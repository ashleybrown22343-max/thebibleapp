// ============================================================
// BIBELI MIMO – IMAGE STUDIO LOGIC (FINAL – MOBILE-SAFE)
// ============================================================

const data = window.bibleData;

// ---------- CONSTANTS ----------
const FONTS = [
    { name: 'Poppins', css: "'Poppins', sans-serif" },
    { name: 'Playfair Display', css: "'Playfair Display', serif" },
    { name: 'Lora', css: "'Lora', serif" },
    { name: 'Cormorant Garamond', css: "'Cormorant Garamond', serif" },
    { name: 'Inter', css: "'Inter', sans-serif" },
    { name: 'Merriweather', css: "'Merriweather', serif" },
    { name: 'Josefin Sans', css: "'Josefin Sans', sans-serif" },
    { name: 'Great Vibes', css: "'Great Vibes', cursive" }
];

const GRADIENTS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)','linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)','linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)','linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)','linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)','linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)','linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    'linear-gradient(135deg, #c79081 0%, #dfa579 100%)','linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)','linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
    'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)','linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
    'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)','linear-gradient(135deg, #0f2027 0%, #203a43 100%, #2c5364 100%)'
];

const SOLIDS = ['#1a237e','#b71c1c','#4a148c','#e65100','#00695c','#1565c0','#212121','#880e4f','#33691e','#0d47a1','#5d4037','#01579b','#2e7d32','#37474f','#8e24aa','#00838f','#bf360c','#3e2723','#64b5f6','#FFD700'];

const PHOTO_FILES = [
    "29897.webp","29903.webp","29873.webp","29921.webp","29935.webp","29882.webp","29899.webp","29905.webp","29838.webp","29871.webp",
    "29942.webp","29937.webp","29917.webp","29878.webp","29929.webp","29866.webp","29939.webp","29933.webp","29966.webp","29964.webp",
    "29974.webp","29893.webp","29931.webp","29915.webp","29884.webp","29876.webp","29901.webp","29880.webp","29865.webp","29970.webp",
    "29925.webp","29907.webp","29968.webp","29895.webp","29927.webp","29875.webp","29972.webp","29868.webp","29913.webp","29889.webp",
    "29956.webp","29909.webp","29911.webp","29923.webp","29962.webp","29944.webp","29891.webp","29960.webp","29946.webp","29886.webp",
    "29919.webp","29958.webp"
];
const PHOTO_URLS = PHOTO_FILES.map(function (f) { return '/backgrounds/' + f; });

const COLOR_PRESETS = [
    '#ffffff','#000000','#f59e0b','#ef4444','#10b981','#3b82f6','#8b5cf6','#ec4899',
    '#fbbf24','#14b8a6','#6366f1','#a855f7','#84cc16','#06b6d4','#f97316','#dc2626',
    '#0f172a','#1a237e','#b71c1c','#4a148c','#e65100','#00695c','#1565c0','#880e4f'
];

const TOPICS = {
    'faith': ['faith','believe','trust'],
    'love': ['love','loved','loving','beloved'],
    'hope': ['hope','hoping','expectation'],
    'peace': ['peace','peaceful','rest','still'],
    'strength': ['strength','strong','mighty','power'],
    'prayer': ['pray','prayer','praying','supplication'],
    'praise': ['praise','worship','glorify','honor'],
    'joy': ['joy','rejoice','glad','happy'],
    'wisdom': ['wisdom','wise','understanding','knowledge'],
    'protection': ['protect','refuge','shield','defend','shelter'],
    'healing': ['heal','healing','health','restore','cure'],
    'forgiveness': ['forgive','forgiveness','pardon','mercy'],
    'grace': ['grace','gracious','favor'],
    'mercy': ['mercy','merciful','compassion'],
    'salvation': ['salvation','save','saved','redeem','redeemed']
};

const QUICK_PRESETS = [
    { name: 'Clean',    font: 'Inter',             fontSize: 26, lineSpacing: 1.7, letterSpacing: 0, padding: 12, align: 'center', vpos: 'center', shadow: 'none',   textColor: '#ffffff', refShow: true,  refPos: 'top',    refShadow: 'none', borderWidth: 0, radius: 0 },
    { name: 'Bold',     font: 'Poppins',           fontSize: 32, lineSpacing: 1.6, letterSpacing: 0, padding: 10, align: 'center', vpos: 'center', shadow: 'strong', textColor: '#ffffff', refShow: true,  refPos: 'top',    refShadow: 'soft', borderWidth: 0, radius: 0 },
    { name: 'Classic',  font: 'Playfair Display',  fontSize: 28, lineSpacing: 1.8, letterSpacing: 0, padding: 12, align: 'center', vpos: 'center', shadow: 'soft',   textColor: '#ffffff', refShow: true,  refPos: 'top',    refShadow: 'none', borderWidth: 0, radius: 0 },
    { name: 'Modern',   font: 'Poppins',           fontSize: 24, lineSpacing: 1.7, letterSpacing: 0, padding: 14, align: 'left',   vpos: 'bottom', shadow: 'soft',   textColor: '#ffffff', refShow: true,  refPos: 'bottom', refShadow: 'none', borderWidth: 0, radius: 20 },
    { name: 'Elegant',  font: 'Cormorant Garamond',fontSize: 30, lineSpacing: 1.6, letterSpacing: 1, padding: 14, align: 'center', vpos: 'center', shadow: 'soft',   textColor: '#ffffff', refShow: true,  refPos: 'top',    refShadow: 'none', borderWidth: 2, radius: 0 },
    { name: 'Minimal',  font: 'Inter',             fontSize: 22, lineSpacing: 1.6, letterSpacing: 0, padding: 16, align: 'center', vpos: 'center', shadow: 'none',   textColor: '#ffffff', refShow: false, refPos: 'top',    refShadow: 'none', borderWidth: 0, radius: 0 }
];

// ---------- STATE FACTORY ----------
function createDefaultState() {
    return {
        currentBook: 'GEN',
        currentChapter: 1,
        currentVerse: 1,

        currentCategory: 'photos',
        selectedTemplate: 0,

        ratio: 'square',
        safezone: false,
        borderWidth: 0,
        borderColor: '#ffffff',
        radius: 0,

        blur: 0,
        darkOverlay: 0,
        brightness: 100,
        saturation: 100,
        duotoneOn: false,
        duotoneShadow: '#1a237e',
        duotoneHighlight: '#f59e0b',
        gradientOverlay: false,
        gradientColor: '#1a237e',
        gradientOpacity: 40,
        vignette: 0,

        fontFamily: 'Poppins',
        fontSize: 24,
        lineSpacing: 1.7,
        letterSpacing: 0,
        padding: 10,
        blockGap: 1.5,
        align: 'center',
        vpos: 'center',
        textColor: '#ffffff',
        shadow: 'strong',
        textCase: 'normal',
        yoOpacity: 100,
        enOpacity: 85,

        highlightWord: '',
        highlightColor: '#f59e0b',

        refShow: true,
        refPos: 'top',
        refSize: 14,
        refColor: '#f59e0b',
        refShadow: 'soft',
        refMatchFont: true,
        refFontFamily: 'Playfair Display',

        secText: '',
        secPos: 'above',
        secSize: 12,
        secOpacity: 85,
        secColor: '#ffffff',

        logoData: null,
        logoPos: 'br',
        logoSize: 60,
        logoOpacity: 100,
        logoBorderOn: false,
        logoBorderColor: '#ffffff',
        logoBgOn: false,
        logoBgColor: '#ffffff',

        showYoruba: true,
        showEnglish: true,

        exportFormat: 'png',
        exportQuality: 90,
        exportRes: '1080'
    };
}

// ---------- GLOBAL STATE ----------
let state = createDefaultState();
let undoStack = [];
let currentModalType = null;
let colorTarget = null;
let pickedColor = { h: 0, s: 0, l: 100 };
let fontTarget = 'main';
let confirmCallback = null;

let favorites = [];
let recentVerses = [];
let recentTemplates = [];
let presets = [];
let brandColors = [];

try { favorites = JSON.parse(localStorage.getItem('studio_favorites') || '[]'); } catch (e) { favorites = []; }
try { recentVerses = JSON.parse(localStorage.getItem('studio_recents_verse') || '[]'); } catch (e) { recentVerses = []; }
try { recentTemplates = JSON.parse(localStorage.getItem('studio_recent_templates') || '[]'); } catch (e) { recentTemplates = []; }
try { presets = JSON.parse(localStorage.getItem('studio_presets') || '[]'); } catch (e) { presets = []; }
try { brandColors = JSON.parse(localStorage.getItem('studio_brand_colors') || '[]'); } catch (e) { brandColors = []; }

