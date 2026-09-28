// ============================================================
// BIBELI MIMO – IMAGE STUDIO V2
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
    '#fbbf24','#14b8a6','#6366f1','#a855f7','#84cc16','#06b6d4','#f97316','#dc2626'
];

const SWATCH_PRESETS = ['#ffffff','#000000','#f59e0b','#ef4444','#10b981','#3b82f6','#8b5cf6','#ec4899'];

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

// ---------- STATE ----------
function createDefaultState() {
    return {
        currentBook: 'GEN',
        currentChapter: 1,
        currentVerse: 1,
        primaryLang: 'yoruba',
        secondaryLang: 'english',

        currentCategory: 'photos',
        selectedTemplate: 0,
        bgImageData: null,
        bgPosition: 'center',
        bgOpacity: 100,

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
        fontWeight: '700',
        lineSpacing: 1.7,
        letterSpacing: 0,
        padding: 10,
        blockGap: 1.5,
        align: 'center',
        vpos: 'center',
        textColor: '#ffffff',
        shadow: 'strong',
        textCase: 'normal',

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

        watermarkOn: true,

        exportFormat: 'png',
        exportQuality: 90,
        exportRes: '1080'
    };
}

let state = createDefaultState();
let undoStack = [];
let redoStack = [];
let colorTarget = null;
let pickedColor = { h: 0, s: 0, l: 100 };
let confirmCallback = null;
let favorites = [];
let recentVerses = [];
let presets = [];
let activeSheet = 'verse';

try { favorites = JSON.parse(localStorage.getItem('studio_favorites') || '[]'); } catch (e) { favorites = []; }
try { recentVerses = JSON.parse(localStorage.getItem('studio_recents_verse') || '[]'); } catch (e) { recentVerses = []; }
try { presets = JSON.parse(localStorage.getItem('studio_presets') || '[]'); } catch (e) { presets = []; }

// ---------- HELPERS ----------
function posFromAlignVpos(align, vpos) {
    var row = vpos === 'top' ? 't' : (vpos === 'bottom' ? 'b' : 'm');
    var col = align === 'left' ? 'l' : (align === 'right' ? 'r' : 'c');
    return row + col;
}
function alignVposFromPos(pos) {
    var row = pos.charAt(0);
    var col = pos.charAt(1);
    return {
        align: col === 'l' ? 'left' : (col === 'r' ? 'right' : 'center'),
        vpos: row === 't' ? 'top' : (row === 'b' ? 'bottom' : 'center')
    };
}

// ---------- INIT ----------
async function initStudio() {
    try {
        await data.loadAllData();
    } catch (e) {
        document.getElementById('preview-text').textContent = 'Failed to load Bible data.';
        return;
    }

    try {
        var neededFonts = [state.fontFamily, 'Poppins', 'Playfair Display', 'Inter'];
        await Promise.race([
            Promise.all(neededFonts.map(function (f) {
                return Promise.all([
                    document.fonts.load('700 24px "' + f + '"').catch(function () {}),
                    document.fonts.load('400 24px "' + f + '"').catch(function () {})
                ]);
            })),
            new Promise(function (resolve) { setTimeout(resolve, 2500); })
        ]);
    } catch (e) {}

    try {
        var draftRaw = localStorage.getItem('studio_draft');
        if (draftRaw) {
            var draft = JSON.parse(draftRaw);
            if (draft && typeof draft === 'object') {
                for (var dk in draft) {
                    if (Object.prototype.hasOwnProperty.call(state, dk)) state[dk] = draft[dk];
                }
            }
        }
    } catch (e) {}

    applyUrlParams();

    var savedLogo = localStorage.getItem('studio_logo');
    if (savedLogo) state.logoData = savedLogo;

    state.exportFormat = localStorage.getItem('studio_export_format') || 'png';
    state.exportQuality = parseInt(localStorage.getItem('studio_export_quality') || '90');
    state.exportRes = localStorage.getItem('studio_export_res') || '1080';

    attachHeaderEvents();
    attachSheetEvents();
    attachVerseEvents();
    attachLookEvents();
    attachTypeEvents();
    attachMoreEvents();
    attachActionBarEvents();
    attachModalEvents();
    attachCanvasGestures();

    renderFontStrip();
    renderSwatches('text-swatches', 'text');
    renderSwatches('highlight-swatches', 'highlight');
    renderFilmstrip();
    renderPresets();
    renderRecentVerses();

    syncAllUI();
    updatePreview();
    showPreviewLogo();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', function () { setTimeout(resizeCanvas, 200); });

    setInterval(saveDraft, 5000);
}

function applyUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var b = params.get('b');
    var c = params.get('c');
    var v = params.get('v');
    if (b && c && v) {
        var idx = data.codes.indexOf(b.toUpperCase());
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

// ---------- UNDO / REDO ----------
function pushUndo() {
    try {
        undoStack.push(JSON.parse(JSON.stringify(state)));
        if (undoStack.length > 30) undoStack.shift();
        redoStack = [];
    } catch (e) {}
}
function performUndo() {
    if (undoStack.length === 0) { showToast('Nothing to undo', 'info'); return; }
    redoStack.push(JSON.parse(JSON.stringify(state)));
    state = undoStack.pop();
    syncAllUI();
    updatePreview();
    showPreviewLogo();
    renderFilmstrip();
    renderFontStrip();
    showToast('Undone', 'info');
}
function performRedo() {
    if (redoStack.length === 0) { showToast('Nothing to redo', 'info'); return; }
    undoStack.push(JSON.parse(JSON.stringify(state)));
    state = redoStack.pop();
    syncAllUI();
    updatePreview();
    showPreviewLogo();
    renderFilmstrip();
    renderFontStrip();
    showToast('Redone', 'info');
}

// ---------- CANVAS RESIZE ----------
function resizeCanvas() {
    var area = document.getElementById('canvas-area');
    var card = document.getElementById('preview-card');
    if (!area || !card) return;
    var W = area.clientWidth - 24;
    var H = area.clientHeight - 24;
    var ratioMap = { square: 1, portrait: 4/5, story: 9/16, landscape: 16/9, pin: 3/4 };
    var r = ratioMap[state.ratio] || 1;
    var w = W;
    var h = w / r;
    if (h > H) { h = H; w = h * r; }
    card.style.width = w + 'px';
    card.style.height = h + 'px';
}

// ---------- HEADER ----------
function attachHeaderEvents() {
    document.getElementById('undo-btn').onclick = performUndo;
    document.getElementById('redo-btn').onclick = performRedo;
    document.getElementById('overflow-btn').onclick = function () {
        document.querySelectorAll('.sheet-pane').forEach(function (p) { p.classList.remove('active'); });
        document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
        var chip = document.querySelector('.chip[data-sheet="more"]');
        chip.classList.add('active');
        document.querySelector('.sheet-pane[data-pane="more"]').classList.add('active');
        document.getElementById('sheet').classList.remove('collapsed');
        activeSheet = 'more';
    };
}

// ---------- SHEET ----------
function attachSheetEvents() {
    document.querySelectorAll('.chip').forEach(function (btn) {
        btn.onclick = function () {
            var target = btn.dataset.sheet;
            if (activeSheet === target && !document.getElementById('sheet').classList.contains('collapsed')) {
                document.getElementById('sheet').classList.add('collapsed');
                return;
            }
            document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
            btn.classList.add('active');
            document.querySelectorAll('.sheet-pane').forEach(function (p) { p.classList.remove('active'); });
            document.querySelector('.sheet-pane[data-pane="' + target + '"]').classList.add('active');
            document.getElementById('sheet').classList.remove('collapsed');
            activeSheet = target;
        };
    });

    document.getElementById('sheet-handle').onclick = function () {
        document.getElementById('sheet').classList.toggle('collapsed');
    };
}

// ---------- CANVAS GESTURES ----------
function attachCanvasGestures() {
    var area = document.getElementById('canvas-area');
    var startY = 0;
    var startDist = 0;
    var startFontSize = 0;
    var moved = false;

    area.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
            startY = e.touches[0].clientY;
            moved = false;
        } else if (e.touches.length === 2) {
            var dx = e.touches[0].clientX - e.touches[1].clientX;
            var dy = e.touches[0].clientY - e.touches[1].clientY;
            startDist = Math.sqrt(dx * dx + dy * dy);
            startFontSize = state.fontSize;
        }
    }, { passive: true });

    area.addEventListener('touchmove', function (e) {
        if (e.touches.length === 2 && startDist > 0) {
            var dx = e.touches[0].clientX - e.touches[1].clientX;
            var dy = e.touches[0].clientY - e.touches[1].clientY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var next = Math.round(startFontSize * (dist / startDist));
            next = Math.max(12, Math.min(80, next));
            if (next !== state.fontSize) {
                state.fontSize = next;
                document.getElementById('font-size-slider').value = next;
                document.getElementById('font-size-label').textContent = next;
                updatePreview();
            }
        }
    }, { passive: true });

    area.addEventListener('touchend', function (e) {
        if (e.changedTouches.length === 1 && startDist === 0) {
            var dy = e.changedTouches[0].clientY - startY;
            if (dy < -60 && !moved) {
                document.body.classList.add('canvas-fullscreen');
            } else if (dy > 60) {
                document.body.classList.remove('canvas-fullscreen');
            }
        }
        startDist = 0;
    });

    document.getElementById('fullscreen-exit-btn').onclick = function () {
        document.body.classList.remove('canvas-fullscreen');
    };

    document.getElementById('preview-card').onclick = function () {
        if (document.body.classList.contains('canvas-fullscreen')) {
            document.body.classList.remove('canvas-fullscreen');
            return;
        }
        var clone = document.getElementById('preview-card').cloneNode(true);
        clone.id = 'zoom-preview-clone';
        var zoomContent = document.getElementById('zoom-content');
        zoomContent.innerHTML = '';
        zoomContent.appendChild(clone);
        document.getElementById('zoom-modal').classList.add('show');
    };
}

