let yoruba = [], english = [], englishMap = {};
let saved = JSON.parse(localStorage.getItem('saved') || '[]');
let notes = JSON.parse(localStorage.getItem('notes') || '{}');
let highlights = JSON.parse(localStorage.getItem('highlights') || '{}');
let history = JSON.parse(localStorage.getItem('history') || '[]');
let streak = JSON.parse(localStorage.getItem('streak') || '{"days":0,"lastDate":""}');
let currentBook = "GEN", currentBookName = "Genesis", currentChapter = 1;
let currentFontSize = parseInt(localStorage.getItem('fontSize') || '100');
let currentEnglishChapterText = '';
let currentLibrary = 'saved';
let activeVerse = { b: 0, c: 0, v: 0 };
let isParallel = false;
let currentPlan = 'one-year';

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
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        loadHome(); buildBooks();
        attachEvents();
    } catch(e) { document.getElementById('splash-screen').innerHTML = "<h3>Error: " + e.message + "</h3>"; }
}

function attachEvents() {
    document.getElementById('menu-btn').onclick = openDrawer;
    document.getElementById('close-drawer').onclick = closeDrawer;
    document.getElementById('search-btn').onclick = toggleSearch;
    document.getElementById('audio-btn').onclick = playAudio;
    document.getElementById('share-btn').onclick = shareChapter;
    document.getElementById('settings-theme-btn').onclick = toggleDarkMode;
    document.getElementById('settings-church-btn').onclick = toggleChurchMode;
    document.getElementById('settings-parallel-btn').onclick = toggleParallel;
    document.getElementById('settings-font-btn').onclick = toggleFont;
}

function openDrawer() { document.getElementById('side-drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('show'); }
function closeDrawer() { document.getElementById('side-drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); }
function goToHome() { closeDrawer(); switchScreen('home'); }
function goToBooks() { closeDrawer(); switchScreen('books'); }
function goToLibrary() { closeDrawer(); switchScreen('library'); }

function switchScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + screen).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach((b, i) => { b.classList.toggle('active', (screen === 'home' && i === 0) || (screen === 'books' && i === 1) || (screen === 'library' && i === 2)); });
}

function switchTab(tab) { currentLibrary = tab; document.querySelectorAll('.tab-btn').forEach((btn, i) => btn.classList.toggle('active', (tab === 'saved' && i === 0) || (tab === 'notes' && i === 1))); loadLibrary(); }

function loadHome() {
    const hour = new Date().getHours();
    document.getElementById('greeting').textContent = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}');
    document.getElementById('last-read').textContent = `${englishNames[codes.indexOf(last.b)]} ${last.c}`;
    const day = new Date().getDate();
    if(yoruba[day * 500]) document.getElementById('votd').textContent = yoruba[day * 500].text;
    const today = new Date().toDateString();
    if(streak.lastDate !== today) { const yesterday = new Date(Date.now() - 86400000).toDateString(); if(streak.lastDate === yesterday) streak.days++; else streak.days = 1; streak.lastDate = today; localStorage.setItem('streak', JSON.stringify(streak)); }
    document.getElementById('streak-count').textContent = streak.days + " Days";
    let allChapters;
    if(currentPlan === 'one-year') allChapters = [...new Set(yoruba.map(v => `${v.book}-${v.chapter}`))];
    else if(currentPlan === 'nt-90') allChapters = [...new Set(yoruba.filter(v => v.book >= 40).map(v => `${v.book}-${v.chapter}`))];
    else allChapters = [...new Set(yoruba.filter(v => v.book === 19 || v.book === 20).map(v => `${v.book}-${v.chapter}`))];
    const now = new Date(), start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const target = allChapters[dayOfYear % allChapters.length].split('-');
    document.getElementById('plan-text').textContent = `${englishNames[parseInt(target[0]) - 1]} ${target[1]}`;
    const histContainer = document.getElementById('history-list'); histContainer.innerHTML = '';
    history.forEach(h => { const div = document.createElement('div'); div.className = 'history-item'; div.textContent = `${englishNames[codes.indexOf(h.b)]} ${h.c}`; div.onclick = () => { currentBook = h.b; currentBookName = englishNames[codes.indexOf(h.b)]; currentChapter = h.c; loadChapter(); }; histContainer.appendChild(div); });
}

function updatePlanType() { currentPlan = document.getElementById('plan-select').value; loadHome(); }
function loadPlanChapter() { let allChapters; if(currentPlan === 'one-year') allChapters = [...new Set(yoruba.map(v => `${v.book}-${v.chapter}`))]; else if(currentPlan === 'nt-90') allChapters = [...new Set(yoruba.filter(v => v.book >= 40).map(v => `${v.book}-${v.chapter}`))]; else allChapters = [...new Set(yoruba.filter(v => v.book === 19 || v.book === 20).map(v => `${v.book}-${v.chapter}`))]; const now = new Date(), start = new Date(now.getFullYear(), 0, 0); const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24)); const target = allChapters[dayOfYear % allChapters.length].split('-'); currentBook = codes[parseInt(target[0]) - 1]; currentBookName = englishNames[parseInt(target[0]) - 1]; currentChapter = parseInt(target[1]); loadChapter(); }