// ============================================================
// INIT
// ============================================================
async function initStudio() {
    try {
        await data.loadAllData();
    } catch (e) {
        document.getElementById('preview-text').textContent = 'Failed to load Bible data.';
        return;
    }

    // Wait max 2s for fonts
    try {
        await Promise.race([
            document.fonts.ready,
            new Promise(function (resolve) { setTimeout(resolve, 2000); })
        ]);
    } catch (e) {}

    // Apply URL params
    applyUrlParams();

    // Load saved logo
    const savedLogo = localStorage.getItem('studio_logo');
    if (savedLogo) state.logoData = savedLogo;

    // Load export prefs
    state.exportFormat = localStorage.getItem('studio_export_format') || 'png';
    state.exportQuality = parseInt(localStorage.getItem('studio_export_quality') || '90');
    state.exportRes = localStorage.getItem('studio_export_res') || '1080';

    // Attach all events
    attachHeaderEvents();
    attachTabEvents();
    attachVerseEvents();
    attachTemplateEvents();
    attachDesignEvents();
    attachExtrasEvents();
    attachPresetEvents();
    attachColorPickerEvents();
    attachExportModalEvents();
    attachZoomEvents();
    attachOnboardingEvents();
    attachConfirmModalEvents();

    // Sync everything
    syncAllUI();
    renderRecentVerses();
    renderRecentTemplates();
    renderTemplates();
    renderPresets();
    renderBrandColors();
    renderQuickPresets();
    showPreviewLogo();
    updatePreview();

    // Auto-save drafts
    setInterval(saveDraft, 5000);

    // Onboarding
    if (!localStorage.getItem('studio_onboarded')) {
        document.getElementById('onboarding-overlay').classList.add('show');
    }
}

function applyUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const b = params.get('b');
    const c = params.get('c');
    const v = params.get('v');
    if (b && c && v) {
        const idx = data.codes.indexOf(b.toUpperCase());
        if (idx >= 0) {
            state.currentBook = data.codes[idx];
            state.currentChapter = parseInt(c);
            state.currentVerse = parseInt(v);
        }
    }
}

function saveDraft() {
    try { localStorage.setItem('studio_draft', JSON.stringify(state)); } catch (e) {}
}

// ============================================================
// UNDO
// ============================================================
function pushUndo() {
    try {
        undoStack.push(JSON.parse(JSON.stringify(state)));
        if (undoStack.length > 5) undoStack.shift();
    } catch (e) {}
}

function performUndo() {
    if (undoStack.length === 0) { showToast('Nothing to undo', 'info'); return; }
    state = undoStack.pop();
    syncAllUI();
    updatePreview();
    showPreviewLogo();
    showToast('Undone', 'info');
}

