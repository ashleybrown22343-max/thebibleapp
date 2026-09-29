// ============================================================
// BIBELI MIMO – VIDEO STUDIO (full rewrite)
// ============================================================

const data = window.bibleData;

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
const PHOTO_FILES = ["29897.webp","29903.webp","29873.webp","29921.webp","29935.webp","29882.webp","29899.webp","29905.webp","29838.webp","29871.webp","29942.webp","29937.webp","29917.webp","29878.webp","29929.webp","29866.webp","29939.webp","29933.webp","29966.webp","29964.webp","29974.webp","29893.webp","29931.webp","29915.webp","29884.webp","29876.webp","29901.webp","29880.webp","29865.webp","29970.webp","29925.webp","29907.webp","29968.webp","29895.webp","29927.webp","29875.webp","29972.webp","29868.webp","29913.webp","29889.webp","29956.webp","29909.webp","29911.webp","29923.webp","29962.webp","29944.webp","29891.webp","29960.webp","29946.webp","29886.webp","29919.webp","29958.webp"];
const PHOTO_URLS = PHOTO_FILES.map(function (f) { return '/backgrounds/' + f; });

const SWATCH_PRESETS = ['#ffffff','#000000','#f59e0b','#ef4444','#10b981','#3b82f6','#8b5cf6','#ec4899'];
const COLOR_PRESETS = ['#ffffff','#000000','#f59e0b','#ef4444','#10b981','#3b82f6','#8b5cf6','#ec4899','#fbbf24','#14b8a6','#6366f1','#a855f7','#84cc16','#06b6d4','#f97316','#dc2626'];

const TOPICS = {
    'faith': ['faith','believe','trust'], 'love': ['love','loved','loving','beloved'],
    'hope': ['hope','hoping','expectation'], 'peace': ['peace','peaceful','rest','still'],
    'strength': ['strength','strong','mighty','power'], 'prayer': ['pray','prayer','praying','supplication'],
    'praise': ['praise','worship','glorify','honor'], 'joy': ['joy','rejoice','glad','happy'],
    'wisdom': ['wisdom','wise','understanding','knowledge'], 'protection': ['protect','refuge','shield','defend','shelter'],
    'healing': ['heal','healing','health','restore','cure'], 'forgiveness': ['forgive','forgiveness','pardon','mercy'],
    'grace': ['grace','gracious','favor'], 'mercy': ['mercy','merciful','compassion'],
    'salvation': ['salvation','save','saved','redeem','redeemed']
};

function createState() {
    return {
        currentBook: 'GEN', currentChapter: 1, currentVerse: 1,
        primaryLang: 'yoruba', secondaryLang: 'english',
        currentCategory: 'photos', selectedTemplate: 0,
        bgImageData: null, bgPosition: 'center', bgOpacity: 100, bgBlurFill: true,
        ratio: 'story', borderWidth: 0, borderColor: '#ffffff', radius: 0,
        blur: 0, darkOverlay: 0, brightness: 100, saturation: 100,
        duotoneOn: false, duotoneShadow: '#1a237e', duotoneHighlight: '#f59e0b',
        gradientOverlay: false, gradientColor: '#1a237e', gradientOpacity: 40, vignette: 0,
        fontFamily: 'Poppins', fontSize: 24, fontWeight: '700',
        lineSpacing: 1.7, letterSpacing: 0, padding: 10, blockGap: 1.5,
        align: 'center', vpos: 'center', textColor: '#ffffff', shadow: 'strong', textCase: 'normal',
        highlightWord: '', highlightColor: '#f59e0b',
        refShow: true, refPos: 'top', refSize: 14, refColor: '#f59e0b', refShadow: 'soft',
        refMatchFont: true, refFontFamily: 'Playfair Display',
        secText: '', secPos: 'above', secSize: 12, secOpacity: 85, secColor: '#ffffff',
        logoData: null, logoPos: 'br', logoSize: 60, logoOpacity: 100,
        logoBorderOn: false, logoBorderColor: '#ffffff', logoBgOn: false, logoBgColor: '#ffffff',
        watermarkOn: true,
        duration: 15, fps: 30, resolution: '1080',
        textMotion: 'fade-up', bgMotion: 'ken-in', refMotion: 'fade', logoMotion: 'fade-end',
        motionSpeed: 'medium', motionEasing: 'ease-out',
        audioData: null, audioVolume: 80, audioFadeIn: 1, audioFadeOut: 1, audioLoop: true
    };
}

let state = createState();
let undoStack = [];
let redoStack = [];
let favorites = [];
let recentVerses = [];
let previewCanvas = null;
let previewCtx = null;
let previewRenderW = 0;
let previewRenderH = 0;
let isPlaying = false;
let playStartTime = 0;
let playStartT = 0;
let playRAF = null;
let scrubTime = 0;
let renderedBlob = null;
let renderedFilename = '';
let renderedURL = null;
let activeLangMenuTarget = null;
let colorTarget = null;
let pickedColor = { h: 0, s: 0, l: 100 };

try { favorites = JSON.parse(localStorage.getItem('studio_favorites') || '[]'); } catch (e) { favorites = []; }
try { recentVerses = JSON.parse(localStorage.getItem('studio_recents_verse') || '[]'); } catch (e) { recentVerses = []; }

// ---------- INIT ----------
async function init() {
    try { await data.loadAllData(); } catch (e) { showToast('Failed to load Bible data', 'error'); return; }

    try {
        var draftRaw = localStorage.getItem('studio_draft');
        if (draftRaw) {
            var draft = JSON.parse(draftRaw);
            for (var k in draft) {
                if (Object.prototype.hasOwnProperty.call(state, k)) state[k] = draft[k];
            }
        }
    } catch (e) {}

    var savedLogo = localStorage.getItem('studio_logo');
    if (savedLogo) state.logoData = savedLogo;

    previewCanvas = document.getElementById('video-canvas');
    previewCtx = previewCanvas.getContext('2d');

    attachHeaderEvents();
    attachSheetEvents();
    attachVerseEvents();
    attachMotionEvents();
    attachLookEvents();
    attachTypeEvents();
    attachMoreEvents();
    attachModalEvents();
    attachTimelineEvents();
    attachSuccessEvents();
    attachLangMenuGlobal();

    renderFontStrip();
    renderSwatches('text-swatches', 'text');
    renderSwatches('highlight-swatches', 'highlight');
    renderFilmstrip();
    renderRecentVerses();

    syncAllUI();
    resizePreview();
    window.addEventListener('resize', resizePreview);
    window.addEventListener('orientationchange', function () { setTimeout(resizePreview, 200); });

    await renderPreviewAtTime(0);
    setInterval(saveDraft, 5000);
}

