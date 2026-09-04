let yoruba = [], english = [], englishMap = {};
let currentBook = "PSA", currentBookName = "Psalms", currentChapter = 23, currentVerse = 6;
let studioColor = 'white', studioFont = 'sans', selectedTemplate = 0;
let currentAlign = 'center', currentVert = 'center';
let currentRatio = 'square', currentWatermark = true, currentShadow = true;

// MANUAL OVERRIDE STATE
let autoFit = true; 
let userFontSize = 32;
let userLineSpacing = 1.7;
let userPadding = 20;

const codes = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];
const englishNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

async function init() {
    try {
        const yRes = await fetch('data/yoruba.json');
        if (!yRes.ok) throw new Error("Yoruba data not found");
        yoruba = await yRes.json();

        try {
            const eRes = await fetch('data/english_net.json');
            if (eRes.ok) { 
                english = await eRes.json(); 
                english.forEach(v => englishMap[`${v.book}-${v.chapter}-${v.verse}`] = v.text); 
            }
        } catch (e) {}

        buildTemplates(); updatePickerButtons(); updatePreview();
        document.getElementById('pick-book').onclick = () => openModal('book');
        document.getElementById('pick-chapter').onclick = () => openModal('chapter');
        document.getElementById('pick-verse').onclick = () => openModal('verse');
    } catch(e) { document.getElementById('preview-text').innerHTML = "Error: " + e.message; }
}

function updatePickerButtons() {
    document.getElementById('pick-book').textContent = currentBookName;
    document.getElementById('pick-chapter').textContent = currentChapter;
    document.getElementById('pick-verse').textContent = currentVerse;
}

function openModal(type) {
    const modal = document.getElementById('picker-modal');
    const list = document.getElementById('modal-list');
    const title = document.getElementById('modal-title');
    list.innerHTML = '';
    if (type === 'book') {
        title.textContent = 'Select Book';
        englishNames.forEach((name, i) => {
            const div = document.createElement('div'); div.className = 'modal-list-item'; div.textContent = name;
            div.onclick = () => { currentBook = codes[i]; currentBookName = name; currentChapter = 1; currentVerse = 1; updatePickerButtons(); closeModal(); updatePreview(); };
            list.appendChild(div);
        });
    } else if (type === 'chapter') {
        title.textContent = 'Select Chapter';
        const bN = codes.indexOf(currentBook) + 1;
        const maxCh = Math.max(...yoruba.filter(v => v.book === bN).map(v => v.chapter));
        for (let i=1; i<=maxCh; i++) {
            const div = document.createElement('div'); div.className = 'modal-list-item'; div.textContent = i;
            div.onclick = () => { currentChapter = i; currentVerse = 1; updatePickerButtons(); closeModal(); updatePreview(); };
            list.appendChild(div);
        }
    } else if (type === 'verse') {
        title.textContent = 'Select Verse';
        const bN = codes.indexOf(currentBook) + 1;
        const maxV = yoruba.filter(v => v.book === bN && v.chapter == currentChapter).length;
        for (let i=1; i<=maxV; i++) {
            const div = document.createElement('div'); div.className = 'modal-list-item'; div.textContent = i;
            div.onclick = () => { currentVerse = i; updatePickerButtons(); closeModal(); updatePreview(); };
            list.appendChild(div);
        }
    }
    modal.style.display = 'flex';
}

function closeModal() { document.getElementById('picker-modal').style.display = 'none'; }
function toggleFont() { studioFont = studioFont === 'sans' ? 'serif' : 'sans'; document.getElementById('studio-font-btn').textContent = studioFont === 'sans' ? 'Sans' : 'Serif'; updatePreview(); }
function setColor(color) { studioColor = color; updatePreview(); }
function setAlign(align) { currentAlign = align; updatePreview(); }
function setVert(vert) { currentVert = vert; updatePreview(); }
function setRatio(ratio) { currentRatio = ratio; updatePreview(); }
function toggleWatermark() { currentWatermark = !currentWatermark; document.getElementById('watermark-btn').textContent = currentWatermark ? 'ON' : 'OFF'; updatePreview(); }
function toggleShadow() { currentShadow = !currentShadow; document.getElementById('shadow-btn').textContent = currentShadow ? 'ON' : 'OFF'; updatePreview(); }

// MANUAL CONTROLS
function manualFontSize(val) {
    autoFit = false;
    userFontSize = parseInt(val);
    updatePreview();
}
function manualLineSpacing(val) {
    autoFit = false;
    userLineSpacing = parseFloat(val);
    updatePreview();
}
function manualPadding(val) {
    autoFit = false;
    userPadding = parseInt(val);
    updatePreview();
}