// ============================================================
// SYNC UI
// ============================================================
function syncAllUI() {
    updatePickerButtons();

    document.querySelectorAll('#ratio-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.ratio === state.ratio); });
    document.getElementById('safezone-toggle').classList.toggle('active', state.safezone);
    document.getElementById('preview-safezone').style.display = state.safezone ? 'block' : 'none';

    document.getElementById('border-slider').value = state.borderWidth;
    document.getElementById('border-label').textContent = state.borderWidth;
    document.getElementById('border-color-btn').style.background = state.borderColor;
    document.getElementById('radius-slider').value = state.radius;
    document.getElementById('radius-label').textContent = state.radius;

    document.getElementById('blur-slider').value = state.blur;
    document.getElementById('blur-label').textContent = state.blur;
    document.getElementById('dark-slider').value = state.darkOverlay;
    document.getElementById('dark-label').textContent = state.darkOverlay;
    document.getElementById('brightness-slider').value = state.brightness;
    document.getElementById('brightness-label').textContent = state.brightness;
    document.getElementById('saturation-slider').value = state.saturation;
    document.getElementById('saturation-label').textContent = state.saturation;
    document.getElementById('duotone-toggle').classList.toggle('active', state.duotoneOn);
    document.getElementById('duotone-shadow-btn').style.background = state.duotoneShadow;
    document.getElementById('duotone-highlight-btn').style.background = state.duotoneHighlight;
    document.getElementById('gradient-overlay-toggle').classList.toggle('active', state.gradientOverlay);
    document.getElementById('gradient-color-btn').style.background = state.gradientColor;
    document.getElementById('gradient-opacity-slider').value = state.gradientOpacity;
    document.getElementById('vignette-slider').value = state.vignette;
    document.getElementById('vignette-label').textContent = state.vignette;

    document.getElementById('font-family-btn').textContent = state.fontFamily;
    document.getElementById('font-size-slider').value = state.fontSize;
    document.getElementById('font-size-label').textContent = state.fontSize;
    document.getElementById('line-spacing-slider').value = state.lineSpacing;
    document.getElementById('line-spacing-label').textContent = state.lineSpacing;
    document.getElementById('letter-spacing-slider').value = state.letterSpacing;
    document.getElementById('letter-spacing-label').textContent = state.letterSpacing;
    document.getElementById('padding-slider').value = state.padding;
    document.getElementById('padding-label').textContent = state.padding;
    document.getElementById('block-gap-slider').value = state.blockGap;
    document.getElementById('block-gap-label').textContent = state.blockGap;
    document.getElementById('text-color-btn').style.background = state.textColor;
    document.getElementById('yo-opacity-slider').value = state.yoOpacity;
    document.getElementById('yo-opacity-label').textContent = state.yoOpacity;
    document.getElementById('en-opacity-slider').value = state.enOpacity;
    document.getElementById('en-opacity-label').textContent = state.enOpacity;
    document.getElementById('highlight-word-input').value = state.highlightWord;
    document.getElementById('highlight-color-btn').style.background = state.highlightColor;

    document.querySelectorAll('#align-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.align === state.align); });
    document.querySelectorAll('#vpos-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.vpos === state.vpos); });
    document.querySelectorAll('#shadow-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.shadow === state.shadow); });
    document.querySelectorAll('#case-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.case === state.textCase); });

    document.getElementById('ref-toggle').classList.toggle('active', state.refShow);
    document.querySelectorAll('#refpos-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.refpos === state.refPos); });
    document.getElementById('ref-size-slider').value = state.refSize;
    document.getElementById('ref-size-label').textContent = state.refSize;
    document.getElementById('ref-color-btn').style.background = state.refColor;
    document.querySelectorAll('#ref-shadow-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.refshadow === state.refShadow); });
    document.getElementById('ref-match-font-toggle').classList.toggle('active', state.refMatchFont);
    document.getElementById('ref-font-btn').style.display = state.refMatchFont ? 'none' : 'block';
    document.getElementById('ref-font-btn').textContent = state.refFontFamily;

    document.getElementById('secondary-input').value = state.secText;
    document.querySelectorAll('#secpos-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.secpos === state.secPos); });
    document.getElementById('sec-size-slider').value = state.secSize;
    document.getElementById('sec-size-label').textContent = state.secSize;
    document.getElementById('sec-opacity-slider').value = state.secOpacity;
    document.getElementById('sec-opacity-label').textContent = state.secOpacity;
    document.getElementById('sec-color-btn').style.background = state.secColor;

    document.querySelectorAll('#logo-pos-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.logopos === state.logoPos); });
    document.getElementById('logo-size-slider').value = state.logoSize;
    document.getElementById('logo-size-label').textContent = state.logoSize;
    document.getElementById('logo-opacity-slider').value = state.logoOpacity;
    document.getElementById('logo-opacity-label').textContent = state.logoOpacity;
    document.getElementById('logo-border-toggle').classList.toggle('active', state.logoBorderOn);
    document.getElementById('logo-border-color-btn').style.background = state.logoBorderColor;
    document.getElementById('logo-bg-toggle').classList.toggle('active', state.logoBgOn);
    document.getElementById('logo-bg-color-btn').style.background = state.logoBgColor;

    document.getElementById('lang-yo-toggle').classList.toggle('active', state.showYoruba);
    document.getElementById('lang-en-toggle').classList.toggle('active', state.showEnglish);
}

// ============================================================
// HEADER
// ============================================================
function attachHeaderEvents() {
    document.getElementById('undo-btn').onclick = performUndo;

    document.getElementById('reset-all-btn').onclick = function () {
        openConfirm('Reset All?', 'All your current edits will be cleared. This cannot be undone.', function () {
            pushUndo();
            state = createDefaultState();
            var savedLogo = localStorage.getItem('studio_logo');
            if (savedLogo) state.logoData = savedLogo;
            syncAllUI();
            updatePreview();
            showPreviewLogo();
            showToast('Reset to defaults', 'success');
        });
    };

    document.getElementById('save-preset-btn').onclick = function () {
        document.getElementById('preset-name-input').value = '';
        document.getElementById('preset-modal').classList.add('show');
    };
}

// ============================================================
// TAB SWITCHING
// ============================================================
function attachTabEvents() {
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
            document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
            btn.classList.add('active');
            document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
        };
    });
}

// ============================================================
// VERSE EVENTS
// ============================================================
function attachVerseEvents() {
    document.getElementById('pick-book').onclick = function () { openVerseModal('book'); };
    document.getElementById('pick-chapter').onclick = function () { openVerseModal('chapter'); };
    document.getElementById('pick-verse').onclick = function () { openVerseModal('verse'); };

    document.getElementById('random-verse').onclick = function () {
        var v = data.yoruba[Math.floor(Math.random() * data.yoruba.length)];
        pushUndo();
        state.currentBook = data.codes[v.book - 1];
        state.currentChapter = v.chapter;
        state.currentVerse = v.verse;
        updatePickerButtons();
        updatePreview();
        saveRecentVerse();
    };

    document.getElementById('votd-fill').onclick = function () {
        var day = new Date().getDate();
        var v = data.yoruba.find(function (x) { return x.book === 19 && x.chapter === day && x.verse === 1; }) || data.yoruba[day * 500];
        if (v) {
            pushUndo();
            state.currentBook = data.codes[v.book - 1];
            state.currentChapter = v.chapter;
            state.currentVerse = v.verse;
            updatePickerButtons();
            updatePreview();
            saveRecentVerse();
        }
    };

    document.getElementById('lang-yo-toggle').onclick = function () {
        pushUndo();
        state.showYoruba = !state.showYoruba;
        this.classList.toggle('active', state.showYoruba);
        updatePreview();
    };
    document.getElementById('lang-en-toggle').onclick = function () {
        pushUndo();
        state.showEnglish = !state.showEnglish;
        this.classList.toggle('active', state.showEnglish);
        updatePreview();
    };

    // Topic search
    var searchTimer;
    document.getElementById('topic-search').addEventListener('input', function (e) {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            var q = e.target.value.toLowerCase().trim();
            var resultsEl = document.getElementById('topic-results');
            resultsEl.innerHTML = '';
            if (q.length < 2) return;

            var keywords = [q];
            for (var topic in TOPICS) {
                if (topic.indexOf(q) >= 0 || q.indexOf(topic) >= 0) {
                    keywords = keywords.concat(TOPICS[topic]);
                }
            }

            var found = [];
            var seen = {};
            for (var i = 0; i < data.english.length; i++) {
                var v = data.english[i];
                var text = (v.text || '').toLowerCase();
                for (var ki = 0; ki < keywords.length; ki++) {
                    if (text.indexOf(keywords[ki]) >= 0) {
                        var key = v.book + '-' + v.chapter + '-' + v.verse;
                        if (!seen[key]) {
                            seen[key] = true;
                            found.push(v);
                        }
                        break;
                    }
                }
                if (found.length >= 30) break;
            }

            if (found.length === 0) {
                resultsEl.innerHTML = '<span class="hint-text">No verses found</span>';
                return;
            }

            found.forEach(function (v) {
                var chip = document.createElement('span');
                chip.className = 'topic-result-item';
                chip.textContent = data.englishNames[v.book - 1] + ' ' + v.chapter + ':' + v.verse;
                chip.onclick = function () {
                    pushUndo();
                    state.currentBook = data.codes[v.book - 1];
                    state.currentChapter = v.chapter;
                    state.currentVerse = v.verse;
                    updatePickerButtons();
                    updatePreview();
                    saveRecentVerse();
                    document.getElementById('topic-search').value = '';
                    resultsEl.innerHTML = '';
                };
                resultsEl.appendChild(chip);
            });
        }, 300);
    });
}

function updatePickerButtons() {
    var idx = data.codes.indexOf(state.currentBook);
    document.getElementById('pick-book').textContent = data.englishNames[idx] || 'Genesis';
    document.getElementById('pick-chapter').textContent = state.currentChapter;
    document.getElementById('pick-verse').textContent = state.currentVerse;
}

function openVerseModal(type) {
    currentModalType = type;
    var modal = document.getElementById('verse-modal');
    var list = document.getElementById('verse-modal-list');
    var title = document.getElementById('verse-modal-title');
    list.innerHTML = '';

    if (type === 'book') {
        title.textContent = 'Select Book';
        data.englishNames.forEach(function (name, i) {
            var div = document.createElement('div');
            div.className = 'modal-list-item';
            div.textContent = name;
            div.onclick = function () {
                pushUndo();
                state.currentBook = data.codes[i];
                state.currentChapter = 1;
                state.currentVerse = 1;
                updatePickerButtons();
                closeVerseModal();
                updatePreview();
                saveRecentVerse();
            };
            list.appendChild(div);
        });
    } else if (type === 'chapter') {
        title.textContent = 'Select Chapter';
        var bookNum = data.codes.indexOf(state.currentBook) + 1;
        var max = Math.max.apply(null, data.yoruba.filter(function (v) { return v.book === bookNum; }).map(function (v) { return v.chapter; }));
        for (var i = 1; i <= max; i++) {
            (function (i) {
                var div = document.createElement('div');
                div.className = 'modal-list-item';
                div.textContent = i;
                div.onclick = function () {
                    pushUndo();
                    state.currentChapter = i;
                    state.currentVerse = 1;
                    updatePickerButtons();
                    closeVerseModal();
                    updatePreview();
                    saveRecentVerse();
                };
                list.appendChild(div);
            })(i);
        }
    } else if (type === 'verse') {
        title.textContent = 'Select Verse';
        var bookNum2 = data.codes.indexOf(state.currentBook) + 1;
        var verses = data.yoruba.filter(function (v) { return v.book === bookNum2 && v.chapter === state.currentChapter; });
        verses.forEach(function (v) {
            var div = document.createElement('div');
            div.className = 'modal-list-item';
            var preview = (v.text || '').substring(0, 40);
            div.innerHTML = '<span>' + v.verse + '</span><span class="item-preview">' + preview + '...</span>';
            div.onclick = function () {
                pushUndo();
                state.currentVerse = v.verse;
                updatePickerButtons();
                closeVerseModal();
                updatePreview();
                saveRecentVerse();
            };
            list.appendChild(div);
        });
    }
    modal.classList.add('show');
}

function closeVerseModal() {
    document.getElementById('verse-modal').classList.remove('show');
}

function saveRecentVerse() {
    var key = state.currentBook + '-' + state.currentChapter + '-' + state.currentVerse;
    recentVerses = recentVerses.filter(function (k) { return k !== key; });
    recentVerses.unshift(key);
    recentVerses = recentVerses.slice(0, 10);
    try { localStorage.setItem('studio_recents_verse', JSON.stringify(recentVerses)); } catch (e) {}
    renderRecentVerses();
}

function renderRecentVerses() {
    var el = document.getElementById('recent-verses');
    el.innerHTML = '';
    if (recentVerses.length === 0) {
        el.innerHTML = '<span class="hint-text" style="margin:0;">No recent verses yet</span>';
        return;
    }
    recentVerses.forEach(function (key) {
        var parts = key.split('-');
        var b = parts[0], c = parts[1], v = parts[2];
        var idx = data.codes.indexOf(b);
        if (idx < 0) return;
        var chip = document.createElement('span');
        chip.className = 'recent-chip';
        chip.textContent = data.englishNames[idx] + ' ' + c + ':' + v;
        chip.onclick = function () {
            pushUndo();
            state.currentBook = b;
            state.currentChapter = parseInt(c);
            state.currentVerse = parseInt(v);
            updatePickerButtons();
            updatePreview();
        };
        el.appendChild(chip);
    });
}

// ============================================================
// TEMPLATES
// ============================================================
function attachTemplateEvents() {
    document.querySelectorAll('.tpl-tab').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('.tpl-tab').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.currentCategory = btn.dataset.cat;
            state.selectedTemplate = 0;
            renderTemplates();
            updatePreview();
        };
    });
}

function renderTemplates() {
    var grid = document.getElementById('template-grid');
    grid.innerHTML = '';

    if (state.currentCategory === 'favorites') {
        if (favorites.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;padding:20px;">No favorites yet. Tap the heart on any template.</p>';
            return;
        }
        favorites.forEach(function (tplId) {
            var item = buildTemplateItem(tplId);
            if (item) grid.appendChild(item);
        });
        return;
    }

    var items = [];
    if (state.currentCategory === 'photos') {
        for (var i = 0; i < PHOTO_URLS.length; i++) items.push('photo_' + i);
    } else if (state.currentCategory === 'gradients') {
        for (var j = 0; j < GRADIENTS.length; j++) items.push('grad_' + j);
    } else {
        for (var k = 0; k < SOLIDS.length; k++) items.push('solid_' + k);
    }

    items.forEach(function (tplId) {
        var item = buildTemplateItem(tplId);
        if (item) grid.appendChild(item);
    });
}

function buildTemplateItem(tplId) {
    var div = document.createElement('div');
    div.className = 'template-item';

    var bg = '', idx = 0, cat = '';
    if (tplId.indexOf('photo_') === 0) { cat = 'photos'; idx = parseInt(tplId.split('_')[1]); bg = "url('" + PHOTO_URLS[idx] + "') center/cover"; }
    else if (tplId.indexOf('grad_') === 0) { cat = 'gradients'; idx = parseInt(tplId.split('_')[1]); bg = GRADIENTS[idx]; }
    else if (tplId.indexOf('solid_') === 0) { cat = 'solids'; idx = parseInt(tplId.split('_')[1]); bg = SOLIDS[idx]; }
    else return null;

    div.style.background = bg;
    div.dataset.tplId = tplId;

    if (state.currentCategory === cat && state.selectedTemplate === idx) {
        div.classList.add('selected');
    }

    div.onclick = function () {
        pushUndo();
        state.currentCategory = cat;
        state.selectedTemplate = idx;
        document.querySelectorAll('.template-item').forEach(function (t) { t.classList.remove('selected'); });
        div.classList.add('selected');
        saveRecentTemplate(tplId);
        updatePreview();
    };

    var favBtn = document.createElement('button');
    favBtn.className = 'template-fav';
    if (favorites.indexOf(tplId) >= 0) favBtn.classList.add('active');
    favBtn.innerHTML = '<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    favBtn.onclick = function (e) {
        e.stopPropagation();
        var i = favorites.indexOf(tplId);
        if (i >= 0) {
            favorites.splice(i, 1);
            showToast('Removed from favorites', 'info');
        } else {
            favorites.push(tplId);
            showToast('Added to favorites', 'success');
        }
        try { localStorage.setItem('studio_favorites', JSON.stringify(favorites)); } catch (err) {}
        favBtn.classList.toggle('active');
        if (state.currentCategory === 'favorites') renderTemplates();
    };
    div.appendChild(favBtn);

    return div;
}

