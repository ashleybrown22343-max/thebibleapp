// Data and State
let yorubaArray = [];
let englishArray = [];
let englishMap = {};
let savedVerses = JSON.parse(localStorage.getItem('savedVerses') || '[]');
let currentBook = "GEN";
let currentChapter = 1;
let currentBookName = "";

const bookNumbers = { "GEN":1, "EXO":2, "LEV":3, "NUM":4, "DEU":5, "JOS":6, "JDG":7, "RUT":8, "1SA":9, "2SA":10, "1KI":11, "2KI":12, "1CH":13, "2CH":14, "EZR":15, "NEH":16, "EST":17, "JOB":18, "PSA":19, "PRO":20, "ECC":21, "SNG":22, "ISA":23, "JER":24, "LAM":25, "EZK":26, "DAN":27, "HOS":28, "JOL":29, "AMO":30, "OBA":31, "JON":32, "MIC":33, "NAM":34, "HAB":35, "ZEP":36, "HAG":37, "ZEC":38, "MAL":39, "MAT":40, "MRK":41, "LUK":42, "JHN":43, "ACT":44, "ROM":45, "1CO":46, "2CO":47, "GAL":48, "EPH":49, "PHP":50, "COL":51, "1TH":52, "2TH":53, "1TI":54, "2TI":55, "TIT":56, "PHM":57, "HEB":58, "JAS":59, "1PE":60, "2PE":61, "1JN":62, "2JN":63, "3JN":64, "JUD":65, "REV":66 };
const yorubaBookNames = ["JENESISI","EKISODU","LEFITIKU","NOMBA","DIUTARONOMI","JOSUA","AWON ADAO","RUTU","SAMUELI KINNI","SAMUELI KEJI","AWON OBA KINNI","AWON OBA KEJI","KRONIKA KINNI","KRONIKA KEJI","ESIRA","NEHEMAYA","ESITA","JOBU","ORIN DAFIDI","IWE OWE","IWE ONIWAASU","ORIN SOLOMONI","AISAYA","JEREMAYA","EKUN JEREMAYA","ISIKIELI","DANIELI","HOSIA","JOELI","AMOSI","OBADAYA","JONA","MIKA","NAHUMU","HABAKUKU","SEFANAYA","HAGAI","SAKARAYA","MALAKI","MATIU","MAKU","LUKU","JOHANU","ISE AWON APOSTELI","ROMU","KORINTI KINNI","KORINTI KEJI","GALATIA","EFESU","FILIPI","KOLOSE","TESALONIKA KINNI","TESALONIKA KEJI","TIMOTI KINNI","TIMOTI KEJI","TITU","FILEMONI","HEBERU","JAKOBU","PETRU KINNI","PETRU KEJI","JOHANU KINNI","JOHANU KEJI","JOHANU KETA","JUDA","IFIWE"];
const englishBookNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

// Init
async function init() {
    // Fetch Data
    const [yoRes, enRes] = await Promise.all([fetch('data/yoruba.json'), fetch('data/english_net.json')]);
    yorubaArray = await yoRes.json(); englishArray = await enRes.json();
    englishArray.forEach(v => { englishMap[`${v.book}-${v.chapter}-${v.verse}`] = v.text; });
    populateBooks();
}

// UI Functions
function toggleNav() { var nav = document.getElementById("sidenav"); if (nav.style.width === "250px") { nav.style.width = "0"; document.getElementById("main").style.marginLeft = "0"; } else { nav.style.width = "250px"; document.getElementById("main").style.marginLeft = "250px"; } }
function switchScreen(screen) { toggleNav(); document.querySelectorAll('.screen').forEach(s => s.style.display = 'none'); document.getElementById('screen-' + screen).style.display = 'block'; if (screen === 'bookmarks') loadBookmarks(); }
function toggleTheme() { document.body.classList.toggle('dark-mode'); toggleNav(); }
function shareApp() { if (navigator.share) { navigator.share({ title: 'Yoruba Bible', url: window.location.href }); } else { alert('Copy and share this link: ' + window.location.href); } toggleNav(); }

