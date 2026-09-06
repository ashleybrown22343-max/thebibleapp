// Settings Page Logic
document.getElementById('menu-btn').onclick = () => { document.getElementById('drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('show'); };
document.getElementById('close-drawer').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };
document.getElementById('drawer-overlay').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };

document.getElementById('theme-btn').onclick = function(){
    document.body.classList.toggle('dark');
    this.textContent = document.body.classList.contains('dark') ? 'ON' : 'OFF';
};

document.getElementById('church-btn').onclick = function(){
    document.body.classList.toggle('church');
    this.textContent = document.body.classList.contains('church') ? 'ON' : 'OFF';
};

document.getElementById('font-btn').onclick = function(){
    document.body.classList.toggle('serif');
    this.textContent = document.body.classList.contains('serif') ? 'Serif' : 'Sans';
};