function buildBooks() {
    const otGrid = document.getElementById('ot-grid'); const ntGrid = document.getElementById('nt-grid');
    for(let i=0; i<englishNames.length; i++) {
        const div = document.createElement('div'); div.className = i >= 39 ? 'grid-item red' : 'grid-item'; div.textContent = englishNames[i];
        div.onclick = () => { currentBook = codes[i]; currentBookName = englishNames[i]; buildChapters(); };
        (i >= 39 ? ntGrid : otGrid).appendChild(div);
    }
}

function buildChapters() {
    switchScreen('chapters');
    document.getElementById('chapter-title').textContent = currentBookName;
    const bookNum = codes.indexOf(currentBook) + 1;
    const maxCh = Math.max(...yoruba.filter(v => v.book === bookNum).map(v => v.chapter));
    const grid = document.getElementById('chapter-grid'); grid.innerHTML = '';
    for(let i=1; i<=maxCh; i++) { const div = document.createElement('div'); div.className = 'grid-item'; div.textContent = i; div.onclick = () => { currentChapter = i; loadChapter(); }; grid.appendChild(div); }
}

function goToChapters() { switchScreen('chapters'); }

function loadChapter() {
    switchScreen('reading');
    document.getElementById('reading-title').textContent = `${currentBookName} ${currentChapter}`;
    const bookNum = codes.indexOf(currentBook) + 1;
    const verses = yoruba.filter(v => v.book === bookNum && v.chapter === currentChapter);
    let html = ''; currentEnglishChapterText = '';
    verses.forEach(v => {
        const eng = englishMap[`${v.book}-${v.chapter}-${v.verse}`] || ""; currentEnglishChapterText += eng + ' ';
        const key = `${v.book}-${v.chapter}-${v.verse}`; const note = notes[key]; const highlightClass = highlights[key] ? `highlight-${highlights[key]}` : '';
        html += `<div class="verse-container ${highlightClass}" onclick="openActionSheet(${v.book}, ${v.chapter}, ${v.verse})"><span class="verse-number">${v.verse}</span><p class="yoruba-text">${v.text}</p><p class="english-text">${eng}</p>${note ? `<div class="note-text">${note}</div>` : ''}</div>`;
    });
    document.getElementById('bible-text').innerHTML = html; document.getElementById('bible-text').style.fontSize = currentFontSize + '%';
    const currentHistory = { b: currentBook, c: currentChapter };
    history = history.filter(h => h.b !== currentHistory.b || h.c !== currentHistory.c); history.unshift(currentHistory); if (history.length > 10) history.pop();
    localStorage.setItem('history', JSON.stringify(history)); localStorage.setItem('lastRead', JSON.stringify({b: currentBook, c: currentChapter}));
    let startX = 0; const el = document.getElementById('bible-text');
    el.ontouchstart = e => startX = e.changedTouches[0].screenX;
    el.ontouchend = e => { let endX = e.changedTouches[0].screenX; if (endX < startX - 50) nextChapter(); if (endX > startX + 50) prevChapter(); };
}

