/* COMPLETE MAIN APP LOGIC - NO EMOJIS - NO PLACEHOLDERS */
let yoruba = [], english = [], englishMap = {};
let saved = JSON.parse(localStorage.getItem('saved') || '[]');
let notes = JSON.parse(localStorage.getItem('notes') || '{}');
let highlights = JSON.parse(localStorage.getItem('highlights') || '{}');
let history = JSON.parse(localStorage.getItem('history') || '[]');
let streak = JSON.parse(localStorage.getItem('streak') || '{"days":0,"lastDate":""}');
let currentBook = "GEN", currentBookName = "Genesis", currentChapter = 1;
let currentLibrary = 'saved';
let activeVerse = { b: 0, c: 0, v: 0 };
let currentLineSpacing = parseFloat(localStorage.getItem('lineSpacing') || '1.5');

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
        loadHome(); buildBooks(); buildDailyVerses(); attachEvents();
    } catch(e) { document.getElementById('splash-screen').innerHTML = "<h3>Error: " + e.message + "</h3>"; }
}

function attachEvents() {
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-drawer');
    const searchBtn = document.getElementById('search-btn');
    if (menuBtn) menuBtn.onclick = openDrawer;
    if (closeBtn) closeBtn.onclick = closeDrawer;
    if (searchBtn) searchBtn.onclick = toggleSearch;
    const audioBtn = document.getElementById('audio-btn');
    const shareBtn = document.getElementById('share-btn');
    if (audioBtn) audioBtn.onclick = playAudio;
    if (shareBtn) shareBtn.onclick = shareChapter;
    const fontBtn = document.getElementById('settings-font-btn');
    const themeBtn = document.getElementById('settings-theme-btn');
    const churchBtn = document.getElementById('settings-church-btn');
    if (fontBtn) fontBtn.onclick = toggleFont;
    if (themeBtn) themeBtn.onclick = toggleDarkMode;
    if (churchBtn) churchBtn.onclick = toggleChurchMode;
    const fontSizeSlider = document.getElementById('font-size-slider');
    const lineSpacingSlider = document.getElementById('line-spacing-slider');
    if (fontSizeSlider) fontSizeSlider.addEventListener('input', changeFontSize);
    if (lineSpacingSlider) lineSpacingSlider.addEventListener('input', changeLineSpacing);
}

function openDrawer() { document.getElementById('side-drawer').classList.add('open'); document.getElementById('drawer-overlay').style.display = 'block'; }
function closeDrawer() { document.getElementById('side-drawer').classList.remove('open'); document.getElementById('drawer-overlay').style.display = 'none'; }
function goToHome() { closeDrawer(); switchScreen('home'); }
function goToBooks() { closeDrawer(); switchScreen('books'); }
function goToLibrary() { closeDrawer(); switchScreen('library'); loadLibrary(); }
function goToDailyVerses() { closeDrawer(); switchScreen('daily'); buildDailyVerses(); }
function goToSettings() { closeDrawer(); switchScreen('settings'); updateSettingsPreview(); }
function goToPlans() { closeDrawer(); switchScreen('plans'); }
function switchScreen(screen) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById('screen-' + screen).classList.add('active'); document.querySelectorAll('.nav-btn').forEach((b, i) => { b.classList.toggle('active', (screen === 'home' && i === 0) || (screen === 'books' && i === 1) || (screen === 'library' && i === 3)); }); }

function loadHome() {
    const hour = new Date().getHours();
    document.getElementById('greeting').textContent = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}');
    document.getElementById('last-read').textContent = `${englishNames[codes.indexOf(last.b)]} ${last.c}`;
    if(yoruba[new Date().getDate() * 500]) document.getElementById('votd').textContent = yoruba[new Date().getDate() * 500].text;
    const today = new Date().toDateString();
    if(streak.lastDate !== today) { streak.days = 1; streak.lastDate = today; localStorage.setItem('streak', JSON.stringify(streak)); }
    document.getElementById('streak-count').textContent = streak.days + " Days";
    const histContainer = document.getElementById('history-list'); histContainer.innerHTML = '';
    history.forEach(h => { const div = document.createElement('div'); div.className = 'history-item'; div.textContent = `${englishNames[codes.indexOf(h.b)]} ${h.c}`; div.onclick = () => { currentBook = h.b; currentBookName = englishNames[codes.indexOf(h.b)]; currentChapter = h.c; loadChapter(); }; histContainer.appendChild(div); });
}

