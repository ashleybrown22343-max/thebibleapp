// ============================================================
// BIBELI MIMO – VIDEO ENCODER (V5)
// Root cause of previous failures: Chrome throttles
// canvas.captureStream() when the canvas is offscreen/hidden.
// Fix: render the canvas VISIBLY inside the render overlay.
// Chrome cannot throttle a canvas the user can see.
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
            try { if (MediaRecorder.isTypeSupported(candidates[i])) return candidates[i]; } catch (e) {}
        }
        return '';
    }

    function fileExtFor(mime) {
        return mime.indexOf('mp4') >= 0 ? 'mp4' : 'webm';
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

        // ---------- CANVAS (VISIBLE, inside render overlay) ----------
        var canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.cssText = [
            'display:block',
            'width:100%',
            'max-width:220px',
            'height:auto',
            'max-height:34vh',
            'margin:0 auto 18px',
            'border-radius:12px',
            'background:#000',
            'object-fit:contain'
        ].join(';');

        // Insert into the render overlay so Chrome keeps it painted
        var renderCard = document.querySelector('#render-overlay .render-card') || document.body;
        renderCard.insertBefore(canvas, renderCard.firstChild);

        var ctx = canvas.getContext('2d', { alpha: false });
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, targetW, targetH);

        // ---------- STREAM ----------
        var stream = canvas.captureStream();

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
                console.warn('Audio setup failed, continuing without audio:', e);
                audioCtx = null;
                audioEl = null;
            }
        }

        // ---------- RECORDER ----------
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

        // ---------- GO ----------
        if (audioEl) {
            try { await audioEl.play(); } catch (e) {}
        }
        recorder.start(100);

        var startWall = performance.now();

        // ---------- RENDER LOOP (RAF-driven, real-time) ----------
        await new Promise(function (resolve) {
            var nextFrameAt = 0;
            var frameIndex = 0;

            async function tick() {
                if (frameIndex >= totalFrames) {
                    resolve();
                    return;
                }

                var elapsed = performance.now() - startWall;
                if (elapsed < nextFrameAt) {
                    requestAnimationFrame(tick);
                    return;
                }

                var t = frameIndex / fps;
                var motion = opts.motionFn ? opts.motionFn(t, duration) : {};

                try {
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
                    ctx.drawImage(frameCanvas, 0, 0, targetW, targetH);
                } catch (e) {
                    console.error('Frame ' + frameIndex + ' render failed:', e);
                }

                frameIndex++;
                nextFrameAt = frameIndex * frameInterval;

                if (opts.onProgress) {
                    opts.onProgress(
                        Math.round((frameIndex / totalFrames) * 95),
                        'Recording frame ' + frameIndex + ' / ' + totalFrames
                    );
                }

                requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
        });

        // ---------- HOLD until wall clock reaches duration ----------
        var elapsedTotal = performance.now() - startWall;
        var remaining = (duration * 1000) - elapsedTotal;
        if (remaining > 0) {
            await delay(remaining);
        }

        // ---------- FINALIZE ----------
        if (audioEl) {
            try { audioEl.pause(); } catch (e) {}
        }
        await delay(300);
        recorder.stop();
        await stopped;

        if (audioCtx) {
            try { await audioCtx.close(); } catch (e) {}
        }

        try { canvas.remove(); } catch (e) {}

        if (opts.onProgress) opts.onProgress(100, 'Finalizing…');

        return {
            blob: new Blob(chunks, { type: mime }),
            mimeType: mime,
            ext: fileExtFor(mime),
            durationSec: duration
        };
    }

    return {
        encode: encode,
        isSupported: function () { return !!window.MediaRecorder; }
    };
})();
