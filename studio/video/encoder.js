// ============================================================
// BIBELI MIMO – VIDEO ENCODER (V4 – real-time, correct duration)
//
// IMPORTANT: MediaRecorder records the WALL CLOCK.
// A 15-second video takes 15 seconds to record, no exceptions.
// We schedule renders at exact wall-clock times so the exported
// duration matches the requested duration exactly.
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

        // ---------- CANVAS (must be in DOM & non-zero size for captureStream) ----------
        var canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.cssText = [
            'position:fixed',
            'left:0',
            'top:0',
            'width:320px',
            'height:auto',
            'opacity:0.001',
            'pointer-events:none',
            'z-index:-9999'
        ].join(';');
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d', { alpha: false });

        // Fill with black so the first captured frame is not transparent
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, targetW, targetH);

        // ---------- STREAM ----------
        var stream = canvas.captureStream(fps);

        // ---------- AUDIO (optional) ----------
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

        // ---------- START ----------
        if (audioEl) {
            try { await audioEl.play(); } catch (e) {}
        }
        recorder.start(100);

        // The moment we start recording — this is the time base.
        var startWall = performance.now();

        // ---------- RENDER LOOP (real-time, hard wall-clock schedule) ----------
        for (var i = 0; i < totalFrames; i++) {
            var targetTime = startWall + (i * frameInterval);
            var now = performance.now();
            var waitFor = targetTime - now;

            // If we're behind, skip ahead. If we're ahead, wait.
            if (waitFor > 2) {
                await delay(waitFor - 1);
            }

            var t = i / fps;
            var motion = opts.motionFn ? opts.motionFn(t, duration) : {};

            var frameCanvas = null;
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
            }

            if (frameCanvas) {
                ctx.clearRect(0, 0, targetW, targetH);
                ctx.drawImage(frameCanvas, 0, 0, targetW, targetH);
            }

            if (opts.onProgress) {
                var pct = Math.round(((i + 1) / totalFrames) * 95);
                opts.onProgress(pct, 'Recording ' + (i + 1) + ' / ' + totalFrames + ' frames');
            }
        }

        // ---------- HOLD until the wall clock reaches `duration` ----------
        // This is the critical step: even if rendering was fast, we make sure
        // MediaRecorder has recorded for at least the full duration.
        var elapsed = performance.now() - startWall;
        var remaining = (duration * 1000) - elapsed;
        if (remaining > 0) {
            await delay(remaining);
        }

        // ---------- FINALIZE ----------
        if (audioEl) {
            try { audioEl.pause(); } catch (e) {}
        }
        await delay(200);
        recorder.stop();
        await stopped;

        if (audioCtx) {
            try { await audioCtx.close(); } catch (e) {}
        }
        try { canvas.remove(); } catch (e) {}

        if (opts.onProgress) opts.onProgress(100, 'Finalizing…');

        var blob = new Blob(chunks, { type: mime });
        return {
            blob: blob,
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
