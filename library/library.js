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
                div.innerHTML = `<strong>${data.englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p>`;
                div.onclick = () => { location.href = `/books?book=${data.codes[b-1]}&chapter=${c}`; };
                list.appendChild(div);
            }
        });
    } else {
        const notes = JSON.parse(localStorage.getItem('notes') || '{}');
        for (const key in notes) {
            const [b,c,v] = key.split('-').map(Number);
            const verse = data.yoruba.find(x => x.book === b && x.chapter === c && x.verse === v);
            if(verse) {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `<strong>${data.englishNames[b-1]} ${c}:${v}</strong><p>${verse.text}</p><p style="font-style:italic;">${notes[key]}</p>`;
                div.onclick = () => { location.href = `/books?book=${data.codes[b-1]}&chapter=${c}`; };
                list.appendChild(div);
            }
        }
    }
}
function showSaved() { currentMode = 'saved'; loadLibrary(); }
function showNotes() { currentMode = 'notes'; loadLibrary(); }
initLibrary();
