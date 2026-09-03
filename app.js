document.addEventListener('DOMContentLoaded', async () => {
    const bookSelect = document.getElementById('book-select');
    const chapterInput = document.getElementById('chapter-input');
    const loadBtn = document.getElementById('load-btn');
    const bibleText = document.getElementById('bible-text');

    async function fetchChapter(book, chapter, lang) {
        // This is the direct GitHub CDN URL for the Bible data
        const url = `https://cdn.jsdelivr.net/gh/wldeh/bible-api@main/bibles/${lang}/books/${book}/chapters/${chapter}.json`;
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
    }

    async function loadChapter() {
        const book = bookSelect.value;
        const chapter = chapterInput.value;
        bibleText.innerHTML = '<p>Loading...</p>';

        const yorubaData = await fetchChapter(book, chapter, 'yoruba');
        const englishData = await fetchChapter(book, chapter, 'en-kjv');

        if (!yorubaData || !englishData) {
            bibleText.innerHTML = '<p>Chapter not found (try chapter 1-3 for now).</p>';
            return;
        }

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

    loadChapter();
    loadBtn.addEventListener('click', loadChapter);
});