function saveDraft() {
    try {
        var d = JSON.parse(JSON.stringify(state));
        delete d.bgImageData;
        delete d.audioData;
        localStorage.setItem('studio_draft', JSON.stringify(d));
    } catch (e) {}
}

// ---------- UNDO ----------
function pushUndo() {
    try {
        var snap = JSON.parse(JSON.stringify(state));
        if (snap.bgImageData) snap.bgImageData = state.bgImageData ? '[img]' : null;
        if (snap.audioData) snap.audioData = state.audioData ? '[audio]' : null;
        undoStack.push(snap);
        if (undoStack.length > 30) undoStack.shift();
        redoStack = [];
    } catch (e) {}
}
function performUndo() {
    if (!undoStack.length) { showToast('Nothing to undo', 'info'); return; }
    redoStack.push(JSON.parse(JSON.stringify(state)));
    var prev = undoStack.pop();
    if (prev.bgImageData === '[img]') prev.bgImageData = state.bgImageData;
    if (prev.audioData === '[audio]') prev.audioData = state.audioData;
    state = prev;
    syncAllUI(); renderFilmstrip(); renderFontStrip(); renderRecentVerses(); resizePreview();
    renderPreviewAtTime(scrubTime);
    showToast('Undone', 'info');
}
function performRedo() {
    if (!redoStack.length) { showToast('Nothing to redo', 'info'); return; }
    undoStack.push(JSON.parse(JSON.stringify(state)));
    var next = redoStack.pop();
    if (next.bgImageData === '[img]') next.bgImageData = state.bgImageData;
    if (next.audioData === '[audio]') next.audioData = state.audioData;
    state = next;
    syncAllUI(); renderFilmstrip(); renderFontStrip(); renderRecentVerses(); resizePreview();
    renderPreviewAtTime(scrubTime);
    showToast('Redone', 'info');
}

// ---------- PREVIEW CANVAS ----------
function resizePreview() {
    var wrap = document.getElementById('preview-wrap');
    if (!wrap) return;
    wrap.className = 'video-preview-wrap ratio-' + state.ratio;

    var rect = wrap.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cxW = Math.max(320, Math.round(rect.width * dpr));
    var cxH = Math.max(320, Math.round(rect.height * dpr));
    previewRenderW = cxW;
    previewRenderH = cxH;
    previewCanvas.width = cxW;
    previewCanvas.height = cxH;
    renderPreviewAtTime(scrubTime);
}

function computeTargetSize() {
    var resW = parseInt(state.resolution) || 1080;
    var ratioMap = { square: 1, portrait: 4/5, story: 9/16, landscape: 16/9 };
    var r = ratioMap[state.ratio] || 9/16;
    var W, H;
    if (r <= 1) { W = resW; H = Math.round(resW / r); }
    else { H = resW; W = Math.round(resW * r); }
    W = W % 2 ? W + 1 : W;
    H = H % 2 ? H + 1 : H;
    return { W: W, H: H };
}

async function renderPreviewAtTime(t) {
    var motion = computeMotion(t, state.duration);
    var canvas = await window.RenderEngine.render({
        state: state,
        verseYoruba: getVerse(state.primaryLang),
        verseEnglish: getVerse(state.secondaryLang),
        referenceText: getReferenceText(),
        backgroundURL: getBackgroundURL(),
        bgGradient: getBgGradient(),
        bgSolid: getBgSolid(),
        targetW: previewRenderW || 540,
        targetH: previewRenderH || 960,
        previewW: 350,
        motion: motion
    });
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);
}

// ---------- MOTION MATH ----------
function easeFn(kind, x) {
    if (x < 0) x = 0; if (x > 1) x = 1;
    if (kind === 'linear') return x;
    if (kind === 'ease-out') return 1 - Math.pow(1 - x, 3);
    if (kind === 'ease-in-out') return x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
    return x;
}
function speedWindow(speed) {
    if (speed === 'slow') return 0.65;
    if (speed === 'fast') return 0.30;
    return 0.45;
}

function computeMotion(t, duration) {
    var p = duration > 0 ? Math.min(1, t / duration) : 0;
    var ease = state.motionEasing;
    var win = speedWindow(state.motionSpeed);
    var motion = {};

    // TEXT
    var tm = state.textMotion;
    if (tm === 'none') motion.textOpacity = 1;
    else if (tm === 'fade') motion.textOpacity = easeFn(ease, Math.min(1, p / win));
    else if (tm === 'fade-up') {
        var k = Math.min(1, p / win);
        var e = easeFn(ease, k);
        motion.textOpacity = e;
        motion.textOffsetY = (1 - e) * 40;
    } else if (tm === 'slide-left') {
        var k3 = Math.min(1, p / win);
        var e3 = easeFn(ease, k3);
        motion.textOpacity = Math.min(1, k3 * 1.3);
        motion.textOffsetX = (1 - e3) * 90;
    } else if (tm === 'scale') {
        var k4 = Math.min(1, p / win);
        var e4 = easeFn(ease, k4);
        motion.textOpacity = e4;
        motion.textScale = 0.65 + 0.35 * e4;
    } else if (tm === 'typewriter') {
        var k5 = Math.min(1, p / (win * 1.6));
        var primary = getVerse(state.primaryLang);
        motion.visibleChars = Math.floor(k5 * primary.length);
        motion.textOpacity = 1;
    } else if (tm === 'word') {
        var k6 = Math.min(1, p / (win * 1.8));
        motion.wordReveal = easeFn(ease, k6);
        motion.textOpacity = 1;
    } else motion.textOpacity = 1;

    // BG
    var be = easeFn(ease, p);
    var bm = state.bgMotion;
    if (bm === 'none') motion.bgScale = 1;
    else if (bm === 'ken-in') motion.bgScale = 1 + 0.12 * be;
    else if (bm === 'ken-out') motion.bgScale = 1.12 - 0.12 * be;
    else if (bm === 'pan-right') { motion.bgScale = 1.15; motion.bgOffsetX = -0.5 + be; }
    else if (bm === 'pan-left') { motion.bgScale = 1.15; motion.bgOffsetX = 0.5 - be; }
    else if (bm === 'zoom-out') motion.bgScale = 1.25 - 0.25 * be;

    // REF
    var rm = state.refMotion;
    if (rm === 'none' || rm === 'always') motion.refOpacity = 1;
    else if (rm === 'fade') motion.refOpacity = easeFn(ease, Math.min(1, p / (win * 0.7)));
    else if (rm === 'slide-down') motion.refOpacity = easeFn(ease, Math.min(1, p / (win * 0.7)));
    else if (rm === 'late') motion.refOpacity = easeFn(ease, Math.max(0, Math.min(1, (p - 0.4) / 0.3)));

    // LOGO
    var lm = state.logoMotion;
    if (lm === 'none' || lm === 'always') motion.logoOpacity = 1;
    else if (lm === 'fade-end') motion.logoOpacity = easeFn(ease, Math.max(0, Math.min(1, (p - 0.55) / 0.25)));

    return motion;
}