function nextChapter() { if(currentChapter < 150) { currentChapter++; loadChapter(); } }
function prevChapter() { if(currentChapter > 1) { currentChapter--; loadChapter(); } }
function continueReading() { const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}'); currentBook = last.b; currentBookName = englishNames[codes.indexOf(currentBook)]; currentChapter = last.c; loadChapter(); }
function changeFont(delta) { currentFontSize += delta * 10; if (currentFontSize < 80) currentFontSize = 80; if (currentFontSize > 150) currentFontSize = 150; localStorage.setItem('fontSize', currentFontSize); document.getElementById('bible-text').style.fontSize = currentFontSize + '%'; document.getElementById('font-size-label').textContent = currentFontSize + '%'; }

function openActionSheet(b, c, v) {
    activeVerse = { b: b, c: c, v: v };
    document.getElementById('sheet-verse-ref').textContent = `${englishNames[b-1]} ${c}:${v}`;
    document.getElementById('action-sheet-overlay').style.display = 'block';
    const sheet = document.getElementById('action-sheet'); setTimeout(() => sheet.classList.add('show'), 10);
}
function closeActionSheet() { const sheet = document.getElementById('action-sheet'); sheet.classList.remove('show'); setTimeout(() => document.getElementById('action-sheet-overlay').style.display = 'none', 200); }
function copyVerse() { const verseObj = yoruba.find(x => x.book === activeVerse.b && x.chapter === activeVerse.c && x.verse === activeVerse.v); const eng = englishMap[`${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`] || ""; navigator.clipboard.writeText(`${verseObj.text}\n${eng}`).then(() => closeActionSheet()); }
function readVerse() { closeActionSheet(); const eng = englishMap[`${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`] || ""; const u = new SpeechSynthesisUtterance(eng); u.lang = 'en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u); }
function actionHighlight() { const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`; const order = ['yellow', 'green', 'blue', 'none']; const current = highlights[key] || 'none'; const next = order[(order.indexOf(current) + 1) % order.length]; if (next === 'none') delete highlights[key]; else highlights[key] = next; localStorage.setItem('highlights', JSON.stringify(highlights)); closeActionSheet(); loadChapter(); }
function saveVerse() { const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`; if(!saved.includes(key)) { saved.push(key); localStorage.setItem('saved', JSON.stringify(saved)); closeActionSheet(); } else { saved = saved.filter(k => k !== key); localStorage.setItem('saved', JSON.stringify(saved)); closeActionSheet(); } }
function openNoteModal() { const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`; document.getElementById('note-input').value = notes[key] || ""; document.getElementById('note-overlay').style.display = 'block'; document.getElementById('note-modal').style.display = 'block'; }
function closeNoteModal() { document.getElementById('note-overlay').style.display = 'none'; document.getElementById('note-modal').style.display = 'none'; document.getElementById('action-sheet-overlay').style.display = 'block'; document.getElementById('action-sheet').classList.add('show'); }
function saveNote() { const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`; const text = document.getElementById('note-input').value; if (text.trim() === "") delete notes[key]; else notes[key] = text; localStorage.setItem('notes', JSON.stringify(notes)); closeNoteModal(); loadChapter(); }
function loadLibrary() { const list = document.getElementById('library-list'); list.innerHTML = ''; if (currentLibrary === 'saved') { saved.forEach(key => { const [b,c,v] = key.split('-').map(Number); const verse = yoruba.find(x => x.book === b && x.chapter === c && x.verse === v); if(verse) { const div = document.createElement('div'); div.className = 'card'; div.innerHTML = `<strong>${englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p>`; div.onclick = () => { removeBookmark(key); }; list.appendChild(div); } }); if (list.innerHTML === '') list.innerHTML = '<p>Tap any verse to save it.</p>'; } else { for (const key in notes) { const [b,c,v] = key.split('-').map(Number); const verse = yoruba.find(x => x.book === b && x.chapter === c && x.verse === v); if(verse) { const div = document.createElement('div'); div.className = 'card'; div.innerHTML = `<strong>${englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p><p class="note-text">${notes[key]}</p>`; div.onclick = () => { delete notes[key]; localStorage.setItem('notes', JSON.stringify(notes)); loadLibrary(); }; list.appendChild(div); } } if (list.innerHTML === '') list.innerHTML = '<p>Tap the pencil icon to add a note.</p>'; } }
function removeBookmark(key) { saved = saved.filter(k => k !== key); localStorage.setItem('saved', JSON.stringify(saved)); loadLibrary(); }

function toggleSearch() { const o = document.getElementById('search-overlay'); if(o.style.display === 'block') { o.style.display = 'none'; document.getElementById('search-input').value = ''; } else { o.style.display = 'block'; document.getElementById('search-input').focus(); } }
function closeSearch() { toggleSearch(); }
document.getElementById('search-input').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase(); if (q.length < 2) { document.getElementById('search-results').innerHTML = ''; return; }
    let results = [];
    const searchYo = document.getElementById('search-yo').checked;
    const searchEn = document.getElementById('search-en').checked;
    if (searchYo) results = results.concat(yoruba.filter(v => v.text.toLowerCase().includes(q)).slice(0, 20));
    if (searchEn) { const enResults = []; for (const key in englishMap) { if (englishMap[key].toLowerCase().includes(q)) { const parts = key.split('-'); enResults.push({ book: parseInt(parts[0]), chapter: parseInt(parts[1]), verse: parseInt(parts[2]), text: englishMap[key] }); if (enResults.length >= 20) break; } } results = results.concat(enResults); }
    let html = ''; results.forEach(v => { html += `<div class="card" onclick="jumpToVerse(${v.book},${v.chapter},${v.verse})"><strong>${englishNames[v.book-1]} ${v.chapter}:${v.verse}</strong><p>${v.text}</p></div>`; });
    document.getElementById('search-results').innerHTML = html || '<p>No results found.</p>';
});
function jumpToVerse(b,c,v) { currentBook = codes[b-1]; currentBookName = englishNames[b-1]; currentChapter = c; closeSearch(); loadChapter(); }
function playAudio() { if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; } const u = new SpeechSynthesisUtterance(currentEnglishChapterText); u.lang = 'en-US'; speechSynthesis.speak(u); }
function shareChapter() { const text = document.getElementById('bible-text').innerText; if(navigator.share) navigator.share({ title: `${currentBookName} ${currentChapter}`, text: text }); else alert(text); }

