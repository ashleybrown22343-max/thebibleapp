let yoruba = [], english = [], englishMap = {};
let currentBook = "GEN", currentBookName = "Genesis", currentChapter = 1, currentVerse = 1;
let studioColor = 'white', studioFont = 'sans', selectedTemplate = 0;
let currentAlign = 'center', currentVert = 'center';
let currentRatio = 'square', currentWatermark = true;
let currentLineSpacing = parseFloat(document.getElementById('studio-line-spacing') ? document.getElementById('studio-line-spacing').value : '1.6');

const codes = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];
const englishNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

async function init() {
    try {
        const yRes = await fetch('data/yoruba.json');
        if (!yRes.ok) throw new Error("Yoruba data not found");
        yoruba = await yRes.json();
        try {
            const eRes = await fetch('data/english_net.json');
            if (eRes.ok) { english = await eRes.json(); english.forEach(v => englishMap[`${v.book}-${v.chapter}-${v.verse}`] = v.text); }
        } catch (e) {}
        
        buildTemplates();
        updatePickerButtons();
        updatePreview();
        
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

function toggleFont() {
    const btn = document.getElementById('studio-font-btn');
    studioFont = studioFont === 'sans' ? 'serif' : 'sans';
    btn.textContent = studioFont === 'sans' ? 'Sans' : 'Serif';
    updatePreview();
}
function setColor(color) { studioColor = color; updatePreview(); }
function setAlign(align) { currentAlign = align; updatePreview(); }
function setVert(vert) { currentVert = vert; updatePreview(); }
function setRatio(ratio) {
    currentRatio = ratio;
    const preview = document.getElementById('image-preview');
    if (ratio === 'square') preview.style.height = '300px';
    if (ratio === 'portrait') preview.style.height = '400px';
    if (ratio === 'landscape') preview.style.height = '200px';
    updatePreview();
}
function toggleWatermark() {
    currentWatermark = !currentWatermark;
    const btn = document.getElementById('watermark-btn');
    btn.textContent = currentWatermark ? 'ON' : 'OFF';
    updatePreview();
}

const templates = [];
const colors = ['#1a237e','#b71c1c','#4a148c','#e65100','#00695c','#1565c0','#212121','#880e4f','#33691e','#0d47a1','#5d4037','#01579b','#2e7d32','#37474f','#8e24aa','#00838f','#bf360c','#3e2723','#64b5f6','#FFD700'];
for (let i=0; i<500; i++) {
    const c1 = colors[i % colors.length];
    const c2 = colors[(i+7) % colors.length];
    templates.push(`linear-gradient(135deg, ${c1}, ${c2})`);
}

function buildTemplates() {
    const grid = document.getElementById('template-grid');
    grid.innerHTML = '';
    templates.forEach((bg, i) => {
        const div = document.createElement('div');
        div.className = 'template-item' + (i === 0 ? ' selected' : '');
        div.style.background = bg;
        div.onclick = () => {
            selectedTemplate = i;
            document.querySelectorAll('.template-item').forEach(t => t.classList.remove('selected'));
            div.classList.add('selected');
            updatePreview();
        };
        grid.appendChild(div);
    });
}

function updatePreview() {
    const bN = codes.indexOf(currentBook) + 1;
    const yorubaVerse = yoruba.find(v => v.book === bN && v.chapter == currentChapter && v.verse == currentVerse);
    const englishVerse = englishMap[`${bN}-${currentChapter}-${currentVerse}`] || "";
    
    document.getElementById('preview-ref').textContent = `${currentBookName} ${currentChapter}:${currentVerse}`;
    
    let text = '';
    if (document.getElementById('img-yo').checked && yorubaVerse) text += yorubaVerse.text;
    if (document.getElementById('img-en').checked && englishVerse) text += (text ? '<br><br>' : '') + englishVerse;
    
    const textEl = document.getElementById('preview-text');
    textEl.innerHTML = text;
    textEl.style.fontFamily = studioFont === 'sans' ? 'sans-serif' : 'serif';
    textEl.style.color = studioColor;
    textEl.style.fontSize = document.getElementById('studio-font-size').value + 'px';
    textEl.style.lineHeight = document.getElementById('studio-line-spacing').value;
    textEl.style.textAlign = currentAlign;
    
    // vertical align
    const preview = document.getElementById('image-preview');
    if (currentVert === 'top') { preview.style.justifyContent = 'flex-start'; }
    else if (currentVert === 'bottom') { preview.style.justifyContent = 'flex-end'; }
    else { preview.style.justifyContent = 'center'; }
    
    if (currentWatermark) { textEl.innerHTML += '<div style="font-size:10px; margin-top:30px; opacity:0.5;">Bibeli Mimo</div>'; }
    
    document.getElementById('image-preview').style.background = templates[selectedTemplate];
}

// CANVAS LOGIC FOR REAL IMAGE DOWNLOAD & SHARE
function generateCanvas() {
    const canvas = document.createElement('canvas');
    let width = 1080, height = 1080;
    if (currentRatio === 'portrait') { width = 1080; height = 1350; }
    if (currentRatio === 'landscape') { width = 1920; height = 1080; }
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Draw Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    const parts = templates[selectedTemplate].match(/#[0-9a-fA-F]{6}/g);
    if (parts && parts.length >= 2) {
        grad.addColorStop(0, parts[0]);
        grad.addColorStop(1, parts[1]);
    } else {
        grad.addColorStop(0, '#1a237e');
        grad.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    
    // Draw Text
    ctx.fillStyle = studioColor;
    ctx.font = (studioFont === 'sans' ? 'sans-serif' : 'serif') + ' ' + (document.getElementById('studio-font-size').value * 4) + 'px';
    ctx.textAlign = currentAlign;
    ctx.textBaseline = 'middle';
    
    const bN = codes.indexOf(currentBook) + 1;
    const yorubaVerse = yoruba.find(v => v.book === bN && v.chapter == currentChapter && v.verse == currentVerse);
    const englishVerse = englishMap[`${bN}-${currentChapter}-${currentVerse}`] || "";
    
    let text = '';
    if (document.getElementById('img-yo').checked && yorubaVerse) text += yorubaVerse.text;
    if (document.getElementById('img-en').checked && englishVerse) text += (text ? '\n\n' : '') + englishVerse;
    
    // Draw Reference
    ctx.font = 'bold ' + (document.getElementById('studio-font-size').value * 2.5) + 'px ' + (studioFont === 'sans' ? 'sans-serif' : 'serif');
    ctx.fillText(`${currentBookName} ${currentChapter}:${currentVerse}`, width / 2, height / 6);
    
    // Wrap Text
    const maxWidth = width - 100;
    const lineHeight = document.getElementById('studio-line-spacing').value * (document.getElementById('studio-font-size').value * 4);
    let y = height / 2;
    if (currentVert === 'top') y = height / 4;
    if (currentVert === 'bottom') y = height / 1.5;
    
    ctx.font = (studioFont === 'sans' ? 'sans-serif' : 'serif') + ' ' + (document.getElementById('studio-font-size').value * 4) + 'px';
    let line = '';
    const words = text.split(' ');
    
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line.trim(), width / 2, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), width / 2, y);
    
    if (currentWatermark) {
        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('Bibeli Mimo', width / 2, height - 30);
    }
    
    return canvas;
}

function downloadImage() {
    const canvas = generateCanvas();
    const link = document.createElement('a');
    link.download = 'bible-verse.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function shareImage() {
    const canvas = generateCanvas();
    canvas.toBlob(function(blob) {
        const file = new File([blob], 'bible-verse.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                files: [file],
                title: 'Bibeli Mimo'
            });
        } else {
            alert('Image sharing not supported on this browser. Downloading instead...');
            downloadImage();
        }
    });
}

init();
