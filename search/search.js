const data = window.bibleData;
document.getElementById('menu-btn').onclick = () => { document.getElementById('drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('show'); };
document.getElementById('close-drawer').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };
document.getElementById('drawer-overlay').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };

let searchTimeout;
function performSearch() {
    const q = document.getElementById('search-input').value.toLowerCase().trim();
    clearTimeout(searchTimeout);
    if (q.length < 2) { document.getElementById('search-results').innerHTML = ''; return; }
    searchTimeout = setTimeout(() => {
        let results = [];
        const searchYo = document.getElementById('search-yo').checked;
        const searchEn = document.getElementById('search-en').checked;
        const selectedBook = document.getElementById('search-book').value;
        const MAX_RESULTS = 50;
        if (searchYo) {
            for (let i = 0; i < data.yoruba.length; i++) {
                const v = data.yoruba[i];
                if ((selectedBook === 'all' || data.codes[v.book-1] === selectedBook) && v.text.toLowerCase().includes(q)) {
                    results.push({ book: v.book, chapter: v.chapter, verse: v.verse, text: v.text, lang: 'yo' });
                    if (results.length >= MAX_RESULTS) break;
                }
            }
        }
        if (searchEn) {
            for (let i = 0; i < data.english.length; i++) {
                const v = data.english[i];
                if ((selectedBook === 'all' || data.codes[v.book-1] === selectedBook) && v.text.toLowerCase().includes(q)) {
                    results.push({ book: v.book, chapter: v.chapter, verse: v.verse, text: v.text, lang: 'en' });
                    if (results.length >= MAX_RESULTS) break;
                }
            }
        }
        function highlightText(text, q) {
            const regex = new RegExp(`(${q})`, 'gi');
            return text.replace(regex, '<span class="search-highlight">$1</span>');
        }
        let html = '';
        results.forEach(v => {
            const displayText = highlightText(v.text, q);
            html += `<div class="card" onclick="location.href='/books?book=${data.codes[v.book-1]}&chapter=${v.chapter}'"><strong>${data.englishNames[v.book-1]} ${v.chapter}:${v.verse} (${v.lang === 'yo' ? 'Yoruba' : 'English'})</strong><p>${displayText}</p></div>`;
        });
        document.getElementById('search-results').innerHTML = html || '<p>No results found.</p>';
    }, 400);
}
document.getElementById('search-input').addEventListener('input', performSearch);
document.getElementById('search-yo').addEventListener('change', performSearch);
document.getElementById('search-en').addEventListener('change', performSearch);
document.getElementById('search-book').addEventListener('change', performSearch);

async function initSearch() {
    await data.loadAllData();
    const select = document.getElementById('search-book');
    data.englishNames.forEach((name, i) => {
        const opt = document.createElement('option');
        opt.value = data.codes[i];
        opt.textContent = name;
        select.appendChild(opt);
    });
}
initSearch();
