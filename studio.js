let yoruba = [], english = [], englishMap = {};
let currentBook = "PSA", currentBookName = "Psalms", currentChapter = 23, currentVerse = 6;
let studioColor = 'white', studioFont = 'sans', selectedTemplate = 0;
let currentAlign = 'center', currentVert = 'center';
let currentRatio = 'square', currentWatermark = true, currentShadow = true;

// AUTO-FIT vs MANUAL
let autoFit = true;
let userFontSize = 32;
let userLineSpacing = 1.7;
let userPadding = 20;
const defaultFontSize = 32, defaultLineSpacing = 1.7, defaultPadding = 20;

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

// Manual slider handlers
function manualFontSize(val) {
    autoFit = false;
    userFontSize = parseInt(val);
    document.getElementById('studio-font-size').value = val;
    updatePreview();
}
function manualLineSpacing(val) {
    autoFit = false;
    userLineSpacing = parseFloat(val);
    document.getElementById('studio-line-spacing').value = val;
    updatePreview();
}
function manualPadding(val) {
    autoFit = false;
    userPadding = parseInt(val);
    document.getElementById('studio-padding').value = val;
    updatePreview();
}

function resetToAutoFit() {
    autoFit = true;
    userFontSize = defaultFontSize;
    userLineSpacing = defaultLineSpacing;
    userPadding = defaultPadding;
    document.getElementById('studio-font-size').value = defaultFontSize;
    document.getElementById('studio-line-spacing').value = defaultLineSpacing;
    document.getElementById('studio-padding').value = defaultPadding;
    updatePreview();
}

const templates = [];
const colors = ['#1a237e','#b71c1c','#4a148c','#e65100','#00695c','#1565c0','#212121','#880e4f','#33691e','#0d47a1','#5d4037','#01579b','#2e7d32','#37474f','#8e24aa','#00838f','#bf360c','#3e2723','#64b5f6','#FFD700'];
for (let i=0; i<500; i++) { const c1 = colors[i % colors.length]; const c2 = colors[(i+7) % colors.length]; templates.push(`linear-gradient(135deg, ${c1}, ${c2})`); }

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

// HELPER: Calculate font size, lineHeight, padding based on autoFit or manual
function getLayoutParams(width, height, refFontSize) {
    if (autoFit) {
        // Use autoFit algorithm
        let fontSize = Math.round(width * 0.08);
        let lineHeight = fontSize * 1.6;
        let padding = Math.round(width * 0.12);
        // Clamp padding to max 15% of width
        padding = Math.min(padding, Math.round(width * 0.15));

        // Calculate line count
        function lineCount(fs) {
            // We'll measure using a temporary context
            const tempCtx = document.createElement('canvas').getContext('2d');
            tempCtx.font = `${fs}px ${studioFont === 'sans' ? 'Poppins' : 'Playfair Display'}`;
            const maxTextWidth = width - (padding * 2);
            let count = 0;
            const paragraphs = getTextData(false).split('\n');
            paragraphs.forEach(para => {
                const words = para.split(' ');
                let line = '';
                for (let i=0; i<words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    if (tempCtx.measureText(testLine).width > maxTextWidth && i>0) {
                        count++;
                        line = words[i] + ' ';
                    } else line = testLine;
                }
                count++;
            });
            return count;
        }

        let totalH = 0;
        while (fontSize > 30) {
            lineHeight = fontSize * 1.6;
            let lines = lineCount(fontSize);
            totalH = lines * lineHeight;
            if (totalH <= height - (padding*2) - (refFontSize*1.5)) break;
            fontSize -= 2;
        }
        return { fontSize, lineHeight, padding };
    } else {
        // Manual mode: use user values, but still clamp padding to avoid negative
        let fontSize = userFontSize * 3; // scale to canvas
        let lineHeight = fontSize * userLineSpacing;
        let padding = Math.min(userPadding * 4, Math.round(width * 0.15));
        return { fontSize, lineHeight, padding };
    }
}

