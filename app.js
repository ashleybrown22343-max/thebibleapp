// Data & State
let yoruba = [], english = [], englishMap = {};
let saved = JSON.parse(localStorage.getItem('saved') || '[]');
let notes = JSON.parse(localStorage.getItem('notes') || '{}');
let currentBook = "GEN", currentBookName = "Genesis", currentChapter = 1;
let readingStreak = JSON.parse(localStorage.getItem('streak') || '{"days":0,"lastDate":""}');

// Book Names (Yoruba & English)
const bookNum = { "GEN":1,"EXO":2, ... "REV":66 };
const yorubaNames = ["JENESISI","EKISODU", ... "IFIWE"];
const englishNames = ["Genesis","Exodus", ... "Revelation"];

// Load Data
async function init() {
    try {
        const [yRes, eRes] = await Promise.all([fetch('data/yoruba.json'), fetch('data/english_net.json')]);
        yoruba = await yRes.json(); english = await eRes.json();
        english.forEach(v => englishMap[`${v.book}-${v.chapter}-${v.verse}`] = v.text);
        splashScreen.style.display = 'none';
        appContainer.style.display = 'block';
        buildHome();
        buildBookGrids();
        updateStreak();
    } catch(e) { splashScreen.innerHTML = "Error: Data not found in /data folder"; }
}

// Build Home Dashboard
function buildHome() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    document.getElementById('greeting').textContent = greeting + " ☀️";
    
    // Verse of the Day (Deterministic)
    const day = new Date().getDate();
    const votd = yoruba[day * 1000];
    if(votd) document.getElementById('votd').textContent = votd.text;
    
    // Continue Reading
    const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}');
    document.getElementById('last-read').textContent = `${englishNames[bookNum[last.b]-1]} ${last.c}`;
}

// Build Book Grids
function buildBookGrids() {
    // Populate OT and NT grids
    for(let i=0; i<yorubaNames.length; i++) {
        const div = document.createElement('div');
        div.className = i >= 39 ? 'grid-item red' : 'grid-item';
        div.textContent = yorubaNames[i];
        div.onclick = () => { currentBook = Object.keys(bookNum)[i]; currentBookName = englishNames[i]; buildChapters(); };
        (i >= 39 ? document.getElementById('nt-grid') : document.getElementById('ot-grid')).appendChild(div);
    }
}

// Build Chapters
function buildChapters() {
    switchScreen('chapters');
    document.getElementById('chapter-title').textContent = currentBookName.toUpperCase();
    const bN = bookNum[currentBook];
    const max = Math.max(...yoruba.filter(v => v.book === bN).map(v => v.chapter));
    const grid = document.getElementById('chapter-grid'); grid.innerHTML = '';
    for(let i=1; i<=max; i++) {
        const div = document.createElement('div');
        div.className = 'grid-item'; div.textContent = i;
        div.onclick = () => { currentChapter = i; loadChapter(); };
        grid.appendChild(div);
    }
}

// Load Reading View
function loadChapter() {
    switchScreen('reading');
    document.getElementById('reading-title').textContent = `${currentBookName} ${currentChapter}`;
    const bN = bookNum[currentBook];
    const verses = yoruba.filter(v => v.book === bN && v.chapter === currentChapter);
    
    let html = '';
    verses.forEach(v => {
        const eng = englishMap[`${v.book}-${v.chapter}-${v.verse}`] || "";
        html += `<div class="verse-container" onclick="saveVerse(${v.book},${v.chapter},${v.verse})">
            <span class="verse-number">${v.verse}</span>
            <p class="yoruba-text">${v.text}</p>
            <p class="english-text">${eng}</p>
        </div>`;
    });
    document.getElementById('bible-text').innerHTML = html;
    
    // Save progress
    localStorage.setItem('lastRead', JSON.stringify({b: currentBook, c: currentChapter}));
    
    // Swipe
    let startX;
    document.getElementById('bible-text').ontouchstart = e => startX = e.changedTouches[0].screenX;
    document.getElementById('bible-text').ontouchend = e => {
        if(e.changedTouches[0].screenX < startX - 50) nextChapter();
        if(e.changedTouches[0].screenX > startX + 50) prevChapter();
    };
}