// Drawer Settings
function toggleDarkMode() { document.body.classList.toggle('dark'); const btn = document.getElementById('settings-theme-btn'); btn.textContent = document.body.classList.contains('dark') ? 'ON' : 'OFF'; btn.classList.toggle('active', document.body.classList.contains('dark')); }
function toggleChurchMode() { document.body.classList.toggle('church'); const btn = document.getElementById('settings-church-btn'); btn.textContent = document.body.classList.contains('church') ? 'ON' : 'OFF'; btn.classList.toggle('active', document.body.classList.contains('church')); }
function toggleParallel() { isParallel = !isParallel; document.getElementById('bible-text').classList.toggle('parallel-mode', isParallel); const btn = document.getElementById('settings-parallel-btn'); btn.textContent = isParallel ? 'ON' : 'OFF'; btn.classList.toggle('active', isParallel); }
function toggleFont() { document.body.classList.toggle('serif'); const btn = document.getElementById('settings-font-btn'); btn.textContent = document.body.classList.contains('serif') ? 'Serif' : 'Sans'; }

// Image Generator
function generateImage() { closeActionSheet(); const verseObj = yoruba.find(x => x.book === activeVerse.b && x.chapter === activeVerse.c && x.verse === activeVerse.v); const eng = englishMap[`${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`] || ""; document.getElementById('image-ref').textContent = `${englishNames[activeVerse.b-1]} ${activeVerse.c}:${activeVerse.v}`; document.getElementById('image-text').innerHTML = `${verseObj.text}<br><br><em style="opacity:0.8; font-size:14px;">${eng}</em>`; document.getElementById('image-modal').style.display = 'flex'; }
function closeImage() { document.getElementById('image-modal').style.display = 'none'; }
function downloadImage() { const text = document.getElementById('image-text').innerText; if(navigator.share) navigator.share({ title: 'Bibeli Mimo', text: text }); else alert(text); }

window.onload = init;