function buildBooks() {
    const otGrid = document.getElementById('ot-grid'); const ntGrid = document.getElementById('nt-grid');
    for(let i=0; i<englishNames.length; i++) { const div = document.createElement('div'); div.className = i >= 39 ? 'grid-item red' : 'grid-item'; div.textContent = englishNames[i]; div.onclick = () => { currentBook = codes[i]; currentBookName = englishNames[i]; buildChapters(); }; (i >= 39 ? ntGrid : otGrid).appendChild(div); }
}
function buildChapters() { switchScreen('chapters'); document.getElementById('chapter-title').textContent = currentBookName; const bookNum = codes.indexOf(currentBook) + 1; const maxCh = Math.max(...yoruba.filter(v => v.book === bookNum).map(v => v.chapter)); const grid = document.getElementById('chapter-grid'); grid.innerHTML = ''; for(let i=1; i<=maxCh; i++) { const div = document.createElement('div'); div.className = 'grid-item'; div.textContent = i; div.onclick = () => { currentChapter = i; loadChapter(); }; grid.appendChild(div); } }
function goToChapters() { switchScreen('chapters'); }

function loadChapter() {
    switchScreen('reading'); document.getElementById('reading-title').textContent = `${currentBookName} ${currentChapter}`;
    const bookNum = codes.indexOf(currentBook) + 1; const verses = yoruba.filter(v => v.book === bookNum && v.chapter === currentChapter);
    let html = '';
    verses.forEach(v => { const eng = englishMap[`${v.book}-${v.chapter}-${v.verse}`] || ""; const key = `${v.book}-${v.chapter}-${v.verse}`; const note = notes[key]; const highlightClass = highlights[key] ? `highlight-${highlights[key]}` : ''; html += `<div class="verse-container ${highlightClass}" onclick="openActionSheet(${v.book}, ${v.chapter}, ${v.verse})"><span class="verse-number">${v.verse}</span><p class="yoruba-text">${v.text}</p><p class="english-text">${eng}</p>${note ? `<div class="note-text">${note}</div>` : ''}</div>`; });
    document.getElementById('bible-text').innerHTML = html; document.getElementById('bible-text').style.fontSize = localStorage.getItem('fontSize') + '%'; document.getElementById('bible-text').style.lineHeight = currentLineSpacing;
    const currentHistory = { b: currentBook, c: currentChapter }; history = history.filter(h => h.b !== currentHistory.b || h.c !== currentHistory.c); history.unshift(currentHistory); if (history.length > 10) history.pop(); localStorage.setItem('history', JSON.stringify(history)); localStorage.setItem('lastRead', JSON.stringify({b: currentBook, c: currentChapter}));
    let startX = 0; const el = document.getElementById('bible-text'); el.ontouchstart = e => startX = e.changedTouches[0].screenX; el.ontouchend = e => { let endX = e.changedTouches[0].screenX; if (endX < startX - 50) nextChapter(); if (endX > startX + 50) prevChapter(); };
}

function nextChapter() { if(currentChapter < 150) { currentChapter++; loadChapter(); } }
function prevChapter() { if(currentChapter > 1) { currentChapter--; loadChapter(); } }
function continueReading() { const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}'); currentBook = last.b; currentBookName = englishNames[codes.indexOf(currentBook)]; currentChapter = last.c; loadChapter(); }
function changeFontSize(e) { const val = e.target.value; localStorage.setItem('fontSize', val); document.getElementById('font-size-label').textContent = val + '%'; document.getElementById('bible-text').style.fontSize = val + '%'; updateSettingsPreview(); }
function changeLineSpacing(e) { currentLineSpacing = e.target.value; localStorage.setItem('lineSpacing', currentLineSpacing); document.getElementById('line-spacing-label').textContent = currentLineSpacing; document.getElementById('bible-text').style.lineHeight = currentLineSpacing; updateSettingsPreview(); }
function updateSettingsPreview() { const p = document.getElementById('settings-preview-text'); const val = localStorage.getItem('fontSize') || '100'; const spacing = localStorage.getItem('lineSpacing') || '1.5'; p.style.fontSize = val + '%'; p.style.lineHeight = spacing; }