// AUTO-FIT BUTTON (Only resets Text Size, Not the Verse)
function resetToAutoFit() {
    autoFit = true;
    userFontSize = 32;
    userLineSpacing = 1.7;
    userPadding = 20;
    document.getElementById('studio-font-size').value = 32;
    document.getElementById('studio-line-spacing').value = 1.7;
    document.getElementById('studio-padding').value = 20;
    updatePreview();
}

// FIXED DUPLICATE TEMPLATES (Using Set)
const templates = [];
const seen = new Set();
const colors = ['#1a237e','#b71c1c','#4a148c','#e65100','#00695c','#1565c0','#212121','#880e4f','#33691e','#0d47a1','#5d4037','#01579b','#2e7d32','#37474f','#8e24aa','#00838f','#bf360c','#3e2723','#64b5f6','#FFD700'];
for (let i=0; i<500; i++) {
    const c1 = colors[i % colors.length];
    const c2 = colors[(i * 7 + 3) % colors.length];
    const bg = `linear-gradient(135deg, ${c1}, ${c2})`;
    if (!seen.has(bg)) {
        seen.add(bg);
        templates.push(bg);
    }
}

function buildTemplates() {
    const grid = document.getElementById('template-grid'); grid.innerHTML = '';
    templates.forEach((bg, i) => {
        const div = document.createElement('div'); div.className = 'template-item' + (i === 0 ? ' selected' : ''); div.style.background = bg;
        div.onclick = () => { selectedTemplate = i; document.querySelectorAll('.template-item').forEach(t => t.classList.remove('selected')); div.classList.add('selected'); updatePreview(); };
        grid.appendChild(div);
    });
}

function getTextData(isPreview) {
    const bN = codes.indexOf(currentBook) + 1;
    const yorubaVerse = yoruba.find(v => v.book === bN && v.chapter == currentChapter && v.verse == currentVerse);
    let englishText = englishMap[`${bN}-${currentChapter}-${currentVerse}`] || "";
    if (!englishText && english.length > 0) {
        const englishVerse = english.find(v => v.book === bN && v.chapter == currentChapter && v.verse == currentVerse);
        if (englishVerse) englishText = englishVerse.text;
    }

    let yorubaText = '';
    if (document.getElementById('img-yo').checked && yorubaVerse) yorubaText = yorubaVerse.text;
    if (!document.getElementById('img-en').checked) englishText = '';

    let fullText = '';
    if (yorubaText) fullText += yorubaText;
    if (englishText) {
        if (fullText) fullText += (isPreview ? '<br><br>' : '\n\n');
        fullText += englishText;
    }
    return fullText;
}

// PREVIEW LOGIC (Supports Manual + AutoFit)
function updatePreview() {
    const text = getTextData(true);
    document.getElementById('preview-ref').textContent = `${currentBookName} ${currentChapter}:${currentVerse}`;
    const textEl = document.getElementById('preview-text');
    textEl.innerHTML = text;

    textEl.style.fontFamily = studioFont === 'sans' ? 'Poppins, sans-serif' : 'Playfair Display, serif';
    textEl.style.color = studioColor;
    textEl.style.textAlign = currentAlign;
    textEl.style.textShadow = currentShadow ? '0 4px 15px rgba(0,0,0,0.7)' : 'none';

    // Decide preview font size (manual vs auto)
    let previewFontSize = userFontSize;
    let previewPadding = Math.min(userPadding, 40);
    let previewLineHeight = userLineSpacing;

    if (autoFit) {
        const boxHeight = currentRatio === 'portrait' ? 450 : currentRatio === 'landscape' ? 250 : 350;
        let tempSize = 32;
        while (tempSize > 15) {
            textEl.style.fontSize = tempSize + 'px';
            textEl.style.lineHeight = 1.6;
            textEl.style.padding = '20px';
            if (textEl.scrollHeight <= boxHeight - 40) {
                previewFontSize = tempSize;
                previewPadding = 20;
                previewLineHeight = 1.6;
                break;
            }
            tempSize -= 2;
        }
    }

    textEl.style.fontSize = previewFontSize + 'px';
    textEl.style.lineHeight = previewLineHeight;
    textEl.style.padding = previewPadding + 'px';

    const box = document.getElementById('image-preview');
    box.style.height = currentRatio === 'portrait' ? '450px' : currentRatio === 'landscape' ? '250px' : '350px';
    box.style.background = templates[selectedTemplate];

    if (currentVert === 'top') box.style.justifyContent = 'flex-start';
    else if (currentVert === 'bottom') box.style.justifyContent = 'flex-end';
    else box.style.justifyContent = 'center';
}

