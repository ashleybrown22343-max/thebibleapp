// Data & State
let yorubaArray = [], englishArray = [], englishMap = {};
let savedVerses = JSON.parse(localStorage.getItem('savedVerses') || '[]');
let currentBook = "GEN", currentBookName = "", currentChapter = 1;
let currentFontSize = parseInt(localStorage.getItem('fontSize') || '100');

const bookNumbers = { "GEN":1, "EXO":2, "LEV":3, "NUM":4, "DEU":5, "JOS":6, "JDG":7, "RUT":8, "1SA":9, "2SA":10, "1KI":11, "2KI":12, "1CH":13, "2CH":14, "EZR":15, "NEH":16, "EST":17, "JOB":18, "PSA":19, "PRO":20, "ECC":21, "SNG":22, "ISA":23, "JER":24, "LAM":25, "EZK":26, "DAN":27, "HOS":28, "JOL":29, "AMO":30, "OBA":31, "JON":32, "MIC":33, "NAM":34, "HAB":35, "ZEP":36, "HAG":37, "ZEC":38, "MAL":39, "MAT":40, "MRK":41, "LUK":42, "JHN":43, "ACT":44, "ROM":45, "1CO":46, "2CO":47, "GAL":48, "EPH":49, "PHP":50, "COL":51, "1TH":52, "2TH":53, "1TI":54, "2TI":55, "TIT":56, "PHM":57, "HEB":58, "JAS":59, "1PE":60, "2PE":61, "1JN":62, "2JN":63, "3JN":64, "JUD":65, "REV":66 };
const yorubaNames = ["JENESISI","EKISODU","LEFITIKU","NOMBA","DIUTARONOMI","JOSUA","AWON ADAO","RUTU","SAMUELI KINNI","SAMUELI KEJI","AWON OBA KINNI","AWON OBA KEJI","KRONIKA KINNI","KRONIKA KEJI","ESIRA","NEHEMAYA","ESITA","JOBU","ORIN DAFIDI","IWE OWE","IWE ONIWAASU","ORIN SOLOMONI","AISAYA","JEREMAYA","EKUN JEREMAYA","ISIKIELI","DANIELI","HOSIA","JOELI","AMOSI","OBADAYA","JONA","MIKA","NAHUMU","HABAKUKU","SEFANAYA","HAGAI","SAKARAYA","MALAKI","MATIU","MAKU","LUKU","JOHANU","ISE AWON APOSTELI","ROMU","KORINTI KINNI","KORINTI KEJI","GALATIA","EFESU","FILIPI","KOLOSE","TESALONIKA KINNI","TESALONIKA KEJI","TIMOTI KINNI","TIMOTI KEJI","TITU","FILEMONI","HEBERU","JAKOBU","PETRU KINNI","PETRU KEJI","JOHANU KINNI","JOHANU KEJI","JOHANU KETA","JUDA","IFIWE"];

// UI Functions
function switchTab(tab) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.hidden-screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    if (tab === 'books') { document.getElementById('screen-books').classList.add('active'); document.querySelectorAll('.nav-btn')[0].classList.add('active'); }
    if (tab === 'bookmarks') { document.getElementById('screen-bookmarks').classList.add('active'); document.querySelectorAll('.nav-btn')[1].classList.add('active'); loadBookmarks(); }
    if (tab === 'settings') { document.getElementById('screen-settings').classList.add('active'); document.querySelectorAll('.nav-btn')[2].classList.add('active'); }
}

// Load Data
async function init() {
    try {
        const [yoRes, enRes] = await Promise.all([fetch('data/yoruba.json'), fetch('data/english_net.json')]);
        yorubaArray = await yoRes.json(); englishArray = await enRes.json();
        englishArray.forEach(v => { englishMap[`${v.book}-${v.chapter}-${v.verse}`] = v.text; });
        
        populateBooks();
        document.getElementById('loading-screen').style.display = 'none';
    } catch (e) {
        document.getElementById('loading-screen').innerHTML = '<h3>Error loading data. Ensure your JSON files are in the "data" folder.</h3>';
    }
}

function populateBooks() {
    const otGrid = document.getElementById('ot-grid');
    const ntGrid = document.getElementById('nt-grid');
    yorubaNames.forEach((name, i) => {
        const code = Object.keys(bookNumbers)[i];
        const div = document.createElement('div');
        div.className = i >= 39 ? 'grid-item red' : 'grid-item';
        div.textContent = name;
        div.onclick = () => { currentBook = code; currentBookName = name; populateChapters(); };
        (i >= 39 ? ntGrid : otGrid).appendChild(div);
    });
}

