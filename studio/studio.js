// ============================================================
// BIBELI MIMO – IMAGE STUDIO LOGIC
// Complete, no placeholders
// ============================================================

const data = window.bibleData;

// ---------- STATE ----------
const state = {
    // Verse
    currentBook: 'GEN',
    currentChapter: 1,
    currentVerse: 1,
    stackText: '',

    // Template
    currentCategory: 'photos',
    selectedTemplate: 0,

    // Layout
    ratio: 'square',
    safezone: false,
    borderWidth: 0,
    borderColor: '#ffffff',
    radius: 0,

    // Background effects
    blur: 0,
    darkOverlay: 0,
    gradientOverlay: false,
    gradientColor: '#1a237e',
    gradientOpacity: 40,
    vignette: 0,

    // Text
    fontFamily: 'Poppins',
    fontSize: 24,
    lineSpacing: 1.7,
    letterSpacing: 0,
    padding: 20,
    align: 'center',
    vpos: 'center',
    textColor: '#ffffff',
    shadow: 'strong',

    // Reference
    refShow: false,
    refPos: 'top',
    refSize: 14,
    refColor: '#f59e0b',

    // Secondary
    secText: '',
    secPos: 'above',
    secSize: 12,

    // Logo
    logoData: null,
    logoPos: 'br',
    logoSize: 60,
    logoOpacity: 100,

    // QR
    qrOn: false,
    qrUrl: '',
    qrPos: 'bl',

    // Stack
    stackOn: false,

    // Storage
    favorites: JSON.parse(localStorage.getItem('studio_favorites') || '[]'),
    recentVerses: JSON.parse(localStorage.getItem('studio_recents_verse') || '[]'),
    presets: JSON.parse(localStorage.getItem('studio_presets') || '[]')
};

// ---------- DATA: FONTS ----------
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

// ---------- DATA: TEMPLATES ----------
const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    'linear-gradient(135deg, #c79081 0%, #dfa579 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
    'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
    'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    'linear-gradient(135deg, #0f2027 0%, #203a43 100%, #2c5364 100%)'
];

const solids = ['#1a237e','#b71c1c','#4a148c','#e65100','#00695c','#1565c0','#212121','#880e4f','#33691e','#0d47a1','#5d4037','#01579b','#2e7d32','#37474f','#8e24aa','#00838f','#bf360c','#3e2723','#64b5f6','#FFD700'];

const photoFiles = [
    "29897.webp","29903.webp","29873.webp","29921.webp","29935.webp",
    "29882.webp","29899.webp","29905.webp","29838.webp","29871.webp",
    "29942.webp","29937.webp","29917.webp","29878.webp","29929.webp",
    "29866.webp","29939.webp","29933.webp","29966.webp","29964.webp",
    "29974.webp","29893.webp","29931.webp","29915.webp","29884.webp",
    "29876.webp","29901.webp","29880.webp","29865.webp","29970.webp",
    "29925.webp","29907.webp","29968.webp","29895.webp","29927.webp",
    "29875.webp","29972.webp","29868.webp","29913.webp","29889.webp",
    "29956.webp","29909.webp","29911.webp","29923.webp","29962.webp",
    "29944.webp","29891.webp","29960.webp","29946.webp","29886.webp",
    "29919.webp","29958.webp"
];
const photoUrls = photoFiles.map(f => `/backgrounds/${f}`);

// ---------- COLOR SWATCHES ----------
const COLOR_PRESETS = [
    '#ffffff','#000000','#f59e0b','#ef4444','#10b981','#3b82f6','#8b5cf6','#ec4899',
    '#fbbf24','#14b8a6','#6366f1','#ec4899','#84cc16','#06b6d4','#f97316','#a855f7',
    '#0f172a','#1a237e','#b71c1c','#4a148c','#e65100','#00695c','#1565c0','#880e4f'
];

// ============================================================
// INIT
// ============================================================
async function initStudio() {
    try {
        await data.loadAllData();
        await document.fonts.ready;

        // Load logo if saved
        const savedLogo = localStorage.getItem('studio_logo');
        if (savedLogo) {
            state.logoData = savedLogo;
            showPreviewLogo();
        }

        // Update picker buttons
        state.currentBook = 'GEN';
        state.currentChapter = 1;
        state.currentVerse = 1;

        // Attach events
        attachVerseEvents();
        attachTemplateEvents();
        attachDesignEvents();
        attachExtrasEvents();
        attachPresetEvents();
        attachColorPickerEvents();
        attachFontModalEvents();
        attachActionEvents();

        // Initial render
        updatePickerButtons();
        renderRecentVerses();
        renderTemplates();
        renderPresets();
        updatePreview();

    } catch (e) {
        console.error(e);
        document.getElementById('preview-text').textContent = 'Error: ' + e.message;
    }
}

// ============================================================
// VERSE PICKER
// ============================================================
function attachVerseEvents() {
    document.getElementById('pick-book').onclick = () => openVerseModal('book');
    document.getElementById('pick-chapter').onclick = () => openVerseModal('chapter');
    document.getElementById('pick-verse').onclick = () => openVerseModal('verse');
    document.getElementById('random-verse').onclick = () => {
        const total = data.yoruba.length;
        const v = data.yoruba[Math.floor(Math.random() * total)];
        state.currentBook = data.codes[v.book - 1];
        state.currentChapter = v.chapter;
        state.currentVerse = v.verse;
        updatePickerButtons();
        updatePreview();
        saveRecentVerse();
    };
    document.getElementById('votd-fill').onclick = () => {
        const day = new Date().getDate();
        const v = data.yoruba.find(x => x.book === 19 && x.chapter === day && x.verse === 1) || data.yoruba[day * 500];
        if (v) {
            state.currentBook = data.codes[v.book - 1];
            state.currentChapter = v.chapter;
            state.currentVerse = v.verse;
            updatePickerButtons();
            updatePreview();
            saveRecentVerse();
        }
    };
}

