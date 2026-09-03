let yoruba = [], english = [], englishMap = {};
let saved = JSON.parse(localStorage.getItem('saved') || '[]');
let currentBook = "GEN", currentBookName = "Genesis", currentChapter = 1;
let currentFontSize = parseInt(localStorage.getItem('fontSize') || '100');

const codes = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];
const englishNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

const splash = document.getElementById('splash-screen');
const app = document.getElementById('app-container');

async function init() {
    try {
        const [yRes, eRes] = await Promise.all([fetch('data/yoruba.json'), fetch('data/english_net.json')]);
        yoruba = await yRes.json(); 
        english = await eRes.json();
        english.forEach(v => englishMap[`${v.book}-${v.chapter}-${v.verse}`] = v.text);
        splash.style.display = 'none';
        app.style.display = 'block';
        loadHome();
        buildBooks();
    } catch(e) { splash.innerHTML = "<h3>Error: data files not found</h3>"; }
}

function switchTab(tab) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('screen-' + tab).classList.add('active');
    if(tab === 'home') document.querySelectorAll('.nav-btn')[0].classList.add('active');
    if(tab === 'books') document.querySelectorAll('.nav-btn')[1].classList.add('active');
    if(tab === 'saved') { document.querySelectorAll('.nav-btn')[2].classList.add('active'); loadSaved(); }
}

function loadHome() {
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    document.getElementById('greeting').textContent = greet;
    const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}');
    const bookIndex = codes.indexOf(last.b);
    document.getElementById('last-read').textContent = `${englishNames[bookIndex]} ${last.c}`;
    const day = new Date().getDate();
    const verse = yoruba[day * 500];
    if(verse) document.getElementById('votd').textContent = verse.text;
}

function buildBooks() {
    const otGrid = document.getElementById('ot-grid');
    const ntGrid = document.getElementById('nt-grid');
    for(let i=0; i<englishNames.length; i++) {
        const div = document.createElement('div');
        div.className = i >= 39 ? 'grid-item red' : 'grid-item';
        div.textContent = englishNames[i];
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
    const grid = document.getElementById('chapter-grid'); 
    grid.innerHTML = '';
    
    for(let i=1; i<=maxCh; i++) {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.textContent = i;
        div.onclick = () => { currentChapter = i; loadChapter(); };
        grid.appendChild(div);
    }
}

function goToChapters() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-chapters').classList.add('active');
}

function loadChapter() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-reading').classList.add('active');
    document.getElementById('reading-title').textContent = `${currentBookName} ${currentChapter}`;
    
    const bookNum = codes.indexOf(currentBook) + 1;
    const verses = yoruba.filter(v => v.book === bookNum && v.chapter === currentChapter);
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
    document.getElementById('bible-text').style.fontSize = currentFontSize + '%';
    
    localStorage.setItem('lastRead', JSON.stringify({b: currentBook, c: currentChapter}));
    
    let startX = 0;
    const el = document.getElementById('bible-text');
    el.ontouchstart = e => startX = e.changedTouches[0].screenX;
    el.ontouchend = e => {
        let endX = e.changedTouches[0].screenX;
        if (endX < startX - 50) nextChapter();
        if (endX > startX + 50) prevChapter();
    };
}

function nextChapter() { if(currentChapter < 150) { currentChapter++; loadChapter(); } }
function prevChapter() { if(currentChapter > 1) { currentChapter--; loadChapter(); } }
function continueReading() {
    const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}');
    currentBook = last.b; currentBookName = englishNames[codes.indexOf(currentBook)]; currentChapter = last.c;
    loadChapter();
}

function changeFont(delta) {
    currentFontSize += delta * 10;
    if (currentFontSize < 80) currentFontSize = 80;
    if (currentFontSize > 150) currentFontSize = 150;
    localStorage.setItem('fontSize', currentFontSize);
    document.getElementById('bible-text').style.fontSize = currentFontSize + '%';
}

function saveVerse(b, c, v) {
    const key = `${b}-${c}-${v}`;
    if(!saved.includes(key)) {
        saved.push(key); localStorage.setItem('saved', JSON.stringify(saved));
        event.currentTarget.style.backgroundColor = "#f59e0b";
        event.currentTarget.style.color = "#000";
        setTimeout(() => { event.currentTarget.style.backgroundColor = ""; event.currentTarget.style.color = ""; }, 300);
    } else {
        saved = saved.filter(k => k !== key); localStorage.setItem('saved', JSON.stringify(saved));
        event.currentTarget.style.backgroundColor = "#d32f2f";
        event.currentTarget.style.color = "#fff";
        setTimeout(() => { event.currentTarget.style.backgroundColor = ""; event.currentTarget.style.color = ""; }, 300);
    }
}

function loadSaved() {
    let html = '';
    saved.forEach(key => {
        const [b,c,v] = key.split('-').map(Number);
        const verse = yoruba.find(x => x.book === b && x.chapter === c && x.verse === v);
        if(verse) html += `<div class="card" onclick="removeBookmark('${key}')"><strong>${englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p><span style="font-size:12px; opacity:0.5;">Tap to delete</span></div>`;
    });
    document.getElementById('saved-list').innerHTML = html || '<p>Tap any verse to save it.</p>';
}
function removeBookmark(key) { saved = saved.filter(k => k !== key); localStorage.setItem('saved', JSON.stringify(saved)); loadSaved(); }

// SEARCH
function toggleSearch() { const o = document.getElementById('search-overlay'); if(o.style.display === 'block') { o.style.display = 'none'; document.getElementById('search-input').value = ''; } else { o.style.display = 'block'; document.getElementById('search-input').focus(); } }
document.getElementById('search-btn').onclick = toggleSearch;
document.getElementById('search-input').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    if (q.length < 2) return;
    let results = yoruba.filter(v => v.text.toLowerCase().includes(q)).slice(0, 20);
    let html = '';
    results.forEach(v => { html += `<div class="card" onclick="jumpToVerse(${v.book},${v.chapter},${v.verse})"><strong>${englishNames[v.book-1]} ${v.chapter}:${v.verse}</strong><p>${v.text}</p></div>`; });
    document.getElementById('search-results').innerHTML = html;
});
function jumpToVerse(b,c,v) { currentBook = codes[b-1]; currentBookName = englishNames[b-1]; currentChapter = c; toggleSearch(); loadChapter(); }

// AUDIO (Text-to-Speech)
document.getElementById('audio-btn').onclick = () => {
    if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; }
    const text = document.getElementById('bible-text').innerText.replace(/[0-9]/g, '');
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'yo-NG';
    u.rate = 0.9;
    speechSynthesis.speak(u);
};

// SHARE
document.getElementById('share-btn').onclick = () => {
    const text = document.getElementById('bible-text').innerText;
    if(navigator.share) navigator.share({ title: `${currentBookName} ${currentChapter}`, text: text });
    else alert(text);
};

// THEME & CHURCH MODE
document.getElementById('theme-btn').onclick = () => document.body.classList.toggle('dark');
document.getElementById('church-mode-btn').onclick = () => document.body.classList.toggle('church');

init();
