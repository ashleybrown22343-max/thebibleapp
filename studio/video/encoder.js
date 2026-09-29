// ============================================================
// BIBELI MIMO – VIDEO ENCODER (V2 – deterministic timing)
// Uses a producer/consumer pattern: one loop renders frames,
// another plays them back at exact fps into the recorder.
// This guarantees the exported video matches the requested duration.
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

    function delay(ms) {
        return new Promise(function (r) { setTimeout(r, Math.max(0, ms)); });
    }

    async function encode(opts) {
        var fps = opts.fps || 30;
        var duration = opts.duration || 15;
        var targetW = opts.targetW;
        var targetH = opts.targetH;
        var totalFrames = Math.round(duration * fps);
        var frameInterval = 1000 / fps;

        var mime = pickBestMimeType();
        if (!mime) throw new Error('Video recording not supported on this browser');

        // ---------- RENDER SURFACE (attached to DOM for reliable capture) ----------
        var canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        // Offscreen but DOM-attached — otherwise Chrome throttles captureStream
        canvas.style.cssText = 'position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0.01;pointer-events:none;z-index:-1;';
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d', { alpha: false });
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, targetW, targetH);

        // ---------- STREAM + RECORDER ----------
        var stream = canvas.captureStream(fps);

        // ---------- AUDIO ----------
        var audioCtx = null;
        var audioEl = null;
        var gainNode = null;

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

        // ---------- PRODUCER / CONSUMER ----------
        var frameQueue = [];
        var renderDone = false;
        var renderError = null;
        var MAX_QUEUE = 60;   // cap memory ~2 seconds of buffered frames

        async function renderAll() {
            try {
                for (var i = 0; i < totalFrames; i++) {
                    while (frameQueue.length >= MAX_QUEUE) {
                        await delay(20);
                    }
                    var t = i / fps;
                    var motion = opts.motionFn ? opts.motionFn(t, duration) : {};
                    var frameCanvas = await window.RenderEngine.render({
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
                    var bmp = await createImageBitmap(frameCanvas);
                    frameQueue.push(bmp);

                    if (opts.onProgress) {
                        var pct = Math.round((i / totalFrames) * 90);
                        opts.onProgress(pct, 'Rendering frame ' + (i + 1) + ' / ' + totalFrames);
                    }
                }
            } catch (e) {
                renderError = e;
            }
            renderDone = true;
        }

        // Start audio before playback
        if (audioEl) {
            try { await audioEl.play(); } catch (e) {}
        }

        recorder.start(100);

        // Start producer in parallel
        var producerPromise = renderAll();

        // Consumer: play frames back at exact fps
        var startTime = performance.now();
        for (var i = 0; i < totalFrames; i++) {
            // Wait for the next frame
            while (frameQueue.length === 0 && !renderDone && !renderError) {
                await delay(5);
            }
            if (renderError) break;
            if (frameQueue.length === 0 && renderDone) break;

            var bmp = frameQueue.shift();
            ctx.drawImage(bmp, 0, 0, targetW, targetH);
            if (bmp.close) bmp.close();

            // Wait so we hit the target fps (real time)
            var target = (i + 1) * frameInterval;
            var elapsed = performance.now() - startTime;
            if (elapsed < target) {
                await delay(target - elapsed);
            }
        }

        // Wait for producer to finish (should already be done)
        await producerPromise;

        if (renderError) {
            if (audioEl) try { audioEl.pause(); } catch (e) {}
            recorder.stop();
            await stopped;
            try { canvas.remove(); } catch (e) {}
            if (audioCtx) try { await audioCtx.close(); } catch (e) {}
            throw renderError;
        }

        // Let the final frame land
        await delay(400);

        if (audioEl) try { audioEl.pause(); } catch (e) {}

        recorder.stop();
        await stopped;

        if (audioCtx) try { await audioCtx.close(); } catch (e) {}

        try { canvas.remove(); } catch (e) {}

        if (opts.onProgress) opts.onProgress(100, 'Finalizing…');

        var blob = new Blob(chunks, { type: mime });
        return { blob: blob, mimeType: mime, ext: fileExtFor(mime), durationSec: duration };
    }

    return { encode: encode, isSupported: function () { return !!window.MediaRecorder; } };
})();