function updatePickerButtons() {
    const bookIdx = data.codes.indexOf(state.currentBook);
    document.getElementById('pick-book').textContent = data.englishNames[bookIdx] || 'Genesis';
    document.getElementById('pick-chapter').textContent = state.currentChapter;
    document.getElementById('pick-verse').textContent = state.currentVerse;
}

let currentModalType = null;
function openVerseModal(type) {
    currentModalType = type;
    const modal = document.getElementById('verse-modal');
    const list = document.getElementById('verse-modal-list');
    const title = document.getElementById('verse-modal-title');
    list.innerHTML = '';

    if (type === 'book') {
        title.textContent = 'Select Book';
        data.englishNames.forEach((name, i) => {
            const div = document.createElement('div');
            div.className = 'modal-list-item';
            div.textContent = name;
            div.onclick = () => {
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
        const bookNum = data.codes.indexOf(state.currentBook) + 1;
        const max = Math.max(...data.yoruba.filter(v => v.book === bookNum).map(v => v.chapter));
        for (let i = 1; i <= max; i++) {
            const div = document.createElement('div');
            div.className = 'modal-list-item';
            div.textContent = i;
            div.onclick = () => {
                state.currentChapter = i;
                state.currentVerse = 1;
                updatePickerButtons();
                closeVerseModal();
                updatePreview();
                saveRecentVerse();
            };
            list.appendChild(div);
        }
    } else if (type === 'verse') {
        title.textContent = 'Select Verse';
        const bookNum = data.codes.indexOf(state.currentBook) + 1;
        const verses = data.yoruba.filter(v => v.book === bookNum && v.chapter === state.currentChapter);
        verses.forEach(v => {
            const div = document.createElement('div');
            div.className = 'modal-list-item';
            div.textContent = v.verse;
            div.onclick = () => {
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
    const key = `${state.currentBook}-${state.currentChapter}-${state.currentVerse}`;
    state.recentVerses = state.recentVerses.filter(k => k !== key);
    state.recentVerses.unshift(key);
    state.recentVerses = state.recentVerses.slice(0, 10);
    localStorage.setItem('studio_recents_verse', JSON.stringify(state.recentVerses));
    renderRecentVerses();
}

function renderRecentVerses() {
    const el = document.getElementById('recent-verses');
    el.innerHTML = '';
    if (state.recentVerses.length === 0) {
        el.innerHTML = '<span class="hint-text" style="margin:0;">No recent verses yet</span>';
        return;
    }
    state.recentVerses.forEach(key => {
        const [b, c, v] = key.split('-');
        const chip = document.createElement('span');
        chip.className = 'recent-chip';
        const bookIdx = data.codes.indexOf(b);
        chip.textContent = `${data.englishNames[bookIdx]} ${c}:${v}`;
        chip.onclick = () => {
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
    document.querySelectorAll('.tpl-tab').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tpl-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentCategory = btn.dataset.cat;
            state.selectedTemplate = 0;
            renderTemplates();
            updatePreview();
        };
    });
}

function renderTemplates() {
    const grid = document.getElementById('template-grid');
    grid.innerHTML = '';

    if (state.currentCategory === 'favorites') {
        if (state.favorites.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;padding:20px;">No favorites yet. Tap the heart on any template.</p>';
            return;
        }
        state.favorites.forEach(tplId => {
            const item = buildTemplateItem(tplId);
            if (item) grid.appendChild(item);
        });
        return;
    }

    let items = [];
    if (state.currentCategory === 'photos') items = photoUrls.map((_, i) => `photo_${i}`);
    else if (state.currentCategory === 'gradients') items = gradients.map((_, i) => `grad_${i}`);
    else items = solids.map((_, i) => `solid_${i}`);

    items.forEach(tplId => {
        const item = buildTemplateItem(tplId);
        if (item) grid.appendChild(item);
    });
}

function buildTemplateItem(tplId) {
    const div = document.createElement('div');
    div.className = 'template-item';

    let bg = '';
    let idx = 0;
    let cat = '';
    if (tplId.startsWith('photo_')) { cat = 'photos'; idx = parseInt(tplId.split('_')[1]); bg = `url('${photoUrls[idx]}') center/cover`; }
    else if (tplId.startsWith('grad_')) { cat = 'gradients'; idx = parseInt(tplId.split('_')[1]); bg = gradients[idx]; }
    else if (tplId.startsWith('solid_')) { cat = 'solids'; idx = parseInt(tplId.split('_')[1]); bg = solids[idx]; }
    else {
        // Legacy format - check if in favorites
        return null;
    }

    div.style.background = bg;
    div.dataset.tplId = tplId;

    if (state.currentCategory === cat && state.selectedTemplate === idx) {
        div.classList.add('selected');
    }

    div.onclick = () => {
        state.currentCategory = cat;
        state.selectedTemplate = idx;
        document.querySelectorAll('.template-item').forEach(t => t.classList.remove('selected'));
        div.classList.add('selected');
        updatePreview();
    };

    const favBtn = document.createElement('button');
    favBtn.className = 'template-fav';
    if (state.favorites.includes(tplId)) favBtn.classList.add('active');
    favBtn.innerHTML = '<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    favBtn.onclick = (e) => {
        e.stopPropagation();
        const i = state.favorites.indexOf(tplId);
        if (i >= 0) state.favorites.splice(i, 1);
        else state.favorites.push(tplId);
        localStorage.setItem('studio_favorites', JSON.stringify(state.favorites));
        favBtn.classList.toggle('active');
        if (state.currentCategory === 'favorites') renderTemplates();
    };
    div.appendChild(favBtn);

    return div;
}

// ============================================================
// DESIGN / EFFECTS
// ============================================================
function attachDesignEvents() {
    // Ratio
    document.querySelectorAll('#ratio-group .opt-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('#ratio-group .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.ratio = btn.dataset.ratio;
            updatePreview();
        };
    });

    // Safe zone
    const safezoneToggle = document.getElementById('safezone-toggle');
    safezoneToggle.onclick = () => {
        state.safezone = !state.safezone;
        safezoneToggle.classList.toggle('active', state.safezone);
        document.getElementById('preview-safezone').style.display = state.safezone ? 'block' : 'none';
    };

    // Border
    document.getElementById('border-slider').oninput = (e) => {
        state.borderWidth = parseInt(e.target.value);
        document.getElementById('border-label').textContent = state.borderWidth;
        updatePreview();
    };
    document.getElementById('border-color-btn').onclick = () => openColorPicker('border');

    // Radius
    document.getElementById('radius-slider').oninput = (e) => {
        state.radius = parseInt(e.target.value);
        document.getElementById('radius-label').textContent = state.radius;
        updatePreview();
    };

    // Blur
    document.getElementById('blur-slider').oninput = (e) => {
        state.blur = parseFloat(e.target.value);
        document.getElementById('blur-label').textContent = state.blur;
        updatePreview();
    };

    // Dark overlay
    document.getElementById('dark-slider').oninput = (e) => {
        state.darkOverlay = parseInt(e.target.value);
        document.getElementById('dark-label').textContent = state.darkOverlay;
        updatePreview();
    };

    // Gradient overlay
    const gradToggle = document.getElementById('gradient-overlay-toggle');
    gradToggle.onclick = () => {
        state.gradientOverlay = !state.gradientOverlay;
        gradToggle.classList.toggle('active', state.gradientOverlay);
        updatePreview();
    };
    document.getElementById('gradient-color-btn').onclick = () => openColorPicker('gradient');
    document.getElementById('gradient-opacity-slider').oninput = (e) => {
        state.gradientOpacity = parseInt(e.target.value);
        updatePreview();
    };

    // Vignette
    document.getElementById('vignette-slider').oninput = (e) => {
        state.vignette = parseInt(e.target.value);
        document.getElementById('vignette-label').textContent = state.vignette;
        updatePreview();
    };

    // Font family
    document.getElementById('font-family-btn').onclick = openFontModal;

    // Font size
    document.getElementById('font-size-slider').oninput = (e) => {
        state.fontSize = parseInt(e.target.value);
        document.getElementById('font-size-label').textContent = state.fontSize;
        updatePreview();
    };

    // Line spacing
    document.getElementById('line-spacing-slider').oninput = (e) => {
        state.lineSpacing = parseFloat(e.target.value);
        document.getElementById('line-spacing-label').textContent = state.lineSpacing;
        updatePreview();
    };

    // Letter spacing
    document.getElementById('letter-spacing-slider').oninput = (e) => {
        state.letterSpacing = parseInt(e.target.value);
        document.getElementById('letter-spacing-label').textContent = state.letterSpacing;
        updatePreview();
    };

    // Padding
    document.getElementById('padding-slider').oninput = (e) => {
        state.padding = parseInt(e.target.value);
        document.getElementById('padding-label').textContent = state.padding;
        updatePreview();
    };

    // Alignment
    document.querySelectorAll('#align-group .opt-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('#align-group .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.align = btn.dataset.align;
            updatePreview();
        };
    });

    // Vertical position
    document.querySelectorAll('#vpos-group .opt-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('#vpos-group .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.vpos = btn.dataset.vpos;
            updatePreview();
        };
    });

    // Text color
    document.getElementById('text-color-btn').onclick = () => openColorPicker('text');

    // Shadow
    document.querySelectorAll('#shadow-group .opt-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('#shadow-group .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.shadow = btn.dataset.shadow;
            updatePreview();
        };
    });

   // Reference
    const refToggle = document.getElementById('ref-toggle');
    refToggle.onclick = () => {
        state.refShow = !state.refShow;
        refToggle.classList.toggle('active', state.refShow);
        updatePreview();
    };
    document.querySelectorAll('#refpos-group .opt-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('#refpos-group .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.refPos = btn.dataset.refpos;
            updatePreview();
        };
    });
    document.getElementById('ref-size-slider').oninput = (e) => {
        state.refSize = parseInt(e.target.value);
        document.getElementById('ref-size-label').textContent = state.refSize;
        updatePreview();
    };
    document.getElementById('ref-color-btn').onclick = () => openColorPicker('ref');
}

