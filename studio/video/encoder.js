// ============================================================
// BIBELI MIMO – VIDEO ENCODER (V3 – WebCodecs deterministic)
// Frames are timestamped explicitly, so duration is exact.
// Falls back to MediaRecorder on browsers without
// MediaStreamTrackGenerator (Safari/Firefox).
// ============================================================

window.VideoEncoder = (function () {

    function pickBestMimeType() {
        var candidates = [
            'video/mp4;codecs=avc1',
            'video/mp4',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
        ];
        if (!window.MediaRecorder) return '';
        for (var i = 0; i < candidates.length; i++) {
            try { if (MediaRecorder.isTypeSupported(candidates[i])) return candidates[i]; } catch (e) {}
        }
        return '';
    }

    function fileExtFor(mime) {
        return mime.indexOf('mp4') >= 0 ? 'mp4' : 'webm';
    }

    function delay(ms) { return new Promise(function (r) { setTimeout(r, Math.max(0, ms)); }); }

    function hasWebCodecs() {
        return typeof window.MediaStreamTrackGenerator !== 'undefined' &&
               typeof window.VideoFrame !== 'undefined';
    }

    // ============================================================
    // PRIMARY PATH — WebCodecs MediaStreamTrackGenerator
    // Timestamps are explicit, so duration is exact regardless of
    // how fast or slow rendering takes.
    // ============================================================
    async function encodeWithGenerator(opts) {
        var fps = opts.fps || 30;
        var duration = opts.duration || 15;
        var targetW = opts.targetW;
        var targetH = opts.targetH;
        var totalFrames = Math.round(duration * fps);
        var frameDuration = Math.round(1000000 / fps); // microseconds

        var mime = pickBestMimeType();
        if (!mime) throw new Error('No supported mime type');

        // --- Track generator (accepts VideoFrames, produces a MediaStreamTrack)
        var generator = new MediaStreamTrackGenerator({ kind: 'video' });
        var writer = generator.writable.getWriter();
        var stream = new MediaStream([generator]);

        // --- Optional audio
        var audioCtx = null, audioEl = null, gainNode = null;
        if (opts.audio && opts.audio.dataURL) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                audioEl = new Audio(opts.audio.dataURL);
                audioEl.crossOrigin = 'anonymous';
                audioEl.loop = !!opts.audio.loop;
                await new Promise(function (res, rej) {
                    audioEl.oncanplaythrough = res;
                    audioEl.onerror = rej;
                    audioEl.load();
                });
                var source = audioCtx.createMediaElementSource(audioEl);
                gainNode = audioCtx.createGain();
                source.connect(gainNode);
                var dest = audioCtx.createMediaStreamDestination();
                gainNode.connect(dest);
                var vol = (opts.audio.volume || 80) / 100;
                var fadeIn = opts.audio.fadeIn || 0;
                var fadeOut = opts.audio.fadeOut || 0;
                var t0 = audioCtx.currentTime;
                gainNode.gain.cancelScheduledValues(t0);
                gainNode.gain.setValueAtTime(fadeIn > 0 ? 0 : vol, t0);
                if (fadeIn > 0) gainNode.gain.linearRampToValueAtTime(vol, t0 + fadeIn);
                if (fadeOut > 0) {
                    gainNode.gain.setValueAtTime(vol, t0 + Math.max(fadeIn, duration - fadeOut));
                    gainNode.gain.linearRampToValueAtTime(0, t0 + duration);
                }
                dest.stream.getAudioTracks().forEach(function (t) { stream.addTrack(t); });
            } catch (e) {
                console.warn('Audio setup failed:', e);
                audioCtx = null; audioEl = null;
            }
        }

        // --- Recorder on the generator stream
        var recorder = new MediaRecorder(stream, {
            mimeType: mime,
            videoBitsPerSecond: targetW >= 1440 ? 10000000 : (targetW >= 1080 ? 6000000 : 3500000),
            audioBitsPerSecond: 128000
        });
        var chunks = [];
        recorder.ondataavailable = function (e) { if (e.data && e.data.size > 0) chunks.push(e.data); };
        var stopped = new Promise(function (r) { recorder.onstop = function () { r(); }; });

        if (audioEl) { try { await audioEl.play(); } catch (e) {} }
        recorder.start();

        // --- Render surface
        var canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, targetW, targetH);

        // --- Render loop — as fast as possible, timestamps explicit
        for (var i = 0; i < totalFrames; i++) {
            var t = i / fps;
            var motion = opts.motionFn ? opts.motionFn(t, duration) : {};

            var frameCanvas;
            try {
                frameCanvas = await window.RenderEngine.render({
                    state: opts.state,
                    verseYoruba: opts.verseYoruba,
                    verseEnglish: opts.verseEnglish,
                    referenceText: opts.referenceText,
                    backgroundURL: opts.backgroundURL,
                    bgGradient: opts.bgGradient,
                    bgSolid: opts.bgSolid,
                    targetW: targetW,
                    targetH: targetH,
                    previewW: 350,
                    motion: motion
                });
            } catch (e) {
                console.error('Frame ' + i + ' render failed:', e);
                continue;
            }

            ctx.clearRect(0, 0, targetW, targetH);
            ctx.drawImage(frameCanvas, 0, 0);

            var videoFrame = new VideoFrame(canvas, {
                timestamp: i * frameDuration,
                duration: frameDuration
            });

            try {
                await writer.write(videoFrame);
            } catch (e) {
                console.warn('write failed at frame ' + i, e);
            }
            videoFrame.close();

            if (opts.onProgress) {
                opts.onProgress(
                    Math.round(((i + 1) / totalFrames) * 95),
                    'Rendering frame ' + (i + 1) + ' / ' + totalFrames
                );
            }
        }

        // --- Finalize
        try { await writer.close(); } catch (e) {}
        await delay(300);
        if (audioEl) { try { audioEl.pause(); } catch (e) {} }
        recorder.stop();
        await stopped;
        if (audioCtx) { try { await audioCtx.close(); } catch (e) {} }

        if (opts.onProgress) opts.onProgress(100, 'Finalizing…');

        return {
            blob: new Blob(chunks, { type: mime }),
            mimeType: mime,
            ext: fileExtFor(mime),
            durationSec: duration
        };
    }

    // ============================================================
    // FALLBACK — MediaRecorder + canvas.captureStream
    // Used only on browsers without MediaStreamTrackGenerator.
    // Uses RAF-based scheduling to try to hold real time.
    // ============================================================
    async function encodeWithCaptureStream(opts) {
        var fps = opts.fps || 30;
        var duration = opts.duration || 15;
        var targetW = opts.targetW;
        var targetH = opts.targetH;
        var totalFrames = Math.round(duration * fps);
        var frameInterval = 1000 / fps;

        var mime = pickBestMimeType();
        if (!mime) throw new Error('No supported mime type');

        var canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.cssText = 'position:fixed;left:-10px;top:-10px;width:4px;height:4px;opacity:0;pointer-events:none;';
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d', { alpha: false });
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, targetW, targetH);

        var stream = canvas.captureStream(fps);

        var audioCtx = null, audioEl = null;
        if (opts.audio && opts.audio.dataURL) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                audioEl = new Audio(opts.audio.dataURL);
                audioEl.crossOrigin = 'anonymous';
                audioEl.loop = !!opts.audio.loop;
                await new Promise(function (res, rej) {
                    audioEl.oncanplaythrough = res;
                    audioEl.onerror = rej;
                    audioEl.load();
                });
                var source = audioCtx.createMediaElementSource(audioEl);
                var gainNode = audioCtx.createGain();
                source.connect(gainNode);
                var dest = audioCtx.createMediaStreamDestination();
                gainNode.connect(dest);
                var vol = (opts.audio.volume || 80) / 100;
                var fadeIn = opts.audio.fadeIn || 0;
                var fadeOut = opts.audio.fadeOut || 0;
                var t0 = audioCtx.currentTime;
                gainNode.gain.setValueAtTime(fadeIn > 0 ? 0 : vol, t0);
                if (fadeIn > 0) gainNode.gain.linearRampToValueAtTime(vol, t0 + fadeIn);
                if (fadeOut > 0) {
                    gainNode.gain.setValueAtTime(vol, t0 + Math.max(fadeIn, duration - fadeOut));
                    gainNode.gain.linearRampToValueAtTime(0, t0 + duration);
                }
                dest.stream.getAudioTracks().forEach(function (t) { stream.addTrack(t); });
            } catch (e) { audioCtx = null; audioEl = null; }
        }

        var recorder = new MediaRecorder(stream, {
            mimeType: mime,
            videoBitsPerSecond: targetW >= 1440 ? 10000000 : (targetW >= 1080 ? 6000000 : 3500000),
            audioBitsPerSecond: 128000
        });
        var chunks = [];
        recorder.ondataavailable = function (e) { if (e.data && e.data.size > 0) chunks.push(e.data); };
        var stopped = new Promise(function (r) { recorder.onstop = function () { r(); }; });

        if (audioEl) { try { await audioEl.play(); } catch (e) {} }
        recorder.start(100);

        var startWall = performance.now();
        var scheduled = 0;

        for (var i = 0; i < totalFrames; i++) {
            // Target wall time for this frame
            scheduled = startWall + i * frameInterval;
            var now = performance.now();
            if (now < scheduled) {
                await delay(scheduled - now);
            }

            var t = i / fps;
            var motion = opts.motionFn ? opts.motionFn(t, duration) : {};

            var frameCanvas;
            try {
                frameCanvas = await window.RenderEngine.render({
                    state: opts.state,
                    verseYoruba: opts.verseYoruba,
                    verseEnglish: opts.verseEnglish,
                    referenceText: opts.referenceText,
                    backgroundURL: opts.backgroundURL,
                    bgGradient: opts.bgGradient,
                    bgSolid: opts.bgSolid,
                    targetW: targetW,
                    targetH: targetH,
                    previewW: 350,
                    motion: motion
                });
            } catch (e) { continue; }

            ctx.clearRect(0, 0, targetW, targetH);
            ctx.drawImage(frameCanvas, 0, 0);

            if (opts.onProgress) {
                opts.onProgress(
                    Math.round(((i + 1) / totalFrames) * 95),
                    'Rendering frame ' + (i + 1) + ' / ' + totalFrames
                );
            }
        }

        // Wait out the remaining wall time in case rendering is faster than real time
        var finalTarget = startWall + duration * 1000;
        var remaining = finalTarget - performance.now();
        if (remaining > 0) await delay(remaining);

        await delay(300);
        if (audioEl) { try { audioEl.pause(); } catch (e) {} }
        recorder.stop();
        await stopped;
        if (audioCtx) { try { await audioCtx.close(); } catch (e) {} }
        try { canvas.remove(); } catch (e) {}

        if (opts.onProgress) opts.onProgress(100, 'Finalizing…');

        return {
            blob: new Blob(chunks, { type: mime }),
            mimeType: mime,
            ext: fileExtFor(mime),
            durationSec: duration
        };
    }

    async function encode(opts) {
        if (hasWebCodecs()) {
            try {
                return await encodeWithGenerator(opts);
            } catch (e) {
                console.warn('WebCodecs path failed, using fallback:', e);
                return await encodeWithCaptureStream(opts);
            }
        }
        return await encodeWithCaptureStream(opts);
    }

    return {
        encode: encode,
        isSupported: function () {
            return !!window.MediaRecorder;
        },
        usesWebCodecs: hasWebCodecs
    };
})();