function saveRecentTemplate(tplId) {
    recentTemplates = recentTemplates.filter(function (t) { return t !== tplId; });
    recentTemplates.unshift(tplId);
    recentTemplates = recentTemplates.slice(0, 6);
    try { localStorage.setItem('studio_recent_templates', JSON.stringify(recentTemplates)); } catch (e) {}
    renderRecentTemplates();
}

function renderRecentTemplates() {
    var el = document.getElementById('recent-templates');
    el.innerHTML = '';
    if (recentTemplates.length === 0) {
        el.innerHTML = '<span class="hint-text" style="margin:0;">No recent templates</span>';
        return;
    }
    recentTemplates.forEach(function (tplId) {
        var bg = '';
        if (tplId.indexOf('photo_') === 0) bg = "url('" + PHOTO_URLS[parseInt(tplId.split('_')[1])] + "') center/cover";
        else if (tplId.indexOf('grad_') === 0) bg = GRADIENTS[parseInt(tplId.split('_')[1])];
        else if (tplId.indexOf('solid_') === 0) bg = SOLIDS[parseInt(tplId.split('_')[1])];
        var div = document.createElement('div');
        div.className = 'recent-tpl-item';
        div.style.background = bg;
        div.onclick = function () {
            pushUndo();
            if (tplId.indexOf('photo_') === 0) { state.currentCategory = 'photos'; state.selectedTemplate = parseInt(tplId.split('_')[1]); }
            else if (tplId.indexOf('grad_') === 0) { state.currentCategory = 'gradients'; state.selectedTemplate = parseInt(tplId.split('_')[1]); }
            else if (tplId.indexOf('solid_') === 0) { state.currentCategory = 'solids'; state.selectedTemplate = parseInt(tplId.split('_')[1]); }
            renderTemplates();
            updatePreview();
        };
        el.appendChild(div);
    });
}

// ============================================================
// DESIGN EVENTS
// ============================================================
function attachDesignEvents() {
    document.querySelectorAll('#ratio-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#ratio-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.ratio = btn.dataset.ratio;
            updatePreview();
        };
    });

    document.getElementById('safezone-toggle').onclick = function () {
        state.safezone = !state.safezone;
        this.classList.toggle('active', state.safezone);
        document.getElementById('preview-safezone').style.display = state.safezone ? 'block' : 'none';
    };

    document.getElementById('border-slider').oninput = function (e) {
        state.borderWidth = parseInt(e.target.value);
        document.getElementById('border-label').textContent = state.borderWidth;
        updatePreview();
    };
    document.getElementById('border-color-btn').onclick = function () { openColorPicker('border'); };

    document.getElementById('radius-slider').oninput = function (e) {
        state.radius = parseInt(e.target.value);
        document.getElementById('radius-label').textContent = state.radius;
        updatePreview();
    };

    document.getElementById('blur-slider').oninput = function (e) {
        state.blur = parseFloat(e.target.value);
        document.getElementById('blur-label').textContent = state.blur;
        updatePreview();
    };
    document.getElementById('dark-slider').oninput = function (e) {
        state.darkOverlay = parseInt(e.target.value);
        document.getElementById('dark-label').textContent = state.darkOverlay;
        updatePreview();
    };
    document.getElementById('brightness-slider').oninput = function (e) {
        state.brightness = parseInt(e.target.value);
        document.getElementById('brightness-label').textContent = state.brightness;
        updatePreview();
    };
    document.getElementById('saturation-slider').oninput = function (e) {
        state.saturation = parseInt(e.target.value);
        document.getElementById('saturation-label').textContent = state.saturation;
        updatePreview();
    };

    document.getElementById('duotone-toggle').onclick = function () {
        pushUndo();
        state.duotoneOn = !state.duotoneOn;
        this.classList.toggle('active', state.duotoneOn);
        updatePreview();
    };
    document.getElementById('duotone-shadow-btn').onclick = function () { openColorPicker('duotoneShadow'); };
    document.getElementById('duotone-highlight-btn').onclick = function () { openColorPicker('duotoneHighlight'); };

    document.getElementById('gradient-overlay-toggle').onclick = function () {
        pushUndo();
        state.gradientOverlay = !state.gradientOverlay;
        this.classList.toggle('active', state.gradientOverlay);
        updatePreview();
    };
    document.getElementById('gradient-color-btn').onclick = function () { openColorPicker('gradient'); };
    document.getElementById('gradient-opacity-slider').oninput = function (e) {
        state.gradientOpacity = parseInt(e.target.value);
        updatePreview();
    };

    document.getElementById('vignette-slider').oninput = function (e) {
        state.vignette = parseInt(e.target.value);
        document.getElementById('vignette-label').textContent = state.vignette;
        updatePreview();
    };

    document.getElementById('font-family-btn').onclick = function () { openFontModal('main'); };

    document.getElementById('font-size-slider').oninput = function (e) {
        state.fontSize = parseInt(e.target.value);
        document.getElementById('font-size-label').textContent = state.fontSize;
        updatePreview();
    };

    document.getElementById('autofit-btn').onclick = autoFitText;

    document.getElementById('line-spacing-slider').oninput = function (e) {
        state.lineSpacing = parseFloat(e.target.value);
        document.getElementById('line-spacing-label').textContent = state.lineSpacing;
        updatePreview();
    };

    document.getElementById('letter-spacing-slider').oninput = function (e) {
        state.letterSpacing = parseInt(e.target.value);
        document.getElementById('letter-spacing-label').textContent = state.letterSpacing;
        updatePreview();
    };

    document.getElementById('padding-slider').oninput = function (e) {
        state.padding = parseFloat(e.target.value);
        document.getElementById('padding-label').textContent = state.padding;
        updatePreview();
    };

    document.getElementById('block-gap-slider').oninput = function (e) {
        state.blockGap = parseFloat(e.target.value);
        document.getElementById('block-gap-label').textContent = state.blockGap;
        updatePreview();
    };

    document.querySelectorAll('#align-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#align-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.align = btn.dataset.align;
            updatePreview();
        };
    });

    document.querySelectorAll('#vpos-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#vpos-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.vpos = btn.dataset.vpos;
            updatePreview();
        };
    });

    document.getElementById('text-color-btn').onclick = function () { openColorPicker('text'); };

    document.querySelectorAll('#shadow-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#shadow-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.shadow = btn.dataset.shadow;
            updatePreview();
        };
    });

    document.querySelectorAll('#case-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#case-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.textCase = btn.dataset.case;
            updatePreview();
        };
    });

    document.getElementById('yo-opacity-slider').oninput = function (e) {
        state.yoOpacity = parseInt(e.target.value);
        document.getElementById('yo-opacity-label').textContent = state.yoOpacity;
        updatePreview();
    };
    document.getElementById('en-opacity-slider').oninput = function (e) {
        state.enOpacity = parseInt(e.target.value);
        document.getElementById('en-opacity-label').textContent = state.enOpacity;
        updatePreview();
    };

    document.getElementById('highlight-word-input').oninput = function (e) {
        state.highlightWord = e.target.value;
        updatePreview();
    };
    document.getElementById('highlight-color-btn').onclick = function () { openColorPicker('highlight'); };

    document.getElementById('ref-toggle').onclick = function () {
        pushUndo();
        state.refShow = !state.refShow;
        this.classList.toggle('active', state.refShow);
        updatePreview();
    };
    document.querySelectorAll('#refpos-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#refpos-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.refPos = btn.dataset.refpos;
            updatePreview();
        };
    });
    document.getElementById('ref-size-slider').oninput = function (e) {
        state.refSize = parseInt(e.target.value);
        document.getElementById('ref-size-label').textContent = state.refSize;
        updatePreview();
    };
    document.getElementById('ref-color-btn').onclick = function () { openColorPicker('ref'); };
    document.querySelectorAll('#ref-shadow-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#ref-shadow-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.refShadow = btn.dataset.refshadow;
            updatePreview();
        };
    });
    document.getElementById('ref-match-font-toggle').onclick = function () {
        pushUndo();
        state.refMatchFont = !state.refMatchFont;
        this.classList.toggle('active', state.refMatchFont);
        document.getElementById('ref-font-btn').style.display = state.refMatchFont ? 'none' : 'block';
        updatePreview();
    };
    document.getElementById('ref-font-btn').onclick = function () { openFontModal('ref'); };
}