// ============================================================
// EXTRAS
// ============================================================
function attachExtrasEvents() {
    // Secondary text
    document.getElementById('secondary-input').oninput = (e) => {
        state.secText = e.target.value;
        updatePreview();
    };
    document.querySelectorAll('#secpos-group .opt-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('#secpos-group .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.secPos = btn.dataset.secpos;
            updatePreview();
        };
    });
    document.getElementById('sec-size-slider').oninput = (e) => {
        state.secSize = parseInt(e.target.value);
        document.getElementById('sec-size-label').textContent = state.secSize;
        updatePreview();
    };

    // Logo
    document.getElementById('logo-upload-btn').onclick = () => document.getElementById('logo-input').click();
    document.getElementById('logo-input').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            state.logoData = ev.target.result;
            localStorage.setItem('studio_logo', state.logoData);
            showPreviewLogo();
            updatePreview();
        };
        reader.readAsDataURL(file);
    };
    document.getElementById('logo-remove-btn').onclick = () => {
        state.logoData = null;
        localStorage.removeItem('studio_logo');
        document.getElementById('preview-logo').style.display = 'none';
        updatePreview();
    };
    document.querySelectorAll('#logo-pos-group .opt-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('#logo-pos-group .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.logoPos = btn.dataset.logopos;
            updatePreview();
        };
    });
    document.getElementById('logo-size-slider').oninput = (e) => {
        state.logoSize = parseInt(e.target.value);
        document.getElementById('logo-size-label').textContent = state.logoSize;
        updatePreview();
    };
    document.getElementById('logo-opacity-slider').oninput = (e) => {
        state.logoOpacity = parseInt(e.target.value);
        document.getElementById('logo-opacity-label').textContent = state.logoOpacity;
        updatePreview();
    };

    // QR
    const qrToggle = document.getElementById('qr-toggle');
    qrToggle.onclick = () => {
        state.qrOn = !state.qrOn;
        qrToggle.classList.toggle('active', state.qrOn);
        updatePreview();
    };
    document.getElementById('qr-url').oninput = (e) => {
        state.qrUrl = e.target.value;
        updatePreview();
    };
    document.querySelectorAll('#qr-pos-group .opt-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('#qr-pos-group .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.qrPos = btn.dataset.qrpos;
            updatePreview();
        };
    });

    // Stack
    const stackToggle = document.getElementById('stack-toggle');
    stackToggle.onclick = () => {
        state.stackOn = !state.stackOn;
        stackToggle.classList.toggle('active', state.stackOn);
        updatePreview();
    };
    document.getElementById('stack-input').oninput = (e) => {
        state.stackText = e.target.value;
        updatePreview();
    };
}