function updatePreview() {
    const text = getTextData(true);
    document.getElementById('preview-ref').textContent = `${currentBookName} ${currentChapter}:${currentVerse}`;
    const textEl = document.getElementById('preview-text');
    textEl.innerHTML = text;

    textEl.style.fontFamily = studioFont === 'sans' ? 'Poppins, sans-serif' : 'Playfair Display, serif';
    textEl.style.color = studioColor;
    textEl.style.textAlign = currentAlign;
    textEl.style.textShadow = currentShadow ? '0 4px 15px rgba(0,0,0,0.7)' : 'none';

    // For preview, we need to scale down the canvas params to fit the box.
    // We'll just use the sliders directly for preview (or auto-fit approximation)
    let previewFontSize, previewPadding;
    if (autoFit) {
        // In preview, approximate auto-fit by scaling to box height
        const boxHeight = currentRatio === 'portrait' ? 450 : currentRatio === 'landscape' ? 250 : 350;
        const boxWidth = 350; // max width of preview
        const params = getLayoutParams(boxWidth * 3, boxHeight * 3, 30); // simulate canvas dimensions
        previewFontSize = params.fontSize / 3;
        previewPadding = params.padding / 3;
    } else {
        previewFontSize = userFontSize;
        previewPadding = Math.min(userPadding, 40);
    }
    textEl.style.fontSize = previewFontSize + 'px';
    textEl.style.padding = previewPadding + 'px';
    textEl.style.lineHeight = autoFit ? 1.6 : userLineSpacing;

    const box = document.getElementById('image-preview');
    box.style.height = currentRatio === 'portrait' ? '450px' : currentRatio === 'landscape' ? '250px' : '350px';
    box.style.background = templates[selectedTemplate];

    if (currentVert === 'top') box.style.justifyContent = 'flex-start';
    else if (currentVert === 'bottom') box.style.justifyContent = 'flex-end';
    else box.style.justifyContent = 'center';
}

// PERFECT CANVAS WITH AUTO-FIT OR MANUAL OVERRIDE
function generateCanvas() {
    const canvas = document.createElement('canvas');
    let width = 1080, height = 1080;
    if (currentRatio === 'portrait') { width = 1080; height = 1350; }
    if (currentRatio === 'landscape') { width = 1920; height = 1080; }
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, width, height);
    const parts = templates[selectedTemplate].match(/#[0-9a-fA-F]{6}/g);
    grad.addColorStop(0, parts ? parts[0] : '#1a237e');
    grad.addColorStop(1, parts ? parts[1] : '#0f172a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);

    const text = getTextData(false);
    const refText = `${currentBookName} ${currentChapter}:${currentVerse}`;
    const refFontSize = Math.round(width * 0.055);

    // Get layout parameters from autoFit or manual
    const params = getLayoutParams(width, height, refFontSize);
    const { fontSize, lineHeight, padding } = params;

    // Draw reference
    ctx.save();
    if (currentShadow) { ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; }
    ctx.fillStyle = studioColor;
    ctx.font = `bold ${refFontSize}px ${studioFont === 'sans' ? 'Poppins' : 'Playfair Display'}`;
    ctx.textAlign = currentAlign;
    ctx.textBaseline = 'middle';
    ctx.fillText(refText, width / 2, padding * 0.8);

    // Draw main text
    ctx.font = `${fontSize}px ${studioFont === 'sans' ? 'Poppins' : 'Playfair Display'}`;
    ctx.lineWidth = 10;
    ctx.textBaseline = 'top';

    // Calculate line count to position vertically
    let lineCount = 0;
    const paragraphs = text.split('\n');
    paragraphs.forEach(para => {
        const words = para.split(' ');
        let line = '';
        for (let i=0; i<words.length; i++) {
            const testLine = line + words[i] + ' ';
            if (ctx.measureText(testLine).width > width - (padding*2) && i>0) {
                lineCount++;
                line = words[i] + ' ';
            } else line = testLine;
        }
        lineCount++;
    });

    const totalTextHeight = lineCount * lineHeight;
    let startY;
    if (currentVert === 'top') startY = padding * 1.5;
    else if (currentVert === 'bottom') startY = height - padding - totalTextHeight;
    else startY = (height / 2) - (totalTextHeight / 2);

    let drawY = startY;
    paragraphs.forEach(para => {
        const words = para.split(' ');
        let line = '';
        for (let i=0; i<words.length; i++) {
            const testLine = line + words[i] + ' ';
            if (ctx.measureText(testLine).width > width - (padding*2) && i>0) {
                ctx.fillText(line.trim(), width / 2, drawY);
                line = words[i] + ' ';
                drawY += lineHeight;
            } else line = testLine;
        }
        ctx.fillText(line.trim(), width / 2, drawY);
        drawY += lineHeight;
    });

    if (currentWatermark) {
        ctx.font = `${Math.round(width * 0.02)}px Poppins`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.textBaseline = 'middle';
        ctx.fillText('Bibeli Mimo', width / 2, height - (padding * 0.4));
    }
    ctx.restore();
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
