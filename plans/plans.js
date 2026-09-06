const data = window.bibleData;
document.getElementById('menu-btn').onclick = () => { document.getElementById('drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('show'); };
document.getElementById('close-drawer').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };
document.getElementById('drawer-overlay').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };

let currentPlan = localStorage.getItem('currentPlan') || 'canonical';
const plans = {
    'canonical': { name: 'Canonical', startBook: 1, endBook: 66 },
    'nt-90': { name: 'New Testament', startBook: 40, endBook: 66 },
    'ot-180': { name: 'Old Testament', startBook: 1, endBook: 39 }
};

async function initPlans() {
    await data.loadAllData();
    buildCalendar();
}

function selectPlan(plan) {
    currentPlan = plan;
    localStorage.setItem('currentPlan', plan);
    buildCalendar();
    alert('Plan selected: ' + plans[plan].name + '.');
}

function buildCalendar() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    const today = new Date().getDate();
    for (let d = 1; d <= 30; d++) {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        div.textContent = d;
        if (d <= today) div.classList.add('read');
        grid.appendChild(div);
    }
}
initPlans();