function showPreviewLogo() {
    if (!state.logoData) {
        document.getElementById('preview-logo').style.display = 'none';
        return;
    }
    const el = document.getElementById('preview-logo');
    const img = document.getElementById('preview-logo-img');
    img.src = state.logoData;
    el.style.display = 'flex';
}

// ============================================================
// PRESETS
// ============================================================
function attachPresetEvents() {
    document.getElementById('save-preset-btn').onclick = () => {
        document.getElementById('preset-name-input').value = '';
        document.getElementById('preset-modal').classList.add('show');
    };
    document.getElementById('preset-confirm-btn').onclick = () => {
        const name = document.getElementById('preset-name-input').value.trim() || 'Untitled';
        const preset = {
            id: Date.now(),
            name: name,
            fontFamily: state.fontFamily,
            fontSize: state.fontSize,
            lineSpacing: state.lineSpacing,
            letterSpacing: state.letterSpacing,
            padding: state.padding,
            align: state.align,
            vpos: state.vpos,
            textColor: state.textColor,
            shadow: state.shadow,
            refShow: state.refShow,
            refPos: state.refPos,
            refSize: state.refSize,
            refColor: state.refColor,
            borderWidth: state.borderWidth,
            borderColor: state.borderColor,
            radius: state.radius,
            darkOverlay: state.darkOverlay,
            vignette: state.vignette,
            ratio: state.ratio
        };
        state.presets.unshift(preset);
        state.presets = state.presets.slice(0, 20);
        localStorage.setItem('studio_presets', JSON.stringify(state.presets));
        closePresetModal();
        renderPresets();
    };
}

function closePresetModal() {
    document.getElementById('preset-modal').classList.remove('show');
}

function renderPresets() {
    const el = document.getElementById('presets-list');
    el.innerHTML = '';
    if (state.presets.length === 0) {
        el.innerHTML = '<p class="hint-text">No presets saved yet.</p>';
        return;
    }
    state.presets.forEach(p => {
        const div = document.createElement('div');
        div.className = 'preset-item';
        div.innerHTML = `
            <div class="preset-item-info">
                <div class="preset-item-name">${p.name}</div>
                <div class="preset-item-meta">${p.fontFamily} • ${p.fontSize}px</div>
            </div>
            <div class="preset-item-actions">
                <button class="preset-mini-btn load" data-id="${p.id}">Load</button>
                <button class="preset-mini-btn delete" data-id="${p.id}">Delete</button>
            </div>
        `;
        div.querySelector('.load').onclick = () => loadPreset(p);
        div.querySelector('.delete').onclick = () => deletePreset(p.id);
        el.appendChild(div);
    });
}

function loadPreset(p) {
    Object.assign(state, {
        fontFamily: p.fontFamily,
        fontSize: p.fontSize,
        lineSpacing: p.lineSpacing,
        letterSpacing: p.letterSpacing,
        padding: p.padding,
        align: p.align,
        vpos: p.vpos,
        textColor: p.textColor,
        shadow: p.shadow,
        refShow: p.refShow,
        refPos: p.refPos,
        refSize: p.refSize,
        refColor: p.refColor,
        borderWidth: p.borderWidth,
        borderColor: p.borderColor,
        radius: p.radius,
        darkOverlay: p.darkOverlay,
        vignette: p.vignette,
        ratio: p.ratio
    });

    // Update UI controls
    document.getElementById('font-family-btn').textContent = p.fontFamily;
    document.getElementById('font-size-slider').value = p.fontSize;
    document.getElementById('font-size-label').textContent = p.fontSize;
    document.getElementById('line-spacing-slider').value = p.lineSpacing;
    document.getElementById('line-spacing-label').textContent = p.lineSpacing;
    document.getElementById('letter-spacing-slider').value = p.letterSpacing;
    document.getElementById('letter-spacing-label').textContent = p.letterSpacing;
    document.getElementById('padding-slider').value = p.padding;
    document.getElementById('padding-label').textContent = p.padding;
    document.getElementById('border-slider').value = p.borderWidth;
    document.getElementById('border-label').textContent = p.borderWidth;
    document.getElementById('radius-slider').value = p.radius;
    document.getElementById('radius-label').textContent = p.radius;
    document.getElementById('dark-slider').value = p.darkOverlay;
    document.getElementById('dark-label').textContent = p.darkOverlay;
    document.getElementById('vignette-slider').value = p.vignette;
    document.getElementById('vignette-label').textContent = p.vignette;
    document.getElementById('ref-size-slider').value = p.refSize;
    document.getElementById('ref-size-label').textContent = p.refSize;

    document.getElementById('border-color-btn').style.background = p.borderColor;
    document.getElementById('text-color-btn').style.background = p.textColor;
    document.getElementById('ref-color-btn').style.background = p.refColor;

    document.querySelectorAll('#align-group .opt-btn').forEach(b => b.classList.toggle('active', b.dataset.align === p.align));
    document.querySelectorAll('#vpos-group .opt-btn').forEach(b => b.classList.toggle('active', b.dataset.vpos === p.vpos));
    document.querySelectorAll('#shadow-group .opt-btn').forEach(b => b.classList.toggle('active', b.dataset.shadow === p.shadow));
    document.querySelectorAll('#ratio-group .opt-btn').forEach(b => b.classList.toggle('active', b.dataset.ratio === p.ratio));
    document.querySelectorAll('#refpos-group .opt-btn').forEach(b => b.classList.toggle('active', b.dataset.refpos === p.refPos));

    const refToggle = document.getElementById('ref-toggle');
    refToggle.classList.toggle('active', p.refShow);

    updatePreview();
}

