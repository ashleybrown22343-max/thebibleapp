document.addEventListener('DOMContentLoaded', async () => {
    const bookSelect = document.getElementById('book-select');
    const chapterInput = document.getElementById('chapter-input');
    const loadBtn = document.getElementById('load-btn');
    const bibleText = document.getElementById('bible-text');

    const bookNumbers = { "GEN":1, "EXO":2, "LEV":3, "NUM":4, "DEU":5, "JOS":6, "JDG":7, "RUT":8, "1SA":9, "2SA":10, "1KI":11, "2KI":12, "1CH":13, "2CH":14, "EZR":15, "NEH":16, "EST":17, "JOB":18, "PSA":19, "PRO":20, "ECC":21, "SNG":22, "ISA":23, "JER":24, "LAM":25, "EZK":26, "DAN":27, "HOS":28, "JOL":29, "AMO":30, "OBA":31, "JON":32, "MIC":33, "NAM":34, "HAB":35, "ZEP":36, "HAG":37, "ZEC":38, "MAL":39, "MAT":40, "MRK":41, "LUK":42, "JHN":43, "ACT":44, "ROM":45, "1CO":46, "2CO":47, "GAL":48, "EPH":49, "PHP":50, "COL":51, "1TH":52, "2TH":53, "1TI":54, "2TI":55, "TIT":56, "PHM":57, "HEB":58, "JAS":59, "1PE":60, "2PE":61, "1JN":62, "2JN":63, "3JN":64, "JUD":65, "REV":66 };
    const bookNames = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

    Object.keys(bookNumbers).forEach(code => {
        let opt = document.createElement('option');
        opt.value = code;
        opt.textContent = bookNames[bookNumbers[code] - 1];
        bookSelect.appendChild(opt);
    });

    let yorubaArray = [];
    let englishArray = [];

    try {
        const [yoRes, enRes] = await Promise.all([
            fetch('data/yoruba.json'),
            fetch('data/english_net.json')
        ]);
        yorubaArray = await yoRes.json();
        englishArray = await enRes.json();
    } catch (e) {
        bibleText.innerHTML = '<p>Error: Make sure "yoruba.json" and "english_net.json" are inside a folder named "data" in GitHub!</p>';
        return;
    }

    const englishMap = {};
    englishArray.forEach(v => {
        const key = `${v.book}-${v.chapter}-${v.verse}`;
        englishMap[key] = v.text;
    });

    function loadChapter() {
        const bookCode = bookSelect.value;
        const chapter = chapterInput.value;
        const bookNum = bookNumbers[bookCode];
        const chapNum = parseInt(chapter);

        const yoChapter = yorubaArray.filter(v => v.book === bookNum && v.chapter === chapNum);

        if (yoChapter.length === 0) {
            bibleText.innerHTML = '<p>Chapter not found.</p>';
            return;
        }

        let html = '';
        yoChapter.forEach(v => {
            const key = `${v.book}-${v.chapter}-${v.verse}`;
            const engText = englishMap[key] || "";
            
            html += `<div class="verse-container">
                <div class="verse-number">${v.verse}</div>
                <div class="verse-text">
                    <p class="yoruba-text">${v.text}</p>
                    <p class="english-text">${engText}</p>
                </div>
            </div>`;
        });
        bibleText.innerHTML = html;
    }

    loadChapter();
    loadBtn.addEventListener('click', loadChapter);
    chapterInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadChapter();
    });
});
