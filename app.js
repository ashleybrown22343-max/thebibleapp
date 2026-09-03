let yoruba = [], english = [], englishMap = {};
let saved = JSON.parse(localStorage.getItem('saved') || '[]');
let notes = JSON.parse(localStorage.getItem('notes') || '{}');
let highlights = JSON.parse(localStorage.getItem('highlights') || '{}');
let history = JSON.parse(localStorage.getItem('history') || '[]');
let currentBook = "GEN", currentBookName = "Genesis", currentChapter = 1;
let currentFontSize = parseInt(localStorage.getItem('fontSize') || '100');
let currentEnglishChapterText = '';
let currentLibrary = 'saved';
let activeVerse = { b: 0, c: 0, v: 0 };

const codes = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];
const englishNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
const splash = document.getElementById('splash-screen');
const app = document.getElementById('app-container');

async function init() {
    try {
        const [yRes, eRes] = await Promise.all([
            fetch('data/yoruba.json').then(res => { if(!res.ok) throw new Error("Yoruba"); return res.json(); }),
            fetch('data/english_net.json').then(res => { if(!res.ok) return null; return res.json(); })
        ]);
        yoruba = yRes;
        if (eRes) { english = eRes; english.forEach(v => englishMap[`${v.book}-${v.chapter}-${v.verse}`] = v.text); }
        splash.style.display = 'none';
        app.style.display = 'block';
        loadHome();
        buildBooks();
    } catch(e) {
        splash.innerHTML = "<h3>Error: Yoruba Data Not Found. Check the 'data' folder in GitHub.</h3>";
    }
}

function switchTab(tab) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('screen-' + tab).classList.add('active');
    if(tab === 'home') document.querySelectorAll('.nav-btn')[0].classList.add('active');
    if(tab === 'books') document.querySelectorAll('.nav-btn')[1].classList.add('active');
    if(tab === 'saved') { document.querySelectorAll('.nav-btn')[2].classList.add('active'); loadLibrary(); }
}

function loadHome() {
    const hour = new Date().getHours();
    document.getElementById('greeting').textContent = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}');
    document.getElementById('last-read').textContent = `${englishNames[codes.indexOf(last.b)]} ${last.c}`;
    const day = new Date().getDate();
    if(yoruba[day * 500]) document.getElementById('votd').textContent = yoruba[day * 500].text;

    const now = new Date(), start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const allChapters = [...new Set(yoruba.map(v => `${v.book}-${v.chapter}`))];
    const target = allChapters[dayOfYear % allChapters.length].split('-');
    document.getElementById('plan-text').textContent = `Bible in 1 Year: ${englishNames[parseInt(target[0]) - 1]} ${target[1]}`;

    const histContainer = document.getElementById('history-list'); histContainer.innerHTML = '';
    history.forEach(h => { const div = document.createElement('div'); div.className = 'history-item'; div.textContent = `${englishNames[codes.indexOf(h.b)]} ${h.c}`; div.onclick = () => { currentBook = h.b; currentBookName = englishNames[codes.indexOf(h.b)]; currentChapter = h.c; loadChapter(); }; histContainer.appendChild(div); });
}

function loadPlanChapter() {
    const now = new Date(), start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const allChapters = [...new Set(yoruba.map(v => `${v.book}-${v.chapter}`))];
    const target = allChapters[dayOfYear % allChapters.length].split('-');
    currentBook = codes[parseInt(target[0]) - 1]; currentBookName = englishNames[parseInt(target[0]) - 1]; currentChapter = parseInt(target[1]); loadChapter();
}

function buildBooks() {
    const otGrid = document.getElementById('ot-grid'); const ntGrid = document.getElementById('nt-grid');
    for(let i=0; i<englishNames.length; i++) {
        const div = document.createElement('div'); div.className = i >= 39 ? 'grid-item red' : 'grid-item'; div.textContent = englishNames[i];
        div.onclick = () => { currentBook = codes[i]; currentBookName = englishNames[i]; buildChapters(); };
        (i >= 39 ? ntGrid : otGrid).appendChild(div);
    }
}