// ============================================================
// AUTO-FIT
// ============================================================
function autoFitText() {
    pushUndo();
    var card = document.getElementById('preview-card');
    var textEl = document.getElementById('preview-text');
    var cardH = card.clientHeight;
    var cardW = card.clientWidth;
    var paddingPx = (state.padding / 100) * cardW;
    var usableH = cardH - (paddingPx * 2);

    var lo = 10, hi = 120, best = 24;
    for (var i = 0; i < 20; i++) {
        var mid = Math.floor((lo + hi) / 2);
        state.fontSize = mid;
        updatePreview();
        var currentH = textEl.scrollHeight + (state.refShow ? state.refSize * 2 : 0);
        if (currentH <= usableH) {
            best = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    state.fontSize = best;
    document.getElementById('font-size-slider').value = best;
    document.getElementById('font-size-label').textContent = best;
    updatePreview();
    showToast('Auto-fit complete', 'success');
}

// ============================================================
// EXTRAS
// ============================================================
function attachExtrasEvents() {
    document.getElementById('secondary-input').oninput = function (e) {
        state.secText = e.target.value;
        updatePreview();
    };
    document.querySelectorAll('#secpos-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#secpos-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.secPos = btn.dataset.secpos;
            updatePreview();
        };
    });
    document.getElementById('sec-size-slider').oninput = function (e) {
        state.secSize = parseInt(e.target.value);
        document.getElementById('sec-size-label').textContent = state.secSize;
        updatePreview();
    };
    document.getElementById('sec-opacity-slider').oninput = function (e) {
        state.secOpacity = parseInt(e.target.value);
        document.getElementById('sec-opacity-label').textContent = state.secOpacity;
        updatePreview();
    };
    document.getElementById('sec-color-btn').onclick = function () { openColorPicker('sec'); };

    document.getElementById('logo-upload-btn').onclick = function () { document.getElementById('logo-input').click(); };
    document.getElementById('logo-input').onchange = function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            pushUndo();
            state.logoData = ev.target.result;
            try { localStorage.setItem('studio_logo', state.logoData); } catch (err) {}
            showPreviewLogo();
            updatePreview();
            showToast('Logo uploaded', 'success');
        };
        reader.readAsDataURL(file);
    };
    document.getElementById('logo-remove-btn').onclick = function () {
        pushUndo();
        state.logoData = null;
        try { localStorage.removeItem('studio_logo'); } catch (e) {}
        document.getElementById('preview-logo-wrap').style.display = 'none';
        updatePreview();
        showToast('Logo removed', 'info');
    };
    document.querySelectorAll('#logo-pos-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#logo-pos-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.logoPos = btn.dataset.logopos;
            updatePreview();
        };
    });
    document.getElementById('logo-size-slider').oninput = function (e) {
        state.logoSize = parseInt(e.target.value);
        document.getElementById('logo-size-label').textContent = state.logoSize;
        updatePreview();
    };
    document.getElementById('logo-opacity-slider').oninput = function (e) {
        state.logoOpacity = parseInt(e.target.value);
        document.getElementById('logo-opacity-label').textContent = state.logoOpacity;
        updatePreview();
    };
    document.getElementById('logo-border-toggle').onclick = function () {
        state.logoBorderOn = !state.logoBorderOn;
        this.classList.toggle('active', state.logoBorderOn);
        updatePreview();
    };
    document.getElementById('logo-border-color-btn').onclick = function () { openColorPicker('logoBorder'); };
    document.getElementById('logo-bg-toggle').onclick = function () {
        state.logoBgOn = !state.logoBgOn;
        this.classList.toggle('active', state.logoBgOn);
        updatePreview();
    };
    document.getElementById('logo-bg-color-btn').onclick = function () { openColorPicker('logoBg'); };
}

function showPreviewLogo() {
    var wrap = document.getElementById('preview-logo-wrap');
    if (!state.logoData) {
        wrap.style.display = 'none';
        return;
    }
    document.getElementById('preview-logo-img').src = state.logoData;
    wrap.style.display = 'flex';
}

// ============================================================
// PRESETS
// ============================================================
function attachPresetEvents() {
    document.getElementById('preset-confirm-btn').onclick = function () {
        var name = document.getElementById('preset-name-input').value.trim() || 'Untitled';
        var preset = {
            id: Date.now(),
            name: name,
            fontFamily: state.fontFamily,
            fontSize: state.fontSize,
            lineSpacing: state.lineSpacing,
            letterSpacing: state.letterSpacing,
            padding: state.padding,
            blockGap: state.blockGap,
            align: state.align,
            vpos: state.vpos,
            textColor: state.textColor,
            shadow: state.shadow,
            textCase: state.textCase,
            yoOpacity: state.yoOpacity,
            enOpacity: state.enOpacity,
            refShow: state.refShow,
            refPos: state.refPos,
            refSize: state.refSize,
            refColor: state.refColor,
            refShadow: state.refShadow,
            borderWidth: state.borderWidth,
            borderColor: state.borderColor,
            radius: state.radius,
            darkOverlay: state.darkOverlay,
            vignette: state.vignette,
            ratio: state.ratio,
            thumbnailBg: getCurrentBackgroundCSS()
        };
        presets.unshift(preset);
        presets = presets.slice(0, 20);
        try { localStorage.setItem('studio_presets', JSON.stringify(presets)); } catch (e) {}
        closePresetModal();
        renderPresets();
        showToast('Preset saved', 'success');
    };
}

function closePresetModal() {
    document.getElementById('preset-modal').classList.remove('show');
}

function renderPresets() {
    var el = document.getElementById('presets-list');
    el.innerHTML = '';
    if (presets.length === 0) {
        el.innerHTML = '<p class="hint-text">No presets saved yet.</p>';
        return;
    }
    presets.forEach(function (p) {
        var div = document.createElement('div');
        div.className = 'preset-item';

        var thumb = document.createElement('div');
        thumb.className = 'preset-thumb';
        if (p.thumbnailBg) thumb.style.background = p.thumbnailBg;

        var info = document.createElement('div');
        info.className = 'preset-item-info';
        info.innerHTML = '<div class="preset-item-name">' + p.name + '</div><div class="preset-item-meta">' + p.fontFamily + ' &middot; ' + p.fontSize + 'px</div>';

        var actions = document.createElement('div');
        actions.className = 'preset-item-actions';

        var loadBtn = document.createElement('button');
        loadBtn.className = 'preset-mini-btn load';
        loadBtn.textContent = 'Load';
        loadBtn.onclick = function () { loadPreset(p); };

        var delBtn = document.createElement('button');
        delBtn.className = 'preset-mini-btn delete';
        delBtn.textContent = 'Delete';
        delBtn.onclick = function () { deletePreset(p.id); };

        actions.appendChild(loadBtn);
        actions.appendChild(delBtn);

        div.appendChild(thumb);
        div.appendChild(info);
        div.appendChild(actions);
        el.appendChild(div);
    });
}

function loadPreset(p) {
    pushUndo();
    state.fontFamily = p.fontFamily;
    state.fontSize = p.fontSize;
    state.lineSpacing = p.lineSpacing;
    state.letterSpacing = p.letterSpacing;
    state.padding = p.padding;
    state.blockGap = p.blockGap;
    state.align = p.align;
    state.vpos = p.vpos;
    state.textColor = p.textColor;
    state.shadow = p.shadow;
    state.textCase = p.textCase;
    state.yoOpacity = p.yoOpacity;
    state.enOpacity = p.enOpacity;
    state.refShow = p.refShow;
    state.refPos = p.refPos;
    state.refSize = p.refSize;
    state.refColor = p.refColor;
    state.refShadow = p.refShadow;
    state.borderWidth = p.borderWidth;
    state.borderColor = p.borderColor;
    state.radius = p.radius;
    state.darkOverlay = p.darkOverlay;
    state.vignette = p.vignette;
    state.ratio = p.ratio;

    syncAllUI();
    updatePreview();
    showToast('Preset loaded', 'success');
}