function populateChapters() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-chapters').classList.add('active');
    document.getElementById('chapter-title').textContent = currentBookName;
    
    const bookNum = bookNumbers[currentBook];
    const maxCh = Math.max(...yorubaArray.filter(v => v.book === bookNum).map(v => v.chapter));
    const grid = document.getElementById('chapter-grid'); grid.innerHTML = '';
    
    for (let i = 1; i <= maxCh; i++) {
        const div = document.createElement('div');
        div.className = 'grid-item'; div.textContent = i;
        div.onclick = () => { currentChapter = i; loadChapter(); };
        grid.appendChild(div);
    }
}

function goToBooks() { switchTab('books'); }
function goToChapters() { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById('screen-chapters').classList.add('active'); }

function loadChapter() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-reading').classList.add('active');
    document.getElementById('reading-title').textContent = `${currentBookName} ${currentChapter}`;
    
    const bookNum = bookNumbers[currentBook];
    const yoChapter = yorubaArray.filter(v => v.book === bookNum && v.chapter === currentChapter);
    
    let html = '';
    yoChapter.forEach(v => {
        const eng = englishMap[`${v.book}-${v.chapter}-${v.verse}`] || "";
        html += `<div class="verse-container" onclick="saveVerse(${v.book}, ${v.chapter}, ${v.verse})">
            <span class="verse-number">${v.verse}</span>
            <p class="yoruba-text">${v.text}</p>
            <p class="english-text">${eng}</p>
        </div>`;
    });
    
    document.getElementById('bible-text').innerHTML = html;
    
    // Swipe support for reading
    let startX = 0;
    const el = document.getElementById('bible-text');
    el.ontouchstart = e => startX = e.changedTouches[0].screenX;
    el.ontouchend = e => {
        let endX = e.changedTouches[0].screenX;
        if (endX < startX - 50) { if (currentChapter < 150) { currentChapter++; loadChapter(); } }
        if (endX > startX + 50) { if (currentChapter > 1) { currentChapter--; loadChapter(); } }
    };
}

function saveVerse(book, ch, v) {
    const key = `${book}-${ch}-${v}`;
    if (!savedVerses.includes(key)) {
        savedVerses.push(key); localStorage.setItem('savedVerses', JSON.stringify(savedVerses));
        // Visual feedback without annoying alert
        event.currentTarget.style.background = "rgba(255,255,255,0.3)";
        setTimeout(() => event.currentTarget.style.background = "", 300);
    }
}

function loadBookmarks() {
    let html = '';
    savedVerses.forEach(key => {
        const [b, c, v] = key.split('-').map(Number);
        const obj = yorubaArray.find(x => x.book === b && x.chapter === c && x.verse === v);
        if (obj) html += `<div class="verse-container"><span class="verse-number">${obj.verse}</span><p class="yoruba-text">${obj.text}</p><button onclick="removeBookmark('${key}')">Delete</button></div>`;
    });
    document.getElementById('bookmark-list').innerHTML = html || '<p>No saved verses yet. Tap a verse to save.</p>';
}
function removeBookmark(key) { savedVerses = savedVerses.filter(k => k !== key); localStorage.setItem('savedVerses', JSON.stringify(savedVerses)); loadBookmarks(); }

function changeFont(delta) {
    currentFontSize += delta * 10;
    currentFontSize = Math.min(150, Math.max(80, currentFontSize));
    localStorage.setItem('fontSize', currentFontSize);
    document.getElementById('font-size-label').textContent = currentFontSize + '%';
    document.getElementById('bible-text').style.fontSize = currentFontSize + '%';
}

// Theme & Drawer
document.getElementById('theme-toggle').onclick = () => document.body.classList.toggle('dark-mode');
document.getElementById('menu-btn').onclick = () => document.getElementById('side-drawer').classList.toggle('open');
function toggleHighContrast() { document.body.classList.toggle('high-contrast'); document.getElementById('hc-toggle').textContent = document.body.classList.contains('high-contrast') ? 'ON' : 'OFF'; }
function shareApp() { if (navigator.share) navigator.share({ title: 'Bibeli Mimo', url: window.location.href }); else alert(window.location.href); }

init();