// ---------- VERSE ----------
function attachVerseEvents() {
    document.getElementById('pick-book').onclick = function () { openVerseModal('book'); };
    document.getElementById('pick-chapter').onclick = function () { openVerseModal('chapter'); };
    document.getElementById('pick-verse').onclick = function () { openVerseModal('verse'); };

    document.getElementById('random-verse').onclick = randomVerse;
    document.getElementById('action-random-btn').onclick = randomVerse;

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

    document.getElementById('primary-lang-btn').onclick = function () { cycleLang('primary'); };
    document.getElementById('secondary-lang-btn').onclick = function () { cycleLang('secondary'); };

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

            var found = [];
            var seen = {};
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

function randomVerse() {
    var v = data.yoruba[Math.floor(Math.random() * data.yoruba.length)];
    pushUndo();
    state.currentBook = data.codes[v.book - 1];
    state.currentChapter = v.chapter;
    state.currentVerse = v.verse;
    updatePickerButtons();
    updatePreview();
    saveRecentVerse();
}

function cycleLang(which) {
    var langs = data.languages;
    var current = which === 'primary' ? state.primaryLang : state.secondaryLang;
    var list = ['none'].concat(langs.map(function (l) { return l.id; }));
    var idx = list.indexOf(current);
    var next = list[(idx + 1) % list.length];
    if (which === 'primary' && next === 'none') next = list[1];
    if (which === 'secondary' && next === state.primaryLang) next = 'none';
    if (which === 'primary' && next === state.secondaryLang) state.secondaryLang = 'none';
    pushUndo();
    if (which === 'primary') state.primaryLang = next;
    else state.secondaryLang = next;
    syncLangButtons();
    updatePreview();
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
    var modal = document.getElementById('verse-modal');
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
                state.currentChapter = 1;
                state.currentVerse = 1;
                updatePickerButtons();
                closeModal('verse-modal');
                updatePreview();
                saveRecentVerse();
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
                    state.currentChapter = i;
                    state.currentVerse = 1;
                    updatePickerButtons();
                    closeModal('verse-modal');
                    updatePreview();
                    saveRecentVerse();
                };
                list.appendChild(div);
            })(i);
        }
    } else if (type === 'verse') {
        title.textContent = 'Select verse';
        var bookNum2 = data.codes.indexOf(state.currentBook) + 1;
        var verses = data.yoruba.filter(function (v) { return v.book === bookNum2 && v.chapter === state.currentChapter; });
        verses.forEach(function (v) {
            var div = document.createElement('div');
            div.className = 'modal-list-item';
            var preview = (v.text || '').substring(0, 40);
            div.innerHTML = '<span>' + v.verse + '</span><span style="font-size:11px;opacity:0.6;">' + preview + '…</span>';
            div.onclick = function () {
                pushUndo();
                state.currentVerse = v.verse;
                updatePickerButtons();
                closeModal('verse-modal');
                updatePreview();
                saveRecentVerse();
            };
            list.appendChild(div);
        });
    }
    modal.classList.add('show');
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
        el.innerHTML = '<span class="hint-text">No recent verses yet</span>';
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