function deletePreset(id) {
    presets = presets.filter(function (p) { return p.id !== id; });
    try { localStorage.setItem('studio_presets', JSON.stringify(presets)); } catch (e) {}
    renderPresets();
    showToast('Preset deleted', 'info');
}

// ============================================================
// COLOR PICKER
// ============================================================
function openColorPicker(target) {
    colorTarget = target;
    var current = '#ffffff';
    if (target === 'text') current = state.textColor;
    else if (target === 'ref') current = state.refColor;
    else if (target === 'border') current = state.borderColor;
    else if (target === 'gradient') current = state.gradientColor;
    else if (target === 'highlight') current = state.highlightColor;
    else if (target === 'sec') current = state.secColor;
    else if (target === 'duotoneShadow') current = state.duotoneShadow;
    else if (target === 'duotoneHighlight') current = state.duotoneHighlight;
    else if (target === 'logoBorder') current = state.logoBorderColor;
    else if (target === 'logoBg') current = state.logoBgColor;

    var rgb = hexToRgb(current);
    pickedColor = rgbToHsl(rgb.r, rgb.g, rgb.b);

    document.getElementById('hue-slider').value = pickedColor.h;
    document.getElementById('sat-slider').value = pickedColor.s;
    document.getElementById('light-slider').value = pickedColor.l;
    document.getElementById('hue-label').textContent = pickedColor.h;
    document.getElementById('sat-label').textContent = pickedColor.s;
    document.getElementById('light-label').textContent = pickedColor.l;
    document.getElementById('hex-input').value = current;
    updateColorPreview();

    var swatchEl = document.getElementById('color-swatches');
    swatchEl.innerHTML = '';
    brandColors.forEach(function (c) {
        var btn = document.createElement('button');
        btn.className = 'color-swatch';
        btn.style.background = c;
        btn.style.borderColor = '#f59e0b';
        btn.onclick = function () { applySwatchColor(c); };
        swatchEl.appendChild(btn);
    });
    COLOR_PRESETS.forEach(function (c) {
        var btn = document.createElement('button');
        btn.className = 'color-swatch';
        btn.style.background = c;
        btn.onclick = function () { applySwatchColor(c); };
        swatchEl.appendChild(btn);
    });

    document.getElementById('color-modal').classList.add('show');
}

function applySwatchColor(c) {
    var rgb = hexToRgb(c);
    pickedColor = rgbToHsl(rgb.r, rgb.g, rgb.b);
    document.getElementById('hue-slider').value = pickedColor.h;
    document.getElementById('sat-slider').value = pickedColor.s;
    document.getElementById('light-slider').value = pickedColor.l;
    document.getElementById('hue-label').textContent = pickedColor.h;
    document.getElementById('sat-label').textContent = pickedColor.s;
    document.getElementById('light-label').textContent = pickedColor.l;
    document.getElementById('hex-input').value = c;
    updateColorPreview();
}

function attachColorPickerEvents() {
    document.getElementById('hue-slider').oninput = function (e) {
        pickedColor.h = parseInt(e.target.value);
        document.getElementById('hue-label').textContent = pickedColor.h;
        updateColorPreview();
    };
    document.getElementById('sat-slider').oninput = function (e) {
        pickedColor.s = parseInt(e.target.value);
        document.getElementById('sat-label').textContent = pickedColor.s;
        updateColorPreview();
    };
    document.getElementById('light-slider').oninput = function (e) {
        pickedColor.l = parseInt(e.target.value);
        document.getElementById('light-label').textContent = pickedColor.l;
        updateColorPreview();
    };
    document.getElementById('hex-input').oninput = function (e) {
        var v = e.target.value.trim();
        var isValidHex = (v.length === 7 && v.charAt(0) === '#');
        if (isValidHex) {
            for (var i = 1; i < 7; i++) {
                var c = v.charAt(i).toLowerCase();
                var isHex = (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f');
                if (!isHex) { isValidHex = false; break; }
            }
        }
        if (isValidHex) {
            var rgb = hexToRgb(v);
            pickedColor = rgbToHsl(rgb.r, rgb.g, rgb.b);
            document.getElementById('hue-slider').value = pickedColor.h;
            document.getElementById('sat-slider').value = pickedColor.s;
            document.getElementById('light-slider').value = pickedColor.l;
            updateColorPreview();
        }
    };
    document.getElementById('color-confirm-btn').onclick = function () {
        pushUndo();
        var hex = hslToHex(pickedColor.h, pickedColor.s, pickedColor.l);
        applyColor(colorTarget, hex);
        closeColorModal();
    };
    document.getElementById('save-brand-color-btn').onclick = function () {
        var hex = hslToHex(pickedColor.h, pickedColor.s, pickedColor.l);
        if (brandColors.indexOf(hex) < 0) {
            brandColors.push(hex);
            brandColors = brandColors.slice(-3);
            try { localStorage.setItem('studio_brand_colors', JSON.stringify(brandColors)); } catch (e) {}
            renderBrandColors();
            showToast('Brand color saved', 'success');
        } else {
            showToast('Already saved', 'info');
        }
    };
}

function updateColorPreview() {
    var hex = hslToHex(pickedColor.h, pickedColor.s, pickedColor.l);
    document.getElementById('color-preview').style.background = hex;
    document.getElementById('hex-input').value = hex;
}

function applyColor(target, hex) {
    if (target === 'text') { state.textColor = hex; document.getElementById('text-color-btn').style.background = hex; }
    else if (target === 'ref') { state.refColor = hex; document.getElementById('ref-color-btn').style.background = hex; }
    else if (target === 'border') { state.borderColor = hex; document.getElementById('border-color-btn').style.background = hex; }
    else if (target === 'gradient') { state.gradientColor = hex; document.getElementById('gradient-color-btn').style.background = hex; }
    else if (target === 'highlight') { state.highlightColor = hex; document.getElementById('highlight-color-btn').style.background = hex; }
    else if (target === 'sec') { state.secColor = hex; document.getElementById('sec-color-btn').style.background = hex; }
    else if (target === 'duotoneShadow') { state.duotoneShadow = hex; document.getElementById('duotone-shadow-btn').style.background = hex; }
    else if (target === 'duotoneHighlight') { state.duotoneHighlight = hex; document.getElementById('duotone-highlight-btn').style.background = hex; }
    else if (target === 'logoBorder') { state.logoBorderColor = hex; document.getElementById('logo-border-color-btn').style.background = hex; }
    else if (target === 'logoBg') { state.logoBgColor = hex; document.getElementById('logo-bg-color-btn').style.background = hex; }
    updatePreview();
}

function closeColorModal() {
    document.getElementById('color-modal').classList.remove('show');
}

function renderBrandColors() {
    var el = document.getElementById('brand-colors-row');
    el.innerHTML = '';
    for (var i = 0; i < 3; i++) {
        (function (i) {
            var slot = document.createElement('div');
            slot.className = 'brand-color-slot';
            if (brandColors[i]) {
                slot.style.background = brandColors[i];
                slot.classList.add('filled');
                slot.onclick = function () { openColorPicker('text'); };
            } else {
                slot.textContent = '+';
                slot.onclick = function () {
                    showToast('Pick a color and save as brand', 'info');
                    openColorPicker('text');
                };
            }
            el.appendChild(slot);
        })(i);
    }
}

// ============================================================
// FONT MODAL
// ============================================================
function openFontModal(target) {
    fontTarget = target;
    var list = document.getElementById('font-list');
    var title = document.getElementById('font-modal-title');
    title.textContent = target === 'ref' ? 'Reference Font' : 'Font Family';
    list.innerHTML = '';
    FONTS.forEach(function (f) {
        var div = document.createElement('div');
        div.className = 'font-item';
        div.innerHTML = '<div style="font-family:' + f.css + ';">The Lord is my shepherd</div><div class="font-item-name">' + f.name + '</div>';
        div.onclick = function () {
            pushUndo();
            if (fontTarget === 'ref') {
                state.refFontFamily = f.name;
                document.getElementById('ref-font-btn').textContent = f.name;
            } else {
                state.fontFamily = f.name;
                document.getElementById('font-family-btn').textContent = f.name;
            }
            closeFontModal();
            updatePreview();
        };
        list.appendChild(div);
    });
    document.getElementById('font-modal').classList.add('show');
}
function closeFontModal() {
    document.getElementById('font-modal').classList.remove('show');
}

// ============================================================
// QUICK PRESETS
// ============================================================
function renderQuickPresets() {
    var el = document.getElementById('quick-presets');
    el.innerHTML = '';
    QUICK_PRESETS.forEach(function (qp) {
        var btn = document.createElement('button');
        btn.className = 'quick-preset-btn';
        btn.textContent = qp.name;
        btn.onclick = function () {
            pushUndo();
            state.fontFamily = qp.font;
            state.fontSize = qp.fontSize;
            state.lineSpacing = qp.lineSpacing;
            state.letterSpacing = qp.letterSpacing;
            state.padding = qp.padding;
            state.align = qp.align;
            state.vpos = qp.vpos;
            state.shadow = qp.shadow;
            state.textColor = qp.textColor;
            state.refShow = qp.refShow;
            state.refPos = qp.refPos;
            state.refShadow = qp.refShadow;
            state.borderWidth = qp.borderWidth;
            state.radius = qp.radius;
            syncAllUI();
            updatePreview();
            showToast(qp.name + ' style applied', 'success');
        };
        el.appendChild(btn);
    });
}

// ============================================================
// PREVIEW HELPERS
// ============================================================
function getCurrentBackgroundCSS() {
    var bg = '';
    if (state.currentCategory === 'photos') {
        bg = "url('" + PHOTO_URLS[state.selectedTemplate] + "') center/cover";
    } else if (state.currentCategory === 'gradients') {
        bg = GRADIENTS[state.selectedTemplate];
    } else if (state.currentCategory === 'solids') {
        bg = SOLIDS[state.selectedTemplate];
    } else if (state.currentCategory === 'favorites') {
        var tplId = favorites[state.selectedTemplate];
        if (tplId) {
            if (tplId.indexOf('photo_') === 0) bg = "url('" + PHOTO_URLS[parseInt(tplId.split('_')[1])] + "') center/cover";
            else if (tplId.indexOf('grad_') === 0) bg = GRADIENTS[parseInt(tplId.split('_')[1])];
            else if (tplId.indexOf('solid_') === 0) bg = SOLIDS[parseInt(tplId.split('_')[1])];
        }
    }
    return bg;
}

function getPreviewBackgroundURL() {
    if (state.currentCategory === 'photos') return PHOTO_URLS[state.selectedTemplate];
    if (state.currentCategory === 'favorites') {
        var tplId = favorites[state.selectedTemplate];
        if (tplId && tplId.indexOf('photo_') === 0) return PHOTO_URLS[parseInt(tplId.split('_')[1])];
    }
    return null;
}

function getVerseText() {
    var bookNum = data.codes.indexOf(state.currentBook) + 1;
    var yo = data.yoruba.find(function (x) { return x.book === bookNum && x.chapter === state.currentChapter && x.verse === state.currentVerse; });
    var en = data.englishMap[bookNum + '-' + state.currentChapter + '-' + state.currentVerse] || '';
    return { yo: yo ? yo.text : '', en: en };
}

function getReferenceText() {
    return data.englishNames[data.codes.indexOf(state.currentBook)] + ' ' + state.currentChapter + ':' + state.currentVerse;
}

function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    var str = String(s);
    var out = '';
    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (c === '&') out += '&amp;';
        else if (c === '<') out += '&lt;';
        else if (c === '>') out += '&gt;';
        else if (c === '"') out += '&quot;';
        else out += c;
    }
    return out;
}