function buildChapters() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-chapters').classList.add('active');
    document.getElementById('chapter-title').textContent = currentBookName;
    const bookNum = codes.indexOf(currentBook) + 1;
    const maxCh = Math.max(...yoruba.filter(v => v.book === bookNum).map(v => v.chapter));
    const grid = document.getElementById('chapter-grid'); grid.innerHTML = '';
    for(let i=1; i<=maxCh; i++) { const div = document.createElement('div'); div.className = 'grid-item'; div.textContent = i; div.onclick = () => { currentChapter = i; loadChapter(); }; grid.appendChild(div); }
}

function goToChapters() { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById('screen-chapters').classList.add('active'); }
function loadChapter() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-reading').classList.add('active');
    document.getElementById('reading-title').textContent = `${currentBookName} ${currentChapter}`;
    const bookNum = codes.indexOf(currentBook) + 1;
    const verses = yoruba.filter(v => v.book === bookNum && v.chapter === currentChapter);
    let html = ''; currentEnglishChapterText = '';
    verses.forEach(v => {
        const eng = englishMap[`${v.book}-${v.chapter}-${v.verse}`] || ""; currentEnglishChapterText += eng + ' ';
        const key = `${v.book}-${v.chapter}-${v.verse}`;
        const note = notes[key]; const highlightClass = highlights[key] ? `highlight-${highlights[key]}` : '';
        html += `<div class="verse-container ${highlightClass}" onclick="openActionSheet(${v.book}, ${v.chapter}, ${v.verse})">
            <span class="verse-number">${v.verse}</span>
            <p class="yoruba-text">${v.text}</p>
            <p class="english-text">${eng}</p>
            ${note ? `<div class="note-text">${note}</div>` : ''}
        </div>`;
    });
    document.getElementById('bible-text').innerHTML = html;
    document.getElementById('bible-text').style.fontSize = currentFontSize + '%';
    const currentHistory = { b: currentBook, c: currentChapter };
    history = history.filter(h => h.b !== currentHistory.b || h.c !== currentHistory.c);
    history.unshift(currentHistory); if (history.length > 10) history.pop();
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('lastRead', JSON.stringify({b: currentBook, c: currentChapter}));
    let startX = 0; const el = document.getElementById('bible-text');
    el.ontouchstart = e => startX = e.changedTouches[0].screenX;
    el.ontouchend = e => { let endX = e.changedTouches[0].screenX; if (endX < startX - 50) nextChapter(); if (endX > startX + 50) prevChapter(); };
}

function nextChapter() { if(currentChapter < 150) { currentChapter++; loadChapter(); } }
function prevChapter() { if(currentChapter > 1) { currentChapter--; loadChapter(); } }
function continueReading() { const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}'); currentBook = last.b; currentBookName = englishNames[codes.indexOf(currentBook)]; currentChapter = last.c; loadChapter(); }
function changeFont(delta) { currentFontSize += delta * 10; if (currentFontSize < 80) currentFontSize = 80; if (currentFontSize > 150) currentFontSize = 150; localStorage.setItem('fontSize', currentFontSize); document.getElementById('bible-text').style.fontSize = currentFontSize + '%'; }

function openActionSheet(b, c, v) {
    activeVerse = { b: b, c: c, v: v };
    document.getElementById('sheet-verse-ref').textContent = `${englishNames[b-1]} ${c}:${v}`;
    document.getElementById('action-sheet-overlay').style.display = 'block';
    const sheet = document.getElementById('action-sheet');
    setTimeout(() => sheet.classList.add('show'), 10);
}
function closeActionSheet() {
    const sheet = document.getElementById('action-sheet');
    sheet.classList.remove('show');
    setTimeout(() => document.getElementById('action-sheet-overlay').style.display = 'none', 200);
}
function copyVerse() {
    const verseObj = yoruba.find(x => x.book === activeVerse.b && x.chapter === activeVerse.c && x.verse === activeVerse.v);
    const eng = englishMap[`${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`] || "";
    const text = `${verseObj.text}\n${eng}`;
    navigator.clipboard.writeText(text).then(() => { closeActionSheet(); }).catch(() => { closeActionSheet(); });
}
function readVerse() {
    closeActionSheet();
    const eng = englishMap[`${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`] || "";
    const u = new SpeechSynthesisUtterance(eng); u.lang = 'en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u);
}
function actionHighlight() {
    const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`;
    const order = ['yellow', 'green', 'blue', 'none'];
    const current = highlights[key] || 'none';
    const next = order[(order.indexOf(current) + 1) % order.length];
    if (next === 'none') delete highlights[key]; else highlights[key] = next;
    localStorage.setItem('highlights', JSON.stringify(highlights));
    closeActionSheet(); loadChapter();
}
function saveVerse() {
    const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`;
    if(!saved.includes(key)) { saved.push(key); localStorage.setItem('saved', JSON.stringify(saved)); closeActionSheet(); }
    else { saved = saved.filter(k => k !== key); localStorage.setItem('saved', JSON.stringify(saved)); closeActionSheet(); }
}

