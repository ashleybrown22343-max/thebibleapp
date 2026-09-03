document.addEventListener('DOMContentLoaded', async () => {
    const bookSelect = document.getElementById('book-select');
    const chapterInput = document.getElementById('chapter-input');
    const loadBtn = document.getElementById('load-btn');
    const bibleText = document.getElementById('bible-text');

    // ===== 1. Populate all 66 books into the dropdown =====
    const allBooks = [
        ["GEN","Genesis"],["EXO","Exodus"],["LEV","Leviticus"],["NUM","Numbers"],
        ["DEU","Deuteronomy"],["JOS","Joshua"],["JDG","Judges"],["RUT","Ruth"],
        ["1SA","1 Samuel"],["2SA","2 Samuel"],["1KI","1 Kings"],["2KI","2 Kings"],
        ["1CH","1 Chronicles"],["2CH","2 Chronicles"],["EZR","Ezra"],["NEH","Nehemiah"],
        ["EST","Esther"],["JOB","Job"],["PSA","Psalms"],["PRO","Proverbs"],
        ["ECC","Ecclesiastes"],["SNG","Song of Solomon"],["ISA","Isaiah"],["JER","Jeremiah"],
        ["LAM","Lamentations"],["EZK","Ezekiel"],["DAN","Daniel"],["HOS","Hosea"],
        ["JOL","Joel"],["AMO","Amos"],["OBA","Obadiah"],["JON","Jonah"],
        ["MIC","Micah"],["NAM","Nahum"],["HAB","Habakkuk"],["ZEP","Zephaniah"],
        ["HAG","Haggai"],["ZEC","Zechariah"],["MAL","Malachi"],["MAT","Matthew"],
        ["MRK","Mark"],["LUK","Luke"],["JHN","John"],["ACT","Acts"],
        ["ROM","Romans"],["1CO","1 Corinthians"],["2CO","2 Corinthians"],["GAL","Galatians"],
        ["EPH","Ephesians"],["PHP","Philippians"],["COL","Colossians"],["1TH","1 Thessalonians"],
        ["2TH","2 Thessalonians"],["1TI","1 Timothy"],["2TI","2 Timothy"],["TIT","Titus"],
        ["PHM","Philemon"],["HEB","Hebrews"],["JAS","James"],["1PE","1 Peter"],
        ["2PE","2 Peter"],["1JN","1 John"],["2JN","2 John"],["3JN","3 John"],
        ["JUD","Jude"],["REV","Revelation"]
    ];

    allBooks.forEach(([code, name]) => {
        let opt = document.createElement('option');
        opt.value = code;
        opt.textContent = name;
        bookSelect.appendChild(opt);
    });

    // ===== 2. Fetch chapter from the free CDN =====
    async function fetchChapter(book, chapter, lang) {
        const url = `https://cdn.jsdelivr.net/gh/wldeh/bible-api@main/bibles/${lang}/books/${book}/chapters/${chapter}.json`;
        const res = await fetch(url);
        if (!res.ok) return null; // If chapter doesn't exist, return null
        return await res.json();
    }

    // ===== 3. Load and display the chapter =====
    async function loadChapter() {
        const book = bookSelect.value;
        const chapter = chapterInput.value;
        bibleText.innerHTML = '<p>Loading...</p>';

        // Fetch Yoruba and English at the same time
        const [yorubaData, englishData] = await Promise.all([
            fetchChapter(book, chapter, 'yoruba'),
            fetchChapter(book, chapter, 'en-kjv')
        ]);

        // Handle missing chapter (e.g., chapter 150 in Psalms won't exist in some versions)
        if (!yorubaData || !englishData) {
            bibleText.innerHTML = '<p>Chapter not found. Please try another chapter.</p>';
            return;
        }

        // Build the side-by-side HTML
        let html = '';
        for (let i = 0; i < yorubaData.length; i++) {
            html += `
                <div class="verse-container">
                    <div class="verse-number">${yorubaData[i].verse}</div>
                    <div class="verse-text">
                        <p class="yoruba-text">${yorubaData[i].text}</p>
                        <p class="english-text">${englishData[i]?.text || ''}</p>
                    </div>
                </div>`;
        }
        bibleText.innerHTML = html;
    }

    // ===== 4. Event Listeners =====
    
    // Load Genesis 1 automatically when app opens
    loadChapter();

    // Load when button is clicked
    loadBtn.addEventListener('click', loadChapter);

    // Also load when user presses Enter on the chapter input
    chapterInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadChapter();
        }
    });
});