// ---------- LOOK ----------
function attachLookEvents() {
    document.querySelectorAll('.look-tab').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('.look-tab').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.currentCategory = btn.dataset.cat;
            state.selectedTemplate = 0;
            renderFilmstrip();
            updatePreview();
        };
    });

    document.getElementById('bg-upload-btn').onclick = function () {
        document.getElementById('bg-upload-input').click();
    };
    document.getElementById('bg-upload-input').onchange = function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            pushUndo();
            state.bgImageData = ev.target.result;
            document.getElementById('bg-remove-btn').style.display = 'block';
            updatePreview();
            showToast('Photo uploaded', 'success');
        };
        reader.readAsDataURL(file);
    };
    document.getElementById('bg-remove-btn').onclick = function () {
        pushUndo();
        state.bgImageData = null;
        this.style.display = 'none';
        updatePreview();
    };

    document.getElementById('bg-opacity-slider').oninput = function (e) {
        state.bgOpacity = parseInt(e.target.value);
        document.getElementById('bg-opacity-label').textContent = state.bgOpacity;
        updatePreview();
    };
    document.getElementById('blur-slider').oninput = function (e) {
        state.blur = parseFloat(e.target.value);
        document.getElementById('blur-label').textContent = state.blur;
        updatePreview();
    };
    document.getElementById('brightness-slider').oninput = function (e) {
        state.brightness = parseInt(e.target.value);
        document.getElementById('brightness-label').textContent = state.brightness;
        updatePreview();
    };
    document.getElementById('dark-slider').oninput = function (e) {
        state.darkOverlay = parseInt(e.target.value);
        document.getElementById('dark-label').textContent = state.darkOverlay;
        updatePreview();
    };
    document.getElementById('vignette-slider').oninput = function (e) {
        state.vignette = parseInt(e.target.value);
        document.getElementById('vignette-label').textContent = state.vignette;
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
    } else if (state.currentCategory === 'favorites') {
        if (favorites.length === 0) {
            strip.innerHTML = '<span class="hint-text" style="padding:20px;text-align:center;width:100%;">No favorites yet. Tap ♡ to save.</span>';
            return;
        }
        favorites.forEach(function (id) {
            var bg = '';
            if (id.indexOf('photo_') === 0) bg = "url('" + PHOTO_URLS[parseInt(id.split('_')[1])] + "') center/cover";
            else if (id.indexOf('grad_') === 0) bg = GRADIENTS[parseInt(id.split('_')[1])];
            else if (id.indexOf('solid_') === 0) bg = SOLIDS[parseInt(id.split('_')[1])];
            if (bg) items.push({ id: id, bg: bg });
        });
    }

    // Prepend uploaded photo if present
    if (state.bgImageData) {
        items.unshift({ id: '__uploaded', bg: "url('" + state.bgImageData + "') center/cover" });
    }

    items.forEach(function (item) {
        var div = document.createElement('div');
        div.className = 'film-item';
        div.style.background = item.bg;

        var isSelected = false;
        if (item.id === '__uploaded') {
            isSelected = state.currentCategory === 'photos' && state.selectedTemplate === -1;
        } else if (state.currentCategory === 'favorites') {
            isSelected = favorites.indexOf(item.id) === state.selectedTemplate;
        } else {
            var pre = state.currentCategory === 'photos' ? 'photo_' : (state.currentCategory === 'gradients' ? 'grad_' : 'solid_');
            isSelected = item.id === pre + state.selectedTemplate;
        }
        if (isSelected) div.classList.add('selected');

        div.onclick = function () {
            pushUndo();
            if (item.id === '__uploaded') {
                state.currentCategory = 'photos';
                state.selectedTemplate = -1;
            } else if (item.id.indexOf('photo_') === 0) {
                state.currentCategory = 'photos';
                state.selectedTemplate = parseInt(item.id.split('_')[1]);
                state.bgImageData = null;
                document.getElementById('bg-remove-btn').style.display = 'none';
            } else if (item.id.indexOf('grad_') === 0) {
                state.currentCategory = 'gradients';
                state.selectedTemplate = parseInt(item.id.split('_')[1]);
                state.bgImageData = null;
                document.getElementById('bg-remove-btn').style.display = 'none';
            } else if (item.id.indexOf('solid_') === 0) {
                state.currentCategory = 'solids';
                state.selectedTemplate = parseInt(item.id.split('_')[1]);
                state.bgImageData = null;
                document.getElementById('bg-remove-btn').style.display = 'none';
            }
            renderFilmstrip();
            updatePreview();
        };

        // Heart for favorites
        if (item.id !== '__uploaded') {
            div.classList.add('fav-item');
            var heart = document.createElement('button');
            heart.className = 'film-heart';
            var isFav = favorites.indexOf(item.id) >= 0;
            if (isFav) heart.classList.add('active');
            heart.textContent = '♥';
            heart.onclick = function (e) {
                e.stopPropagation();
                var i = favorites.indexOf(item.id);
                if (i >= 0) favorites.splice(i, 1);
                else favorites.push(item.id);
                try { localStorage.setItem('studio_favorites', JSON.stringify(favorites)); } catch (err) {}
                renderFilmstrip();
            };
            div.appendChild(heart);
        }

        strip.appendChild(div);
    });
}

// ---------- TYPE ----------
function attachTypeEvents() {
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
    document.getElementById('block-gap-slider').oninput = function (e) {
        state.blockGap = parseFloat(e.target.value);
        document.getElementById('block-gap-label').textContent = state.blockGap;
        updatePreview();
    };
    document.getElementById('padding-slider').oninput = function (e) {
        state.padding = parseFloat(e.target.value);
        document.getElementById('padding-label').textContent = state.padding;
        updatePreview();
    };

    document.querySelectorAll('#weight-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#weight-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.fontWeight = btn.dataset.weight;
            updatePreview();
        };
    });

    document.querySelectorAll('#pos-grid button').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            var av = alignVposFromPos(btn.dataset.pos);
            state.align = av.align;
            state.vpos = av.vpos;
            syncPositionGrid();
            updatePreview();
        };
    });

    document.querySelectorAll('#shadow-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#shadow-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.shadow = btn.dataset.shadow;
            updatePreview();
        };
    });

    document.querySelectorAll('#case-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#case-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.textCase = btn.dataset.case;
            updatePreview();
        };
    });

    document.querySelectorAll('#refpos-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#refpos-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.refPos = btn.dataset.refpos;
            updatePreview();
        };
    });

    document.getElementById('highlight-word-input').oninput = function (e) {
        state.highlightWord = e.target.value;
        updatePreview();
    };

    document.getElementById('text-color-custom-btn').onclick = function () { openColorPicker('text'); };
    document.getElementById('ref-color-btn').onclick = function () { openColorPicker('ref'); };

    document.getElementById('ref-toggle').onclick = function () {
        pushUndo();
        state.refShow = !state.refShow;
        this.classList.toggle('active', state.refShow);
        updatePreview();
    };
    document.getElementById('ref-size-slider').oninput = function (e) {
        state.refSize = parseInt(e.target.value);
        document.getElementById('ref-size-label').textContent = state.refSize;
        updatePreview();
    };
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
            updatePreview();
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
            updatePreview();
        };
        el.appendChild(btn);
    });
}