// ---------- DATA HELPERS ----------
function getVerse(langId) {
    if (langId === 'none' || !langId) return '';
    var bookNum = data.codes.indexOf(state.currentBook) + 1;
    return data.getVerseInLang(langId, bookNum, state.currentChapter, state.currentVerse);
}
function getReferenceText() {
    return data.englishNames[data.codes.indexOf(state.currentBook)] + ' ' + state.currentChapter + ':' + state.currentVerse;
}
function getBackgroundURL() {
    if (state.bgImageData) return state.bgImageData;
    if (state.currentCategory === 'photos' && state.selectedTemplate >= 0) return PHOTO_URLS[state.selectedTemplate];
    return null;
}
function getBgGradient() { return state.currentCategory === 'gradients' ? GRADIENTS[state.selectedTemplate] : null; }
function getBgSolid() { return state.currentCategory === 'solids' ? SOLIDS[state.selectedTemplate] : null; }

// ---------- HEADER ----------
function attachHeaderEvents() {
    document.getElementById('undo-btn').onclick = performUndo;
    document.getElementById('redo-btn').onclick = performRedo;
    document.getElementById('header-export-btn').onclick = openExportModal;
}

function attachSheetEvents() {
    document.querySelectorAll('.chip').forEach(function (btn) {
        btn.onclick = function () {
            var target = btn.dataset.sheet;
            if (btn.classList.contains('active') && !document.getElementById('sheet').classList.contains('collapsed')) {
                document.getElementById('sheet').classList.add('collapsed');
                return;
            }
            document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
            btn.classList.add('active');
            document.querySelectorAll('.sheet-pane').forEach(function (p) { p.classList.remove('active'); });
            document.querySelector('.sheet-pane[data-pane="' + target + '"]').classList.add('active');
            document.getElementById('sheet').classList.remove('collapsed');
            document.getElementById('sheet-content').scrollTop = 0;
        };
    });
    document.getElementById('sheet-handle').onclick = function () {
        document.getElementById('sheet').classList.toggle('collapsed');
    };
}

// ---------- VERSE ----------
function attachVerseEvents() {
    document.getElementById('pick-book').onclick = function () { openVerseModal('book'); };
    document.getElementById('pick-chapter').onclick = function () { openVerseModal('chapter'); };
    document.getElementById('pick-verse').onclick = function () { openVerseModal('verse'); };
    document.getElementById('random-verse').onclick = randomVerse;
    document.getElementById('votd-fill').onclick = function () {
        var day = new Date().getDate();
        var v = data.yoruba.find(function (x) { return x.book === 19 && x.chapter === day && x.verse === 1; }) || data.yoruba[day * 500];
        if (v) {
            pushUndo();
            state.currentBook = data.codes[v.book - 1];
            state.currentChapter = v.chapter;
            state.currentVerse = v.verse;
            updatePickerButtons(); saveRecentVerse();
            renderPreviewAtTime(scrubTime);
        }
    };
    document.getElementById('primary-lang-btn').onclick = function () { toggleLangMenu('primary'); };
    document.getElementById('secondary-lang-btn').onclick = function () { toggleLangMenu('secondary'); };

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
                if (topic.indexOf(q) >= 0 || q.indexOf(topic) >= 0) keywords = keywords.concat(TOPICS[topic]);
            }
            var found = []; var seen = {};
            for (var i = 0; i < data.english.length; i++) {
                var v = data.english[i];
                var text = (v.text || '').toLowerCase();
                for (var ki = 0; ki < keywords.length; ki++) {
                    if (text.indexOf(keywords[ki]) >= 0) {
                        var key = v.book + '-' + v.chapter + '-' + v.verse;
                        if (!seen[key]) { seen[key] = true; found.push(v); }
                        break;
                    }
                }
                if (found.length >= 30) break;
            }
            if (found.length === 0) { resultsEl.innerHTML = '<span class="hint-text">No verses found</span>'; return; }
            found.forEach(function (v) {
                var chip = document.createElement('span');
                chip.className = 'topic-result-item';
                chip.textContent = data.englishNames[v.book - 1] + ' ' + v.chapter + ':' + v.verse;
                chip.onclick = function () {
                    pushUndo();
                    state.currentBook = data.codes[v.book - 1];
                    state.currentChapter = v.chapter;
                    state.currentVerse = v.verse;
                    updatePickerButtons(); saveRecentVerse();
                    document.getElementById('topic-search').value = '';
                    resultsEl.innerHTML = '';
                    renderPreviewAtTime(scrubTime);
                };
                resultsEl.appendChild(chip);
            });
        }, 300);
    });
}


function randomVerse() {
    var v = data.yoruba[Math.floor(Math.random() * data.yoruba.length)];
    pushUndo();
    state.currentBook = data.codes[v.book - 1];
    state.currentChapter = v.chapter;
    state.currentVerse = v.verse;
    updatePickerButtons(); saveRecentVerse();
    renderPreviewAtTime(scrubTime);
}

function syncLangButtons() {
    var getLabel = function (id) {
        if (id === 'none') return 'None';
        var l = data.languages.find(function (x) { return x.id === id; });
        return l ? l.label : id;
    };
    document.getElementById('primary-lang-btn').textContent = getLabel(state.primaryLang);
    document.getElementById('secondary-lang-btn').textContent = getLabel(state.secondaryLang);
}

function updatePickerButtons() {
    var idx = data.codes.indexOf(state.currentBook);
    document.getElementById('pick-book').textContent = data.englishNames[idx] || 'Genesis';
    document.getElementById('pick-chapter').textContent = state.currentChapter;
    document.getElementById('pick-verse').textContent = state.currentVerse;
}

