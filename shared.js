// ============================================================
// SHARED BIBLE DATA
// ============================================================

var bibleData = {
    yoruba: [],
    english: [],
    englishMap: {},
    codes: ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"],
    englishNames: ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"],
    loaded: false
};

bibleData.loadAllData = function () {
    if (bibleData.loaded) return Promise.resolve();
    return Promise.all([
        fetch('/data/yoruba.json').then(function (r) {
            if (!r.ok) throw new Error('Yoruba data missing');
            return r.json();
        }),
        fetch('/data/english_nkj.json').then(function (r) {
            if (!r.ok) throw new Error('English data missing');
            return r.json();
        })
    ]).then(function (results) {
        bibleData.yoruba = results[0];
        bibleData.english = results[1];
        var map = {};
        for (var i = 0; i < bibleData.english.length; i++) {
            var v = bibleData.english[i];
            map[v.book + '-' + v.chapter + '-' + v.verse] = v.text;
        }
        bibleData.englishMap = map;
        bibleData.loaded = true;
    });
};

bibleData.getEnglishName = function (code) {
    var idx = bibleData.codes.indexOf(code);
    return idx >= 0 ? bibleData.englishNames[idx] : code;
};

bibleData.getBookIndex = function (code) {
    return bibleData.codes.indexOf(code);
};

window.bibleData = bibleData;

// ============================================================
// SERVICE WORKER REGISTRATION
// ============================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (reg) {
            // Check for updates every 30 minutes
            setInterval(function () {
                reg.update().catch(function () {});
            }, 30 * 60 * 1000);
        }).catch(function (err) {
            console.warn('Service Worker registration failed:', err);
        });
    });
}

// ============================================================
// STUDIO OFFLINE WARNING
// ============================================================
// ============================================================
// SERVICE WORKER REGISTRATION
// ============================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (reg) {
            setInterval(function () {
                reg.update().catch(function () {});
            }, 30 * 60 * 1000);
        }).catch(function (err) {
            console.warn('Service Worker registration failed:', err);
        });
    });
            }