function buildTextHTML() {
    var texts = getVerseText();
    var yo = texts.yo;
    var en = texts.en;
    var word = state.highlightWord.trim();

    function hl(text) {
        if (!word || !text) return escapeHtml(text || '');
        var escaped = escapeHtml(text);
        var lowerText = text.toLowerCase();
        var lowerWord = word.toLowerCase();
        var result = '';
        var pos = 0;
        while (true) {
            var idx = lowerText.indexOf(lowerWord, pos);
            if (idx < 0) {
                result += escaped.substring(pos);
                break;
            }
            result += escaped.substring(pos, idx);
            result += '<span class="hl" style="background:' + state.highlightColor + ';color:#fff;">' + escaped.substring(idx, idx + word.length) + '</span>';
            pos = idx + word.length;
        }
        return result;
    }

    var html = '';
    if (state.showYoruba && yo) {
        html += '<div class="text-yo" style="opacity:' + (state.yoOpacity / 100) + ';">' + hl(yo) + '</div>';
    }
    if (state.showEnglish && en) {
        html += '<div class="text-en" style="opacity:' + (state.enOpacity / 100) + ';">' + hl(en) + '</div>';
    }
    return html || 'Verse not found';
}

function getShadowCSS(style) {
    if (style === 'none') return 'none';
    if (style === 'soft') return '0 2px 8px rgba(0,0,0,0.4)';
    if (style === 'strong') return '0 4px 15px rgba(0,0,0,0.75)';
    if (style === 'glow') return '0 0 25px rgba(255,255,255,0.7), 0 0 50px rgba(255,255,255,0.3)';
    if (style === 'outline') return '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
    return 'none';
}

// ============================================================
// PREVIEW UPDATE
// ============================================================
function updatePreview() {
    var card = document.getElementById('preview-card');
    var bg = document.getElementById('preview-bg');
    var bgFilter = document.getElementById('preview-bg-filter');
    var darkOv = document.getElementById('preview-dark-overlay');
    var duotoneOv = document.getElementById('preview-duotone');
    var gradOv = document.getElementById('preview-gradient-overlay');
    var vig = document.getElementById('preview-vignette');
    var textEl = document.getElementById('preview-text');
    var refEl = document.getElementById('preview-ref');
    var secEl = document.getElementById('preview-secondary');
    var logoWrap = document.getElementById('preview-logo-wrap');
    var logoBg = document.getElementById('preview-logo-bg');
    var deco = document.getElementById('preview-decoration');
    var content = card.querySelector('.preview-content');

    card.className = 'preview-card ratio-' + state.ratio;

    bg.style.background = getCurrentBackgroundCSS() || '#1a237e';

    var filters = [];
    if (state.brightness !== 100) filters.push('brightness(' + (state.brightness / 100) + ')');
    if (state.saturation !== 100) filters.push('saturate(' + (state.saturation / 100) + ')');
    if (filters.length) {
        bgFilter.style.backdropFilter = filters.join(' ');
        bgFilter.style.webkitBackdropFilter = filters.join(' ');
    } else {
        bgFilter.style.backdropFilter = 'none';
        bgFilter.style.webkitBackdropFilter = 'none';
    }

    bg.style.filter = state.blur > 0 ? 'blur(' + state.blur + 'px)' : 'none';
    darkOv.style.background = 'rgba(0,0,0,' + (state.darkOverlay / 100) + ')';

    if (state.duotoneOn) {
        duotoneOv.style.display = 'block';
        duotoneOv.style.background = 'linear-gradient(45deg, ' + state.duotoneShadow + ', ' + state.duotoneHighlight + ')';
        duotoneOv.style.opacity = '0.55';
    } else {
        duotoneOv.style.display = 'none';
    }

    if (state.gradientOverlay) {
        gradOv.style.display = 'block';
        gradOv.style.background = hexToRgba(state.gradientColor, state.gradientOpacity / 100);
    } else {
        gradOv.style.display = 'none';
    }

    if (state.vignette > 0) {
        vig.style.boxShadow = 'inset 0 0 ' + Math.round(state.vignette * 2.5) + 'px ' + Math.round(state.vignette * 1.5) + 'px rgba(0,0,0,' + (state.vignette / 100) + ')';
    } else {
        vig.style.boxShadow = 'none';
    }

    if (state.borderWidth > 0) {
        deco.style.border = state.borderWidth + 'px solid ' + state.borderColor;
    } else {
        deco.style.border = 'none';
    }
    card.style.borderRadius = state.radius + 'px';

    var fontCss = "'Poppins', sans-serif";
    for (var i = 0; i < FONTS.length; i++) {
        if (FONTS[i].name === state.fontFamily) { fontCss = FONTS[i].css; break; }
    }
    textEl.style.fontFamily = fontCss;
    textEl.style.fontSize = state.fontSize + 'px';
    textEl.style.lineHeight = state.lineSpacing;
    textEl.style.letterSpacing = state.letterSpacing + 'px';
    textEl.style.color = state.textColor;
    textEl.style.textAlign = state.align;
    textEl.style.textShadow = getShadowCSS(state.shadow);
    textEl.className = 'preview-text';
    if (state.textCase === 'upper') textEl.classList.add('upper');
    if (state.textCase === 'title') textEl.classList.add('title');
    textEl.innerHTML = buildTextHTML();

    if (state.refShow) {
        refEl.style.display = 'block';
        refEl.textContent = getReferenceText();
        var refFont = fontCss;
        if (!state.refMatchFont) {
            for (var j = 0; j < FONTS.length; j++) {
                if (FONTS[j].name === state.refFontFamily) { refFont = FONTS[j].css; break; }
            }
        }
        refEl.style.fontFamily = refFont;
        refEl.style.fontSize = state.refSize + 'px';
        refEl.style.color = state.refColor;
        refEl.style.textShadow = getShadowCSS(state.refShadow);
        refEl.style.order = state.refPos === 'top' ? -1 : 10;
    } else {
        refEl.style.display = 'none';
    }

    content.style.padding = state.padding + '%';

    if (state.vpos === 'top') content.style.justifyContent = 'flex-start';
    else if (state.vpos === 'bottom') content.style.justifyContent = 'flex-end';
    else content.style.justifyContent = 'center';

    var gapPx = state.fontSize * state.blockGap * 0.5;
    textEl.querySelectorAll('.text-en').forEach(function (el) { el.style.marginTop = gapPx + 'px'; });

    if (state.secText) {
        secEl.style.display = 'block';
        secEl.textContent = state.secText;
        secEl.style.fontSize = state.secSize + 'px';
        secEl.style.color = state.secColor;
        secEl.style.opacity = state.secOpacity / 100;
        secEl.style.order = state.secPos === 'top' ? -2 : (state.secPos === 'bottom' ? 20 : 0);
    } else {
        secEl.style.display = 'none';
    }

    if (state.logoData) {
        logoWrap.style.display = 'flex';
        logoWrap.dataset.pos = state.logoPos;
        logoWrap.style.width = state.logoSize + 'px';
        logoWrap.style.height = state.logoSize + 'px';
        logoWrap.style.opacity = state.logoOpacity / 100;
        logoWrap.style.border = state.logoBorderOn ? '2px solid ' + state.logoBorderColor : 'none';
        logoBg.style.display = state.logoBgOn ? 'block' : 'none';
        logoBg.style.background = state.logoBgColor;
        document.getElementById('preview-logo-img').src = state.logoData;
    } else {
        logoWrap.style.display = 'none';
    }
}

