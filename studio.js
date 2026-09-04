let yoruba = [], english = [], englishMap = {};
let currentBook = "GEN", currentBookName = "Genesis", currentChapter = 1, currentVerse = 1;
let studioColor = 'white', studioFont = 'sans', selectedTemplate = 0;
let pickerType = null; // 'book', 'chapter', 'verse'

const codes = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];
const englishNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

async function init() {
    const yRes = await fetch('data/yoruba.json');
    yoruba = await yRes.json();
    try {
        const eRes = await fetch('data/english_net.json');
        english = await eRes.json();
        english.forEach(v => englishMap[`${v.book}-${v.chapter}-${v.verse}`] = v.text);
    } catch (e) {}
    
    updatePickerButtons();
    buildTemplates();
    updatePreview();
    
    document.getElementById('pick-book').onclick = () => openModal('book');
    document.getElementById('pick-chapter').onclick = () => openModal('chapter');
    document.getElementById('pick-verse').onclick = () => openModal('verse');
}

function updatePickerButtons() {
    document.getElementById('pick-book').textContent = currentBookName;
    document.getElementById('pick-chapter').textContent = currentChapter;
    document.getElementById('pick-verse').textContent = currentVerse;
}

function openModal(type) {
    pickerType = type;
    const modal = document.getElementById('picker-modal');
    const list = document.getElementById('modal-list');
    const title = document.getElementById('modal-title');
    list.innerHTML = '';
    
    if (type === 'book') {
        title.textContent = 'Select Book';
        englishNames.forEach((name, i) => {
            const div = document.createElement('div'); div.className = 'modal-list-item'; div.textContent = name;
            div.onclick = () => { currentBook = codes[i]; currentBookName = name; currentChapter = 1; currentVerse = 1; updatePickerButtons(); updateChaptersModal(); closeModal(); updatePreview(); };
            list.appendChild(div);
        });
    } else if (type === 'chapter') {
        title.textContent = 'Select Chapter';
        const bN = codes.indexOf(currentBook) + 1;
        const maxCh = Math.max(...yoruba.filter(v => v.book === bN).map(v => v.chapter));
        for (let i=1; i<=maxCh; i++) {
            const div = document.createElement('div'); div.className = 'modal-list-item'; div.textContent = i;
            div.onclick = () => { currentChapter = i; currentVerse = 1; updatePickerButtons(); updateVersesModal(); closeModal(); updatePreview(); };
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

function buildTemplates() {
    const grid = document.getElementById('template-grid');
    const colors = ['#1a237e','#b71c1c','#4a148c','#e65100','#00695c','#1565c0','#212121','#880e4f','#33691e','#0d47a1','#5d4037','#01579b','#2e7d32','#37474f','#8e24aa','#00838f','#bf360c','#3e2723','#64b5f6','#FFD700'];
    for (let i=0; i<500; i++) {
        const div = document.createElement('div');
        div.className = 'template-item' + (i === 0 ? ' selected' : '');
        div.style.background = `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i+7) % colors.length]})`;
        div.onclick = () => {
            selectedTemplate = i;
            document.querySelectorAll('.template-item').forEach(t => t.classList.remove('selected'));
            div.classList.add('selected');
            updatePreview();
        };
        grid.appendChild(div);
    }
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
    
    document.getElementById('image-preview').style.background = document.querySelector('.template-item.selected').style.background;
}

function toggleFont() {
    const btn = document.getElementById('studio-font-btn');
    studioFont = studioFont === 'sans' ? 'serif' : 'sans';
    btn.textContent = studioFont === 'sans' ? 'Sans' : 'Serif';
    updatePreview();
}
function setColor(color) {
    studioColor = color;
    updatePreview();
}
function shareVerse() {
    const bN = codes.indexOf(currentBook) + 1;
    const yorubaVerse = yoruba.find(v => v.book === bN && v.chapter == currentChapter && v.verse == currentVerse);
    const englishVerse = englishMap[`${bN}-${currentChapter}-${currentVerse}`] || "";
    const text = `${yorubaVerse ? yorubaVerse.text : ''}${englishVerse ? '\n\n' + englishVerse : ''}`;
    
    if (navigator.share) {
        navigator.share({
            title: `${currentBookName} ${currentChapter}:${currentVerse}`,
            text: text
        });
    } else {
        alert(text);
    }
}

init();