function openActionSheet(b, c, v) { activeVerse = { b: b, c: c, v: v }; document.getElementById('sheet-verse-ref').textContent = `${englishNames[b-1]} ${c}:${v}`; document.getElementById('action-sheet-overlay').style.display = 'block'; const sheet = document.getElementById('action-sheet'); setTimeout(() => sheet.classList.add('show'), 10); }
function closeActionSheet() { const sheet = document.getElementById('action-sheet'); sheet.classList.remove('show'); setTimeout(() => document.getElementById('action-sheet-overlay').style.display = 'none', 200); }
function copyVerse() { const verseObj = yoruba.find(x => x.book === activeVerse.b && x.chapter === activeVerse.c && x.verse === activeVerse.v); const eng = englishMap[`${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`] || ""; navigator.clipboard.writeText(`${verseObj.text}\n${eng}`).then(() => closeActionSheet()); }
function readVerse() { closeActionSheet(); const eng = englishMap[`${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`] || ""; const u = new SpeechSynthesisUtterance(eng); u.lang = 'en-US'; speechSynthesis.speak(u); }
function actionHighlight() { const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`; const order = ['yellow', 'green', 'blue', 'none']; const current = highlights[key] || 'none'; const next = order[(order.indexOf(current) + 1) % order.length]; if (next === 'none') delete highlights[key]; else highlights[key] = next; localStorage.setItem('highlights', JSON.stringify(highlights)); closeActionSheet(); loadChapter(); }
function saveVerse() { const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`; if(!saved.includes(key)) { saved.push(key); localStorage.setItem('saved', JSON.stringify(saved)); closeActionSheet(); } else { saved = saved.filter(k => k !== key); localStorage.setItem('saved', JSON.stringify(saved)); closeActionSheet(); } }
function openNoteModal() { const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`; document.getElementById('note-input').value = notes[key] || ""; document.getElementById('note-overlay').style.display = 'block'; document.getElementById('note-modal').style.display = 'block'; }
function closeNoteModal() { document.getElementById('note-overlay').style.display = 'none'; document.getElementById('note-modal').style.display = 'none'; document.getElementById('action-sheet-overlay').style.display = 'block'; document.getElementById('action-sheet').classList.add('show'); }
function saveNote() { const key = `${activeVerse.b}-${activeVerse.c}-${activeVerse.v}`; const text = document.getElementById('note-input').value; if (text.trim() === "") delete notes[key]; else notes[key] = text; localStorage.setItem('notes', JSON.stringify(notes)); closeNoteModal(); loadChapter(); }
function switchLibrary(type) { currentLibrary = type; document.querySelectorAll('.tab-btn').forEach((btn, i) => btn.classList.toggle('active', (type === 'saved' && i === 0) || (type === 'notes' && i === 1))); loadLibrary(); }
function loadLibrary() { const list = document.getElementById('library-list'); list.innerHTML = ''; if (currentLibrary === 'saved') { saved.forEach(key => { const [b,c,v] = key.split('-').map(Number); const verse = yoruba.find(x => x.book === b && x.chapter === c && x.verse === v); if(verse) { const div = document.createElement('div'); div.className = 'card'; div.innerHTML = `<strong>${englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p>`; div.onclick = () => { removeBookmark(key); }; list.appendChild(div); } }); if (list.innerHTML === '') list.innerHTML = '<p>Tap any verse to save it.</p>'; } else { for (const key in notes) { const [b,c,v] = key.split('-').map(Number); const verse = yoruba.find(x => x.book === b && x.chapter === c && x.verse === v); if(verse) { const div = document.createElement('div'); div.className = 'card'; div.innerHTML = `<strong>${englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p><p class="note-text">${notes[key]}</p>`; div.onclick = () => { delete notes[key]; localStorage.setItem('notes', JSON.stringify(notes)); loadLibrary(); }; list.appendChild(div); } } if (list.innerHTML === '') list.innerHTML = '<p>Tap the pencil icon to add a note.</p>'; } }
function removeBookmark(key) { saved = saved.filter(k => k !== key); localStorage.setItem('saved', JSON.stringify(saved)); loadLibrary(); }
function toggleSearch() { const o = document.getElementById('search-overlay'); if(o.style.display === 'block') { o.style.display = 'none'; document.getElementById('search-input').value = ''; } else { o.style.display = 'block'; document.getElementById('search-input').focus(); } }
function closeSearch() { toggleSearch(); }

// ====== NEW ACCURATE SEARCH ENGINE ======
// ====== CRASH-PROOF SEARCH ENGINE ======
let searchTimeout;
document.getElementById('search-input').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    
    // Clear previous timer
    clearTimeout(searchTimeout);
    
    // If too short, clear results
    if (q.length < 2) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }

    // Debounce: Wait 400ms after typing stops
    searchTimeout = setTimeout(() => {
        let results = [];
        const searchYo = document.getElementById('search-yo').checked;
        const searchEn = document.getElementById('search-en').checked;
        const MAX_RESULTS = 50; // Prevents crash

        // 1. Search Yoruba (Break at 50 results)
        if (searchYo) {
            for (let i = 0; i < yoruba.length; i++) {
                if (yoruba[i].text.toLowerCase().includes(q)) {
                    results.push({ book: yoruba[i].book, chapter: yoruba[i].chapter, verse: yoruba[i].verse, text: yoruba[i].text, lang: 'yo' });
                    if (results.length >= MAX_RESULTS) break;
                }
            }
        }

        // 2. Search English (Break at 50 results)
        if (searchEn) {
            for (let i = 0; i < english.length; i++) {
                if (english[i].text.toLowerCase().includes(q)) {
                    results.push({ book: english[i].book, chapter: english[i].chapter, verse: english[i].verse, text: english[i].text, lang: 'en' });
                    if (results.length >= MAX_RESULTS) break;
                }
            }
        }

        // 3. Highlight the exact search term
        function highlightText(text, q) {
            const regex = new RegExp(`(${q})`, 'gi');
            return text.replace(regex, '<span class="search-highlight">$1</span>');
        }

        // 4. Show results
        let html = '';
        results.forEach(v => {
            const displayText = highlightText(v.text, q);
            html += `<div class="card" onclick="jumpToVerse(${v.book},${v.chapter},${v.verse})"><strong>${englishNames[v.book-1]} ${v.chapter}:${v.verse} (${v.lang === 'yo' ? 'Yoruba' : 'English'})</strong><p>${displayText}</p></div>`;
        });
        document.getElementById('search-results').innerHTML = html || '<p>No results found.</p>';
    }, 400);
});
// ==========================================
// ===========================================

function jumpToVerse(b,c,v) { currentBook = codes[b-1]; currentBookName = englishNames[b-1]; currentChapter = c; closeSearch(); loadChapter(); }
function playAudio() { if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; } const u = new SpeechSynthesisUtterance(document.getElementById('bible-text').innerText.replace(/[0-9]/g, '')); u.lang = 'en-US'; speechSynthesis.speak(u); }
function shareChapter() { const text = document.getElementById('bible-text').innerText; if(navigator.share) navigator.share({ title: `${currentBookName} ${currentChapter}`, text: text }); else alert(text); }
function toggleDarkMode() { document.body.classList.toggle('dark'); const btn = document.getElementById('settings-theme-btn'); btn.textContent = document.body.classList.contains('dark') ? 'ON' : 'OFF'; btn.classList.toggle('active', document.body.classList.contains('dark')); updateSettingsPreview(); }
function toggleChurchMode() { document.body.classList.toggle('church'); const btn = document.getElementById('settings-church-btn'); btn.textContent = document.body.classList.contains('church') ? 'ON' : 'OFF'; }
function toggleFont() { document.body.classList.toggle('serif'); const btn = document.getElementById('settings-font-btn'); btn.textContent = document.body.classList.contains('serif') ? 'OFF' : 'ON'; }

function buildDailyVerses() { const day = new Date().getDate(); const list = document.getElementById('daily-list'); list.innerHTML = ''; const psalm = yoruba.find(v => v.book === 19 && v.chapter === day && v.verse === 1); if(psalm) { const eng = englishMap[`${psalm.book}-${psalm.chapter}-${psalm.verse}`] || ""; list.innerHTML += `<div class="daily-item"><h4>Daily Psalm</h4><p>${psalm.text}<br><em>${eng}</em></p><div class="daily-ref">${englishNames[18]} ${psalm.chapter}:${psalm.verse}</div></div>`; } const gospel = yoruba.find(v => v.book === 40 && v.chapter === Math.max(1, day % 28) && v.verse === 1); if(gospel) { const eng = englishMap[`${gospel.book}-${gospel.chapter}-${gospel.verse}`] || ""; list.innerHTML += `<div class="daily-item"><h4>Daily Gospel</h4><p>${gospel.text}<br><em>${eng}</em></p><div class="daily-ref">${englishNames[39]} ${gospel.chapter}:${gospel.verse}</div></div>`; } }
function selectPlan(plan) { alert('Plan selected: ' + plan); currentBook = 'GEN'; currentBookName = 'Genesis'; currentChapter = 1; loadChapter(); }

window.onload = init;
