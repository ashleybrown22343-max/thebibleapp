// ============================================================
// BIBELI MIMO – EXPORT PAGE LOGIC (Pixel-Perfect)
// ============================================================

const data = window.bibleData;

let exportData = null;
let generatedBlob = null;
let generatedFilename = '';
let generatedCanvas = null;

function showView(id) {
    document.querySelectorAll('.export-view').forEach(function (v) { v.classList.remove('active'); });
    document.getElementById(id).classList.add('active');
}

function setProgress(percent, status) {
    document.getElementById('progress-percent').textContent = Math.round(percent) + '%';
    document.getElementById('progress-fill').style.width = percent + '%';
    if (status) document.getElementById('status-text').textContent = status;
}

function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

// ============================================================
// INIT
// ============================================================
async function initExport() {
    document.getElementById('back-btn').onclick = function () { window.location.href = '/studio'; };
    document.getElementById('error-back-action').onclick = function () { window.location.href = '/studio'; };
    document.getElementById('back-studio-action').onclick = function () { window.location.href = '/studio'; };
    document.getElementById('retry-action').onclick = function () { runExportFlow(); };
    document.getElementById('save-again-action').onclick = function () {
        if (generatedBlob && generatedFilename) triggerDownload(generatedBlob, generatedFilename);
    };
    document.getElementById('share-action').onclick = shareGenerated;
    document.getElementById('copy-action').onclick = copyGenerated;

    try {
        const raw = localStorage.getItem('studio_export_state');
        if (!raw) {
            showError('No export data found. Go back to the Studio and try again.');
            return;
        }
        exportData = JSON.parse(raw);
    } catch (e) {
        showError('Failed to read export data.');
        return;
    }

    runExportFlow();
}

function showError(msg) {
    document.getElementById('error-msg').textContent = msg;
    showView('error-view');
}

// ============================================================
// MAIN EXPORT FLOW
// ============================================================
async function runExportFlow() {
    showView('processing-view');
    setProgress(0, 'Starting...');
    await delay(200);

    // Load Bible data if needed
    try {
        setProgress(5, 'Loading Bible data...');
        if (!data.yoruba || data.yoruba.length === 0) {
            await data.loadAllData();
        }
        setProgress(15, 'Loading verse...');
        await delay(150);
    } catch (e) {
        showError('Failed to load Bible data.');
        return;
    }

    // Load fonts
    try {
        setProgress(25, 'Loading fonts...');
        await Promise.race([
            document.fonts.ready,
            new Promise(function (resolve) { setTimeout(resolve, 3000); })
        ]);
        await delay(200);
    } catch (e) {}

    // Determine target dimensions
    setProgress(35, 'Preparing canvas...');
    const targetWidth = parseInt(exportData.exportRes);
    const ratio = exportData.settings.ratio;
    let targetHeight;
    if (ratio === 'square') targetHeight = targetWidth;
    else if (ratio === 'portrait') targetHeight = Math.round(targetWidth * 5 / 4);
    else if (ratio === 'story') targetHeight = Math.round(targetWidth * 16 / 9);
    else if (ratio === 'landscape') targetHeight = Math.round(targetWidth * 9 / 16);
    else targetHeight = Math.round(targetWidth * 4 / 3);

    await delay(200);

    // Preload background image if needed
    setProgress(50, 'Loading background...');
    let bgImageLoaded = false;
    if (exportData.backgroundURL) {
        try {
            await preloadImage(exportData.backgroundURL);
            bgImageLoaded = true;
        } catch (e) {
            bgImageLoaded = false;
        }
    }
    await delay(200);

    // Build the preview DOM at the ORIGINAL studio size
    setProgress(65, 'Rendering image...');
    const hiddenContainer = document.getElementById('hidden-preview-container');
    hiddenContainer.innerHTML = '';

    const previewW = exportData.previewW || 350;
    const previewH = exportData.previewH || 350;

    const previewEl = buildPreviewElement(previewW, previewH, bgImageLoaded);
    hiddenContainer.appendChild(previewEl);
    await delay(300);

    // Compute html2canvas scale factor
    const canvasScale = targetWidth / previewW;

    // Render with html2canvas — this does the upscale natively
    setProgress(75, 'Rendering...');
    let canvas;
    try {
        canvas = await html2canvas(previewEl, {
            backgroundColor: null,
            scale: canvasScale,
            logging: false,
            useCORS: true,
            allowTaint: true,
            width: previewW,
            height: previewH,
            windowWidth: previewW,
            windowHeight: previewH
        });
    } catch (e) {
        showError('Image rendering failed. Please try again.');
        return;
    }

    generatedCanvas = canvas;
    await delay(200);

    // Convert to blob
    setProgress(88, 'Preparing file...');
    const format = exportData.exportFormat || 'png';
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpg' ? (exportData.exportQuality / 100) : 1.0;

    const blob = await new Promise(function (resolve) {
        canvas.toBlob(function (b) { resolve(b); }, mimeType, quality);
    });

    if (!blob) {
        showError('Failed to prepare image file.');
        return;
    }

    generatedBlob = blob;

    // Filename
    const bookIdx = data.codes.indexOf(exportData.settings.currentBook);
    const bookName = (data.englishNames[bookIdx] || 'Verse').replace(/\s+/g, '-');
    const ch = exportData.settings.currentChapter;
    const vs = exportData.settings.currentVerse;
    const now = new Date();
    const stamp = now.getFullYear() + pad2(now.getMonth() + 1) + pad2(now.getDate()) + '-' + pad2(now.getHours()) + pad2(now.getMinutes());
    const ext = format === 'jpg' ? 'jpg' : 'png';
    generatedFilename = 'bible-' + bookName + '-' + ch + '-' + vs + '-' + stamp + '.' + ext;

    // Trigger download
    setProgress(95, 'Saving to device...');
    await delay(200);
    triggerDownload(blob, generatedFilename);

    // Show success
    setProgress(100, 'Done!');
    await delay(400);

    const thumbURL = URL.createObjectURL(blob);
    document.getElementById('preview-thumb').src = thumbURL;
    document.getElementById('filename-display').textContent = generatedFilename;
    showView('success-view');

    setTimeout(function () {
        document.getElementById('hidden-preview-container').innerHTML = '';
    }, 2000);
}

