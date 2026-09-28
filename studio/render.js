// ============================================================
// BIBELI MIMO – NATIVE CANVAS 2D RENDERER
// Used by /studio/export for pixel-perfect output.
// Pure canvas — no DOM, no html2canvas, no CDN.
// Later reused by the video exporter.
// ============================================================

window.RenderEngine = (function () {

    var FONT_MAP = {
        'Poppins': "'Poppins', sans-serif",
        'Playfair Display': "'Playfair Display', serif",
        'Lora': "'Lora', serif",
        'Cormorant Garamond': "'Cormorant Garamond', serif",
        'Inter': "'Inter', sans-serif",
        'Merriweather': "'Merriweather', serif",
        'Josefin Sans': "'Josefin Sans', sans-serif",
        'Great Vibes': "'Great Vibes', cursive"
    };

    function getFontCss(name) {
        return FONT_MAP[name] || "'Poppins', sans-serif";
    }

    function hexToRgb(hex) {
        if (!hex || hex.length < 7) return { r: 0, g: 0, b: 0 };
        return {
            r: parseInt(hex.slice(1, 3), 16),
            g: parseInt(hex.slice(3, 5), 16),
            b: parseInt(hex.slice(5, 7), 16)
        };
    }

    function loadImage(src) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function () { resolve(img); };
            img.onerror = function () { reject(new Error('Image load failed')); };
            img.src = src;
        });
    }

    function roundRectPath(ctx, x, y, w, h, r) {
        if (r < 0) r = 0;
        if (r > w / 2) r = w / 2;
        if (r > h / 2) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function drawImageCover(ctx, img, x, y, w, h) {
        var iw = img.width, ih = img.height;
        var s = Math.max(w / iw, h / ih);
        var sw = iw * s;
        var sh = ih * s;
        var sx = x + (w - sw) / 2;
        var sy = y + (h - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh);
    }

    function parseCssGradient(ctx, str, W, H) {
        var m = String(str).match(/linear-gradient\(\s*([\d.]+)deg\s*,\s*(.+)\)/);
        if (!m) return null;
        var deg = parseFloat(m[1]);
        var stops = m[2].split(/,(?![^(]*\))/);
        var rad = (deg - 90) * Math.PI / 180;
        var cx = W / 2, cy = H / 2;
        var len = Math.abs(W * Math.cos(rad)) + Math.abs(H * Math.sin(rad));
        var dx = Math.cos(rad) * len / 2;
        var dy = Math.sin(rad) * len / 2;
        var grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
        stops.forEach(function (s, i) {
            s = s.trim();
            var parts = s.split(/\s+/);
            var color = parts[0];
            var pct = parts[1] ? parseFloat(parts[1]) / 100 : (i / Math.max(1, stops.length - 1));
            grad.addColorStop(Math.max(0, Math.min(1, pct)), color);
        });
        return grad;
    }

    function applyCase(text, mode) {
        if (!text) return text || '';
        if (mode === 'upper') return text.toUpperCase();
        if (mode === 'title') return text.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        return text;
    }

    async function ensureFonts(names) {
        if (!document.fonts || !document.fonts.load) return;
        var uniq = {};
        (names || []).forEach(function (n) { if (n) uniq[n] = true; });
        var jobs = [];
        Object.keys(uniq).forEach(function (f) {
            jobs.push(document.fonts.load('700 24px "' + f + '"').catch(function () {}));
            jobs.push(document.fonts.load('400 24px "' + f + '"').catch(function () {}));
        });
        try { await Promise.all(jobs); } catch (e) {}
    }

    async function render(opts) {
        var state = opts.state || {};
        var W = opts.targetW;
        var H = opts.targetH;
        var previewW = opts.previewW || 350;
        var scale = W / previewW;

        var canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        var ctx = canvas.getContext('2d');
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';

        var radiusPx = (state.radius || 0) * scale;
        var bwPx = (state.borderWidth || 0) * scale;

        // ============ BACKGROUND LAYER (clipped to radius) ============
        ctx.save();
        if (radiusPx > 0) {
            roundRectPath(ctx, 0, 0, W, H, radiusPx);
            ctx.clip();
        }

        ctx.fillStyle = '#1a237e';
        ctx.fillRect(0, 0, W, H);

        if (opts.backgroundURL) {
            try {
                var bgImg = await loadImage(opts.backgroundURL);
                var filters = [];
                if (state.blur > 0) filters.push('blur(' + (state.blur * scale) + 'px)');
                if (state.brightness !== undefined && state.brightness !== 100) filters.push('brightness(' + (state.brightness / 100) + ')');
                if (state.saturation !== undefined && state.saturation !== 100) filters.push('saturate(' + (state.saturation / 100) + ')');
                if (filters.length) ctx.filter = filters.join(' ');
                var bleed = Math.ceil((state.blur || 0) * scale * 2) + 2;
                drawImageCover(ctx, bgImg, -bleed, -bleed, W + bleed * 2, H + bleed * 2);
                ctx.filter = 'none';
            } catch (e) {}
        } else if (opts.bgGradient) {
            var gg = parseCssGradient(ctx, opts.bgGradient, W, H);
            if (gg) { ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H); }
        } else if (opts.bgSolid) {
            ctx.fillStyle = opts.bgSolid;
            ctx.fillRect(0, 0, W, H);
        }

        if (state.darkOverlay > 0) {
            ctx.fillStyle = 'rgba(0,0,0,' + (state.darkOverlay / 100) + ')';
            ctx.fillRect(0, 0, W, H);
        }

        if (state.duotoneOn) {
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            ctx.globalAlpha = 0.55;
            var duo = ctx.createLinearGradient(0, H, W, 0);
            duo.addColorStop(0, state.duotoneShadow || '#1a237e');
            duo.addColorStop(1, state.duotoneHighlight || '#f59e0b');
            ctx.fillStyle = duo;
            ctx.fillRect(0, 0, W, H);
            ctx.restore();
        }

        if (state.gradientOverlay) {
            var grgb = hexToRgb(state.gradientColor);
            ctx.fillStyle = 'rgba(' + grgb.r + ',' + grgb.g + ',' + grgb.b + ',' + ((state.gradientOpacity || 0) / 100) + ')';
            ctx.fillRect(0, 0, W, H);
        }

        if (state.vignette > 0) {
            var vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
            vg.addColorStop(0, 'rgba(0,0,0,0)');
            vg.addColorStop(1, 'rgba(0,0,0,' + (state.vignette / 100) + ')');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);
        }

        // ============ TEXT SETUP ============
        var mainFontFamily = getFontCss(state.fontFamily || 'Poppins');
        var refFontFamily = state.refMatchFont ? mainFontFamily : getFontCss(state.refFontFamily || 'Playfair Display');

        var fontSize = (state.fontSize || 24) * scale;
        var refSize = (state.refSize || 14) * scale;
        var secSize = (state.secSize || 12) * scale;
        var lineHeight = fontSize * (state.lineSpacing || 1.7);
        var gapPx = fontSize * (state.blockGap || 1.5) * 0.5;

        var padPx = ((state.padding || 10) / 100) * W;
        var contentX = padPx;
        var contentW = W - padPx * 2;
        var contentTop = padPx;
        var contentBottom = H - padPx;
        var contentH = contentBottom - contentTop;

        var shadowStyle = state.shadow || 'strong';
        var textColor = state.textColor || '#ffffff';
        var align = state.align || 'center';
        var hw = (state.highlightWord || '').trim().toLowerCase();
        var hlColor = state.highlightColor || '#f59e0b';

        function measure(text, font, maxW) {
            ctx.font = font;
            var words = text.split(/\s+/).filter(Boolean);
            if (words.length === 0) return { lines: [], spaceW: 0 };
            var spaceW = ctx.measureText(' ').width;
            var lines = [];
            var line = [];
            var lineW = 0;
            for (var i = 0; i < words.length; i++) {
                var w = words[i];
                var wW = ctx.measureText(w).width;
                var add = line.length === 0 ? wW : spaceW + wW;
                if (lineW + add > maxW && line.length > 0) {
                    lines.push({ words: line, width: lineW });
                    line = [{ text: w, width: wW }];
                    lineW = wW;
                } else {
                    line.push({ text: w, width: wW });
                    lineW += add;
                }
            }
            if (line.length) lines.push({ words: line, width: lineW });
            return { lines: lines, spaceW: spaceW };
        }

        function applyShadowForText(style) {
            if (style === 'outline' || style === 'none' || !style) {
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                return;
            }
            if (style === 'soft') {
                ctx.shadowColor = 'rgba(0,0,0,0.4)';
                ctx.shadowBlur = 8 * scale;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 2 * scale;
            } else if (style === 'strong') {
                ctx.shadowColor = 'rgba(0,0,0,0.75)';
                ctx.shadowBlur = 15 * scale;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4 * scale;
            } else if (style === 'glow') {
                ctx.shadowColor = 'rgba(255,255,255,0.7)';
                ctx.shadowBlur = 25 * scale;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            } else {
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }
        }

        function drawWord(word, x, centerY, font, sizePx, color, style, isHl) {
            ctx.font = font;
            if (isHl) {
                var padX = 6 * scale;
                var padY = 2 * scale;
                var pillH = sizePx + padY * 2;
                var pillY = centerY - pillH / 2;
                ctx.save();
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.fillStyle = hlColor;
                roundRectPath(ctx, x - padX, pillY, word.width + padX * 2, pillH, 4 * scale);
                ctx.fill();
                ctx.restore();
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#ffffff';
                ctx.fillText(word.text, x, centerY);
            } else {
                if (style === 'outline') {
                    ctx.save();
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = '#000000';
                    var off = 1.2 * scale;
                    ctx.fillText(word.text, x - off, centerY);
                    ctx.fillText(word.text, x + off, centerY);
                    ctx.fillText(word.text, x, centerY - off);
                    ctx.fillText(word.text, x, centerY + off);
                    ctx.restore();
                }
                applyShadowForText(style);
                ctx.fillStyle = color;
                ctx.fillText(word.text, x, centerY);
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }
        }

        function drawParagraph(layout, x, y, lineH, font, sizePx, color, style) {
            var cy = y;
            for (var li = 0; li < layout.lines.length; li++) {
                var ln = layout.lines[li];
                var startX = x;
                if (align === 'center') startX = x + (contentW - ln.width) / 2;
                else if (align === 'right') startX = x + contentW - ln.width;
                var cx = startX;
                var centerY = cy + lineH / 2;
                for (var wi = 0; wi < ln.words.length; wi++) {
                    var w = ln.words[wi];
                    var isHl = hw && w.text.toLowerCase().indexOf(hw) >= 0;
                    drawWord(w, cx, centerY, font, sizePx, color, style, isHl);
                    cx += w.width + layout.spaceW;
                }
                cy += lineH;
            }
        }

        // ============ MEASURE ============
        var yoText = applyCase(opts.verseYoruba || '', state.textCase);
        var enText = applyCase(opts.verseEnglish || '', state.textCase);

        var mainSub = [];
        if (state.showYoruba !== false && yoText) {
            var layoutYo = measure(yoText, '700 ' + fontSize + 'px ' + mainFontFamily, contentW);
            mainSub.push({
                layout: layoutYo,
                font: '700 ' + fontSize + 'px ' + mainFontFamily,
                size: fontSize,
                lineH: lineHeight,
                opacity: (state.yoOpacity !== undefined ? state.yoOpacity : 100) / 100,
                marginTop: 0
            });
        }
        if (state.showEnglish !== false && enText) {
            var enSize = fontSize * 0.70;
            var enLineH = enSize * (state.lineSpacing || 1.7);
            var layoutEn = measure(enText, '400 ' + enSize + 'px ' + mainFontFamily, contentW);
            mainSub.push({
                layout: layoutEn,
                font: '400 ' + enSize + 'px ' + mainFontFamily,
                size: enSize,
                lineH: enLineH,
                opacity: (state.enOpacity !== undefined ? state.enOpacity : 85) / 100,
                marginTop: mainSub.length > 0 ? gapPx : 0
            });
        }

        var mainHeight = 0;
        mainSub.forEach(function (s) {
            mainHeight += s.marginTop;
            mainHeight += s.layout.lines.length * s.lineH;
        });

        var secH = secSize * 1.35;
        var refH = refSize * 1.35;
        var blocks = [];

        // Fixed visual order (top → bottom):
        //   sec(top) → ref(top) → sec(above) → main → ref(bottom) → sec(bottom)
        if (state.secText && state.secPos === 'top') blocks.push({ kind: 'sec', height: secH });
        if (state.refShow && opts.referenceText && state.refPos === 'top') blocks.push({ kind: 'ref', height: refH });
        if (state.secText && state.secPos === 'above') blocks.push({ kind: 'sec', height: secH });
        if (mainSub.length > 0) blocks.push({ kind: 'main', height: mainHeight });
        if (state.refShow && opts.referenceText && state.refPos === 'bottom') blocks.push({ kind: 'ref', height: refH });
        if (state.secText && state.secPos === 'bottom') blocks.push({ kind: 'sec', height: secH });

        var totalH = 0;
        blocks.forEach(function (b, i) {
            if (i > 0) totalH += gapPx;
            totalH += b.height;
        });

        var startY;
        var vpos = state.vpos || 'center';
        if (vpos === 'top') startY = contentTop;
        else if (vpos === 'bottom') startY = contentBottom - totalH;
        else startY = contentTop + Math.max(0, (contentH - totalH) / 2);

        // ============ DRAW BLOCKS ============
        var cursorY = startY;
        blocks.forEach(function (b, i) {
            if (i > 0) cursorY += gapPx;

            if (b.kind === 'main') {
                var subY = cursorY;
                mainSub.forEach(function (s) {
                    subY += s.marginTop;
                    ctx.globalAlpha = s.opacity;
                    drawParagraph(s.layout, contentX, subY, s.lineH, s.font, s.size, textColor, shadowStyle);
                    subY += s.layout.lines.length * s.lineH;
                });
                ctx.globalAlpha = 1;
            } else if (b.kind === 'ref') {
                ctx.font = '700 ' + refSize + 'px ' + refFontFamily;
                var refText = opts.referenceText;
                var rw = ctx.measureText(refText).width;
                var rx = contentX;
                if (align === 'center') rx = contentX + (contentW - rw) / 2;
                else if (align === 'right') rx = contentX + contentW - rw;
                applyShadowForText(state.refShadow || 'soft');
                ctx.fillStyle = state.refColor || '#f59e0b';
                ctx.fillText(refText, rx, cursorY + b.height / 2);
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
            } else if (b.kind === 'sec') {
                ctx.globalAlpha = (state.secOpacity !== undefined ? state.secOpacity : 85) / 100;
                ctx.font = '500 ' + secSize + 'px ' + mainFontFamily;
                var st = state.secText;
                var sw = ctx.measureText(st).width;
                var sx = contentX;
                if (align === 'center') sx = contentX + (contentW - sw) / 2;
                else if (align === 'right') sx = contentX + contentW - sw;
                applyShadowForText('soft');
                ctx.fillStyle = state.secColor || '#ffffff';
                ctx.fillText(st, sx, cursorY + b.height / 2);
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
                ctx.globalAlpha = 1;
            }
            cursorY += b.height;
        });

        // ============ LOGO ============
        if (state.logoData) {
            try {
                var logo = await loadImage(state.logoData);
                var logoSize = (state.logoSize || 60) * scale;
                var logoGap = ((state.padding || 10) / 100) * W * 0.5;
                var lpos = state.logoPos || 'br';
                var lx, ly;
                if (lpos === 'tl') { lx = logoGap; ly = logoGap; }
                else if (lpos === 'tr') { lx = W - logoGap - logoSize; ly = logoGap; }
                else if (lpos === 'bl') { lx = logoGap; ly = H - logoGap - logoSize; }
                else { lx = W - logoGap - logoSize; ly = H - logoGap - logoSize; }

                ctx.save();
                ctx.globalAlpha = (state.logoOpacity !== undefined ? state.logoOpacity : 100) / 100;

                if (state.logoBgOn) {
                    ctx.fillStyle = state.logoBgColor || '#ffffff';
                    roundRectPath(ctx, lx - 4 * scale, ly - 4 * scale, logoSize + 8 * scale, logoSize + 8 * scale, 8 * scale);
                    ctx.fill();
                }
                if (state.logoBorderOn) {
                    ctx.strokeStyle = state.logoBorderColor || '#ffffff';
                    ctx.lineWidth = 2 * scale;
                    ctx.strokeRect(lx, ly, logoSize, logoSize);
                }
                var iw = logo.width, ih = logo.height;
                var ls = Math.min(logoSize / iw, logoSize / ih);
                var dw = iw * ls, dh = ih * ls;
                ctx.drawImage(logo, lx + (logoSize - dw) / 2, ly + (logoSize - dh) / 2, dw, dh);
                ctx.restore();
            } catch (e) {}
        }

        // ============ WATERMARK ============
        if (state.watermarkOn !== false) {
            var wmSize = 11 * scale;
            ctx.save();
            ctx.font = '600 ' + wmSize + 'px ' + mainFontFamily;
            if ('letterSpacing' in ctx) ctx.letterSpacing = (1.5 * scale) + 'px';
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('BIBELI MIMO', W / 2, H - 10 * scale);
            ctx.restore();
        }

        // Release content clip
        ctx.restore();

        // ============ BORDER (unclipped) ============
        if (bwPx > 0) {
            ctx.save();
            var br = Math.max(0, radiusPx - bwPx / 2);
            roundRectPath(ctx, bwPx / 2, bwPx / 2, W - bwPx, H - bwPx, br);
            ctx.strokeStyle = state.borderColor || '#ffffff';
            ctx.lineWidth = bwPx;
            ctx.stroke();
            ctx.restore();
        }

        return canvas;
    }

    return { render: render, ensureFonts: ensureFonts };
})();
