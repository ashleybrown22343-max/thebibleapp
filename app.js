document.addEventListener('DOMContentLoaded', () => {
    const bookSelect = document.getElementById('book-select');
    const chapterInput = document.getElementById('chapter-input');
    const loadBtn = document.getElementById('load-btn');
    const bibleText = document.getElementById('bible-text');

    // Mapping Book Codes to GetBible Numbers (1-66)
    const bookNumbers = {
        "GEN": 1, "EXO": 2, "LEV": 3, "NUM": 4, "DEU": 5, "JOS": 6, "JDG": 7, "RUT": 8,
        "1SA": 9, "2SA": 10, "1KI": 11, "2KI": 12, "1CH": 13, "2CH": 14, "EZR": 15, "NEH": 16,
        "EST": 17, "JOB": 18, "PSA": 19, "PRO": 20, "ECC": 21, "SNG": 22, "ISA": 23, "JER": 24,
        "LAM": 25, "EZK": 26, "DAN": 27, "HOS": 28, "JOL": 29, "AMO": 30, "OBA": 31, "JON": 32,
        "MIC": 33, "NAM": 34, "HAB": 35, "ZEP": 36, "HAG": 37, "ZEC": 38, "MAL": 39,
        "MAT": 40, "MRK": 41, "LUK": 42, "JHN": 43, "ACT": 44, "ROM": 45, "1CO": 46, "2CO": 47,
        "GAL": 48, "EPH": 49, "PHP": 50, "COL": 51, "1TH": 52, "2TH": 53, "1TI": 54, "2TI": 55,
        "TIT": 56, "PHM": 57, "HEB": 58, "JAS": 59, "1PE": 60, "2PE": 61, "1JN": 62, "2JN": 63,
        "3JN": 64, "JUD": 65, "REV": 66
    };

    // Populate dropdown with all 66 books
    const allBooks = Object.keys(bookNumbers);
    allBooks.forEach(code => {
        let opt = document.createElement('option');
        opt.value = code;
        opt.textContent = code; // Just shows the code, e.g., GEN
        bookSelect.appendChild(opt);
    });

    async function fetchChapter(bookCode, chapter, lang) {
        const bookNum = bookNumbers[bookCode]; // e.g., 1
        // GetBible's free API format:
        const url = `https://api.getbible.net/v2/${lang}/${bookNum}/${chapter}.json`;
        try {
            const res = await fetch(url);
            if (!res.ok) return null;
            const data = await res.json();
            return data.verses; // GetBible uses "verses" array
        } catch (e) {
            return null;
        }
    }

    async function loadChapter() {
        const bookCode = bookSelect.value;
        const chapter = chapterInput.value;
        bibleText.innerHTML = '<p>Loading...</p>';

        // GetBible IDs: "yoruba" for Yoruba, "kjv" for King James English
        const [yorubaData, englishData] = await Promise.all([
            fetchChapter(bookCode, chapter, 'yoruba'),
            fetchChapter(bookCode, chapter, 'kjv')
        ]);

        if (!yorubaData || !englishData) {
            bibleText.innerHTML = '<p>Chapter not found. Please try another chapter.</p>';
            return;
        }

        let html = '';
        for (let i = 0; i < yorubaData.length; i++) {
            // Both Yoruba and KJV should have same verse numbers, but use the Yoruba one
            const verseNum = yorubaData[i].verse;
            const yorubaText = yorubaData[i].text;
            const englishText = englishData[i]?.text || '';

            html += `
                <div class="verse-container">
                    <div class="verse-number">${verseNum}</div>
                    <div class="verse-text">
                        <p class="yoruba-text">${yorubaText}</p>
                        <p class="english-text">${englishText}</p>
                    </div>
                </div>`;
        }
        bibleText.innerHTML = html;
    }

    loadChapter();
    loadBtn.addEventListener('click', loadChapter);

    chapterInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadChapter();
        }
    });
});