function openNoteModal() {
    const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`;
    document.getElementById('note-input').value = notes[key] || "";
    document.getElementById('note-overlay').style.display = 'block';
    document.getElementById('note-modal').style.display = 'block';
}
function closeNoteModal() {
    document.getElementById('note-overlay').style.display = 'none';
    document.getElementById('note-modal').style.display = 'none';
    document.getElementById('action-sheet-overlay').style.display = 'block';
    document.getElementById('action-sheet').classList.add('show');
}
function saveNote() {
    const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`;
    const text = document.getElementById('note-input').value;
    if (text.trim() === "") delete notes[key]; else notes[key] = text;
    localStorage.setItem('notes', JSON.stringify(notes));
    closeNoteModal(); loadChapter();
}

function switchLibrary(type) {
    currentLibrary = type;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (type === 'saved') document.querySelectorAll('.tab-btn')[0].classList.add('active');
    else document.querySelectorAll('.tab-btn')[1].classList.add('active');
    loadLibrary();
}
function loadLibrary() {
    const list = document.getElementById('library-list'); list.innerHTML = '';
    if (currentLibrary === 'saved') {
        saved.forEach(key => { const [b,c,v] = key.split('-').map(Number); const verse = yoruba.find(x => x.book === b && x.chapter === c && x.verse === v); if(verse) { const div = document.createElement('div'); div.className = 'card'; div.innerHTML = `<strong>${englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p>`; div.onclick = () => { removeBookmark(key); }; list.appendChild(div); } });
        if (list.innerHTML === '') list.innerHTML = '<p>Tap any verse to save it.</p>';
    } else {
        for (const key in notes) { const [b,c,v] = key.split('-').map(Number); const verse = yoruba.find(x => x.book === b && x.chapter === c && x.verse === v); if(verse) { const div = document.createElement('div'); div.className = 'card'; div.innerHTML = `<strong>${englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p><p class="note-text">${notes[key]}</p>`; div.onclick = () => { delete notes[key]; localStorage.setItem('notes', JSON.stringify(notes)); loadLibrary(); }; list.appendChild(div); } }
        if (list.innerHTML === '') list.innerHTML = '<p>Tap the pencil icon to add a note.</p>';
    }
}
function removeBookmark(key) { saved = saved.filter(k => k !== key); localStorage.setItem('saved', JSON.stringify(saved)); loadLibrary(); }

function toggleSearch() { const o = document.getElementById('search-overlay'); if(o.style.display === 'block') { o.style.display = 'none'; document.getElementById('search-input').value = ''; } else { o.style.display = 'block'; document.getElementById('search-input').focus(); } }
document.getElementById('search-btn').onclick = toggleSearch;
document.getElementById('search-input').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase(); if (q.length < 2) return;
    let results = yoruba.filter(v => v.text.toLowerCase().includes(q)).slice(0, 20);
    let html = ''; results.forEach(v => { html += `<div class="card" onclick="jumpToVerse(${v.book},${v.chapter},${v.verse})"><strong>${englishNames[v.book-1]} ${v.chapter}:${v.verse}</strong><p>${v.text}</p></div>`; });
    document.getElementById('search-results').innerHTML = html;
});
function jumpToVerse(b,c,v) { currentBook = codes[b-1]; currentBookName = englishNames[b-1]; currentChapter = c; toggleSearch(); loadChapter(); }

document.getElementById('audio-btn').onclick = () => { if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; } const u = new SpeechSynthesisUtterance(currentEnglishChapterText); u.lang = 'en-US'; speechSynthesis.speak(u); };
document.getElementById('share-btn').onclick = () => { const text = document.getElementById('bible-text').innerText; if(navigator.share) navigator.share({ title: `${currentBookName} ${currentChapter}`, text: text }); else alert(text); };
document.getElementById('theme-btn').onclick = () => document.body.classList.toggle('dark');
document.getElementById('church-mode-btn').onclick = () => document.body.classList.toggle('church');

init();