function pad2(n) { return (n < 10 ? '0' : '') + n; }

function triggerDownload(blob, filename) {
    try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
    } catch (e) {
        const reader = new FileReader();
        reader.onload = function () {
            const a = document.createElement('a');
            a.href = reader.result;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        reader.readAsDataURL(blob);
    }
}

function preloadImage(url) {
    return new Promise(function (resolve, reject) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () { resolve(img); };
        img.onerror = function () { reject(new Error('Failed to load image')); };
        img.src = url;
    });
}

// ============================================================
// BUILD PREVIEW AT STUDIO SIZE (NO SCALING ANYWHERE)
// ============================================================
function buildPreviewElement(W, H, bgLoaded) {
    const s = exportData.settings;

    const card = document.createElement('div');
    card.className = 'export-preview-card';
    card.style.width = W + 'px';
    card.style.height = H + 'px';
    card.style.borderRadius = s.radius + 'px';

    // Background
    const bg = document.createElement('div');
    bg.className = 'export-preview-bg';

    if (exportData.backgroundURL && bgLoaded) {
        bg.style.backgroundImage = "url('" + exportData.backgroundURL + "')";
    } else if (exportData.bgGradient) {
        bg.style.background = exportData.bgGradient;
    } else if (exportData.bgSolid) {
        bg.style.background = exportData.bgSolid;
    } else {
        bg.style.background = '#1a237e';
    }

    if (s.blur > 0) bg.style.filter = 'blur(' + s.blur + 'px)';
    card.appendChild(bg);

    // Filter layer
    const bgFilter = document.createElement('div');
    bgFilter.className = 'export-preview-bg-filter';
    const filters = [];
    if (s.brightness !== 100) filters.push('brightness(' + (s.brightness / 100) + ')');
    if (s.saturation !== 100) filters.push('saturate(' + (s.saturation / 100) + ')');
    if (filters.length) {
        bgFilter.style.backdropFilter = filters.join(' ');
        bgFilter.style.webkitBackdropFilter = filters.join(' ');
    }
    card.appendChild(bgFilter);

    // Dark overlay
    const dark = document.createElement('div');
    dark.className = 'export-preview-dark-overlay';
    dark.style.background = 'rgba(0,0,0,' + (s.darkOverlay / 100) + ')';
    card.appendChild(dark);

    // Duotone
    if (s.duotoneOn) {
        const duo = document.createElement('div');
        duo.className = 'export-preview-duotone';
        duo.style.background = 'linear-gradient(45deg, ' + s.duotoneShadow + ', ' + s.duotoneHighlight + ')';
        duo.style.opacity = '0.55';
        duo.style.mixBlendMode = 'multiply';
        card.appendChild(duo);
    }

    // Gradient overlay
    if (s.gradientOverlay) {
        const go = document.createElement('div');
        go.className = 'export-preview-gradient-overlay';
        const rgb = hexToRgb(s.gradientColor);
        go.style.background = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + (s.gradientOpacity / 100) + ')';
        card.appendChild(go);
    }

    // Vignette
    if (s.vignette > 0) {
        const vig = document.createElement('div');
        vig.className = 'export-preview-vignette';
        vig.style.boxShadow = 'inset 0 0 ' + Math.round(s.vignette * 2.5) + 'px ' + Math.round(s.vignette * 1.5) + 'px rgba(0,0,0,' + (s.vignette / 100) + ')';
        card.appendChild(vig);
    }

    // Content
    const content = document.createElement('div');
    content.className = 'export-preview-content';
    content.style.padding = s.padding + '%';

    if (s.vpos === 'top') content.style.justifyContent = 'flex-start';
    else if (s.vpos === 'bottom') content.style.justifyContent = 'flex-end';
    else content.style.justifyContent = 'center';

    const fontCss = getFontCss(s.fontFamily);

    // Reference top
    if (s.refShow && s.refPos === 'top') {
        content.appendChild(createRefEl(s, fontCss));
    }

    // Secondary top
    if (s.secText && s.secPos === 'top') {
        content.appendChild(createSecondaryEl(s));
    }

    // Main text
    const textEl = document.createElement('div');
    textEl.className = 'export-preview-text';
    if (s.textCase === 'upper') textEl.classList.add('upper');
    if (s.textCase === 'title') textEl.classList.add('title');
    textEl.style.fontFamily = fontCss;
    textEl.style.fontSize = s.fontSize + 'px';
    textEl.style.lineHeight = s.lineSpacing;
    textEl.style.letterSpacing = s.letterSpacing + 'px';
    textEl.style.color = s.textColor;
    textEl.style.textAlign = s.align;
    textEl.style.textShadow = getShadowCSS(s.shadow);

    const word = s.highlightWord ? s.highlightWord.trim() : '';
    function hl(text) {
        if (!word || !text) return escapeHtml(text || '');
        const escaped = escapeHtml(text);
        const lowerText = text.toLowerCase();
        const lowerWord = word.toLowerCase();
        let result = '';
        let pos = 0;
        while (true) {
            const idx = lowerText.indexOf(lowerWord, pos);
            if (idx < 0) { result += escaped.substring(pos); break; }
            result += escaped.substring(pos, idx);
            result += '<span class="hl" style="background:' + s.highlightColor + ';color:#fff;">' + escaped.substring(idx, idx + word.length) + '</span>';
            pos = idx + word.length;
        }
        return result;
    }

    const gapPx = s.fontSize * s.blockGap * 0.5;

    if (s.showYoruba && exportData.verseYoruba) {
        const yo = document.createElement('div');
        yo.className = 'text-yo';
        yo.style.opacity = s.yoOpacity / 100;
        yo.innerHTML = hl(exportData.verseYoruba);
        textEl.appendChild(yo);
    }
    if (s.showEnglish && exportData.verseEnglish) {
        const en = document.createElement('div');
        en.className = 'text-en';
        en.style.marginTop = gapPx + 'px';
        en.style.opacity = s.enOpacity / 100;
        en.innerHTML = hl(exportData.verseEnglish);
        textEl.appendChild(en);
    }

    content.appendChild(textEl);

    if (s.secText && s.secPos === 'above') {
        const sec = createSecondaryEl(s);
        sec.style.marginTop = gapPx + 'px';
        content.appendChild(sec);
    }
    if (s.secText && s.secPos === 'bottom') {
        const sec = createSecondaryEl(s);
        sec.style.marginTop = gapPx + 'px';
        content.appendChild(sec);
    }
    if (s.refShow && s.refPos === 'bottom') {
        const ref = createRefEl(s, fontCss);
        ref.style.marginTop = gapPx + 'px';
        content.appendChild(ref);
    }

    card.appendChild(content);

    // Logo
    if (s.logoData) {
        const logoWrap = document.createElement('div');
        logoWrap.className = 'export-preview-logo-wrap';
        logoWrap.dataset.pos = s.logoPos;
        logoWrap.style.width = s.logoSize + 'px';
        logoWrap.style.height = s.logoSize + 'px';
        logoWrap.style.opacity = s.logoOpacity / 100;
        if (s.logoBorderOn) logoWrap.style.border = '2px solid ' + s.logoBorderColor;

        const gap = (s.padding / 100) * W * 0.5;
        if (s.logoPos === 'tl') { logoWrap.style.top = gap + 'px'; logoWrap.style.left = gap + 'px'; }
        else if (s.logoPos === 'tr') { logoWrap.style.top = gap + 'px'; logoWrap.style.right = gap + 'px'; }
        else if (s.logoPos === 'bl') { logoWrap.style.bottom = gap + 'px'; logoWrap.style.left = gap + 'px'; }
        else { logoWrap.style.bottom = gap + 'px'; logoWrap.style.right = gap + 'px'; }

        if (s.logoBgOn) {
            const bgEl = document.createElement('div');
            bgEl.className = 'export-preview-logo-bg';
            bgEl.style.background = s.logoBgColor;
            logoWrap.appendChild(bgEl);
        }
        const img = document.createElement('img');
        img.className = 'export-preview-logo-img';
        img.src = s.logoData;
        img.crossOrigin = 'anonymous';
        logoWrap.appendChild(img);
        card.appendChild(logoWrap);
    }

    // Border
    if (s.borderWidth > 0) {
        const deco = document.createElement('div');
        deco.className = 'export-preview-decoration';
        deco.style.border = s.borderWidth + 'px solid ' + s.borderColor;
        deco.style.borderRadius = s.radius + 'px';
        card.appendChild(deco);
    }

    // Watermark
    const watermark = document.createElement('div');
    watermark.className = 'export-preview-watermark';
    watermark.style.fontSize = '11px';
    watermark.style.bottom = '10px';
    watermark.textContent = 'Bibeli Mimo';
    card.appendChild(watermark);

    return card;
}