// ============================================================
// ZOOM
// ============================================================
function attachZoomEvents() {
    document.getElementById('preview-card').addEventListener('click', function () {
        var clone = document.getElementById('preview-card').cloneNode(true);
        clone.id = 'zoom-preview-clone';
        var zoomContent = document.getElementById('zoom-content');
        zoomContent.innerHTML = '';
        zoomContent.appendChild(clone);
        document.getElementById('zoom-modal').classList.add('show');
    });
}
function closeZoomModal() {
    document.getElementById('zoom-modal').classList.remove('show');
    document.getElementById('zoom-content').innerHTML = '';
}

// ============================================================
// ONBOARDING
// ============================================================
function attachOnboardingEvents() {
    var slide = 1;
    var total = 3;
    var nextBtn = document.getElementById('onboarding-next-btn');
    var skipBtn = document.getElementById('onboarding-skip-btn');

    function showSlide(n) {
        for (var i = 1; i <= total; i++) {
            document.getElementById('ob-slide-' + i).style.display = (i === n) ? 'block' : 'none';
            var dot = document.querySelector('.onboarding-dots .dot[data-slide="' + i + '"]');
            if (dot) dot.classList.toggle('active', i === n);
        }
        nextBtn.textContent = (n === total) ? 'Got it' : 'Next';
    }

    nextBtn.onclick = function () {
        if (slide < total) {
            slide++;
            showSlide(slide);
        } else {
            document.getElementById('onboarding-overlay').classList.remove('show');
            localStorage.setItem('studio_onboarded', '1');
        }
    };
    skipBtn.onclick = function () {
        document.getElementById('onboarding-overlay').classList.remove('show');
        localStorage.setItem('studio_onboarded', '1');
    };
    document.querySelectorAll('.onboarding-dots .dot').forEach(function (dot) {
        dot.onclick = function () {
            slide = parseInt(dot.dataset.slide);
            showSlide(slide);
        };
    });
    showSlide(1);
}

// ============================================================
// CONFIRM MODAL
// ============================================================
function attachConfirmModalEvents() {
    document.getElementById('confirm-cancel-btn').onclick = function () { closeConfirmModal(); };
    document.getElementById('confirm-ok-btn').onclick = function () {
        if (confirmCallback) confirmCallback();
        closeConfirmModal();
    };
}
function openConfirm(title, message, cb) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    confirmCallback = cb;
    document.getElementById('confirm-modal').classList.add('show');
}
function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('show');
    confirmCallback = null;
}

// ============================================================
// EXPORT MODAL
// ============================================================
function attachExportModalEvents() {
    document.getElementById('export-open-btn').onclick = function () {
        document.querySelectorAll('#format-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.format === state.exportFormat); });
        document.querySelectorAll('#resolution-group .opt-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.res === state.exportRes); });
        document.getElementById('jpg-quality-slider').value = state.exportQuality;
        document.getElementById('jpg-quality-label').textContent = state.exportQuality;
        document.getElementById('jpg-quality-row').style.display = state.exportFormat === 'jpg' ? 'block' : 'none';
        updateExportEstimate();
        document.getElementById('export-modal').classList.add('show');
    };

    document.querySelectorAll('#format-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#format-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.exportFormat = btn.dataset.format;
            document.getElementById('jpg-quality-row').style.display = state.exportFormat === 'jpg' ? 'block' : 'none';
            updateExportEstimate();
        };
    });

    document.querySelectorAll('#resolution-group .opt-btn').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#resolution-group .opt-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.exportRes = btn.dataset.res;
            updateExportEstimate();
        };
    });

    document.getElementById('jpg-quality-slider').oninput = function (e) {
        state.exportQuality = parseInt(e.target.value);
        document.getElementById('jpg-quality-label').textContent = state.exportQuality;
        updateExportEstimate();
    };

    document.getElementById('export-download-btn').onclick = function () {
        try { localStorage.setItem('studio_export_format', state.exportFormat); } catch (e) {}
        try { localStorage.setItem('studio_export_quality', state.exportQuality); } catch (e) {}
        try { localStorage.setItem('studio_export_res', state.exportRes); } catch (e) {}
        saveExportState();
        window.location.href = '/studio/export';
    };
}

function updateExportEstimate() {
    var res = parseInt(state.exportRes);
    var pixels = res * res * 1.5;
    var sizeMB;
    if (state.exportFormat === 'jpg') {
        sizeMB = (pixels * (state.exportQuality / 100) * 0.00000025).toFixed(2);
    } else {
        sizeMB = (pixels * 0.0000007).toFixed(2);
    }
    document.getElementById('export-estimate').textContent = 'Estimated size: ~' + sizeMB + ' MB';
}

function closeExportModal() {
    document.getElementById('export-modal').classList.remove('show');
}

// ============================================================
// SAVE EXPORT STATE
// ============================================================
function saveExportState() {
    var texts = getVerseText();
    var backgroundURL = getPreviewBackgroundURL();
    var bgGradient = null;
    var bgSolid = null;

    if (state.currentCategory === 'gradients' ||
        (state.currentCategory === 'favorites' && favorites[state.selectedTemplate] && favorites[state.selectedTemplate].indexOf('grad_') === 0)) {
        bgGradient = getCurrentBackgroundCSS();
    }
    if (state.currentCategory === 'solids' ||
        (state.currentCategory === 'favorites' && favorites[state.selectedTemplate] && favorites[state.selectedTemplate].indexOf('solid_') === 0)) {
        bgSolid = getCurrentBackgroundCSS();
    }

    var exportData = {
        verseYoruba: texts.yo,
        verseEnglish: texts.en,
        referenceText: getReferenceText(),
        backgroundURL: backgroundURL,
        bgGradient: bgGradient,
        bgSolid: bgSolid,
        settings: JSON.parse(JSON.stringify(state)),
        exportFormat: state.exportFormat,
        exportQuality: state.exportQuality,
        exportRes: state.exportRes
    };

    try { localStorage.setItem('studio_export_state', JSON.stringify(exportData)); } catch (e) {}
}

// ============================================================
// TOAST
// ============================================================
function showToast(message, type) {
    if (!type) type = 'info';
    var container = document.getElementById('toast-container');
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
        toast.classList.add('out');
        setTimeout(function () { toast.remove(); }, 300);
    }, 2200);
}

// ============================================================
// COLOR HELPERS
// ============================================================
function hexToRgb(hex) {
    if (!hex || hex.length < 7) return { r: 255, g: 255, b: 255 };
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    function toHex(v) { return Math.round((v + m) * 255).toString(16).padStart(2, '0'); }
    return '#' + toHex(r) + toHex(g) + toHex(b);
}
function hexToRgba(hex, alpha) {
    var rgb = hexToRgb(hex);
    return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
}

// ============================================================
// START
// ============================================================
initStudio();