function openVerseModal(type) {
    var list = document.getElementById('verse-modal-list');
    var title = document.getElementById('verse-modal-title');
    list.innerHTML = '';
    if (type === 'book') {
        title.textContent = 'Select book';
        data.englishNames.forEach(function (name, i) {
            var div = document.createElement('div');
            div.className = 'modal-list-item';
            div.textContent = name;
            div.onclick = function () {
                pushUndo();
                state.currentBook = data.codes[i];
                state.currentChapter = 1; state.currentVerse = 1;
                updatePickerButtons(); closeModal('verse-modal'); saveRecentVerse();
                renderPreviewAtTime(scrubTime);
            };
            list.appendChild(div);
        });
    } else if (type === 'chapter') {
        title.textContent = 'Select chapter';
        var bookNum = data.codes.indexOf(state.currentBook) + 1;
        var max = Math.max.apply(null, data.yoruba.filter(function (v) { return v.book === bookNum; }).map(function (v) { return v.chapter; }));
        for (var i = 1; i <= max; i++) {
            (function (i) {
                var div = document.createElement('div');
                div.className = 'modal-list-item';
                div.textContent = i;
                div.onclick = function () {
                    pushUndo();
                    state.currentChapter = i; state.currentVerse = 1;
                    updatePickerButtons(); closeModal('verse-modal'); saveRecentVerse();
                    renderPreviewAtTime(scrubTime);
                };
                list.appendChild(div);
            })(i);
        }
    } else {
        title.textContent = 'Select verse';
        var bookNum2 = data.codes.indexOf(state.currentBook) + 1;
        var verses = data.yoruba.filter(function (v) { return v.book === bookNum2 && v.chapter === state.currentChapter; });
        verses.forEach(function (v) {
            var div = document.createElement('div');
            div.className = 'modal-list-item';
            div.innerHTML = '<span>' + v.verse + '</span><span style="font-size:11px;opacity:0.6;">' + (v.text || '').substring(0, 40) + '…</span>';
            div.onclick = function () {
                pushUndo();
                state.currentVerse = v.verse;
                updatePickerButtons(); closeModal('verse-modal'); saveRecentVerse();
                renderPreviewAtTime(scrubTime);
            };
            list.appendChild(div);
        });
    }
    document.getElementById('verse-modal').classList.add('show');
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
    if (recentVerses.length === 0) { el.innerHTML = '<span class="hint-text">No recent verses yet</span>'; return; }
    recentVerses.forEach(function (key) {
        var parts = key.split('-');
        var idx = data.codes.indexOf(parts[0]);
        if (idx < 0) return;
        var chip = document.createElement('span');
        chip.className = 'recent-chip';
        chip.textContent = data.englishNames[idx] + ' ' + parts[1] + ':' + parts[2];
        chip.onclick = function () {
            pushUndo();
            state.currentBook = parts[0];
            state.currentChapter = parseInt(parts[1]);
            state.currentVerse = parseInt(parts[2]);
            updatePickerButtons();
            renderPreviewAtTime(scrubTime);
        };
        el.appendChild(chip);
    });
}

// ---------- LANGUAGE MENU ----------
function attachLangMenuGlobal() {
    document.addEventListener('pointerdown', closeLangOnOutside, true);
}
function closeLangOnOutside(e) {
    var menu = document.getElementById('lang-menu');
    if (!menu || menu.style.display !== 'block') return;
    if (menu.contains(e.target)) return;
    if (e.target.closest && (e.target.closest('#primary-lang-btn') || e.target.closest('#secondary-lang-btn'))) return;
    e.stopPropagation(); e.preventDefault();
    closeLangMenu();
}
function openLangMenu(which) {
    activeLangMenuTarget = which;
    var btn = document.getElementById(which === 'primary' ? 'primary-lang-btn' : 'secondary-lang-btn');
    var rect = btn.getBoundingClientRect();
    var menu = document.getElementById('lang-menu');
    menu.innerHTML = '';
    var currentValue = which === 'primary' ? state.primaryLang : state.secondaryLang;
    var takenValue = which === 'primary' ? state.secondaryLang : state.primaryLang;
    var options = which === 'primary' ? ['yoruba', 'english'] : ['none', 'yoruba', 'english'];
    options.forEach(function (id) {
        var label = id === 'none' ? 'None' : ((data.languages.find(function (l) { return l.id === id; }) || { label: id }).label);
        var div = document.createElement('div');
        div.className = 'lang-menu-option';
        if (id === currentValue) div.classList.add('active');
        if (id === takenValue) { div.classList.add('disabled'); div.textContent = label + ' — in use'; }
        else div.textContent = label;
        div.onclick = function (e) {
            e.stopPropagation();
            if (id === takenValue) return;
            if (id === currentValue) { closeLangMenu(); return; }
            pushUndo();
            if (which === 'primary') state.primaryLang = id;
            else state.secondaryLang = id;
            syncLangButtons();
            renderPreviewAtTime(scrubTime);
            closeLangMenu();
        };
        menu.appendChild(div);
    });
    menu.style.display = 'block';
    menu.style.top = (rect.bottom + 6) + 'px';
    menu.style.right = Math.max(8, window.innerWidth - rect.right) + 'px';
}
function closeLangMenu() {
    var menu = document.getElementById('lang-menu');
    if (menu) menu.style.display = 'none';
    activeLangMenuTarget = null;
}
function toggleLangMenu(which) {
    if (activeLangMenuTarget === which) closeLangMenu();
    else openLangMenu(which);
}

// ---------- MOTION EVENTS ----------
function attachMotionEvents() {
    function chipGroup(id, key, dataAttr) {
        document.querySelectorAll('#' + id + ' .chip-sm').forEach(function (btn) {
            btn.onclick = function () {
                pushUndo();
                document.querySelectorAll('#' + id + ' .chip-sm').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                state[key] = btn.dataset[dataAttr];
                renderPreviewAtTime(scrubTime);
            };
        });
    }
    chipGroup('text-motion-chips', 'textMotion', 'motion');
    chipGroup('bg-motion-chips', 'bgMotion', 'motion');
    chipGroup('ref-motion-chips', 'refMotion', 'motion');
    chipGroup('logo-motion-chips', 'logoMotion', 'motion');
    chipGroup('motion-speed-chips', 'motionSpeed', 'speed');
    chipGroup('motion-easing-chips', 'motionEasing', 'easing');
}

