window.onerror = function(msg, url, line) {
    document.body.innerHTML = '<div style="color:red;padding:20px;font-size:16px;">Error: ' + msg + '<br>File: ' + url + '<br>Line: ' + line + '</div>';
};
const params = new URLSearchParams(window.location.search);
const bookParam = params.get('book');
const chapterParam = params.get('chapter');
let currentBook = bookParam || 'GEN';
let currentChapter = parseInt(chapterParam) || 1;

document.getElementById('menu-btn').onclick = () => { document.getElementById('drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('show'); };
document.getElementById('close-drawer').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };
document.getElementById('drawer-overlay').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };

async function initBooks() {
    await window.bibleData.loadAllData();
    if (bookParam) {
        renderReading();
    } else {
        renderBookGrid();
    }
}

function renderBookGrid() {
    const grid = document.getElementById('book-grid');
    grid.style.display = 'grid';
    document.getElementById('chapter-grid').style.display = 'none';
    document.getElementById('reading-view').style.display = 'none';
    const data = window.bibleData;
    data.englishNames.forEach((name, i) => {
        const div = document.createElement('div');
        div.className = 'grid-item' + (i >= 39 ? ' red' : '');
        div.textContent = name;
        div.onclick = () => { location.href = `/books?book=${data.codes[i]}&chapter=1`; };
        grid.appendChild(div);
    });
}

function renderReading() {
    document.getElementById('book-grid').style.display = 'none';
    document.getElementById('chapter-grid').style.display = 'none';
    const view = document.getElementById('reading-view');
    view.style.display = 'block';

    const data = window.bibleData;
    let bookIdx = data.codes.indexOf(currentBook);
    if (bookIdx === -1) { currentBook = 'GEN'; bookIdx = 0; }
    const bookName = data.englishNames[bookIdx];
    const bookNum = bookIdx + 1;

    const verses = data.yoruba.filter(v => v.book === bookNum && v.chapter === currentChapter);
    let html = `<h2>${bookName} ${currentChapter}</h2><div style="margin-bottom:15px;">
        <button class="btn" onclick="prevChapter()">Previous</button>
        <button class="btn" style="margin-left:10px;" onclick="nextChapter()">Next</button>
    </div>`;

    verses.forEach(v => {
        const eng = data.englishMap[`${v.book}-${v.chapter}-${v.verse}`] || '';
        html += `<div class="verse" data-book="${v.book}" data-chapter="${v.chapter}" data-verse="${v.verse}">
            <span class="verse-num">${v.verse}</span>
            <div class="yoruba">${v.text}</div>
            ${eng ? `<div class="english">${eng}</div>` : ''}
        </div>`;
    });
    view.innerHTML = html;

    localStorage.setItem('lastRead', JSON.stringify({ b: currentBook, c: currentChapter }));
    const completed = JSON.parse(localStorage.getItem('completedChapters') || '[]');
    const key = `${currentBook}-${currentChapter}`;
    if (!completed.includes(key)) { completed.push(key); localStorage.setItem('completedChapters', JSON.stringify(completed)); }
}

function prevChapter() { if (currentChapter > 1) { currentChapter--; location.href = `/books?book=${currentBook}&chapter=${currentChapter}`; } }
function nextChapter() { if (currentChapter < 150) { currentChapter++; location.href = `/books?book=${currentBook}&chapter=${currentChapter}`; } }

initBooks();
