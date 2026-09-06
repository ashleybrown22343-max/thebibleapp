const data = window.bibleData;
document.getElementById('menu-btn').onclick = () => { document.getElementById('drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('show'); };
document.getElementById('close-drawer').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };
document.getElementById('drawer-overlay').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };

let currentMode = 'saved';
async function initLibrary() {
    try {
        await data.loadAllData();
        loadLibrary();
    } catch (error) {
        document.getElementById('library-list').innerHTML = '<div style="color:red; text-align:center; padding:30px;">Failed to load Bible data. Please try again.</div>';
    }
}

function loadLibrary() {
    const list = document.getElementById('library-list');
    list.innerHTML = '';

    if (currentMode === 'saved') {
        const saved = JSON.parse(localStorage.getItem('saved') || '[]');
        if (saved.length === 0) {
            list.innerHTML = `
                <div style="text-align:center; padding:40px 20px;">
                    <svg width="60" height="60" fill="none" stroke="#f59e0b" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                    <p style="margin-top:15px; font-size:18px; color:#888;">No saved verses yet</p>
                    <p style="font-size:14px; color:#aaa;">Tap a verse in the Bible to save it here.</p>
                </div>`;
            return;
        }
        saved.forEach(key => {
            const [b,c,v] = key.split('-').map(Number);
            const verse = data.yoruba.find(x => x.book === b && x.chapter === c && x.verse === v);
            if(verse) {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `<strong>${data.getEnglishName(data.codes[b-1])} ${c}:${v}</strong><p>${verse.text}</p><p style="font-size:12px;opacity:0.5;margin-top:8px;">Tap to delete</p>`;
                div.onclick = () => {
                    let savedArr = JSON.parse(localStorage.getItem('saved') || '[]');
                    savedArr = savedArr.filter(k => k !== key);
                    localStorage.setItem('saved', JSON.stringify(savedArr));
                    loadLibrary();
                };
                list.appendChild(div);
            }
        });
    } else { // Notes
        const notes = JSON.parse(localStorage.getItem('notes') || '{}');
        const noteKeys = Object.keys(notes);
        if (noteKeys.length === 0) {
            list.innerHTML = `
                <div style="text-align:center; padding:40px 20px;">
                    <svg width="60" height="60" fill="none" stroke="#f59e0b" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    <p style="margin-top:15px; font-size:18px; color:#888;">No notes yet</p>
                    <p style="font-size:14px; color:#aaa;">Tap the pencil icon on a verse to add a note.</p>
                </div>`;
            return;
        }
        noteKeys.forEach(key => {
            const [b,c,v] = key.split('-').map(Number);
            const verse = data.yoruba.find(x => x.book === b && x.chapter === c && x.verse === v);
            if(verse) {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `<strong>${data.getEnglishName(data.codes[b-1])} ${c}:${v}</strong><p>${verse.text}</p><p style="font-style:italic;">${notes[key]}</p><p style="font-size:12px;opacity:0.5;margin-top:8px;">Tap to delete</p>`;
                div.onclick = () => {
                    let notesObj = JSON.parse(localStorage.getItem('notes') || '{}');
                    delete notesObj[key];
                    localStorage.setItem('notes', JSON.stringify(notesObj));
                    loadLibrary();
                };
                list.appendChild(div);
            }
        });
    }
}

function showSaved() { currentMode = 'saved'; loadLibrary(); }
function showNotes() { currentMode = 'notes'; loadLibrary(); }

initLibrary();