function syncPositionGrid() {
    var current = posFromAlignVpos(state.align, state.vpos);
    document.querySelectorAll('#pos-grid button').forEach(function (b) {
        b.classList.toggle('active', b.dataset.pos === current);
    });
}

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
        if (currentH <= usableH) { best = mid; lo = mid + 1; }
        else { hi = mid - 1; }
    }
    state.fontSize = best;
    document.getElementById('font-size-slider').value = best;
    document.getElementById('font-size-label').textContent = best;
    updatePreview();
    showToast('Auto-fit complete', 'success');
}

// ---------- MORE ----------
function attachMoreEvents() {
    document.querySelectorAll('#ratio-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            pushUndo();
            document.querySelectorAll('#ratio-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.ratio = btn.dataset.ratio;
            resizeCanvas();
            updatePreview();
        };
    });

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

    document.getElementById('secondary-input').oninput = function (e) {
        state.secText = e.target.value;
        updatePreview();
    };
    document.querySelectorAll('#secpos-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#secpos-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
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

    document.getElementById('logo-upload-btn').onclick = function () {
        document.getElementById('logo-input').click();
    };
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
    document.querySelectorAll('#logo-pos-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#logo-pos-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
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

    document.getElementById('save-preset-btn').onclick = function () {
        document.getElementById('preset-name-input').value = '';
        document.getElementById('preset-modal').classList.add('show');
    };
    document.getElementById('preset-confirm-btn').onclick = function () {
        var name = document.getElementById('preset-name-input').value.trim() || 'Untitled';
        var preset = {
            id: Date.now(),
            name: name,
            fontFamily: state.fontFamily,
            fontSize: state.fontSize,
            fontWeight: state.fontWeight,
            lineSpacing: state.lineSpacing,
            letterSpacing: state.letterSpacing,
            padding: state.padding,
            blockGap: state.blockGap,
            align: state.align,
            vpos: state.vpos,
            textColor: state.textColor,
            shadow: state.shadow,
            textCase: state.textCase,
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
        closeModal('preset-modal');
        renderPresets();
        showToast('Preset saved', 'success');
    };

    document.getElementById('watermark-toggle').onclick = function () {
        state.watermarkOn = !state.watermarkOn;
        this.classList.toggle('active', state.watermarkOn);
        updatePreview();
    };
    document.getElementById('safezone-toggle').onclick = function () {
        state.safezone = !state.safezone;
        this.classList.toggle('active', state.safezone);
        document.getElementById('preview-safezone').style.display = state.safezone ? 'block' : 'none';
    };
    document.getElementById('reset-all-btn').onclick = function () {
        openConfirm('Reset studio?', 'All your current edits will be cleared.', function () {
            pushUndo();
            state = createDefaultState();
            try { localStorage.removeItem('studio_draft'); } catch (e) {}
            var savedLogo = localStorage.getItem('studio_logo');
            if (savedLogo) state.logoData = savedLogo;
            syncAllUI();
            updatePreview();
            showPreviewLogo();
            renderFilmstrip();
            renderFontStrip();
            showToast('Reset to defaults', 'success');
        });
    };
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
        info.className = 'preset-info';
        info.innerHTML = '<div class="preset-name">' + escapeHtml(p.name) + '</div><div class="preset-meta">' + escapeHtml(p.fontFamily) + ' · ' + p.fontSize + 'px</div>';

        var loadBtn = document.createElement('button');
        loadBtn.className = 'preset-btn';
        loadBtn.textContent = 'Load';
        loadBtn.onclick = function () { loadPreset(p); };

        var delBtn = document.createElement('button');
        delBtn.className = 'preset-btn danger';
        delBtn.textContent = '×';
        delBtn.onclick = function () { deletePreset(p.id); };

        div.appendChild(thumb);
        div.appendChild(info);
        div.appendChild(loadBtn);
        div.appendChild(delBtn);
        el.appendChild(div);
    });
}

