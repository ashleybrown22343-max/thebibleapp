// Settings Page Logic (All Features from Original app.js)
document.getElementById('menu-btn').onclick = () => { document.getElementById('drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('show'); };
document.getElementById('close-drawer').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };
document.getElementById('drawer-overlay').onclick = () => { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('show'); };

// State from localStorage
let currentLineSpacing = parseFloat(localStorage.getItem('lineSpacing') || '1.5');
let currentVerseSpacing = parseFloat(localStorage.getItem('verseSpacing') || '1.5');
let isRedLetter = localStorage.getItem('redLetter') === 'true';

// Load initial values
document.getElementById('font-size-slider').value = localStorage.getItem('fontSize') || '100';
document.getElementById('font-size-label').textContent = localStorage.getItem('fontSize') + '%' || '100%';
document.getElementById('line-spacing-slider').value = currentLineSpacing;
document.getElementById('line-spacing-label').textContent = currentLineSpacing;
document.getElementById('verse-spacing-slider').value = currentVerseSpacing;
document.getElementById('verse-spacing-label').textContent = currentVerseSpacing;

// Update functions
function updateSettingsPreview() {
    const p = document.getElementById('settings-preview-text');
    const val = localStorage.getItem('fontSize') || '100';
    const spacing = localStorage.getItem('lineSpacing') || '1.5';
    p.style.fontSize = val + '%';
    p.style.lineHeight = spacing;
}

// Font Style
document.getElementById('settings-font-btn').onclick = function(){
    document.body.classList.toggle('serif');
    this.textContent = document.body.classList.contains('serif') ? 'OFF' : 'ON';
};

// Font Size
document.getElementById('font-size-slider').addEventListener('input', (e) => {
    const val = e.target.value;
    localStorage.setItem('fontSize', val);
    document.getElementById('font-size-label').textContent = val + '%';
    updateSettingsPreview();
});

// Line Spacing
document.getElementById('line-spacing-slider').addEventListener('input', (e) => {
    const val = e.target.value;
    localStorage.setItem('lineSpacing', val);
    document.getElementById('line-spacing-label').textContent = val;
    updateSettingsPreview();
});

// Verse Spacing
document.getElementById('verse-spacing-slider').addEventListener('input', (e) => {
    const val = e.target.value;
    localStorage.setItem('verseSpacing', val);
    document.getElementById('verse-spacing-label').textContent = val;
});

// Red Letter Mode
document.getElementById('settings-red-btn').onclick = function(){
    isRedLetter = !isRedLetter;
    localStorage.setItem('redLetter', isRedLetter);
    this.textContent = isRedLetter ? 'ON' : 'OFF';
    this.classList.toggle('active', isRedLetter);
};

// Dark Mode
document.getElementById('settings-theme-btn').onclick = function(){
    document.body.classList.toggle('dark');
    this.textContent = document.body.classList.contains('dark') ? 'ON' : 'OFF';
    this.classList.toggle('active', document.body.classList.contains('dark'));
};

// Church Mode
document.getElementById('settings-church-btn').onclick = function(){
    document.body.classList.toggle('church');
    this.textContent = document.body.classList.contains('church') ? 'ON' : 'OFF';
};

// Initialize Preview
updateSettingsPreview();
