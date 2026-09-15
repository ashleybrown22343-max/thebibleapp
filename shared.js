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
(function () {
    if (window.location.pathname.indexOf('/studio') !== 0) return;

    function showOfflineBanner() {
        if (document.getElementById('studio-offline-banner')) return;
        var banner = document.createElement('div');
        banner.id = 'studio-offline-banner';
        banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#DC2626;color:#fff;padding:12px 16px;text-align:center;font-size:13px;font-weight:600;font-family:Inter,sans-serif;z-index:99999;box-shadow:0 2px 8px rgba(0,0,0,0.2);';
        banner.textContent = 'You need internet for the Image Studio. Reconnect and try again.';
        document.body.appendChild(banner);
    }

    function removeOfflineBanner() {
        var banner = document.getElementById('studio-offline-banner');
        if (banner) banner.parentNode.removeChild(banner);
    }

    if (!navigator.onLine) showOfflineBanner();
    window.addEventListener('offline', showOfflineBanner);
    window.addEventListener('online', removeOfflineBanner);
})();
