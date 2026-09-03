let yoruba = [], english = [];
let currentBook = "GEN", currentBookName = "Genesis", currentChapter = 1;
const codes = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];
const englishNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

const splash = document.getElementById('splash-screen');
const app = document.getElementById('app-container');

async function init() {
    try {
        const [yRes, eRes] = await Promise.all([fetch('data/yoruba.json'), fetch('data/english_net.json')]);
        yoruba = await yRes.json(); 
        english = await eRes.json();
        splash.style.display = 'none';
        app.style.display = 'block';
        loadHome();
    } catch(e) { splash.innerHTML = "<h3>Error: data files not found</h3>"; }
}

function switchTab(tab) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('screen-' + tab).classList.add('active');
    if(tab === 'home') document.querySelectorAll('.nav-btn')[0].classList.add('active');
    if(tab === 'books') document.querySelectorAll('.nav-btn')[1].classList.add('active');
    if(tab === 'saved') document.querySelectorAll('.nav-btn')[2].classList.add('active');
}

function loadHome() {
    // Greeting
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    document.getElementById('greeting').textContent = greet;

    // Continue Reading
    const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}');
    const bookIndex = codes.indexOf(last.b);
    document.getElementById('last-read').textContent = `${englishNames[bookIndex]} ${last.c}`;

    // Verse of the Day
    const day = new Date().getDate();
    const verse = yoruba[day * 500];
    if(verse) document.getElementById('votd').textContent = verse.text;
}

function continueReading() {
    const last = JSON.parse(localStorage.getItem('lastRead') || '{"b":"GEN","c":1}');
    currentBook = last.b;
    currentBookName = englishNames[codes.indexOf(currentBook)];
    currentChapter = last.c;
    alert("This will open Chapter " + currentChapter + " in the next phase!");
}

document.getElementById('theme-btn').onclick = () => document.body.classList.toggle('dark');

init();
