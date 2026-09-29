// ============================================================
// BIBELI MIMO – VIDEO ENCODER (V6, WebCodecs + mp4-muxer)
//
// Why this exists: MediaRecorder stamps frames with the time the
// browser *received* them, so any main-thread stall = wrong video.
// Here YOU set every timestamp (frame i => i/fps seconds), so the
// output duration is exact no matter how slow rendering is.
//
// Requires (load BEFORE this file):
//   <script src="/studio/video/muxer.js"></script>   (exposes window.Mp4Muxer)
//   <script src="/studio/render.js"></script>        (window.RenderEngine)
//
// IMPORTANT: this file replaces window.VideoEncoder (your API name).
// That name is ALSO the native WebCodecs class, so we capture the
// native one first and keep it in NativeVideoEncoder below.
// ============================================================

window.VideoEncoder = (function () {
    'use strict';

    // ---- Keep the NATIVE WebCodecs VideoEncoder before we shadow it ----
    var prev = window.VideoEncoder;
    var NativeVideoEncoder = (prev && prev.__bibeliWrapper) ? prev.__native : prev;

    var AUDIO_SAMPLE_RATE = 48000;

    function delay(ms) {
        return new Promise(function (r) { setTimeout(r, Math.max(0, ms)); });
    }

    function even(n) {
        n = Math.round(n);
        return n % 2 === 0 ? n : n + 1;
    }

    // ---------- FEATURE DETECTION ----------
    function unsupportedReason() {
        if (typeof NativeVideoEncoder !== 'function') {
            return 'This browser cannot encode video (WebCodecs missing). Please use Chrome on Android.';
        }
        if (typeof window.VideoFrame !== 'function') {
            return 'This browser is missing VideoFrame support. Please update Chrome.';
        }
        if (!window.Mp4Muxer || !window.Mp4Muxer.Muxer) {
            return 'Video muxer not loaded. Check that /studio/video/muxer.js is included before encoder.js.';
        }
        return null;
    }

    // ---------- PICK A WORKING H.264 CONFIG ----------
    // Tries several H.264 profiles/levels, hardware first then software,
    // and steps the resolution down if the phone can't do full size.
    async function pickVideoConfig(w, h, fps, bitrate) {
        var codecs = [
            'avc1.42002a', // Baseline L4.2 (best compatibility for 1080x1920@30)
            'avc1.4d002a', // Main L4.2
            'avc1.640028', // High L4.0
            'avc1.42001f', // Baseline L3.1 (fine up to ~720p)
            'avc1.42001e'  // Baseline L3.0 (last resort)
        ];
        var hw = ['prefer-hardware', 'no-preference'];
        var scales = [1, 0.6667, 0.5];

        for (var s = 0; s < scales.length; s++) {
            var cw = even(w * scales[s]);
            var ch = even(h * scales[s]);
            var br = Math.round(bitrate * scales[s] * scales[s]);
            for (var c = 0; c < codecs.length; c++) {
                for (var a = 0; a < hw.length; a++) {
                    var cfg = {
                        codec: codecs[c],
                        width: cw,
                        height: ch,
                        bitrate: br,
                        framerate: fps,
                        hardwareAcceleration: hw[a],
                        avc: { format: 'avc' } // AVCC format: what MP4 needs
                    };
                    try {
                        var sup = await NativeVideoEncoder.isConfigSupported(cfg);
                        if (sup && sup.supported) return cfg;
                    } catch (e) { /* try next */ }
                }
            }
        }
        return null;
    }

    // ---------- AUDIO: decode, apply volume/fades, render to exact length ----------
    async function prepareAudio(audioOpts, duration) {
        if (!audioOpts || !audioOpts.dataURL) return null;
        if (typeof window.AudioEncoder !== 'function' || typeof window.AudioData !== 'function') return null;
        if (!(window.OfflineAudioContext || window.webkitOfflineAudioContext)) return null;

        try {
            // Find a supported audio codec (AAC preferred, Opus fallback)
            var codecs = [
                { codec: 'mp4a.40.2', mux: 'aac' },
                { codec: 'opus', mux: 'opus' }
            ];
            var chosen = null;
            for (var i = 0; i < codecs.length; i++) {
                try {
                    var sup = await window.AudioEncoder.isConfigSupported({
                        codec: codecs[i].codec,
                        sampleRate: AUDIO_SAMPLE_RATE,
                        numberOfChannels: 2,
                        bitrate: 128000
                    });
                    if (sup && sup.supported) { chosen = codecs[i]; break; }
                } catch (e) {}
            }
            if (!chosen) return null;

            // Decode the file
            var resp = await fetch(audioOpts.dataURL);
            var arr = await resp.arrayBuffer();
            var tmpCtx = new (window.AudioContext || window.webkitAudioContext)();
            var decoded = await tmpCtx.decodeAudioData(arr);
            try { tmpCtx.close(); } catch (e) {}

            // Render to exactly `duration` seconds with volume + fades baked in
            var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            var totalSamples = Math.ceil(AUDIO_SAMPLE_RATE * duration);
            var off = new OAC(2, totalSamples, AUDIO_SAMPLE_RATE);
            var src = off.createBufferSource();
            src.buffer = decoded;
            src.loop = !!audioOpts.loop;
            var gain = off.createGain();
            src.connect(gain);
            gain.connect(off.destination);

            var vol = (audioOpts.volume == null ? 80 : audioOpts.volume) / 100;
            var fadeIn = audioOpts.fadeIn || 0;
            var fadeOut = audioOpts.fadeOut || 0;
            gain.gain.setValueAtTime(fadeIn > 0 ? 0 : vol, 0);
            if (fadeIn > 0) gain.gain.linearRampToValueAtTime(vol, fadeIn);
            if (fadeOut > 0) {
                gain.gain.setValueAtTime(vol, Math.max(fadeIn, duration - fadeOut));
                gain.gain.linearRampToValueAtTime(0, duration);
            }
            src.start(0);
            var rendered = await off.startRendering();

            var left = rendered.getChannelData(0);
            var right = rendered.numberOfChannels > 1 ? rendered.getChannelData(1) : left;

            return {
                codec: chosen.codec,
                muxCodec: chosen.mux,
                left: left,
                right: right,
                total: rendered.length
            };
        } catch (e) {
            console.warn('Audio preparation failed, exporting without audio:', e);
            return null;
        }
    }

    // ---------- MAIN ENCODE ----------
    async function encode(opts) {
        var reason = unsupportedReason();
        if (reason) throw new Error(reason);

        var fps = opts.fps || 30;
        var duration = opts.duration || 15;
        var targetW = opts.targetW;
        var targetH = opts.targetH;
        var totalFrames = Math.round(duration * fps);
        var frameDurUs = 1000000 / fps;

        function progress(p, msg) {
            if (opts.onProgress) opts.onProgress(p, msg);
        }

        progress(0, 'Preparing encoder…');

        // ---------- VIDEO CONFIG ----------
        var baseBitrate = targetW >= 1440 ? 10000000 : (targetW >= 1080 ? 6000000 : 3500000);
        var vcfg = await pickVideoConfig(targetW, targetH, fps, baseBitrate);
        if (!vcfg) {
            throw new Error('This phone cannot encode H.264 video at this size. Try a lower quality/resolution.');
        }
        var outW = vcfg.width;
        var outH = vcfg.height;

        // ---------- AUDIO ----------
        progress(1, 'Preparing audio…');
        var audio = await prepareAudio(opts.audio, duration);

        // ---------- MUXER ----------
        var muxerOpts = {
            target: new window.Mp4Muxer.ArrayBufferTarget(),
            video: { codec: 'avc', width: outW, height: outH, frameRate: fps },
            fastStart: 'in-memory',
            firstTimestampBehavior: 'offset'
        };
        if (audio) {
            muxerOpts.audio = {
                codec: audio.muxCodec,
                numberOfChannels: 2,
                sampleRate: AUDIO_SAMPLE_RATE
            };
        }
        var muxer = new window.Mp4Muxer.Muxer(muxerOpts);

        // ---------- ENCODERS ----------
        var encError = null;

        var videoEncoder = new NativeVideoEncoder({
            output: function (chunk, meta) { muxer.addVideoChunk(chunk, meta); },
            error: function (e) { encError = e; console.error('VideoEncoder error:', e); }
        });
        videoEncoder.configure(vcfg);

        var audioEncoder = null;
        if (audio) {
            audioEncoder = new window.AudioEncoder({
                output: function (chunk, meta) { muxer.addAudioChunk(chunk, meta); },
                error: function (e) { encError = e; console.error('AudioEncoder error:', e); }
            });
            audioEncoder.configure({
                codec: audio.codec,
                sampleRate: AUDIO_SAMPLE_RATE,
                numberOfChannels: 2,
                bitrate: 128000
            });
        }

        // Feed audio up to a given time so audio/video chunks stay interleaved
        var audioPos = 0;
        var AUDIO_CHUNK = 4096;
        function feedAudioUpTo(sec) {
            if (!audio) return;
            var limit = Math.min(audio.total, Math.floor(sec * AUDIO_SAMPLE_RATE));
            while (audioPos < limit) {
                var n = Math.min(AUDIO_CHUNK, audio.total - audioPos);
                var data = new Float32Array(n * 2);
                data.set(audio.left.subarray(audioPos, audioPos + n), 0);
                data.set(audio.right.subarray(audioPos, audioPos + n), n);
                var ad = new window.AudioData({
                    format: 'f32-planar',
                    sampleRate: AUDIO_SAMPLE_RATE,
                    numberOfFrames: n,
                    numberOfChannels: 2,
                    timestamp: Math.round((audioPos / AUDIO_SAMPLE_RATE) * 1000000),
                    data: data
                });
                audioEncoder.encode(ad);
                ad.close();
                audioPos += n;
            }
        }

        // Scratch canvas (only used if RenderEngine's output size differs from encoder size)
        var scratch = null;
        var scratchCtx = null;

        // ---------- FRAME LOOP (NOT real-time: runs as fast as the phone can render) ----------
        try {
            for (var i = 0; i < totalFrames; i++) {
                if (encError) throw encError;

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

                var source = frameCanvas;
                if (frameCanvas.width !== outW || frameCanvas.height !== outH) {
                    if (!scratch) {
                        scratch = document.createElement('canvas');
                        scratch.width = outW;
                        scratch.height = outH;
                        scratchCtx = scratch.getContext('2d', { alpha: false });
                    }
                    scratchCtx.drawImage(frameCanvas, 0, 0, outW, outH);
                    source = scratch;
                }

                // THE KEY LINE: we set the timestamp ourselves. Frame i is at i/fps seconds. Always.
                var vf = new window.VideoFrame(source, {
                    timestamp: Math.round(i * frameDurUs),
                    duration: Math.round(frameDurUs)
                });
                videoEncoder.encode(vf, { keyFrame: i % (fps * 2) === 0 });
                vf.close();

                feedAudioUpTo(t + 0.5);

                // Backpressure: don't let the encoder queue balloon in RAM
                while (videoEncoder.encodeQueueSize > 6) {
                    if (encError) throw encError;
                    await delay(4);
                }

                // Let the UI breathe and update progress
                if (i % 3 === 0) {
                    progress(
                        Math.min(95, Math.round(((i + 1) / totalFrames) * 95)),
                        'Encoding frame ' + (i + 1) + ' / ' + totalFrames
                    );
                    await delay(0);
                }
            }

            // ---------- FINALIZE ----------
            progress(96, 'Finalizing…');
            feedAudioUpTo(duration + 1);
            await videoEncoder.flush();
            if (audioEncoder) await audioEncoder.flush();
            if (encError) throw encError;

            videoEncoder.close();
            if (audioEncoder) audioEncoder.close();
            muxer.finalize();
        } catch (e) {
            try { videoEncoder.close(); } catch (e1) {}
            try { if (audioEncoder) audioEncoder.close(); } catch (e2) {}
            throw e;
        }

        var buffer = muxer.target.buffer;
        var blob = new Blob([buffer], { type: 'video/mp4' });

        progress(100, 'Done');

        return {
            blob: blob,
            mimeType: 'video/mp4',
            ext: 'mp4',
            durationSec: totalFrames / fps,
            width: outW,
            height: outH,
            codec: vcfg.codec,
            hasAudio: !!audio
        };
    }

    return {
        encode: encode,
        isSupported: function () { return unsupportedReason() === null; },
        unsupportedReason: unsupportedReason,
        __bibeliWrapper: true,
        __native: NativeVideoEncoder
    };
})();
                    