function populateBooks() {
    const grid = document.getElementById('book-grid');
    grid.innerHTML = '';
    yorubaBookNames.forEach((name, i) => {
        const code = Object.keys(bookNumbers)[i];
        const isNT = i >= 39; // New Testament books are red
        const div = document.createElement('div');
        div.className = isNT ? 'grid-item red' : 'grid-item';
        div.textContent = name;
        div.onclick = () => { currentBook = code; currentBookName = name; populateChapters(); };
        grid.appendChild(div);
    });
}

function populateChapters() {
    const grid = document.getElementById('chapter-grid');
    grid.innerHTML = '';
    document.getElementById('chapter-book-title').textContent = currentBookName;
    document.getElementById('screen-books').style.display = 'none';
    document.getElementById('screen-chapters').style.display = 'block';

    // Get max chapters for this book (using Yoruba data)
    const bookNum = bookNumbers[currentBook];
    const maxChapters = Math.max(...yorubaArray.filter(v => v.book === bookNum).map(v => v.chapter));
    
    for (let i = 1; i <= maxChapters; i++) {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.textContent = i;
        div.onclick = () => { currentChapter = i; loadChapter(); };
        grid.appendChild(div);
    }
}

function goToBooks() { document.getElementById('screen-chapters').style.display = 'none'; document.getElementById('screen-books').style.display = 'block'; }
function goToChapters() { document.getElementById('screen-reading').style.display = 'none'; document.getElementById('screen-chapters').style.display = 'block'; }

function loadChapter() {
    document.getElementById('screen-chapters').style.display = 'none';
    document.getElementById('screen-reading').style.display = 'block';
    document.getElementById('reading-title').textContent = `${currentBookName} ${currentChapter}`;
    
    const bookNum = bookNumbers[currentBook];
    const yoChapter = yorubaArray.filter(v => v.book === bookNum && v.chapter === currentChapter);

    let html = '';
    yoChapter.forEach(v => {
        const engText = englishMap[`${v.book}-${v.chapter}-${v.verse}`] || "";
        html += `<div class="verse-container">
            <span class="verse-number">${v.verse}</span>
            <p class="yoruba-text">${v.text}</p>
            <p class="english-text">${engText}</p>
            <button onclick="saveVerse(${v.book}, ${v.chapter}, ${v.verse})" style="border:none; background:#f0f0f0; padding:5px; border-radius:3px;">🔖 Save</button>
        </div>`;
    });
    document.getElementById('bible-text').innerHTML = html || '<p>Chapter not found.</p>';
}

function saveVerse(book, ch, v) {
    const key = `${book}-${ch}-${v}`;
    if (!savedVerses.includes(key)) { savedVerses.push(key); localStorage.setItem('savedVerses', JSON.stringify(savedVerses)); alert('Saved!'); }
    else { alert('Already saved!'); }
}

function loadBookmarks() {
    let html = '';
    savedVerses.forEach(key => {
        const [b, c, v] = key.split('-').map(Number);
        const verseObj = yorubaArray.find(x => x.book === b && x.chapter === c && x.verse === v);
        if (verseObj) {
            html += `<div class="bm-item"><strong>${yorubaBookNames[b-1]} ${c}:${v}</strong><br><p>${verseObj.text}</p><button onclick="removeBookmark('${key}')">Delete</button></div>`;
        }
    });
    document.getElementById('bookmark-list').innerHTML = html || '<p>No saved verses yet.</p>';
}

function removeBookmark(key) {
    savedVerses = savedVerses.filter(k => k !== key);
    localStorage.setItem('savedVerses', JSON.stringify(savedVerses));
    loadBookmarks();
}

function increaseFont() { const el = document.getElementById('bible-text'); el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) + 2) + 'px'; }
function decreaseFont() { const el = document.getElementById('bible-text'); el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) - 2) + 'px'; }

init();