// ---------- LOOK ----------
function attachLookEvents() {
    document.querySelectorAll('.look-tab').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('.look-tab').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.currentCategory = btn.dataset.cat;
            state.selectedTemplate = 0;
            renderFilmstrip();
            renderPreviewAtTime(scrubTime);
        };
    });
    document.getElementById('bg-upload-btn').onclick = function () { document.getElementById('bg-upload-input').click(); };
    document.getElementById('bg-upload-input').onchange = function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            pushUndo();
            state.bgImageData = ev.target.result;
            document.getElementById('bg-remove-btn').style.display = 'block';
            renderFilmstrip();
            renderPreviewAtTime(scrubTime);
            showToast('Photo uploaded', 'success');
        };
        reader.readAsDataURL(file);
    };
    document.getElementById('bg-remove-btn').onclick = function () {
        pushUndo();
        state.bgImageData = null;
        this.style.display = 'none';
        renderFilmstrip();
        renderPreviewAtTime(scrubTime);
    };
    document.getElementById('bg-blurfill-toggle').onclick = function () {
        state.bgBlurFill = !state.bgBlurFill;
        this.classList.toggle('active', state.bgBlurFill);
        renderPreviewAtTime(scrubTime);
    };
    function slide(id, key, labelId) {
        document.getElementById(id).oninput = function (e) {
            state[key] = parseFloat(e.target.value);
            if (labelId) document.getElementById(labelId).textContent = state[key];
            renderPreviewAtTime(scrubTime);
        };
    }
    slide('bg-opacity-slider', 'bgOpacity', 'bg-opacity-label');
    slide('blur-slider', 'blur', 'blur-label');
    slide('brightness-slider', 'brightness', 'brightness-label');
    slide('dark-slider', 'darkOverlay', 'dark-label');
    slide('vignette-slider', 'vignette', 'vignette-label');
}

function renderFilmstrip() {
    var strip = document.getElementById('filmstrip');
    strip.innerHTML = '';
    var items = [];
    if (state.currentCategory === 'photos') {
        for (var i = 0; i < PHOTO_URLS.length; i++) items.push({ id: 'photo_' + i, bg: "url('" + PHOTO_URLS[i] + "') center/cover" });
    } else if (state.currentCategory === 'gradients') {
        for (var j = 0; j < GRADIENTS.length; j++) items.push({ id: 'grad_' + j, bg: GRADIENTS[j] });
    } else if (state.currentCategory === 'solids') {
        for (var k = 0; k < SOLIDS.length; k++) items.push({ id: 'solid_' + k, bg: SOLIDS[k] });
    } else {
        if (!favorites.length) { strip.innerHTML = '<span class="hint-text" style="padding:20px;text-align:center;width:100%;">No favorites yet.</span>'; return; }
        favorites.forEach(function (id) {
            var bg = '';
            if (id.indexOf('photo_') === 0) bg = "url('" + PHOTO_URLS[parseInt(id.split('_')[1])] + "') center/cover";
            else if (id.indexOf('grad_') === 0) bg = GRADIENTS[parseInt(id.split('_')[1])];
            else if (id.indexOf('solid_') === 0) bg = SOLIDS[parseInt(id.split('_')[1])];
            if (bg) items.push({ id: id, bg: bg });
        });
    }
    if (state.bgImageData) items.unshift({ id: '__uploaded', bg: "url('" + state.bgImageData + "') center/cover" });
    items.forEach(function (item) {
        var div = document.createElement('div');
        div.className = 'film-item';
        div.style.background = item.bg;
        var isSel = false;
        if (item.id === '__uploaded') isSel = state.currentCategory === 'photos' && state.selectedTemplate === -1;
        else if (state.currentCategory === 'favorites') isSel = favorites.indexOf(item.id) === state.selectedTemplate;
        else {
            var pre = state.currentCategory === 'photos' ? 'photo_' : (state.currentCategory === 'gradients' ? 'grad_' : 'solid_');
            isSel = item.id === pre + state.selectedTemplate;
        }
        if (isSel) div.classList.add('selected');
        div.onclick = function () {
            pushUndo();
            if (item.id === '__uploaded') { state.currentCategory = 'photos'; state.selectedTemplate = -1; }
            else if (item.id.indexOf('photo_') === 0) { state.currentCategory = 'photos'; state.selectedTemplate = parseInt(item.id.split('_')[1]); state.bgImageData = null; document.getElementById('bg-remove-btn').style.display = 'none'; }
            else if (item.id.indexOf('grad_') === 0) { state.currentCategory = 'gradients'; state.selectedTemplate = parseInt(item.id.split('_')[1]); state.bgImageData = null; document.getElementById('bg-remove-btn').style.display = 'none'; }
            else if (item.id.indexOf('solid_') === 0) { state.currentCategory = 'solids'; state.selectedTemplate = parseInt(item.id.split('_')[1]); state.bgImageData = null; document.getElementById('bg-remove-btn').style.display = 'none'; }
            renderFilmstrip();
            renderPreviewAtTime(scrubTime);
        };
        strip.appendChild(div);
    });
}

// ---------- TYPE ----------
function attachTypeEvents() {
    document.getElementById('font-size-slider').oninput = function (e) {
        state.fontSize = parseInt(e.target.value);
        document.getElementById('font-size-label').textContent = state.fontSize;
        renderPreviewAtTime(scrubTime);
    };
    document.getElementById('line-spacing-slider').oninput = function (e) {
        state.lineSpacing = parseFloat(e.target.value);
        document.getElementById('line-spacing-label').textContent = state.lineSpacing;
        renderPreviewAtTime(scrubTime);
    };
    document.querySelectorAll('#weight-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#weight-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.fontWeight = btn.dataset.weight;
            renderPreviewAtTime(scrubTime);
        };
    });
    document.querySelectorAll('#pos-grid button').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            var pos = btn.dataset.pos;
            state.align = pos.charAt(1) === 'l' ? 'left' : (pos.charAt(1) === 'r' ? 'right' : 'center');
            state.vpos = pos.charAt(0) === 't' ? 'top' : (pos.charAt(0) === 'b' ? 'bottom' : 'center');
            document.querySelectorAll('#pos-grid button').forEach(function (b) { b.classList.toggle('active', b.dataset.pos === pos); });
            renderPreviewAtTime(scrubTime);
        };
    });
    document.querySelectorAll('#shadow-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#shadow-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.shadow = btn.dataset.shadow;
            renderPreviewAtTime(scrubTime);
        };
    });
    document.getElementById('highlight-word-input').oninput = function (e) {
        state.highlightWord = e.target.value;
        renderPreviewAtTime(scrubTime);
    };
    document.getElementById('text-color-custom-btn').onclick = function () { openColorPicker('text'); };
}