// *** THE ONLY PART CHANGED: CANVAS MIRRORS THE PREVIEW EXACTLY ***
function generateCanvas() {
    const canvas = document.createElement('canvas');
    let width = 1080, height = 1080;
    if (currentRatio === 'portrait') { width = 1080; height = 1350; }
    if (currentRatio === 'landscape') { width = 1920; height = 1080; }
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    const parts = templates[selectedTemplate].match(/#[0-9a-fA-F]{6}/g);
    grad.addColorStop(0, parts ? parts[0] : '#1a237e');
    grad.addColorStop(1, parts ? parts[1] : '#0f172a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);

    // 2. Get EXACT styles from the LIVE preview elements
    const previewText = document.getElementById('preview-text');
    const previewRef = document.getElementById('preview-ref');
    const previewBox = document.getElementById('image-preview');

    const previewStyles = getComputedStyle(previewText);
    const refStyles = getComputedStyle(previewRef);

    const previewFontSize = parseFloat(previewStyles.fontSize);
    const previewPadding = parseFloat(previewStyles.paddingLeft);
    const previewLineHeight = parseFloat(previewStyles.lineHeight);
    const previewRefSize = parseFloat(refStyles.fontSize);

    const previewWidth = previewBox.clientWidth;
    const previewHeight = previewBox.clientHeight;

    // 3. Calculate Scale Factors
    const scaleX = width / previewWidth;
    const scaleY = height / previewHeight;

    // 4. Scale values to Canvas
    const canvasFontSize = previewFontSize * scaleX;
    const canvasPadding = previewPadding * scaleX;
    const canvasLineHeight = previewLineHeight * scaleX;
    const canvasRefSize = previewRefSize * scaleX;

    // 5. Prepare Fonts & Shadows
    const fontName = studioFont === 'sans' ? 'Poppins' : 'Playfair Display';
    ctx.font = `bold ${canvasRefSize}px "${fontName}"`;
    ctx.textAlign = currentAlign;
    ctx.textBaseline = 'middle';

    if (currentShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
    }
    ctx.fillStyle = studioColor;

    // 6. Draw Reference at exact Y position from preview
    const refYPos = (previewRef.offsetTop + (previewRef.offsetHeight / 2)) * scaleY;
    ctx.fillText(`${currentBookName} ${currentChapter}:${currentVerse}`, width / 2, refYPos);

    // 7. Prepare Main Text
    ctx.font = `${canvasFontSize}px "${fontName}"`;
    ctx.textBaseline = 'top';

    // 8. Define X position based on alignment
    let textX = width / 2;
    if (currentAlign === 'left') { textX = canvasPadding; }
    else if (currentAlign === 'right') { textX = width - canvasPadding; }

    // 9. Define starting Y position based on the preview's offsetTop
    const textYTop = previewText.offsetTop * scaleY;

    // 10. Wrap text using the EXACT scaled line height
    const maxTextWidth = width - (canvasPadding * 2);
    const text = previewText.innerHTML.replace(/<br\s*\/?>/gi, '\n'); // Convert breaks to newlines

    const paragraphs = text.split('\n');
    let drawY = textYTop;

    paragraphs.forEach(paragraph => {
        const words = paragraph.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxTextWidth && n > 0) {
                ctx.fillText(line.trim(), textX, drawY);
                line = words[n] + ' ';
                drawY += canvasLineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), textX, drawY);
        drawY += canvasLineHeight; // Add the paragraph gap
    });

    // 11. Draw Watermark
    if (currentWatermark) {
        ctx.font = `${Math.round(width * 0.02)}px "Poppins"`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.textBaseline = 'middle';
        ctx.fillText('Bibeli Mimo', width / 2, height - (canvasPadding * 0.4));
    }

    return canvas;
}

function downloadImage() { const canvas = generateCanvas(); const link = document.createElement('a'); link.download = 'bible-verse.png'; link.href = canvas.toDataURL('image/png'); link.click(); }
function shareImage() {
    const canvas = generateCanvas();
    canvas.toBlob(function(blob) {
        const file = new File([blob], 'bible-verse.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: 'Bibeli Mimo' });
        else { alert('Image sharing not supported. Downloading...'); downloadImage(); }
    });
}

init();
