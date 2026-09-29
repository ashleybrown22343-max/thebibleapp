// ============================================================
// BIBELI MIMO – VIDEO ENCODER
// Uses MediaRecorder (universal) with canvas + optional audio.
// Real-time capture: a 15s video takes ~15s to encode.
// ============================================================

window.VideoEncoder = (function () {

    function pickBestMimeType() {
        var candidates = [
            'video/mp4;codecs=h264',
            'video/mp4;codecs=avc1',
            'video/mp4',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
        ];
        if (!window.MediaRecorder) return '';
        for (var i = 0; i < candidates.length; i++) {
            try {
                if (MediaRecorder.isTypeSupported(candidates[i])) return candidates[i];
            } catch (e) {}
        }
        return '';
    }

    function fileExtFor(mime) {
        if (mime.indexOf('mp4') >= 0) return 'mp4';
        if (mime.indexOf('webm') >= 0) return 'webm';
        return 'webm';
    }

    // Main encode function.
    // opts: {
    //   state, verseYoruba, verseEnglish, referenceText, backgroundURL,
    //   bgGradient, bgSolid,
    //   duration, fps, targetW, targetH,
    //   motionFn: (t) => motionObject,
    //   audio: null | { dataURL, volume (0-100), fadeIn, fadeOut, loop }
    //   onProgress: (percent, status) => void
    // }
    // Returns: { blob, mimeType, ext, durationSec }
    async function encode(opts) {
        var fps = opts.fps || 30;
        var duration = opts.duration || 15;
        var targetW = opts.targetW;
        var targetH = opts.targetH;
        var totalFrames = Math.round(duration * fps);
        var frameInterval = 1000 / fps;

        var mime = pickBestMimeType();
        if (!mime) throw new Error('Video recording not supported on this browser');

        // Render surface
        var canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        var ctx = canvas.getContext('2d');

        var stream = canvas.captureStream(fps);
        var audioCtx = null;
        var audioEl = null;
        var gainNode = null;

        // Audio setup
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

                // Fade in / out applied via gain automation
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

                dest.stream.getAudioTracks().forEach(function (track) {
                    stream.addTrack(track);
                });
            } catch (e) {
                console.warn('Audio setup failed:', e);
                audioCtx = null;
                audioEl = null;
            }
        }

        var recorder = new MediaRecorder(stream, {
            mimeType: mime,
            videoBitsPerSecond: targetW >= 1440 ? 10000000 : (targetW >= 1080 ? 6000000 : 3500000),
            audioBitsPerSecond: 128000
        });

        var chunks = [];
        recorder.ondataavailable = function (e) {
            if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        var stopped = new Promise(function (resolve) {
            recorder.onstop = function () { resolve(); };
        });

        if (audioEl) {
            try { await audioEl.play(); } catch (e) {}
        }

        recorder.start(100);

        var startTime = performance.now();

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
                    previewW: targetW,
                    motion: motion
                });
            } catch (e) {
                console.error('Frame render failed:', e);
                continue;
            }

            ctx.clearRect(0, 0, targetW, targetH);
            ctx.drawImage(frameCanvas, 0, 0);

            if (opts.onProgress) {
                opts.onProgress(
                    Math.round(((i + 1) / totalFrames) * 95),
                    'Rendering frame ' + (i + 1) + ' / ' + totalFrames
                );
            }

            // Pace the render in real time (captureStream samples in real time)
            var elapsed = performance.now() - startTime;
            var target = (i + 1) * frameInterval;
            if (elapsed < target) {
                await new Promise(function (r) { setTimeout(r, target - elapsed); });
            }
        }

        // Let the last frame land in the recorder
        await new Promise(function (r) { setTimeout(r, 300); });

        if (audioEl) {
            try { audioEl.pause(); } catch (e) {}
        }

        recorder.stop();
        await stopped;

        if (audioCtx) {
            try { await audioCtx.close(); } catch (e) {}
        }

        if (opts.onProgress) opts.onProgress(100, 'Finalizing…');

        var blob = new Blob(chunks, { type: mime });
        return { blob: blob, mimeType: mime, ext: fileExtFor(mime), durationSec: duration };
    }

    return { encode: encode, isSupported: function () { return !!window.MediaRecorder; } };
})();