function loadPreset(p) {
    pushUndo();
    state.fontFamily = p.fontFamily;
    state.fontSize = p.fontSize;
    state.fontWeight = p.fontWeight || '700';
    state.lineSpacing = p.lineSpacing;
    state.letterSpacing = p.letterSpacing;
    state.padding = p.padding;
    state.blockGap = p.blockGap;
    state.align = p.align || 'center';
    state.vpos = p.vpos || 'center';
    state.textColor = p.textColor;
    state.shadow = p.shadow;
    state.textCase = p.textCase;
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
    renderFontStrip();
    resizeCanvas();
    updatePreview();
    showToast('Preset loaded', 'success');
}

function deletePreset(id) {
    presets = presets.filter(function (p) { return p.id !== id; });
    try { localStorage.setItem('studio_presets', JSON.stringify(presets)); } catch (e) {}
    renderPresets();
    showToast('Preset deleted', 'info');
}

// ---------- ACTION BAR ----------
function attachActionBarEvents() {
    document.getElementById('export-open-btn').onclick = function () {
        document.querySelectorAll('#format-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.format === state.exportFormat); });
        document.querySelectorAll('#resolution-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.res === state.exportRes); });
        document.getElementById('jpg-quality-slider').value = state.exportQuality;
        document.getElementById('jpg-quality-label').textContent = state.exportQuality;
        document.getElementById('jpg-quality-row').style.display = state.exportFormat === 'jpg' ? 'block' : 'none';
        updateExportEstimate();
        document.getElementById('export-modal').classList.add('show');
    };

    document.querySelectorAll('#format-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#format-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.exportFormat = btn.dataset.format;
            document.getElementById('jpg-quality-row').style.display = state.exportFormat === 'jpg' ? 'block' : 'none';
            updateExportEstimate();
        };
    });
    document.querySelectorAll('#resolution-chips .chip-sm').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('#resolution-chips .chip-sm').forEach(function (b) { b.classList.remove('active'); });
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
        window.location.href = '/studio/image/export/';
    };
}

function updateExportEstimate() {
    var res = parseInt(state.exportRes);
    var pixels = res * res * 1.5;
    var sizeMB = state.exportFormat === 'jpg'
        ? (pixels * (state.exportQuality / 100) * 0.00000025).toFixed(2)
        : (pixels * 0.0000007).toFixed(2);
    document.getElementById('export-estimate').textContent = 'Estimated: ~' + sizeMB + ' MB';
}

function saveExportState() {
    var primary = data.getVerseInLang(state.primaryLang, data.codes.indexOf(state.currentBook) + 1, state.currentChapter, state.currentVerse);
    var secondary = data.getVerseInLang(state.secondaryLang, data.codes.indexOf(state.currentBook) + 1, state.currentChapter, state.currentVerse);
    var previewCard = document.getElementById('preview-card');

    var backgroundURL = state.bgImageData || null;
    var bgGradient = null;
    var bgSolid = null;

    if (!backgroundURL) {
        if (state.currentCategory === 'photos' && state.selectedTemplate >= 0) {
            backgroundURL = PHOTO_URLS[state.selectedTemplate];
        } else if (state.currentCategory === 'gradients') {
            bgGradient = GRADIENTS[state.selectedTemplate];
        } else if (state.currentCategory === 'solids') {
            bgSolid = SOLIDS[state.selectedTemplate];
        }
    }

    var exportData = {
        verseYoruba: primary,
        verseEnglish: secondary,
        referenceText: data.englishNames[data.codes.indexOf(state.currentBook)] + ' ' + state.currentChapter + ':' + state.currentVerse,
        backgroundURL: backgroundURL,
        bgGradient: bgGradient,
        bgSolid: bgSolid,
        previewW: previewCard.offsetWidth,
        previewH: previewCard.offsetHeight,
        settings: JSON.parse(JSON.stringify(state)),
        exportFormat: state.exportFormat,
        exportQuality: state.exportQuality,
        exportRes: state.exportRes
    };

    try { localStorage.setItem('studio_export_state', JSON.stringify(exportData)); } catch (e) {}
}

// ---------- MODALS ----------
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