// Navigation & Tabs
function switchScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + screen).classList.add('active');
}
function switchTab(tab) { 
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if(tab === 'home') { switchScreen('home'); document.querySelectorAll('.nav-btn')[0].classList.add('active'); }
    if(tab === 'books') { switchScreen('books'); document.querySelectorAll('.nav-btn')[1].classList.add('active'); }
    if(tab === 'saved') { switchScreen('saved'); loadSaved(); document.querySelectorAll('.nav-btn')[3].classList.add('active'); }
}
function goToChapters() { switchScreen('chapters'); }
function continueReading() { const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}'); currentBook = last.b; currentBookName = englishNames[bookNum[currentBook]-1]; currentChapter = last.c; loadChapter(); }

// Navigation Buttons
function nextChapter() { if(currentChapter < 150) { currentChapter++; loadChapter(); } }
function prevChapter() { if(currentChapter > 1) { currentChapter--; loadChapter(); } }

// Saved, Notes, and Verses
function saveVerse(b, c, v) {
    const key = `${b}-${c}-${v}`;
    if(!saved.includes(key)) {
        saved.push(key); localStorage.setItem('saved', JSON.stringify(saved));
        event.currentTarget.style.backgroundColor = "#f59e0b";
        event.currentTarget.style.color = "#000";
        setTimeout(() => { event.currentTarget.style.backgroundColor = ""; event.currentTarget.style.color = ""; }, 300);
    }
}
function loadSaved() {
    let html = '';
    saved.forEach(key => {
        const [b,c,v] = key.split('-').map(Number);
        const verse = yoruba.find(x => x.book === b && x.chapter === c && x.verse === v);
        if(verse) html += `<div class="card" onclick="removeBookmark('${key}')"><strong>${englishNames[b-1]} ${c}:${v}</strong><p class="yoruba-text">${verse.text}</p><span style="font-size:12px; opacity:0.5;">Tap to delete</span></div>`;
    });
    document.getElementById('saved-list').innerHTML = html || '<p>No saved verses yet. Tap a verse to save it.</p>';
}
function removeBookmark(key) { saved = saved.filter(k => k !== key); localStorage.setItem('saved', JSON.stringify(saved)); loadSaved(); }

// Streak & Theme & Audio (TTS)
function updateStreak() {
    const today = new Date().toDateString();
    if(readingStreak.lastDate !== today) {
        if(new Date(readingStreak.lastDate).getDate() === new Date().getDate() - 1) readingStreak.days++;
        else readingStreak.days = 1;
        readingStreak.lastDate = today;
        localStorage.setItem('streak', JSON.stringify(readingStreak));
    }
    document.getElementById('streak-count').textContent = `🔥 ${readingStreak.days} Days`;
}
document.getElementById('theme-btn').onclick = () => document.body.classList.toggle('dark');
document.getElementById('church-mode-btn').onclick = () => document.body.classList.toggle('church');
document.getElementById('audio-btn').onclick = () => { const text = document.getElementById('bible-text').innerText.replace(/[0-9]/g, ''); const u = new SpeechSynthesisUtterance(text); u.lang = 'yo-NG'; speechSynthesis.speak(u); };

// Search
function toggleSearch() { const o = document.getElementById('search-overlay'); if(o.style.display === 'block') { o.style.display = 'none'; } else { o.style.display = 'block'; document.getElementById('search-input').focus(); } }
document.getElementById('search-input').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    let results = yoruba.filter(v => v.text.toLowerCase().includes(q)).slice(0, 20);
    let html = '';
    results.forEach(v => { html += `<div class="card" onclick="jumpToVerse(${v.book},${v.chapter},${v.verse})"><strong>${englishNames[v.book-1]} ${v.chapter}:${v.verse}</strong><p>${v.text}</p></div>`; });
    document.getElementById('search-results').innerHTML = html;
});
function jumpToVerse(b,c,v) { currentBook = Object.keys(bookNum).find(k=>bookNum[k]===b); currentBookName = englishNames[b-1]; currentChapter = c; toggleSearch(); loadChapter(); }

// Sharing (Killer Feature)
function shareCurrent() { if(navigator.share) navigator.share({ title: `${currentBookName} ${currentChapter}`, text: document.getElementById('bible-text').innerText }); else alert(document.getElementById('bible-text').innerText); }

// Startup
const splashScreen = document.getElementById('splash-screen');
const appContainer = document.getElementById('app-container');
init();