function deletePreset(id) {
    state.presets = state.presets.filter(p => p.id !== id);
    localStorage.setItem('studio_presets', JSON.stringify(state.presets));
    renderPresets();
}

// ============================================================
// COLOR PICKER
// ============================================================
let colorTarget = null;
let pickedColor = { h: 0, s: 0, l: 100 };

function openColorPicker(target) {
    colorTarget = target;
    let current = '#ffffff';
    if (target === 'text') current = state.textColor;
    else if (target === 'ref') current = state.refColor;
    else if (target === 'border') current = state.borderColor;
    else if (target === 'gradient') current = state.gradientColor;

    const rgb = hexToRgb(current);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    pickedColor = hsl;

    document.getElementById('hue-slider').value = hsl.h;
    document.getElementById('sat-slider').value = hsl.s;
    document.getElementById('light-slider').value = hsl.l;
    document.getElementById('hue-label').textContent = hsl.h;
    document.getElementById('sat-label').textContent = hsl.s;
    document.getElementById('light-label').textContent = hsl.l;
    document.getElementById('hex-input').value = current;
    updateColorPreview();

    // Render swatches
    const swatchEl = document.getElementById('color-swatches');
    swatchEl.innerHTML = '';
    COLOR_PRESETS.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'color-swatch';
        btn.style.background = c;
        btn.onclick = () => {
            const rgb2 = hexToRgb(c);
            pickedColor = rgbToHsl(rgb2.r, rgb2.g, rgb2.b);
            document.getElementById('hue-slider').value = pickedColor.h;
            document.getElementById('sat-slider').value = pickedColor.s;
            document.getElementById('light-slider').value = pickedColor.l;
            document.getElementById('hue-label').textContent = pickedColor.h;
            document.getElementById('sat-label').textContent = pickedColor.s;
            document.getElementById('light-label').textContent = pickedColor.l;
            document.getElementById('hex-input').value = c;
            updateColorPreview();
        };
        swatchEl.appendChild(btn);
    });

    document.getElementById('color-modal').classList.add('show');
}

function attachColorPickerEvents() {
    document.getElementById('hue-slider').oninput = (e) => {
        pickedColor.h = parseInt(e.target.value);
        document.getElementById('hue-label').textContent = pickedColor.h;
        updateColorPreview();
    };
    document.getElementById('sat-slider').oninput = (e) => {
        pickedColor.s = parseInt(e.target.value);
        document.getElementById('sat-label').textContent = pickedColor.s;
        updateColorPreview();
    };
    document.getElementById('light-slider').oninput = (e) => {
        pickedColor.l = parseInt(e.target.value);
        document.getElementById('light-label').textContent = pickedColor.l;
        updateColorPreview();
    };
    document.getElementById('hex-input').oninput = (e) => {
        const v = e.target.value.trim();
        if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            const rgb = hexToRgb(v);
            pickedColor = rgbToHsl(rgb.r, rgb.g, rgb.b);
            document.getElementById('hue-slider').value = pickedColor.h;
            document.getElementById('sat-slider').value = pickedColor.s;
            document.getElementById('light-slider').value = pickedColor.l;
            updateColorPreview();
        }
    };
    document.getElementById('color-confirm-btn').onclick = () => {
        const hex = hslToHex(pickedColor.h, pickedColor.s, pickedColor.l);
        applyColor(colorTarget, hex);
        closeColorModal();
    };
}

function updateColorPreview() {
    const hex = hslToHex(pickedColor.h, pickedColor.s, pickedColor.l);
    document.getElementById('color-preview').style.background = hex;
    document.getElementById('hex-input').value = hex;
}

function applyColor(target, hex) {
    if (target === 'text') {
        state.textColor = hex;
        document.getElementById('text-color-btn').style.background = hex;
    } else if (target === 'ref') {
        state.refColor = hex;
        document.getElementById('ref-color-btn').style.background = hex;
    } else if (target === 'border') {
        state.borderColor = hex;
        document.getElementById('border-color-btn').style.background = hex;
    } else if (target === 'gradient') {
        state.gradientColor = hex;
        document.getElementById('gradient-color-btn').style.background = hex;
    }
    updatePreview();
}

