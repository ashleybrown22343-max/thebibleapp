const data = window.bibleData;
document.getElementById('menu-btn').onclick = () => { document.getElementById('drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('show'); };
document.getElementById('close-drawer').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };
document.getElementById('drawer-overlay').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };

async function initDaily() {
    await data.loadAllData();
    const day = new Date().getDate();
    const list = document.getElementById('daily-list');
    list.innerHTML = '';

    const psalm = data.yoruba.find(v => v.book === 19 && v.chapter === day && v.verse === 1);
    if(psalm) {
        const eng = data.englishMap[`${psalm.book}-${psalm.chapter}-${psalm.verse}`] || "";
        list.innerHTML += `<div class="card"><h3>Daily Psalm</h3><p>${psalm.text}<br><em>${eng}</em></p><p style="text-align:right;">${data.englishNames[18]} ${psalm.chapter}:${psalm.verse}</p></div>`;
    }
    const gospel = data.yoruba.find(v => v.book === 40 && v.chapter === Math.max(1, day % 28) && v.verse === 1);
    if(gospel) {
        const eng = data.englishMap[`${gospel.book}-${gospel.chapter}-${gospel.verse}`] || "";
        list.innerHTML += `<div class="card"><h3>Daily Gospel</h3><p>${gospel.text}<br><em>${eng}</em></p><p style="text-align:right;">${data.englishNames[39]} ${gospel.chapter}:${gospel.verse}</p></div>`;
    }
}
initDaily();