function renderFontStrip() {
    var el = document.getElementById('font-strip');
    el.innerHTML = '';
    FONTS.forEach(function (f) {
        var btn = document.createElement('button');
        btn.className = 'font-chip';
        if (state.fontFamily === f.name) btn.classList.add('active');
        btn.style.fontFamily = f.css;
        btn.textContent = f.name.split(' ')[0];
        btn.onclick = function () {
            pushUndo();
            state.fontFamily = f.name;
            renderFontStrip();
            renderPreviewAtTime(scrubTime);
        };
        el.appendChild(btn);
    });
}

function renderSwatches(elId, target) {
    var el = document.getElementById(elId);
    el.innerHTML = '';
    var current = target === 'text' ? state.textColor : state.highlightColor;
    SWATCH_PRESETS.forEach(function (c) {
        var btn = document.createElement('button');
        btn.style.background = c;
        if (c.toLowerCase() === current.toLowerCase()) btn.classList.add('active');
        btn.onclick = function () {
            pushUndo();
            if (target === 'text') state.textColor = c;
            else state.highlightColor = c;
            renderSwatches(elId, target);
            renderPreviewAtTime(scrubTime);
        };
        el.appendChild(btn);
    });
}

// ---------- MORE ----------
function attachMoreEvents() {
    document.getElementById('duration-slider').oninput = function (e) {
        state.duration = parseInt(e.target.value);
        document.getElementById('duration-label').textContent = state.duration;
        updateTimeDisplay();
        renderPreviewAtTime(scrubTime);
    };
    document.querySelectorAll('#duration-preset-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#duration-preset-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.duration = parseInt(btn.dataset.dur);
            document.getElementById('duration-slider').value = state.duration;
            document.getElementById('duration-label').textContent = state.duration;
            updateTimeDisplay();
            renderPreviewAtTime(scrubTime);
        };
    });
    document.querySelectorAll('#ratio-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#ratio-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.ratio = btn.dataset.ratio;
            resizePreview();
        };
    });
    document.querySelectorAll('#fps-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#fps-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.fps = parseInt(btn.dataset.fps);
        };
    });
    document.querySelectorAll('#resolution-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#resolution-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.resolution = btn.dataset.res;
        };
    });

    document.getElementById('audio-upload-btn').onclick = function () { document.getElementById('audio-input').click(); };
    document.getElementById('audio-input').onchange = function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            pushUndo();
            state.audioData = ev.target.result;
            document.getElementById('audio-upload-label').textContent = file.name.substring(0, 22);
            document.getElementById('audio-remove-btn').style.display = 'block';
            document.getElementById('audio-controls').style.display = 'block';
            showToast('Music uploaded', 'success');
        };
        reader.readAsDataURL(file);
    };
    document.getElementById('audio-remove-btn').onclick = function () {
        pushUndo();
        state.audioData = null;
        document.getElementById('audio-upload-label').textContent = 'Upload music';
        this.style.display = 'none';
        document.getElementById('audio-controls').style.display = 'none';
        document.getElementById('audio-input').value = '';
    };
    document.getElementById('audio-volume-slider').oninput = function (e) {
        state.audioVolume = parseInt(e.target.value);
        document.getElementById('audio-volume-label').textContent = state.audioVolume;
    };
    document.getElementById('audio-fadein-slider').oninput = function (e) {
        state.audioFadeIn = parseFloat(e.target.value);
        document.getElementById('audio-fadein-label').textContent = state.audioFadeIn;
    };
    document.getElementById('audio-fadeout-slider').oninput = function (e) {
        state.audioFadeOut = parseFloat(e.target.value);
        document.getElementById('audio-fadeout-label').textContent = state.audioFadeOut;
    };
    document.getElementById('audio-loop-toggle').onclick = function () {
        state.audioLoop = !state.audioLoop;
        this.classList.toggle('active', state.audioLoop);
    };
    document.getElementById('border-slider').oninput = function (e) {
        state.borderWidth = parseInt(e.target.value);
        document.getElementById('border-label').textContent = state.borderWidth;
        renderPreviewAtTime(scrubTime);
    };
    document.getElementById('border-color-btn').onclick = function () { openColorPicker('border'); };
    document.getElementById('radius-slider').oninput = function (e) {
        state.radius = parseInt(e.target.value);
        document.getElementById('radius-label').textContent = state.radius;
        renderPreviewAtTime(scrubTime);
    };
    document.getElementById('secondary-input').oninput = function (e) {
        state.secText = e.target.value;
        renderPreviewAtTime(scrubTime);
    };
    document.querySelectorAll('#secpos-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#secpos-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.secPos = btn.dataset.secpos;
            renderPreviewAtTime(scrubTime);
        };
    });
    document.getElementById('sec-size-slider').oninput = function (e) {
        state.secSize = parseInt(e.target.value);
        document.getElementById('sec-size-label').textContent = state.secSize;
        renderPreviewAtTime(scrubTime);
    };
    document.getElementById('sec-opacity-slider').oninput = function (e) {
        state.secOpacity = parseInt(e.target.value);
        document.getElementById('sec-opacity-label').textContent = state.secOpacity;
        renderPreviewAtTime(scrubTime);
    };
    document.getElementById('sec-color-btn').onclick = function () { openColorPicker('sec'); };
    document.getElementById('watermark-toggle').onclick = function () {
        state.watermarkOn = !state.watermarkOn;
        this.classList.toggle('active', state.watermarkOn);
        renderPreviewAtTime(scrubTime);
    };
}

// ---------- TIMELINE ----------
function attachTimelineEvents() {
    var scrubber = document.getElementById('timeline-scrubber');
    scrubber.addEventListener('input', function () {
        if (isPlaying) stopPlayback();
        scrubTime = (parseInt(scrubber.value) / 1000) * state.duration;
        updateTimeDisplay();
        renderPreviewAtTime(scrubTime);
    });
    document.getElementById('timeline-play-btn').onclick = togglePlay;
    document.getElementById('play-overlay-btn').onclick = togglePlay;
}