function closeColorModal() {
    document.getElementById('color-modal').classList.remove('show');
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
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
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const toHex = (v) => {
        const h2 = Math.round((v + m) * 255).toString(16).padStart(2, '0');
        return h2;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                }
// ============================================================
// FONT PICKER
// ============================================================
function attachFontModalEvents() {
    // rendered on open
}
function openFontModal() {
    const list = document.getElementById('font-list');
    list.innerHTML = '';
    FONTS.forEach(f => {
        const div = document.createElement('div');
        div.className = 'font-item';
        div.innerHTML = `<div style="font-family:${f.css};">The Lord is my shepherd</div><div class="font-item-name">${f.name}</div>`;
        div.onclick = () => {
            state.fontFamily = f.name;
            document.getElementById('font-family-btn').textContent = f.name;
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
// PREVIEW UPDATE
// ============================================================
function updatePreview() {
    const card = document.getElementById('preview-card');
    const bg = document.getElementById('preview-bg');
    const darkOv = document.getElementById('preview-dark-overlay');
    const gradOv = document.getElementById('preview-gradient-overlay');
    const vig = document.getElementById('preview-vignette');
    const textEl = document.getElementById('preview-text');
    const refEl = document.getElementById('preview-ref');
    const secEl = document.getElementById('preview-secondary');
    const logoEl = document.getElementById('preview-logo');
    const qrEl = document.getElementById('preview-qr');
    const deco = document.getElementById('preview-decoration');
    const content = card.querySelector('.preview-content');

    // Ratio
    card.className = 'preview-card ratio-' + state.ratio;

    // Background
    if (state.currentCategory === 'photos') {
        const url = photoUrls[state.selectedTemplate] || photoUrls[0];
        bg.style.background = `url('${url}') center/cover`;
    } else if (state.currentCategory === 'gradients') {
        bg.style.background = gradients[state.selectedTemplate] || gradients[0];
    } else if (state.currentCategory === 'solids') {
        bg.style.background = solids[state.selectedTemplate] || solids[0];
    } else if (state.currentCategory === 'favorites') {
        // Load favorite template
        const tplId = state.favorites[state.selectedTemplate];
        if (tplId) {
            if (tplId.startsWith('photo_')) {
                const i = parseInt(tplId.split('_')[1]);
                bg.style.background = `url('${photoUrls[i]}') center/cover`;
            } else if (tplId.startsWith('grad_')) {
                bg.style.background = gradients[parseInt(tplId.split('_')[1])];
            } else if (tplId.startsWith('solid_')) {
                bg.style.background = solids[parseInt(tplId.split('_')[1])];
            }
        }
    }

    // Blur
    bg.style.filter = state.blur > 0 ? `blur(${state.blur}px)` : 'none';

    // Dark overlay
    darkOv.style.background = `rgba(0,0,0,${state.darkOverlay / 100})`;

    // Gradient overlay
    if (state.gradientOverlay) {
        gradOv.style.display = 'block';
        gradOv.style.background = hexToRgba(state.gradientColor, state.gradientOpacity / 100);
    } else {
        gradOv.style.display = 'none';
    }

    // Vignette
    if (state.vignette > 0) {
        vig.style.boxShadow = `inset 0 0 ${Math.round(state.vignette * 2.5)}px ${Math.round(state.vignette * 1.5)}px rgba(0,0,0,${state.vignette / 100})`;
    } else {
        vig.style.boxShadow = 'none';
    }

    // Border + radius
    if (state.borderWidth > 0) {
        deco.style.border = `${state.borderWidth}px solid ${state.borderColor}`;
    } else {
        deco.style.border = 'none';
    }
    card.style.borderRadius = state.radius + 'px';

    // Text
    const fontCss = FONTS.find(f => f.name === state.fontFamily)?.css || "'Poppins', sans-serif";
    textEl.style.fontFamily = fontCss;
    textEl.style.fontSize = state.fontSize + 'px';
    textEl.style.lineHeight = state.lineSpacing;
    textEl.style.letterSpacing = state.letterSpacing + 'px';
    textEl.style.color = state.textColor;
    textEl.style.textAlign = state.align;
    textEl.style.textShadow = getShadowCSS(state.shadow);

    // Text content
    textEl.innerHTML = buildTextHTML();

    // Reference
    if (state.refShow) {
        refEl.style.display = 'block';
        const refText = `${data.englishNames[data.codes.indexOf(state.currentBook)]} ${state.currentChapter}:${state.currentVerse}`;
        refEl.textContent = refText;
        refEl.style.fontFamily = fontCss;
        refEl.style.fontSize = state.refSize + 'px';
        refEl.style.color = state.refColor;
        refEl.style.order = state.refPos === 'top' ? -1 : state.refPos === 'bottom' ? 10 : 1;
    } else {
        refEl.style.display = 'none';
    }

    // Content padding
    content.style.padding = state.padding + 'px';

    // Vertical position
    if (state.vpos === 'top') content.style.justifyContent = 'flex-start';
    else if (state.vpos === 'bottom') content.style.justifyContent = 'flex-end';
    else content.style.justifyContent = 'center';

    // Secondary text
    if (state.secText) {
        secEl.style.display = 'block';
        secEl.textContent = state.secText;
        secEl.style.fontSize = state.secSize + 'px';
        secEl.style.order = state.secPos === 'top' ? -2 : state.secPos === 'bottom' ? 20 : 0;
    } else {
        secEl.style.display = 'none';
    }

    // Logo
    if (state.logoData) {
        logoEl.style.display = 'flex';
        logoEl.dataset.pos = state.logoPos;
        logoEl.style.width = state.logoSize + 'px';
        logoEl.style.height = state.logoSize + 'px';
        logoEl.style.opacity = state.logoOpacity / 100;
        document.getElementById('preview-logo-img').src = state.logoData;
    } else {
        logoEl.style.display = 'none';
    }

    // QR
    if (state.qrOn && state.qrUrl) {
        qrEl.style.display = 'block';
        qrEl.dataset.pos = state.qrPos;
        qrEl.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(state.qrUrl)}" style="width:100%;height:100%;display:block;border-radius:4px;" crossorigin="anonymous">`;
    } else {
        qrEl.style.display = 'none';
    }
}

function buildTextHTML() {
    let baseText = '';
    if (state.stackOn && state.stackText) {
        // Parse stack text: "GEN-1-1, JHN-3-16"
        const keys = state.stackText.split(',').map(s => s.trim()).filter(Boolean);
        const parts = [];
        keys.forEach(k => {
            const [b, c, v] = k.split('-');
            if (!b || !c || !v) return;
            const bookIdx = data.codes.indexOf(b.toUpperCase());
            if (bookIdx === -1) return;
            const bookNum = bookIdx + 1;
            const verse = data.yoruba.find(x => x.book === bookNum && x.chapter === parseInt(c) && x.verse === parseInt(v));
            if (verse) parts.push(verse.text);
        });
        baseText = parts.join('<br><br>');
    } else {
        const bookNum = data.codes.indexOf(state.currentBook) + 1;
        const verse = data.yoruba.find(x => x.book === bookNum && x.chapter === state.currentChapter && x.verse === state.currentVerse);
        baseText = verse ? verse.text : 'Verse not found';
    }
    return baseText;
}

function getShadowCSS(style) {
    switch (style) {
        case 'none': return 'none';
        case 'soft': return '0 2px 8px rgba(0,0,0,0.4)';
        case 'strong': return '0 4px 15px rgba(0,0,0,0.75)';
        case 'glow': return '0 0 25px rgba(255,255,255,0.7), 0 0 50px rgba(255,255,255,0.3)';
        case 'outline': return '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
        default: return 'none';
    }
}

function hexToRgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${alpha})`;
}

// ============================================================
// ACTION: DOWNLOAD & SHARE
// ============================================================
function attachActionEvents() {
    document.getElementById('download-btn').onclick = downloadImage;
    document.getElementById('share-btn').onclick = shareImage;
}

// ============================================================
// CANVAS: GENERATE IMAGE
// ============================================================
async function generateCanvas() {
    await document.fonts.ready;

    const canvas = document.createElement('canvas');
    let W, H;
    if (state.ratio === 'square') { W = 1080; H = 1080; }
    else if (state.ratio === 'portrait') { W = 1080; H = 1350; }
    else if (state.ratio === 'story') { W = 1080; H = 1920; }
    else if (state.ratio === 'landscape') { W = 1920; H = 1080; }
    else { W = 1080; H = 1440; } // pin

    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 1) Background
    if (state.currentCategory === 'photos' || (state.currentCategory === 'favorites' && state.favorites[state.selectedTemplate]?.startsWith('photo_'))) {
        let url;
        if (state.currentCategory === 'photos') url = photoUrls[state.selectedTemplate];
        else {
            const idx = parseInt(state.favorites[state.selectedTemplate].split('_')[1]);
            url = photoUrls[idx];
        }
        try {
            const img = await loadImage(url);
            if (state.blur > 0) ctx.filter = `blur(${state.blur * 4}px)`;
            const scale = Math.max(W / img.width, H / img.height) * 1.05;
            const sw = W / scale, sh = H / scale;
            const sx = (img.width - sw) / 2;
            const sy = (img.height - sh) / 2;
            ctx.drawImage(img, sx, sy, sw, sh, -W * 0.025, -H * 0.025, W * 1.05, H * 1.05);
            ctx.filter = 'none';
        } catch (e) {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, W, H);
        }
    } else if (state.currentCategory === 'gradients' || (state.currentCategory === 'favorites' && state.favorites[state.selectedTemplate]?.startsWith('grad_'))) {
        let g;
        if (state.currentCategory === 'gradients') g = gradients[state.selectedTemplate];
        else {
            const idx = parseInt(state.favorites[state.selectedTemplate].split('_')[1]);
            g = gradients[idx];
        }
        const parts = g.match(/#[0-9a-fA-F]{6}/g);
        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, parts[0]);
        grad.addColorStop(1, parts[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    } else {
        let color;
        if (state.currentCategory === 'solids') color = solids[state.selectedTemplate];
        else {
            const idx = parseInt(state.favorites[state.selectedTemplate].split('_')[1]);
            color = solids[idx];
        }
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, W, H);
    }

    // 2) Dark overlay
    if (state.darkOverlay > 0) {
        ctx.fillStyle = `rgba(0,0,0,${state.darkOverlay / 100})`;
        ctx.fillRect(0, 0, W, H);
    }

    // 3) Gradient overlay
    if (state.gradientOverlay) {
        ctx.fillStyle = hexToRgba(state.gradientColor, state.gradientOpacity / 100);
        ctx.fillRect(0, 0, W, H);
    }

    // 4) Vignette
    if (state.vignette > 0) {
        const vig = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.75);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, `rgba(0,0,0,${state.vignette / 100})`);
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);
    }

    // 5) Text
    const fontFamily = state.fontFamily;
    const fontCss = `${fontFamily}, sans-serif`;

    // Compute font size scaled up from preview
    const scaleFactor = W / 400;
    const fontSize = state.fontSize * scaleFactor * 0.75;
    const lineHeight = fontSize * state.lineSpacing;
    const padding = state.padding * scaleFactor * 0.9;
    const maxWidth = W - (padding * 2);

    // Reference
    const refText = `${data.englishNames[data.codes.indexOf(state.currentBook)]} ${state.currentChapter}:${state.currentVerse}`;
    const refFontSize = state.refSize * scaleFactor * 0.75;

    // Get main text
    let mainText = '';
    if (state.stackOn && state.stackText) {
        const keys = state.stackText.split(',').map(s => s.trim()).filter(Boolean);
        const parts = [];
        keys.forEach(k => {
            const [b, c, v] = k.split('-');
            if (!b || !c || !v) return;
            const bookIdx = data.codes.indexOf(b.toUpperCase());
            if (bookIdx === -1) return;
            const bookNum = bookIdx + 1;
            const verse = data.yoruba.find(x => x.book === bookNum && x.chapter === parseInt(c) && x.verse === parseInt(v));
            if (verse) parts.push(verse.text);
        });
        mainText = parts.join('\n\n');
    } else {
        const bookNum = data.codes.indexOf(state.currentBook) + 1;
        const verse = data.yoruba.find(x => x.book === bookNum && x.chapter === state.currentChapter && x.verse === state.currentVerse);
        mainText = verse ? verse.text : '';
    }

    // Reference drawing
    ctx.save();
    ctx.font = `700 ${refFontSize}px ${fontCss}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = state.refColor;
    applyShadow(ctx, state.shadow === 'soft' ? 'soft' : 'strong');
    if (state.refShow && state.refPos === 'top') {
        ctx.fillText(refText, W / 2, padding);
    }
    ctx.restore();

    // Auto-fit main text
    const fontStack = `700 ${fontSize}px ${fontCss}`;
    ctx.font = fontStack;

    // Wrap into lines
    const lines = wrapText(ctx, mainText, maxWidth);

    // Draw main text
    ctx.save();
    ctx.font = fontStack;
    ctx.textAlign = state.align === 'center' ? 'center' : state.align === 'left' ? 'left' : 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = state.textColor;
    applyShadow(ctx, state.shadow);

    const totalTextHeight = lines.length * lineHeight;
    let startY;
    const textX = state.align === 'center' ? W / 2 : state.align === 'left' ? padding : W - padding;

    if (state.vpos === 'top') startY = padding + (state.refShow && state.refPos === 'top' ? refFontSize * 2 : 0);
    else if (state.vpos === 'bottom') startY = H - padding - totalTextHeight - (state.refShow && state.refPos === 'bottom' ? refFontSize * 2 : 0);
    else startY = (H - totalTextHeight) / 2 + (state.refShow && state.refPos === 'top' ? refFontSize : 0);

    lines.forEach((line, i) => {
        ctx.fillText(line, textX, startY + i * lineHeight);
    });
    ctx.restore();

    // Reference at bottom
    if (state.refShow && state.refPos === 'bottom') {
        ctx.save();
        ctx.font = `700 ${refFontSize}px ${fontCss}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = state.refColor;
        applyShadow(ctx, 'strong');
        ctx.fillText(refText, W / 2, H - padding);
        ctx.restore();
    }

    // 6) Secondary text
    if (state.secText) {
        ctx.save();
        const secFontSize = state.secSize * scaleFactor * 0.75;
        ctx.font = `600 ${secFontSize}px ${fontCss}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = state.textColor;
        ctx.globalAlpha = 0.85;
        applyShadow(ctx, 'strong');
        let secY = state.secPos === 'top' ? padding * 2.5 : state.secPos === 'bottom' ? H - padding * 2 : H / 2 - totalTextHeight / 2 - 40;
        ctx.fillText(state.secText, W / 2, secY);
        ctx.restore();
    }

    // 7) Border
    if (state.borderWidth > 0) {
        const bw = state.borderWidth * scaleFactor * 0.9;
        ctx.save();
        ctx.strokeStyle = state.borderColor;
        ctx.lineWidth = bw;
        ctx.strokeRect(bw / 2, bw / 2, W - bw, H - bw);
        ctx.restore();
    }

    // 8) Logo
    if (state.logoData) {
        try {
            const logoImg = await loadImage(state.logoData);
            const size = state.logoSize * scaleFactor * 0.9;
            const gap = padding * 0.7;
            let lx, ly;
            if (state.logoPos === 'tl') { lx = gap; ly = gap; }
            else if (state.logoPos === 'tr') { lx = W - gap - size; ly = gap; }
            else if (state.logoPos === 'bl') { lx = gap; ly = H - gap - size; }
            else { lx = W - gap - size; ly = H - gap - size; }

            ctx.save();
            ctx.globalAlpha = state.logoOpacity / 100;
            const logoScale = Math.min(size / logoImg.width, size / logoImg.height);
            const lw = logoImg.width * logoScale;
            const lh = logoImg.height * logoScale;
            ctx.drawImage(logoImg, lx + (size - lw) / 2, ly + (size - lh) / 2, lw, lh);
            ctx.restore();
        } catch (e) { /* ignore logo error */ }
    }

    // 9) QR
    if (state.qrOn && state.qrUrl) {
        try {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(state.qrUrl)}`;
            const qrImg = await loadImage(qrUrl, true);
            const size = 100 * scaleFactor * 0.5;
            const gap = padding * 0.7;
            let qx, qy;
            if (state.qrPos === 'tl') { qx = gap; qy = gap; }
            else if (state.qrPos === 'tr') { qx = W - gap - size; qy = gap; }
            else if (state.qrPos === 'bl') { qx = gap; qy = H - gap - size; }
            else { qx = W - gap - size; qy = H - gap - size; }

            ctx.save();
            ctx.fillStyle = 'white';
            ctx.fillRect(qx - 4, qy - 4, size + 8, size + 8);
            ctx.drawImage(qrImg, qx, qy, size, size);
            ctx.restore();
        } catch (e) { /* ignore QR error */ }
    }

    // 10) Watermark
    ctx.save();
    ctx.font = `400 ${Math.round(W * 0.018)}px 'Poppins', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Bibeli Mimo', W / 2, H - padding * 0.4);
    ctx.restore();

    return canvas;
}

function wrapText(ctx, text, maxWidth) {
    const paragraphs = text.split('\n');
    const allLines = [];
    paragraphs.forEach(para => {
        const words = para.split(' ');
        let line = '';
        words.forEach(word => {
            const test = line ? line + ' ' + word : word;
            const w = ctx.measureText(test).width;
            if (w > maxWidth && line) {
                allLines.push(line);
                line = word;
            } else {
                line = test;
            }
        });
        if (line) allLines.push(line);
    });
    return allLines;
}

function applyShadow(ctx, style) {
    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    if (style === 'soft') {
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
    } else if (style === 'strong') {
        ctx.shadowColor = 'rgba(0,0,0,0.75)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 6;
    } else if (style === 'glow') {
        ctx.shadowColor = 'rgba(255,255,255,0.7)';
        ctx.shadowBlur = 25;
    } else if (style === 'outline') {
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }
}

function loadImage(src, crossOrigin = true) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        if (crossOrigin) img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
                                         }
// ============================================================
// DOWNLOAD & SHARE
// ============================================================
async function downloadImage() {
    try {
        const canvas = await generateCanvas();
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bible-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
    } catch (e) {
        alert('Failed to generate image: ' + e.message);
    }
}

async function shareImage() {
    try {
        const canvas = await generateCanvas();
        canvas.toBlob(async (blob) => {
            const file = new File([blob], `bible-${Date.now()}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Bible Verse',
                        text: 'Shared from Bibeli Mimo'
                    });
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        downloadImage();
                    }
                }
            } else {
                downloadImage();
            }
        }, 'image/png', 1.0);
    } catch (e) {
        alert('Failed to share image: ' + e.message);
    }
}

// ============================================================
// START
// ============================================================
initStudio();
            
