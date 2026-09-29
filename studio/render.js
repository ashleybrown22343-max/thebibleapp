// ============================================================
// BIBELI MIMO – NATIVE CANVAS 2D RENDERER (V4.1)
// Shared by /studio/image/export and /studio/video.
// V4.1: blur-fill is now opt-in only (was opt-out).
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

    function drawImageCover(ctx, img, x, y, w, h, position) {
        var iw = img.width, ih = img.height;
        var s = Math.max(w / iw, h / ih);
        var sw = iw * s;
        var sh = ih * s;
        var px = 0.5, py = 0.5;
        if (position === 'top') py = 0;
        else if (position === 'bottom') py = 1;
        else if (position === 'left') px = 0;
        else if (position === 'right') px = 1;
        var sx = x + (w - sw) * px;
        var sy = y + (h - sh) * py;
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

        // ---------- MOTION INPUT ----------
        var m = opts.motion || {};
        var textOpacity    = m.textOpacity    !== undefined ? m.textOpacity    : 1;
        var textOffsetX    = m.textOffsetX    || 0;
        var textOffsetY    = m.textOffsetY    || 0;
        var textScale      = m.textScale      !== undefined ? m.textScale      : 1;
        var visibleChars   = m.visibleChars;
        var wordReveal     = m.wordReveal;
        var bgScale        = m.bgScale        !== undefined ? m.bgScale        : 1;
        var bgOffsetX      = m.bgOffsetX      || 0;
        var bgOffsetY      = m.bgOffsetY      || 0;
        var refOpacity     = m.refOpacity     !== undefined ? m.refOpacity     : 1;
        var secOpacityM    = m.secOpacity     !== undefined ? m.secOpacity     : 1;
        var logoOpacityM   = m.logoOpacity    !== undefined ? m.logoOpacity    : 1;

        if (textOpacity <= 0.001) textOpacity = 0;
        if (bgScale <= 0) bgScale = 1;

        var canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        var ctx = canvas.getContext('2d');
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';

        var radiusPx = (state.radius || 0) * scale;
        var bwPx = (state.borderWidth || 0) * scale;

        // ---------- BACKGROUND (clipped) ----------
        ctx.save();
        if (radiusPx > 0) {
            roundRectPath(ctx, 0, 0, W, H, radiusPx);
            ctx.clip();
        }

        ctx.fillStyle = '#1a237e';
        ctx.fillRect(0, 0, W, H);

        var bgAlpha = (state.bgOpacity !== undefined ? state.bgOpacity : 100) / 100;
        if (bgAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = bgAlpha;

            if (opts.backgroundURL) {
                try {
                    var bgImg = await loadImage(opts.backgroundURL);
                    var filters = [];
                    if (state.blur > 0) filters.push('blur(' + (state.blur * scale) + 'px)');
                    if (state.brightness !== undefined && state.brightness !== 100) filters.push('brightness(' + (state.brightness / 100) + ')');
                    if (state.saturation !== undefined && state.saturation !== 100) filters.push('saturate(' + (state.saturation / 100) + ')');
                    var baseFilter = filters.length ? filters.join(' ') : '';

                    var imgAspect = bgImg.width / bgImg.height;
                    var boxAspect = W / H;
                    // Blur-fill is OPT-IN only. Never on by default.
                    var useBlurFill = state.bgBlurFill === true &&
                                      Math.abs(imgAspect - boxAspect) / boxAspect > 0.08;

                    if (useBlurFill) {
                        // Layer 1: blurred cover fill
                        ctx.filter = (baseFilter ? baseFilter + ' ' : '') + 'blur(' + (60 * scale) + 'px)';
                        drawImageCover(ctx, bgImg, -30, -30, W + 60, H + 60, 'center');
                        ctx.filter = baseFilter || 'none';
                        // Layer 2: slight darken for contrast
                        ctx.fillStyle = 'rgba(0,0,0,0.18)';
                        ctx.fillRect(0, 0, W, H);
                        // Layer 3: sharp fit image centered, with Ken Burns
                        var fitScale = Math.min(W / bgImg.width, H / bgImg.height);
                        var sw = bgImg.width * fitScale * bgScale;
                        var sh = bgImg.height * fitScale * bgScale;
                        var sx = (W - sw) / 2 + bgOffsetX * scale;
                        var sy = (H - sh) / 2 + bgOffsetY * scale;
                        ctx.filter = baseFilter || 'none';
                        ctx.drawImage(bgImg, sx, sy, sw, sh);
                        ctx.filter = 'none';
                    } else {
                        // Standard cover fill
                        if (baseFilter) ctx.filter = baseFilter;
                        var bleed = Math.ceil((state.blur || 0) * scale * 2) + 2;
                        var drawW = W + bleed * 2;
                        var drawH = H + bleed * 2;
                        var scaledW = drawW * bgScale;
                        var scaledH = drawH * bgScale;
                        var dx = (drawW - scaledW) / 2 + bgOffsetX * scale;
                        var dy = (drawH - scaledH) / 2 + bgOffsetY * scale;
                        drawImageCover(
                            ctx, bgImg,
                            -bleed + dx, -bleed + dy, scaledW, scaledH,
                            state.bgPosition || 'center'
                        );
                        ctx.filter = 'none';
                    }
                } catch (e) {}
            } else if (opts.bgGradient) {
                var gg = parseCssGradient(ctx, opts.bgGradient, W, H);
                if (gg) { ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H); }
            } else if (opts.bgSolid) {
                ctx.fillStyle = opts.bgSolid;
                ctx.fillRect(0, 0, W, H);
            }
            ctx.restore();
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

        // ---------- TEXT SETUP ----------
        var mainFontFamily = getFontCss(state.fontFamily || 'Poppins');
        var refFontFamily = state.refMatchFont ? mainFontFamily : getFontCss(state.refFontFamily || 'Playfair Display');

        var baseFontSize = (state.fontSize || 24) * scale;
        var fontSize = baseFontSize * textScale;
        var refSize = (state.refSize || 14) * scale;
        var secSize = (state.secSize || 12) * scale;
        var lineHeight = fontSize * (state.lineSpacing || 1.7);
        var gapPx = fontSize * (state.blockGap || 1.5) * 0.5;

        var padPx = ((state.padding || 10) / 100) * W;
        var contentX = padPx + textOffsetX * scale;
        var contentW = W - padPx * 2;
        var contentTop = padPx;
        var contentBottom = H - padPx;
        var contentH = contentBottom - contentTop;

        var shadowStyle = state.shadow || 'strong';
        var textColor = state.textColor || '#ffffff';
        var align = state.align || 'center';
        var hw = (state.highlightWord || '').trim().toLowerCase();
        var hlColor = state.highlightColor || '#f59e0b';
        var primaryWeight = state.fontWeight || '700';

        function measure(text, font, maxW) {
            ctx.font = font;
            var words = text.split(/\s+/).filter(Boolean);
            if (words.length === 0) return { lines: [], spaceW: 0, wordCount: 0 };
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
            var total = 0;
            lines.forEach(function (l) { total += l.words.length; });
            return { lines: lines, spaceW: spaceW, wordCount: total };
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

        var currentWordIndex = 0;
        var totalWordsToReveal = 0;

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
            var N = totalWordsToReveal || 1;
            var doWordReveal = (wordReveal !== undefined && wordReveal !== null);

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

                    if (doWordReveal) {
                        var idx = currentWordIndex;
                        var start = (idx / N) * 0.65;
                        var dur = 0.35;
                        var p = (wordReveal - start) / dur;
                        if (p < 0) p = 0;
                        if (p > 1) p = 1;
                        var eased = 1 - Math.pow(1 - p, 3);

                        if (eased > 0.001) {
                            var dy = (1 - eased) * 14 * scale;
                            var sc = 0.90 + 0.10 * eased;
                            var pivotX = cx + w.width / 2;
                            var pivotY = centerY + dy;
                            ctx.save();
                            ctx.globalAlpha *= eased;
                            ctx.translate(pivotX, pivotY);
                            ctx.scale(sc, sc);
                            ctx.translate(-pivotX, -pivotY);
                            drawWord(w, cx, centerY + dy, font, sizePx, color, style, isHl);
                            ctx.restore();
                        }
                        currentWordIndex++;
                        cx += w.width + layout.spaceW;
                        continue;
                    }

                    drawWord(w, cx, centerY, font, sizePx, color, style, isHl);
                    cx += w.width + layout.spaceW;
                    currentWordIndex++;
                }
                cy += lineH;
            }
        }

        // ---------- MEASURE TEXT ----------
        var primaryText = applyCase(opts.verseYoruba || '', state.textCase);
        var secondaryText = applyCase(opts.verseEnglish || '', state.textCase);

        if (visibleChars !== undefined && visibleChars !== null) {
            if (primaryText.length > visibleChars) {
                primaryText = primaryText.substring(0, visibleChars);
            }
        }

        var mainSub = [];
        if (primaryText) {
            var layoutP = measure(primaryText, primaryWeight + ' ' + fontSize + 'px ' + mainFontFamily, contentW);
            mainSub.push({
                layout: layoutP,
                font: primaryWeight + ' ' + fontSize + 'px ' + mainFontFamily,
                size: fontSize,
                lineH: lineHeight,
                opacity: 1,
                marginTop: 0
            });
            totalWordsToReveal += layoutP.wordCount;
        }
        if (secondaryText) {
            var enSize = fontSize * 0.70;
            var enLineH = enSize * (state.lineSpacing || 1.7);
            var layoutS = measure(secondaryText, '400 ' + enSize + 'px ' + mainFontFamily, contentW);
            mainSub.push({
                layout: layoutS,
                font: '400 ' + enSize + 'px ' + mainFontFamily,
                size: enSize,
                lineH: enLineH,
                opacity: 0.85,
                marginTop: mainSub.length > 0 ? gapPx : 0
            });
            totalWordsToReveal += layoutS.wordCount;
        }

        currentWordIndex = 0;

        var mainHeight = 0;
        mainSub.forEach(function (s) {
            mainHeight += s.marginTop;
            mainHeight += s.layout.lines.length * s.lineH;
        });

        var secH = secSize * 1.35;
        var refH = refSize * 1.35;
        var blocks = [];

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
        startY += textOffsetY * scale;

        // ---------- DRAW BLOCKS ----------
        ctx.globalAlpha = textOpacity;

        var cursorY = startY;
        blocks.forEach(function (b, i) {
            if (i > 0) cursorY += gapPx;

            if (b.kind === 'main') {
                var subY = cursorY;
                mainSub.forEach(function (s) {
                    subY += s.marginTop;
                    ctx.globalAlpha = textOpacity * s.opacity;
                    drawParagraph(s.layout, contentX, subY, s.lineH, s.font, s.size, textColor, shadowStyle);
                    subY += s.layout.lines.length * s.lineH;
                });
                ctx.globalAlpha = textOpacity;
            } else if (b.kind === 'ref') {
                ctx.globalAlpha = textOpacity * refOpacity;
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
                ctx.globalAlpha = textOpacity * ((state.secOpacity !== undefined ? state.secOpacity : 85) / 100) * secOpacityM;
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
            }
            cursorY += b.height;
        });
        ctx.globalAlpha = 1;

        // ---------- LOGO ----------
        if (state.logoData && logoOpacityM > 0.001) {
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
                ctx.globalAlpha = ((state.logoOpacity !== undefined ? state.logoOpacity : 100) / 100) * logoOpacityM;
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

        // ---------- WATERMARK ----------
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

        ctx.restore();

        // ---------- BORDER ----------
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