function togglePlay() { if (isPlaying) stopPlayback(); else startPlayback(); }
function startPlayback() {
    if (isPlaying) return;
    isPlaying = true;
    document.getElementById('play-icon').style.display = 'none';
    document.getElementById('pause-icon').style.display = 'block';
    document.getElementById('tl-play-icon').style.display = 'none';
    document.getElementById('tl-pause-icon').style.display = 'block';
    document.getElementById('play-overlay-btn').classList.add('hidden');
    playStartTime = performance.now();
    playStartT = scrubTime >= state.duration - 0.05 ? 0 : scrubTime;
    tick();
}
function stopPlayback() {
    isPlaying = false;
    document.getElementById('play-icon').style.display = 'block';
    document.getElementById('pause-icon').style.display = 'none';
    document.getElementById('tl-play-icon').style.display = 'block';
    document.getElementById('tl-pause-icon').style.display = 'none';
    document.getElementById('play-overlay-btn').classList.remove('hidden');
    if (playRAF) cancelAnimationFrame(playRAF);
    playRAF = null;
}
function tick() {
    if (!isPlaying) return;
    var elapsed = (performance.now() - playStartTime) / 1000;
    var t = playStartT + elapsed;
    if (t >= state.duration) {
        scrubTime = 0; stopPlayback(); updateTimeDisplay(0); renderPreviewAtTime(0);
        return;
    }
    scrubTime = t;
    updateTimeDisplay();
    renderPreviewAtTime(t);
    playRAF = requestAnimationFrame(tick);
}
function updateTimeDisplay(t) {
    var now = t !== undefined ? t : scrubTime;
    document.getElementById('time-display').textContent = now.toFixed(1) + ' / ' + state.duration.toFixed(1) + 's';
    document.getElementById('timeline-scrubber').value = Math.round((now / state.duration) * 1000);
}

// ---------- MODALS ----------
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
function attachModalEvents() {
    document.querySelectorAll('[data-close]').forEach(function (btn) {
        btn.onclick = function () { closeModal(btn.dataset.close); };
    });
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
        overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(overlay.id); });
    });
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
        if (v.length === 7 && v.charAt(0) === '#') {
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
        closeModal('color-modal');
    };
}

function openColorPicker(target) {
    colorTarget = target;
    var current = '#ffffff';
    if (target === 'text') current = state.textColor;
    else if (target === 'border') current = state.borderColor;
    else if (target === 'gradient') current = state.gradientColor;
    else if (target === 'highlight') current = state.highlightColor;
    else if (target === 'sec') current = state.secColor;
    else if (target === 'duotoneShadow') current = state.duotoneShadow;
    else if (target === 'duotoneHighlight') current = state.duotoneHighlight;
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
    COLOR_PRESETS.forEach(function (c) {
        var btn = document.createElement('button');
        btn.className = 'color-swatch';
        btn.style.background = c;
        btn.onclick = function () {
            var r2 = hexToRgb(c);
            pickedColor = rgbToHsl(r2.r, r2.g, r2.b);
            document.getElementById('hue-slider').value = pickedColor.h;
            document.getElementById('sat-slider').value = pickedColor.s;
            document.getElementById('light-slider').value = pickedColor.l;
            updateColorPreview();
        };
        swatchEl.appendChild(btn);
    });
    document.getElementById('color-modal').classList.add('show');
}
function updateColorPreview() {
    var hex = hslToHex(pickedColor.h, pickedColor.s, pickedColor.l);
    document.getElementById('color-preview').style.background = hex;
    document.getElementById('hex-input').value = hex;
}
function applyColor(target, hex) {
    if (target === 'text') { state.textColor = hex; renderSwatches('text-swatches', 'text'); }
    else if (target === 'border') { state.borderColor = hex; document.getElementById('border-color-btn').style.background = hex; }
    else if (target === 'gradient') { state.gradientColor = hex; }
    else if (target === 'highlight') { state.highlightColor = hex; renderSwatches('highlight-swatches', 'highlight'); }
    else if (target === 'sec') { state.secColor = hex; document.getElementById('sec-color-btn').style.background = hex; }
    renderPreviewAtTime(scrubTime);
}

