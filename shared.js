// Shared Data Loader and Utilities
let yoruba = [];
let english = [];
let englishMap = {};

const codes = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];

const englishNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

async function loadAllData() {
    try {
        const [yRes, eRes] = await Promise.all([
            fetch('/data/yoruba.json'),
            fetch('/data/english_nkj.json')
        ]);
        if (!yRes.ok) throw new Error('Yoruba data missing');
        if (!eRes.ok) throw new Error('English NKJ data missing');
        yoruba = await yRes.json();
        english = await eRes.json();
        english.forEach(v => {
            englishMap[`${v.book}-${v.chapter}-${v.verse}`] = v.text;
        });
        // CRITICAL UPDATE: Update the window object with the loaded data
        window.bibleData.yoruba = yoruba;
        window.bibleData.english = english;
        window.bibleData.englishMap = englishMap;
    } catch (e) {
        console.error(e);
        alert('Error loading Bible data. Check data files.');
    }
}

function getBookCode(index) { return codes[index]; }
function getEnglishName(code) {
    const idx = codes.indexOf(code);
    return idx >= 0 ? englishNames[idx] : code;
}
function getBookIndex(code) { return codes.indexOf(code); }

window.bibleData = {
    yoruba: yoruba,
    english: english,
    englishMap: englishMap,
    codes: codes,
    englishNames: englishNames,
    loadAllData: loadAllData,
    getBookCode: getBookCode,
    getEnglishName: getEnglishName,
    getBookIndex: getBookIndex
};
