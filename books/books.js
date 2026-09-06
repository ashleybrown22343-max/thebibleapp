// =======================================================
// BOOKS PAGE - TAKEN DIRECTLY FROM YOUR WORKING app.js
// WITH URL PARAMETER SUPPORT
// =======================================================

// LOAD DATA FROM SHARED.JS FIRST
const data = window.bibleData;

// URL PARAMETERS
const params = new URLSearchParams(window.location.search);
const bookParam = params.get('book');
const chapterParam = params.get('chapter');
let currentBook = bookParam || 'GEN';
let currentBookName = data.getEnglishName(currentBook);
let currentChapter = parseInt(chapterParam) || 1;

// STATE (Exact from your app.js)
let saved = JSON.parse(localStorage.getItem('saved') || '[]');
let notes = JSON.parse(localStorage.getItem('notes') || '{}');
let highlights = JSON.parse(localStorage.getItem('highlights') || '{}');
let history = JSON.parse(localStorage.getItem('history') || '[]');
let completedChapters = JSON.parse(localStorage.getItem('completedChapters') || '[]');
let streak = JSON.parse(localStorage.getItem('streak') || '{"days":0,"lastDate":"","best":0}');
let currentLibrary = 'saved';
let activeVerse = { b: 0, c: 0, v: 0 };
let currentPlan = localStorage.getItem('currentPlan') || 'canonical';
let currentLineSpacing = parseFloat(localStorage.getItem('lineSpacing') || '1.5');
let currentVerseSpacing = parseFloat(localStorage.getItem('verseSpacing') || '1.5');
let isRedLetter = localStorage.getItem('redLetter') === 'true';

// RED LETTER MAP (Exact from your app.js)
const redLetterMap = {};
[[40,5],[40,6],[40,7],[41,4],[41,5],[42,6],[42,7],[43,3],[43,14],[43,15],[43,16],[43,17]].forEach(([b,c]) => {
    for (let v=1; v<=30; v++) redLetterMap[`${b}-${c}-${v}`] = true;
});

// DRAWER EVENTS
document.getElementById('menu-btn').onclick = () => { document.getElementById('drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('show'); };
document.getElementById('close-drawer').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };
document.getElementById('drawer-overlay').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };

// =======================================================
// INITIALIZATION (Loads data, then shows book grid or reading)
// =======================================================
async function initBooks() {
    await data.loadAllData();
    
    // Update state with loaded data
    currentBookName = data.getEnglishName(currentBook);
    
    if (bookParam) {
        renderReading();
    } else {
        renderBookGrid();
    }
}

// =======================================================
// BOOK GRID (Copied from your app.js buildBooks)
// =======================================================
function renderBookGrid() {
    const grid = document.getElementById('book-grid');
    grid.style.display = 'grid';
    document.getElementById('chapter-grid').style.display = 'none';
    document.getElementById('reading-view').style.display = 'none';
    
    const codes = data.codes;
    const englishNames = data.englishNames;
    
    englishNames.forEach((name, i) => {
        const div = document.createElement('div');
        div.className = 'grid-item' + (i >= 39 ? ' red' : '');
        div.textContent = name;
        div.onclick = () => { location.href = `/books?book=${codes[i]}&chapter=1`; };
        grid.appendChild(div);
    });
}

// =======================================================
// READING VIEW (ALL FEATURES FROM YOUR app.js)
// =======================================================
function renderReading() {
    document.getElementById('book-grid').style.display = 'none';
    document.getElementById('chapter-grid').style.display = 'none';
    const view = document.getElementById('reading-view');
    view.style.display = 'block';

    const codes = data.codes;
    const englishNames = data.englishNames;
    const yorubaData = data.yoruba;
    const englishMapData = data.englishMap;

    let bookIdx = codes.indexOf(currentBook);
    if (bookIdx === -1) { currentBook = 'GEN'; bookIdx = 0; }
    currentBookName = englishNames[bookIdx];
    const bookNum = bookIdx + 1;

    const verses = yorubaData.filter(v => v.book === bookNum && v.chapter === currentChapter);
    let html = `<h2>${currentBookName} ${currentChapter}</h2><div style="margin-bottom:15px;">
        <button class="btn" onclick="prevChapter()">Previous</button>
        <button class="btn" style="margin-left:10px;" onclick="nextChapter()">Next</button>
    </div>`;

    verses.forEach(v => {
        const eng = englishMapData[`${v.book}-${v.chapter}-${v.verse}`] || "";
        const key = `${v.book}-${v.chapter}-${v.verse}`;
        const note = notes[key];
        const highlightClass = highlights[key] ? `highlight-${highlights[key]}` : '';
        const redClass = isRedLetter && redLetterMap[key] ? 'red-letter' : '';
        
        html += `<div class="verse-container ${highlightClass} ${redClass}" onclick="openActionSheet(${v.book}, ${v.chapter}, ${v.verse})">
            <span class="verse-number">${v.verse}</span>
            <p class="yoruba-text">${v.text}</p>
            <p class="english-text">${eng}</p>
            ${note ? `<div class="note-text">${note}</div>` : ''}
        </div>`;
    });
    view.innerHTML = html;

    // Apply Font Settings
    view.style.fontSize = localStorage.getItem('fontSize') + '%';
    view.style.lineHeight = currentLineSpacing;
    document.querySelectorAll('.verse-container').forEach(div => div.style.marginBottom = currentVerseSpacing + 'em');

    // Track completed chapter
    const chapterKey = `${currentBook}-${currentChapter}`;
    if (!completedChapters.includes(chapterKey)) {
        completedChapters.push(chapterKey);
        localStorage.setItem('completedChapters', JSON.stringify(completedChapters));
    }

    // Update history
    const currentHistory = { b: currentBook, c: currentChapter };
    history = history.filter(h => h.b !== currentHistory.b || h.c !== currentHistory.c);
    history.unshift(currentHistory);
    if (history.length > 10) history.pop();
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('lastRead', JSON.stringify({b: currentBook, c: currentChapter}));
}