function createRefEl(s, fontCss) {
    const ref = document.createElement('div');
    ref.className = 'export-preview-ref';
    const refFontCss = s.refMatchFont ? fontCss : getFontCss(s.refFontFamily);
    ref.style.fontFamily = refFontCss;
    ref.style.fontSize = s.refSize + 'px';
    ref.style.color = s.refColor;
    ref.style.textShadow = getShadowCSS(s.refShadow);
    ref.style.marginBottom = '10px';
    ref.textContent = exportData.referenceText;
    return ref;
}

function createSecondaryEl(s) {
    const sec = document.createElement('div');
    sec.className = 'export-preview-secondary';
    sec.style.fontFamily = getFontCss(s.fontFamily);
    sec.style.fontSize = s.secSize + 'px';
    sec.style.color = s.secColor;
    sec.style.opacity = s.secOpacity / 100;
    sec.style.textShadow = getShadowCSS('soft');
    sec.textContent = s.secText;
    return sec;
}

function getFontCss(fontName) {
    const fonts = {
        'Poppins': "'Poppins', sans-serif",
        'Playfair Display': "'Playfair Display', serif",
        'Lora': "'Lora', serif",
        'Cormorant Garamond': "'Cormorant Garamond', serif",
        'Inter': "'Inter', sans-serif",
        'Merriweather': "'Merriweather', serif",
        'Josefin Sans': "'Josefin Sans', sans-serif",
        'Great Vibes': "'Great Vibes', cursive"
    };
    return fonts[fontName] || "'Poppins', sans-serif";
}

