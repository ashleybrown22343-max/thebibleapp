let yoruba = [], english = [], englishMap = {};
let saved = JSON.parse(localStorage.getItem('saved') || '[]');
let currentBook = "GEN", currentBookName = "Genesis", currentChapter = 1;

// Full list of 66 books (Yoruba & English)
const yorubaNames = ["JENESISI","EKISODU","LEFITIKU","NOMBA","DIUTARONOMI","JOSUA","AWON ADAO","RUTU","SAMUELI KINNI","SAMUELI KEJI","AWON OBA KINNI","AWON OBA KEJI","KRONIKA KINNI","KRONIKA KEJI","ESIRA","NEHEMAYA","ESITA","JOBU","ORIN DAFIDI","IWE OWE","IWE ONIWAASU","ORIN SOLOMONI","AISAYA","JEREMAYA","EKUN JEREMAYA","ISIKIELI","DANIELI","HOSIA","JOELI","AMOSI","OBADAYA","JONA","MIKA","NAHUMU","HABAKUKU","SEFANAYA","HAGAI","SAKARAYA","MALAKI","MATIU","MAKU","LUKU","JOHANU","ISE AWON APOSTELI","ROMU","KORINTI KINNI","KORINTI KEJI","GALATIA","EFESU","FILIPI","KOLOSE","TESALONIKA KINNI","TESALONIKA KEJI","TIMOTI KINNI","TIMOTI KEJI","TITU","FILEMONI","HEBERU","JAKOBU","PETRU KINNI","PETRU KEJI","JOHANU KINNI","JOHANU KEJI","JOHANU KETA","JUDA","IFIWE"];
const englishNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
// Map code to number (1-66)
const codes = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];

// Startup
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
        buildBooks();
        loadHome();
    } catch(e) { splash.innerHTML = "<h3>Data error: Make sure your JSON files are in the 'data' folder.</h3>"; }
}

function switchScreen(s) { document.querySelectorAll('.screen').forEach(x => x.classList.remove('active')); document.getElementById('screen-' + s).classList.add('active'); }
function switchTab(t) { 
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if(t==='home'){ switchScreen('home'); document.querySelectorAll('.nav-btn')[0].classList.add('active'); }
    if(t==='books'){ switchScreen('books'); document.querySelectorAll('.nav-btn')[1].classList.add('active'); }
    if(t==='saved'){ switchScreen('saved'); loadSaved(); document.querySelectorAll('.nav-btn')[2].classList.add('active'); }
}
function continueReading(){ let last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}'); currentBook = last.b; currentBookName = englishNames[codes.indexOf(last.b)]; currentChapter = last.c; loadChapter(); }
function loadHome() {
    const hour = new Date().getHours(); 
    document.getElementById('greeting').textContent = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    const day = new Date().getDate();
    if(yoruba[day * 500]) document.getElementById('votd').textContent = yoruba[day * 500].text;
    document.getElementById('last-read').textContent = `${englishNames[codes.indexOf(JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}').b)]} ${JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}').c}`;
}

function buildBooks() {
    for(let i=0; i<yorubaNames.length; i++) {
        const div = document.createElement('div');
        div.className = i >= 39 ? 'grid-item red' : 'grid-item';
        div.textContent = yorubaNames[i];
        div.onclick = () => { currentBook = codes[i]; currentBookName = englishNames[i]; buildChapters(); };
        (i >= 39 ? document.getElementById('nt-grid') : document.getElementById('ot-grid')).appendChild(div);
    }
}
function buildChapters() {
    switchScreen('chapters');
    document.getElementById('chapter-title').textContent = currentBookName.toUpperCase();
    const bN = codes.indexOf(currentBook) + 1;
    const max = Math.max(...yoruba.filter(v => v.book === bN).map(v => v.chapter));
    const grid = document.getElementById('chapter-grid'); grid.innerHTML = '';
    for(let i=1; i<=max; i++) { const div = document.createElement('div'); div.className = 'grid-item'; div.textContent = i; div.onclick = () => { currentChapter = i; loadChapter(); }; grid.appendChild(div); }
}
function loadChapter() {
    switchScreen('reading'); 
    document.getElementById('reading-title').textContent = `${currentBookName} ${currentChapter}`;
    const bN = codes.indexOf(currentBook) + 1;
    const verses = yoruba.filter(v => v.book === bN && v.chapter === currentChapter);
    let html = '';
    verses.forEach(v => {
        const eng = englishMap[`${v.book}-${v.chapter}-${v.verse}`] || "";
        html += `<div class="verse-container" onclick="saveVerse(${v.book},${v.chapter},${v.verse})"><span class="verse-number">${v.verse}</span><p class="yoruba-text">${v.text}</p><p class="english-text">${eng}</p></div>`;
    });
    document.getElementById('bible-text').innerHTML = html;
    localStorage.setItem('lastRead', JSON.stringify({b: currentBook, c: currentChapter}));
}
function saveVerse(b,c,v) { let k = `${b}-${c}-${v}`; if(!saved.includes(k)){ saved.push(k); localStorage.setItem('saved', JSON.stringify(saved)); event.currentTarget.style.backgroundColor = "#f59e0b"; setTimeout(()=>event.currentTarget.style.backgroundColor="",300); } }
function loadSaved() { let html=''; saved.forEach(k=>{ let [b,c,v]=k.split('-').map(Number); let ve=yoruba.find(x=>x.book===b&&x.chapter===c&&x.verse===v); if(ve) html += `<div class="card" onclick="removeBookmark('${k}')"><strong>${englishNames[b-1]} ${c}:${v}</strong><p>${ve.text}</p><span style="font-size:12px; opacity:0.5;">Tap to delete</span></div>`; }); document.getElementById('saved-list') ? document.getElementById('saved-list').innerHTML = html : document.getElementById('saved-list').innerHTML = html; }
function removeBookmark(k) { saved = saved.filter(x=>x!==k); localStorage.setItem('saved', JSON.stringify(saved)); loadSaved(); }
function nextChapter(){ if(currentChapter<150){ currentChapter++; loadChapter(); } }
function prevChapter(){ if(currentChapter>1){ currentChapter--; loadChapter(); } }
document.getElementById('theme-btn').onclick = () => document.body.classList.toggle('dark');
document.getElementById('church-mode-btn').onclick = () => document.body.classList.toggle('church');

init();