// =======================================================
// NAVIGATION (From your app.js)
// =======================================================
function prevChapter() { if (currentChapter > 1) { currentChapter--; location.href = `/books?book=${currentBook}&chapter=${currentChapter}`; } }
function nextChapter() { if (currentChapter < 150) { currentChapter++; location.href = `/books?book=${currentBook}&chapter=${currentChapter}`; } }
function continueReading() { const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}'); currentBook = last.b; currentBookName = data.getEnglishName(currentBook); currentChapter = last.c; location.href = `/books?book=${currentBook}&chapter=${currentChapter}`; }

// =======================================================
// ACTION SHEET & VERSE INTERACTIONS (EXACT FROM YOUR app.js)
// =======================================================
function openActionSheet(b, c, v) {
    activeVerse = { b: b, c: c, v: v };
    document.getElementById('sheet-verse-ref').textContent = `${data.englishNames[b-1]} ${c}:${v}`;
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
    const verseObj = data.yoruba.find(x => x.book === activeVerse.b && x.chapter === activeVerse.c && x.verse === activeVerse.v);
    const eng = data.englishMap[`${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`] || "";
    navigator.clipboard.writeText(`${verseObj.text}\n${eng}`).then(() => closeActionSheet());
}
function readVerse() {
    closeActionSheet();
    const eng = data.englishMap[`${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`] || "";
    const u = new SpeechSynthesisUtterance(eng);
    u.lang = 'en-US';
    speechSynthesis.speak(u);
}
function actionHighlight() {
    const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`;
    const order = ['yellow', 'green', 'blue', 'none'];
    const current = highlights[key] || 'none';
    const next = order[(order.indexOf(current) + 1) % order.length];
    if (next === 'none') delete highlights[key];
    else highlights[key] = next;
    localStorage.setItem('highlights', JSON.stringify(highlights));
    closeActionSheet();
    // Reload the current chapter to see the change
    location.reload();
}
function saveVerse() {
    const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`;
    if(!saved.includes(key)) { saved.push(key); localStorage.setItem('saved', JSON.stringify(saved)); closeActionSheet(); }
    else { saved = saved.filter(k => k !== key); localStorage.setItem('saved', JSON.stringify(saved)); closeActionSheet(); }
}
function shareVerseAsImage() {
    const url = `/studio?b=${activeVerse.b}&c=${activeVerse.c}&v=${activeVerse.v}`;
    window.location.href = url;
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
    if (text.trim() === "") delete notes[key];
    else notes[key] = text;
    localStorage.setItem('notes', JSON.stringify(notes));
    closeNoteModal();
    location.reload();
}

// AUDIO & SHARE (From your app.js)
function playAudio() {
    if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; }
    const verses = document.querySelectorAll('.verse-container');
    let text = '';
    verses.forEach(v => {
        const eng = v.querySelector('.english-text');
        const yo = v.querySelector('.yoruba-text');
        if (eng && eng.textContent.trim()) text += eng.textContent + ' ';
        else if (yo) text += yo.textContent + ' ';
    });
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    speechSynthesis.speak(u);
}
function shareChapter() {
    const text = document.getElementById('bible-text').innerText;
    if(navigator.share) navigator.share({ title: `${currentBookName} ${currentChapter}`, text: text });
    else alert(text);
}

// START
initBooks();
