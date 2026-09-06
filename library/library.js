const data = window.bibleData;
document.getElementById('menu-btn').onclick = () => { document.getElementById('drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('show'); };
document.getElementById('close-drawer').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };
document.getElementById('drawer-overlay').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };

let currentMode = 'saved';
async function initLibrary() {
    await data.loadAllData();
    loadLibrary();
}

function loadLibrary() {
    const list = document.getElementById('library-list');
    list.innerHTML = '';
    if (currentMode === 'saved') {
        const saved = JSON.parse(localStorage.getItem('saved') || '[]');
        saved.forEach(key => {
            const [b,c,v] = key.split('-').map(Number);
            const verse = data.yoruba.find(x => x.book === b && x.chapter === c && x.verse === v);
            if(verse) {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `<strong>${data.englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p><p style="font-size:12px;opacity:0.5;margin-top:8px;">Tap to delete</p>`;
                div.onclick = () => {
                    // Remove bookmark
                    let savedArr = JSON.parse(localStorage.getItem('saved') || '[]');
                    savedArr = savedArr.filter(k => k !== key);
                    localStorage.setItem('saved', JSON.stringify(savedArr));
                    loadLibrary();
                };
                list.appendChild(div);
            }
        });
        if (list.innerHTML === '') list.innerHTML = '<p>Tap any verse to save it.</p>';
    } else {
        const notes = JSON.parse(localStorage.getItem('notes') || '{}');
        for (const key in notes) {
            const [b,c,v] = key.split('-').map(Number);
            const verse = data.yoruba.find(x => x.book === b && x.chapter === c && x.verse === v);
            if(verse) {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `<strong>${data.englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p><p style="font-style:italic;">${notes[key]}</p><p style="font-size:12px;opacity:0.5;margin-top:8px;">Tap to delete</p>`;
                div.onclick = () => {
                    // Delete note
                    let notesObj = JSON.parse(localStorage.getItem('notes') || '{}');
                    delete notesObj[key];
                    localStorage.setItem('notes', JSON.stringify(notesObj));
                    loadLibrary();
                };
                list.appendChild(div);
            }
        }
        if (list.innerHTML === '') list.innerHTML = '<p>Tap the pencil icon to add a note.</p>';
    }
}

function showSaved() { currentMode = 'saved'; loadLibrary(); }
function showNotes() { currentMode = 'notes'; loadLibrary(); }
initLibrary();
