// State & Data
let yorubaArray = [];
let englishArray = [];
let englishMap = {};
let savedVerses = JSON.parse(localStorage.getItem('savedVerses') || '[]');
let currentBook = "GEN";
let currentChapter = 1;

const bookNumbers = { "GEN":1, "EXO":2, "LEV":3, "NUM":4, "DEU":5, "JOS":6, "JDG":7, "RUT":8, "1SA":9, "2SA":10, "1KI":11, "2KI":12, "1CH":13, "2CH":14, "EZR":15, "NEH":16, "EST":17, "JOB":18, "PSA":19, "PRO":20, "ECC":21, "SNG":22, "ISA":23, "JER":24, "LAM":25, "EZK":26, "DAN":27, "HOS":28, "JOL":29, "AMO":30, "OBA":31, "JON":32, "MIC":33, "NAM":34, "HAB":35, "ZEP":36, "HAG":37, "ZEC":38, "MAL":39, "MAT":40, "MRK":41, "LUK":42, "JHN":43, "ACT":44, "ROM":45, "1CO":46, "2CO":47, "GAL":48, "EPH":49, "PHP":50, "COL":51, "1TH":52, "2TH":53, "1TI":54, "2TI":55, "TIT":56, "PHM":57, "HEB":58, "JAS":59, "1PE":60, "2PE":61, "1JN":62, "2JN":63, "3JN":64, "JUD":65, "REV":66 };
const bookNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

// Tabs
document.getElementById('tab-read').onclick = () => showTab('read');
document.getElementById('tab-search').onclick = () => showTab('search');
document.getElementById('tab-bookmark').onclick = () => showTab('bookmark');
function showTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    if (tab === 'read') { document.getElementById('tab-read').classList.add('active'); document.getElementById('read-section').style.display = 'block'; }
    if (tab === 'search') { document.getElementById('tab-search').classList.add('active'); document.getElementById('search-section').style.display = 'block'; }
    if (tab === 'bookmark') { document.getElementById('tab-bookmark').classList.add('active'); document.getElementById('bookmark-section').style.display = 'block'; loadBookmarks(); }
}

// Theme & Church Mode
document.getElementById('theme-btn').onclick = () => { document.body.classList.toggle('dark-mode'); document.body.classList.remove('church-mode'); };
document.getElementById('church-btn').onclick = () => { document.body.classList.toggle('church-mode'); document.body.classList.remove('dark-mode'); };

// Initialize Data
async function init() {
    // Populate dropdown
    Object.keys(bookNumbers).forEach(code => {
        let opt = document.createElement('option'); opt.value = code; opt.textContent = bookNames[bookNumbers[code] - 1];
        document.getElementById('book-select').appendChild(opt);
    });

    // Fetch Data
    const [yoRes, enRes] = await Promise.all([fetch('data/yoruba.json'), fetch('data/english_net.json')]);
    yorubaArray = await yoRes.json(); englishArray = await enRes.json();
    englishArray.forEach(v => { englishMap[`${v.book}-${v.chapter}-${v.verse}`] = v.text; });
    
    // Load first chapter
    loadChapter();
    
    // Init Verse of the Day
    loadVOTD();
}

function loadChapter() {
    currentBook = document.getElementById('book-select').value;
    currentChapter = parseInt(document.getElementById('chapter-input').value);
    const bookNum = bookNumbers[currentBook];
    const yoChapter = yorubaArray.filter(v => v.book === bookNum && v.chapter === currentChapter);

    let html = '';
    yoChapter.forEach(v => {
        const engText = englishMap[`${v.book}-${v.chapter}-${v.verse}`] || "";
        html += `<div class="verse-container" id="verse-${v.book}-${v.chapter}-${v.verse}">
            <div class="verse-number">${v.verse}</div>
            <div class="verse-text"><p class="yoruba-text">${v.text}</p><p class="english-text">${engText}</p></div>
            <button class="save-btn" onclick="saveVerse(${v.book}, ${v.chapter}, ${v.verse})">Save</button>
        </div>`;
    });
    document.getElementById('bible-text').innerHTML = html || '<p>Chapter not found.</p>';
    
    // Swipe Support
    let touchstartX = 0; let touchendX = 0;
    const el = document.getElementById('bible-text');
    el.addEventListener('touchstart', e => touchstartX = e.changedTouches[0].screenX);
    el.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX; 
        if (touchendX < touchstartX - 50) nextChapter(); 
        if (touchendX > touchstartX + 50) prevChapter();
    });
}

function nextChapter() { document.getElementById('chapter-input').value = currentChapter + 1; loadChapter(); }
function prevChapter() { if (currentChapter > 1) { document.getElementById('chapter-input').value = currentChapter - 1; loadChapter(); } }

function saveVerse(book, ch, v) {
    const key = `${book}-${ch}-${v}`;
    if (!savedVerses.includes(key)) {
        savedVerses.push(key); localStorage.setItem('savedVerses', JSON.stringify(savedVerses)); alert('Saved!');
    } else { alert('Already saved!'); }
}

function loadBookmarks() {
    let html = '<ul>';
    savedVerses.forEach(key => {
        const [b, c, v] = key.split('-').map(Number);
        const verseObj = yorubaArray.find(x => x.book === b && x.chapter === c && x.verse === v);
        if (verseObj) {
            html += `<li><strong>${bookNames[b-1]} ${c}:${v}</strong><br>${verseObj.text}<br><button onclick="removeBookmark('${key}')">Delete</button></li>`;
        }
    });
    document.getElementById('bookmark-list').innerHTML = html + '</ul>';
}
function removeBookmark(key) {
    savedVerses = savedVerses.filter(k => k !== key);
    localStorage.setItem('savedVerses', JSON.stringify(savedVerses));
    loadBookmarks();
}

function loadVOTD() {
    const day = new Date().getDate();
    const randomVerse = yorubaArray[day * 1000];
    if (randomVerse) {
        document.getElementById('votd-banner').innerText = `Verse of the Day: ${randomVerse.text}`;
    }
}

// Search
document.getElementById('search-btn').onclick = () => {
    const query = document.getElementById('search-input').value.toLowerCase();
    let results = yorubaArray.filter(v => v.text.toLowerCase().includes(query)).slice(0, 20);
    let html = '<h4>Search Results:</h4>';
    results.forEach(v => {
        html += `<div class="verse-container"><strong>${bookNames[v.book-1]} ${v.chapter}:${v.verse}</strong><br>${v.text}</div>`;
    });
    document.getElementById('search-results').innerHTML = html || '<p>No results found.</p>';
};

document.getElementById('load-btn').onclick = loadChapter;
document.getElementById('chapter-input').addEventListener('keypress', e => { if (e.key === 'Enter') loadChapter(); });

// Install Button
let deferredPrompt; const installBtn = document.getElementById('install-btn');
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; installBtn.style.display = 'block'; });
installBtn.onclick = async () => { if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; installBtn.style.display = 'none'; } };

init();