function getShadowCSS(style) {
    if (style === 'none') return 'none';
    if (style === 'soft') return '0 2px 8px rgba(0,0,0,0.4)';
    if (style === 'strong') return '0 4px 15px rgba(0,0,0,0.75)';
    if (style === 'glow') return '0 0 25px rgba(255,255,255,0.7), 0 0 50px rgba(255,255,255,0.3)';
    if (style === 'outline') return '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
    return 'none';
}

function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    const str = String(s);
    let out = '';
    for (let i = 0; i < str.length; i++) {
        const c = str.charAt(i);
        if (c === '&') out += '&amp;';
        else if (c === '<') out += '&lt;';
        else if (c === '>') out += '&gt;';
        else if (c === '"') out += '&quot;';
        else out += c;
    }
    return out;
}

function hexToRgb(hex) {
    if (!hex || hex.length < 7) return { r: 0, g: 0, b: 0 };
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

// ============================================================
// SHARE / COPY
// ============================================================
async function shareGenerated() {
    if (!generatedBlob || !generatedFilename) return;
    const file = new File([generatedBlob], generatedFilename, { type: generatedBlob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({ files: [file], title: 'Bible Verse', text: 'Shared from Bibeli Mimo' });
        } catch (e) {
            if (e.name !== 'AbortError') alert('Sharing failed. Try saving again.');
        }
    } else {
        alert('Sharing is not supported on this browser. The image is already saved.');
    }
}

async function copyGenerated() {
    if (!generatedBlob) return;
    try {
        if (navigator.clipboard && window.ClipboardItem) {
            const item = new ClipboardItem({ [generatedBlob.type]: generatedBlob });
            await navigator.clipboard.write([item]);
            alert('Image copied to clipboard.');
        } else {
            alert('Copy is not supported on this browser.');
        }
    } catch (e) {
        alert('Copy failed. The image is already saved.');
    }
}

window.addEventListener('load', initExport);