function attachModalEvents() {
    document.querySelectorAll('[data-close]').forEach(function (btn) {
        btn.onclick = function () { closeModal(btn.dataset.close); };
    });
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    // Color picker
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

    // Confirm
    document.getElementById('confirm-cancel-btn').onclick = function () {
        confirmCallback = null;
        closeModal('confirm-modal');
    };
    document.getElementById('confirm-ok-btn').onclick = function () {
        var cb = confirmCallback;
        confirmCallback = null;
        closeModal('confirm-modal');
        if (cb) cb();
    };
}

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
    COLOR_PRESETS.forEach(function (c) {
        var btn = document.createElement('button');
        btn.className = 'color-swatch';
        btn.style.background = c;
        btn.onclick = function () {
            var rgb2 = hexToRgb(c);
            pickedColor = rgbToHsl(rgb2.r, rgb2.g, rgb2.b);
            document.getElementById('hue-slider').value = pickedColor.h;
            document.getElementById('sat-slider').value = pickedColor.s;
            document.getElementById('light-slider').value = pickedColor.l;
            document.getElementById('hue-label').textContent = pickedColor.h;
            document.getElementById('sat-label').textContent = pickedColor.s;
            document.getElementById('light-label').textContent = pickedColor.l;
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
    else if (target === 'ref') { state.refColor = hex; document.getElementById('ref-color-btn').style.background = hex; }
    else if (target === 'border') { state.borderColor = hex; document.getElementById('border-color-btn').style.background = hex; }
    else if (target === 'gradient') { state.gradientColor = hex; document.getElementById('gradient-color-btn').style.background = hex; }
    else if (target === 'highlight') { state.highlightColor = hex; renderSwatches('highlight-swatches', 'highlight'); }
    else if (target === 'sec') { state.secColor = hex; document.getElementById('sec-color-btn').style.background = hex; }
    else if (target === 'duotoneShadow') { state.duotoneShadow = hex; document.getElementById('duotone-shadow-btn').style.background = hex; }
    else if (target === 'duotoneHighlight') { state.duotoneHighlight = hex; document.getElementById('duotone-highlight-btn').style.background = hex; }
    else if (target === 'logoBorder') { state.logoBorderColor = hex; document.getElementById('logo-border-color-btn').style.background = hex; }
    else if (target === 'logoBg') { state.logoBgColor = hex; document.getElementById('logo-bg-color-btn').style.background = hex; }
    updatePreview();
}

function openConfirm(title, message, cb) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    confirmCallback = cb;
    document.getElementById('confirm-modal').classList.add('show');
}

// ---------- SYNC ALL UI ----------
function syncAllUI() {
    updatePickerButtons();
    syncLangButtons();

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
    document.getElementById('saturation-slider').value = state.saturation;
    document.getElementById('saturation-label').textContent = state.saturation;
    document.getElementById('duotone-toggle').classList.toggle('active', state.duotoneOn);
    document.getElementById('duotone-shadow-btn').style.background = state.duotoneShadow;
    document.getElementById('duotone-highlight-btn').style.background = state.duotoneHighlight;
    document.getElementById('gradient-overlay-toggle').classList.toggle('active', state.gradientOverlay);
    document.getElementById('gradient-color-btn').style.background = state.gradientColor;
    document.getElementById('gradient-opacity-slider').value = state.gradientOpacity;

    document.querySelectorAll('#ratio-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.ratio === state.ratio); });
    document.getElementById('border-slider').value = state.borderWidth;
    document.getElementById('border-label').textContent = state.borderWidth;
    document.getElementById('border-color-btn').style.background = state.borderColor;
    document.getElementById('radius-slider').value = state.radius;
    document.getElementById('radius-label').textContent = state.radius;

    document.getElementById('font-size-slider').value = state.fontSize;
    document.getElementById('font-size-label').textContent = state.fontSize;
    document.getElementById('line-spacing-slider').value = state.lineSpacing;
    document.getElementById('line-spacing-label').textContent = state.lineSpacing;
    document.getElementById('letter-spacing-slider').value = state.letterSpacing;
    document.getElementById('letter-spacing-label').textContent = state.letterSpacing;
    document.getElementById('block-gap-slider').value = state.blockGap;
    document.getElementById('block-gap-label').textContent = state.blockGap;
    document.getElementById('padding-slider').value = state.padding;
    document.getElementById('padding-label').textContent = state.padding;
    document.querySelectorAll('#weight-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.weight === state.fontWeight); });
    syncPositionGrid();
    document.querySelectorAll('#shadow-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.shadow === state.shadow); });
    document.querySelectorAll('#case-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.case === state.textCase); });
    document.getElementById('highlight-word-input').value = state.highlightWord;

    document.getElementById('ref-toggle').classList.toggle('active', state.refShow);
    document.querySelectorAll('#refpos-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.refpos === state.refPos); });
    document.getElementById('ref-size-slider').value = state.refSize;
    document.getElementById('ref-size-label').textContent = state.refSize;
    document.getElementById('ref-color-btn').style.background = state.refColor;

    document.getElementById('secondary-input').value = state.secText;
    document.querySelectorAll('#secpos-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.secpos === state.secPos); });
    document.getElementById('sec-size-slider').value = state.secSize;
    document.getElementById('sec-size-label').textContent = state.secSize;
    document.getElementById('sec-opacity-slider').value = state.secOpacity;
    document.getElementById('sec-opacity-label').textContent = state.secOpacity;
    document.getElementById('sec-color-btn').style.background = state.secColor;

    document.querySelectorAll('#logo-pos-chips .chip-sm').forEach(function (b) { b.classList.toggle('active', b.dataset.logopos === state.logoPos); });
    document.getElementById('logo-size-slider').value = state.logoSize;
    document.getElementById('logo-size-label').textContent = state.logoSize;
    document.getElementById('logo-opacity-slider').value = state.logoOpacity;
    document.getElementById('logo-opacity-label').textContent = state.logoOpacity;
    document.getElementById('logo-border-toggle').classList.toggle('active', state.logoBorderOn);
    document.getElementById('logo-border-color-btn').style.background = state.logoBorderColor;
    document.getElementById('logo-bg-toggle').classList.toggle('active', state.logoBgOn);
    document.getElementById('logo-bg-color-btn').style.background = state.logoBgColor;

    document.getElementById('watermark-toggle').classList.toggle('active', state.watermarkOn !== false);
    document.getElementById('safezone-toggle').classList.toggle('active', state.safezone);
    document.getElementById('preview-safezone').style.display = state.safezone ? 'block' : 'none';

    document.getElementById('bg-remove-btn').style.display = state.bgImageData ? 'block' : 'none';
}

// ---------- PREVIEW ----------
function getCurrentBackgroundCSS() {
    if (state.bgImageData) return "url('" + state.bgImageData + "') center/cover";
    if (state.currentCategory === 'photos' && state.selectedTemplate >= 0) {
        return "url('" + PHOTO_URLS[state.selectedTemplate] + "') center/cover";
    }
    if (state.currentCategory === 'gradients') return GRADIENTS[state.selectedTemplate];
    if (state.currentCategory === 'solids') return SOLIDS[state.selectedTemplate];
    return '';
}

function getShadowCSS(style) {
    if (style === 'none') return 'none';
    if (style === 'soft') return '0 2px 8px rgba(0,0,0,0.4)';
    if (style === 'strong') return '0 4px 15px rgba(0,0,0,0.75)';
    if (style === 'glow') return '0 0 25px rgba(255,255,255,0.7), 0 0 50px rgba(255,255,255,0.3)';
    if (style === 'outline') return '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
    return 'none';
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
    var bookNum = data.codes.indexOf(state.currentBook) + 1;
    var primary = data.getVerseInLang(state.primaryLang, bookNum, state.currentChapter, state.currentVerse);
    var secondary = data.getVerseInLang(state.secondaryLang, bookNum, state.currentChapter, state.currentVerse);
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
            if (idx < 0) { result += escaped.substring(pos); break; }
            result += escaped.substring(pos, idx);
            result += '<span class="hl" style="background:' + state.highlightColor + ';color:#fff;">' + escaped.substring(idx, idx + word.length) + '</span>';
            pos = idx + word.length;
        }
        return result;
    }

    var html = '';
    if (primary) html += '<div class="text-yo" style="font-weight:' + state.fontWeight + ';">' + hl(primary) + '</div>';
    if (secondary) html += '<div class="text-en">' + hl(secondary) + '</div>';
    return html || 'Verse not found';
}

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
    bg.style.opacity = (state.bgOpacity || 100) / 100;

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
    } else duotoneOv.style.display = 'none';

    if (state.gradientOverlay) {
        gradOv.style.display = 'block';
        gradOv.style.background = hexToRgba(state.gradientColor, state.gradientOpacity / 100);
    } else gradOv.style.display = 'none';

    vig.style.boxShadow = state.vignette > 0
        ? 'inset 0 0 ' + Math.round(state.vignette * 2.5) + 'px ' + Math.round(state.vignette * 1.5) + 'px rgba(0,0,0,' + (state.vignette / 100) + ')'
        : 'none';

    deco.style.border = state.borderWidth > 0 ? state.borderWidth + 'px solid ' + state.borderColor : 'none';
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
        refEl.textContent = data.englishNames[data.codes.indexOf(state.currentBook)] + ' ' + state.currentChapter + ':' + state.currentVerse;
        refEl.style.fontFamily = fontCss;
        refEl.style.fontSize = state.refSize + 'px';
        refEl.style.color = state.refColor;
        refEl.style.textShadow = getShadowCSS(state.refShadow);
        refEl.style.order = state.refPos === 'top' ? -2 : 10;
    } else refEl.style.display = 'none';

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
        secEl.style.order = state.secPos === 'top' ? -3 : (state.secPos === 'bottom' ? 20 : -1);
    } else secEl.style.display = 'none';

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
    } else logoWrap.style.display = 'none';

    var wmEl = document.getElementById('preview-watermark');
    if (wmEl) wmEl.style.display = (state.watermarkOn !== false) ? 'block' : 'none';
}

function showPreviewLogo() {
    var wrap = document.getElementById('preview-logo-wrap');
    if (!state.logoData) { wrap.style.display = 'none'; return; }
    document.getElementById('preview-logo-img').src = state.logoData;
    wrap.style.display = 'flex';
}

// ---------- TOAST ----------
function showToast(message, type) {
    if (!type) type = 'info';
    var container = document.getElementById('toast-container');
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(function () { toast.remove(); }, 300);
    }, 2200);
}

// ---------- COLOR HELPERS ----------
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

// ---------- START ----------
initStudio();