// ---------- SYNC UI ----------
function syncAllUI() {
    updatePickerButtons();
    syncLangButtons();
    document.getElementById('duration-slider').value = state.duration;
    document.getElementById('duration-label').textContent = state.duration;
    document.querySelectorAll('#duration-preset-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', parseInt(b.dataset.dur) === state.duration); });
    document.querySelectorAll('#ratio-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.ratio === state.ratio); });
    document.querySelectorAll('#fps-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', parseInt(b.dataset.fps) === state.fps); });
    document.querySelectorAll('#resolution-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.res === state.resolution); });
    document.querySelectorAll('#text-motion-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.motion === state.textMotion); });
    document.querySelectorAll('#bg-motion-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.motion === state.bgMotion); });
    document.querySelectorAll('#ref-motion-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.motion === state.refMotion); });
    document.querySelectorAll('#logo-motion-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.motion === state.logoMotion); });
    document.querySelectorAll('#motion-speed-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.speed === state.motionSpeed); });
    document.querySelectorAll('#motion-easing-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.easing === state.motionEasing); });
    document.getElementById('font-size-slider').value = state.fontSize;
    document.getElementById('font-size-label').textContent = state.fontSize;
    document.getElementById('line-spacing-slider').value = state.lineSpacing;
    document.getElementById('line-spacing-label').textContent = state.lineSpacing;
    document.querySelectorAll('#weight-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.weight === state.fontWeight); });
    document.querySelectorAll('#shadow-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.shadow === state.shadow); });
    document.getElementById('highlight-word-input').value = state.highlightWord;
    var row = state.vpos === 'top' ? 't' : (state.vpos === 'bottom' ? 'b' : 'm');
    var col = state.align === 'left' ? 'l' : (state.align === 'right' ? 'r' : 'c');
    document.querySelectorAll('#pos-grid button').forEach(function (b) { b.classList.toggle('active', b.dataset.pos === row + col); });
    document.getElementById('bg-opacity-slider').value = state.bgOpacity;
    document.getElementById('bg-opacity-label').textContent = state.bgOpacity;
    document.getElementById('blur-slider').value = state.blur;
    document.getElementById('blur-label').textContent = state.blur;
    document.getElementById('brightness-slider').value = state.brightness;
    document.getElementById('brightness-label').textContent = state.brightness;
    document.getElementById('dark-slider').value = state.darkOverlay;
    document.getElementById('dark-label').textContent = state.darkOverlay;
    document.getElementById('vignette-slider').value = state.vignette;
    document.getElementById('vignette-label').textContent = state.vignette;
    document.getElementById('bg-blurfill-toggle').classList.toggle('active', state.bgBlurFill);
    document.getElementById('border-slider').value = state.borderWidth;
    document.getElementById('border-label').textContent = state.borderWidth;
    document.getElementById('border-color-btn').style.background = state.borderColor;
    document.getElementById('radius-slider').value = state.radius;
    document.getElementById('radius-label').textContent = state.radius;
    document.getElementById('secondary-input').value = state.secText;
    document.querySelectorAll('#secpos-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.secpos === state.secPos); });
    document.getElementById('sec-size-slider').value = state.secSize;
    document.getElementById('sec-size-label').textContent = state.secSize;
    document.getElementById('sec-opacity-slider').value = state.secOpacity;
    document.getElementById('sec-opacity-label').textContent = state.secOpacity;
    document.getElementById('sec-color-btn').style.background = state.secColor;
    document.getElementById('watermark-toggle').classList.toggle('active', state.watermarkOn !== false);
    if (state.audioData) {
        document.getElementById('audio-remove-btn').style.display = 'block';
        document.getElementById('audio-controls').style.display = 'block';
    }
    document.getElementById('audio-volume-slider').value = state.audioVolume;
    document.getElementById('audio-volume-label').textContent = state.audioVolume;
    document.getElementById('audio-fadein-slider').value = state.audioFadeIn;
    document.getElementById('audio-fadein-label').textContent = state.audioFadeIn;
    document.getElementById('audio-fadeout-slider').value = state.audioFadeOut;
    document.getElementById('audio-fadeout-label').textContent = state.audioFadeOut;
    document.getElementById('audio-loop-toggle').classList.toggle('active', state.audioLoop);
    updateTimeDisplay(0);
}

// ---------- EXPORT ----------
function openExportModal() {
    if (!window.VideoEncoder.isSupported()) { showToast('Video export not supported on this browser', 'error'); return; }
    var size = computeTargetSize();
    var est = ((state.duration * state.fps * size.W * size.H * 0.06) / 1000000).toFixed(1);
    document.getElementById('export-estimate').textContent = state.duration + 's · ' + state.fps + 'fps · ' + size.W + '×' + size.H + ' · ~' + est + ' MB';
    document.getElementById('export-modal').classList.add('show');
    document.getElementById('export-download-btn').onclick = startRender;
}

function attachSuccessEvents() {
    document.getElementById('success-close-btn').onclick = function () {
        document.getElementById('success-overlay').classList.remove('show');
    };
    document.getElementById('success-save-btn').onclick = function () {
        if (renderedBlob && renderedFilename) triggerDownload(renderedBlob, renderedFilename);
    };
    document.getElementById('success-share-btn').onclick = async function () {
        if (!renderedBlob || !renderedFilename) return;
        var file = new File([renderedBlob], renderedFilename, { type: renderedBlob.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: 'Bible Verse Video' }); }
            catch (e) { if (e.name !== 'AbortError') showToast('Sharing failed', 'error'); }
        } else showToast('Sharing not supported', 'info');
    };
}

function triggerDownload(blob, filename) {
    try {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 8000);
    } catch (e) {}
}

async function startRender() {
    closeModal('export-modal');
    document.getElementById('render-overlay').classList.add('show');
    document.getElementById('render-percent').textContent = '0%';
    document.getElementById('render-fill').style.width = '0%';
    document.getElementById('render-status').textContent = 'Preparing…';

    var size = computeTargetSize();
    await window.RenderEngine.ensureFonts([state.fontFamily, 'Poppins', 'Playfair Display', 'Inter']);

    var result;
    try {
        result = await window.VideoEncoder.encode({
            state: state,
            verseYoruba: getVerse(state.primaryLang),
            verseEnglish: getVerse(state.secondaryLang),
            referenceText: getReferenceText(),
            backgroundURL: getBackgroundURL(),
            bgGradient: getBgGradient(),
            bgSolid: getBgSolid(),
            duration: state.duration,
            fps: state.fps,
            targetW: size.W,
            targetH: size.H,
            motionFn: function (t, dur) { return computeMotion(t, dur); },
            audio: state.audioData ? {
                dataURL: state.audioData,
                volume: state.audioVolume,
                fadeIn: state.audioFadeIn,
                fadeOut: state.audioFadeOut,
                loop: state.audioLoop
            } : null,
            onProgress: function (pct, status) {
                document.getElementById('render-percent').textContent = pct + '%';
                document.getElementById('render-fill').style.width = pct + '%';
                if (status) document.getElementById('render-status').textContent = status;
            }
        });
    } catch (e) {
        console.error(e);
        document.getElementById('render-overlay').classList.remove('show');
        showToast('Video export failed: ' + (e.message || e), 'error');
        return;
    }

    document.getElementById('render-overlay').classList.remove('show');
    renderedBlob = result.blob;
    var refClean = getReferenceText().replace(/[:]/g, '-').replace(/\s+/g, '-');
    var now = new Date();
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var stamp = now.getFullYear() + pad(now.getMonth()+1) + pad(now.getDate()) + '-' + pad(now.getHours()) + pad(now.getMinutes());
    renderedFilename = 'bible-' + refClean + '-' + stamp + '.' + result.ext;
    if (renderedURL) URL.revokeObjectURL(renderedURL);
    renderedURL = URL.createObjectURL(renderedBlob);
    triggerDownload(renderedBlob, renderedFilename);
    document.getElementById('success-filename').textContent = renderedFilename;
    document.getElementById('success-video').src = renderedURL;
    document.getElementById('success-overlay').classList.add('show');
}

// ---------- HELPERS ----------
function showToast(msg, type) {
    if (!type) type = 'info';
    var c = document.getElementById('toast-container');
    var t = document.createElement('div');
    t.className = 'toast ' + type;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(function () {
        t.style.transition = 'opacity 0.3s, transform 0.3s';
        t.style.opacity = '0'; t.style.transform = 'translateY(20px)';
        setTimeout(function () { t.remove(); }, 300);
    }, 2500);
}
function hexToRgb(hex) {
    if (!hex || hex.length < 7) return { r: 255, g: 255, b: 255 };
    return { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) };
}
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r,g,b), min = Math.min(r,g,b);
    var h = 0, s = 0, l = (max+min)/2;
    if (max !== min) {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s*100), l: Math.round(l*100) };
}
function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    var c = (1 - Math.abs(2*l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    function toHex(v) { return Math.round((v + m) * 255).toString(16).padStart(2,'0'); }
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

init();
