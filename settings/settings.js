// ============================================================
// SETTINGS — Every setting works and saves to localStorage
// ============================================================

(function () {
    'use strict';

    window.SharedNav.init({
        title: 'Settings',
        showBack: true,
        showSearch: false,
        showBell: false,
        showMenu: false,
        showBottomNav: true,
        activeNav: 'more'
    });

    // -------- STORAGE HELPERS --------
    function getSetting(key, fallback) {
        var v = localStorage.getItem(key);
        return v === null ? fallback : v;
    }
    function setSetting(key, value) {
        localStorage.setItem(key, String(value));
    }
    function getBool(key, fallback) {
        var v = localStorage.getItem(key);
        if (v === null) return fallback;
        return v === 'true';
    }
    function getNum(key, fallback) {
        var v = localStorage.getItem(key);
        if (v === null) return fallback;
        var n = parseFloat(v);
        return isNaN(n) ? fallback : n;
    }

    // -------- TOAST --------
    function showToast(msg, type) {
        if (!type) type = 'info';
        var c = document.getElementById('toast-container');
        var t = document.createElement('div');
        t.className = 'toast ' + type;
        t.textContent = msg;
        c.appendChild(t);
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2200);
    }

    // -------- THEME --------
    function applyTheme(theme) {
        document.body.classList.remove('dark', 'church');
        if (theme === 'dark') document.body.classList.add('dark');
        if (theme === 'church') document.body.classList.add('church');
    }
    function updateThemeUI() {
        var t = getSetting('theme', 'light');
        document.querySelectorAll('#theme-control .seg-btn').forEach(function (b) {
            b.classList.toggle('active', b.dataset.theme === t);
        });
    }

    // -------- FONT FAMILY --------
    var FONT_MAP = {
        'sans':    "'Inter', -apple-system, sans-serif",
        'serif':   "'Lora', Georgia, serif",
        'display': "'Playfair Display', Georgia, serif",
        'classic': "'Merriweather', Georgia, serif",
        'elegant': "'Cormorant Garamond', Georgia, serif",
        'modern':  "'Josefin Sans', sans-serif"
    };
    function updateFontUI() {
        var f = getSetting('fontFamily', 'serif');
        document.querySelectorAll('#font-grid .font-card').forEach(function (c) {
            c.classList.toggle('active', c.dataset.font === f);
        });
    }

    // -------- PREVIEW --------
    function updatePreview() {
        var p = document.getElementById('preview-content');
        var yo = document.getElementById('preview-yo');
        var en = document.getElementById('preview-en');

        var fontKey = getSetting('fontFamily', 'serif');
        var fontCss = FONT_MAP[fontKey] || FONT_MAP.serif;
        var fontSize = getNum('readerFontSize', 100);
        var lineSpacing = getNum('readerLineSpacing', 1.7);
        var letterSpacing = getNum('readerLetterSpacing', 0);
        var align = getSetting('readerAlign', 'left');

        p.style.fontFamily = fontCss;
        p.style.fontSize = fontSize + '%';
        p.style.lineHeight = lineSpacing;
        p.style.letterSpacing = letterSpacing + 'px';
        p.style.textAlign = align;

        yo.style.fontFamily = fontCss;
        en.style.fontFamily = fontCss;
    }

    // -------- APPLY ALL --------
    function applyAll() {
        applyTheme(getSetting('theme', 'light'));
        updateThemeUI();
        updateFontUI();

        // Sliders
        var fontSize = getNum('readerFontSize', 100);
        document.getElementById('font-size').value = fontSize;
        document.getElementById('font-size-value').textContent = fontSize + '%';

        var lineSpacing = getNum('readerLineSpacing', 1.7);
        document.getElementById('line-spacing').value = lineSpacing;
        document.getElementById('line-spacing-value').textContent = lineSpacing.toFixed(1);

        var verseSpacing = getNum('readerVerseSpacing', 1.5);
        document.getElementById('verse-spacing').value = verseSpacing;
        document.getElementById('verse-spacing-value').textContent = verseSpacing.toFixed(1);

        var padding = getNum('readerTextPadding', 20);
        document.getElementById('text-padding').value = padding;
        document.getElementById('text-padding-value').textContent = padding + 'px';

        var letterSpacing = getNum('readerLetterSpacing', 0);
        document.getElementById('letter-spacing').value = letterSpacing;
        document.getElementById('letter-spacing-value').textContent = letterSpacing;

        // Toggles
        document.getElementById('parallel-toggle').classList.toggle('active', getBool('parallelView', false));
        document.getElementById('verse-num-toggle').classList.toggle('active', getBool('showVerseNumbers', true));
        document.getElementById('red-letter-toggle').classList.toggle('active', getBool('redLetterMode', false));

        // Alignment
        var align = getSetting('readerAlign', 'left');
        document.querySelectorAll('#align-control .seg-btn').forEach(function (b) {
            b.classList.toggle('active', b.dataset.align === align);
        });

        // Language
        var lang = getSetting('defaultLanguage', 'both');
        document.querySelectorAll('#lang-control .seg-btn').forEach(function (b) {
            b.classList.toggle('active', b.dataset.lang === lang);
        });

        // Reminder
        var reminderOn = getBool('reminderOn', false);
        document.getElementById('reminder-toggle').classList.toggle('active', reminderOn);
        document.getElementById('reminder-time-row').style.display = reminderOn ? 'flex' : 'none';
        document.getElementById('reminder-time').value = getSetting('reminderTime', '08:00');

        updatePreview();
    }

    // -------- WIRE THEME --------
    document.querySelectorAll('#theme-control .seg-btn').forEach(function (b) {
        b.onclick = function () {
            var t = this.dataset.theme;
            setSetting('theme', t);
            applyTheme(t);
            updateThemeUI();
            updatePreview();
            showToast('Theme: ' + t, 'success');
        };
    });

    // -------- WIRE FONT --------
    document.querySelectorAll('#font-grid .font-card').forEach(function (c) {
        c.onclick = function () {
            var f = this.dataset.font;
            setSetting('fontFamily', f);
            updateFontUI();
            updatePreview();
            showToast('Font updated', 'success');
        };
    });

    // -------- WIRE SLIDERS --------
    document.getElementById('font-size').oninput = function () {
        var v = parseInt(this.value);
        setSetting('readerFontSize', v);
        document.getElementById('font-size-value').textContent = v + '%';
        updatePreview();
    };
    document.getElementById('line-spacing').oninput = function () {
        var v = parseFloat(this.value);
        setSetting('readerLineSpacing', v);
        document.getElementById('line-spacing-value').textContent = v.toFixed(1);
        updatePreview();
    };
    document.getElementById('verse-spacing').oninput = function () {
        var v = parseFloat(this.value);
        setSetting('readerVerseSpacing', v);
        document.getElementById('verse-spacing-value').textContent = v.toFixed(1);
        updatePreview();
    };
    document.getElementById('text-padding').oninput = function () {
        var v = parseInt(this.value);
        setSetting('readerTextPadding', v);
        document.getElementById('text-padding-value').textContent = v + 'px';
        updatePreview();
    };
    document.getElementById('letter-spacing').oninput = function () {
        var v = parseFloat(this.value);
        setSetting('readerLetterSpacing', v);
        document.getElementById('letter-spacing-value').textContent = v;
        updatePreview();
    };

    // -------- WIRE TOGGLES --------
    document.getElementById('parallel-toggle').onclick = function () {
        var on = !this.classList.contains('active');
        this.classList.toggle('active', on);
        setSetting('parallelView', on);
        showToast(on ? 'Parallel view on' : 'Parallel view off', 'success');
    };
    document.getElementById('verse-num-toggle').onclick = function () {
        var on = !this.classList.contains('active');
        this.classList.toggle('active', on);
        setSetting('showVerseNumbers', on);
        showToast(on ? 'Verse numbers on' : 'Verse numbers off', 'success');
    };
    document.getElementById('red-letter-toggle').onclick = function () {
        var on = !this.classList.contains('active');
        this.classList.toggle('active', on);
        setSetting('redLetterMode', on);
        showToast(on ? 'Red letters on' : 'Red letters off', 'success');
    };

    // -------- WIRE ALIGNMENT --------
    document.querySelectorAll('#align-control .seg-btn').forEach(function (b) {
        b.onclick = function () {
            var a = this.dataset.align;
            setSetting('readerAlign', a);
            document.querySelectorAll('#align-control .seg-btn').forEach(function (x) {
                x.classList.toggle('active', x.dataset.align === a);
            });
            updatePreview();
            showToast('Alignment: ' + a, 'success');
        };
    });

    // -------- WIRE LANGUAGE --------
    document.querySelectorAll('#lang-control .seg-btn').forEach(function (b) {
        b.onclick = function () {
            var l = this.dataset.lang;
            setSetting('defaultLanguage', l);
            document.querySelectorAll('#lang-control .seg-btn').forEach(function (x) {
                x.classList.toggle('active', x.dataset.lang === l);
            });
            showToast('Default language: ' + l, 'success');
        };
    });

    // -------- WIRE REMINDER --------
    document.getElementById('reminder-toggle').onclick = function () {
        var on = !this.classList.contains('active');
        this.classList.toggle('active', on);
        setSetting('reminderOn', on);
        document.getElementById('reminder-time-row').style.display = on ? 'flex' : 'none';

        if (on) {
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission().then(function (perm) {
                    if (perm === 'granted') showToast('Reminder on', 'success');
                    else {
                        showToast('Notifications blocked', 'error');
                        document.getElementById('reminder-toggle').classList.remove('active');
                        setSetting('reminderOn', false);
                        document.getElementById('reminder-time-row').style.display = 'none';
                    }
                });
            } else if ('Notification' in window && Notification.permission === 'denied') {
                showToast('Notifications blocked in settings', 'error');
                this.classList.remove('active');
                setSetting('reminderOn', false);
                document.getElementById('reminder-time-row').style.display = 'none';
            } else {
                showToast('Reminder on', 'success');
            }
        } else {
            showToast('Reminder off', 'info');
        }
    };
    document.getElementById('reminder-time').onchange = function () {
        setSetting('reminderTime', this.value);
        showToast('Reminder time: ' + this.value, 'success');
    };

    // -------- CONFIRM MODAL --------
    var confirmCallback = null;
    function openConfirm(title, message, cb) {
        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-message').textContent = message;
        confirmCallback = cb;
        document.getElementById('confirm-overlay').classList.add('show');
    }
    function closeConfirm() {
        document.getElementById('confirm-overlay').classList.remove('show');
        confirmCallback = null;
    }
    document.getElementById('confirm-cancel').onclick = closeConfirm;
    document.getElementById('confirm-confirm').onclick = function () {
        if (confirmCallback) confirmCallback();
        closeConfirm();
    };
    document.getElementById('confirm-overlay').onclick = function (e) {
        if (e.target.id === 'confirm-overlay') closeConfirm();
    };

    // -------- EXPORT --------
    document.getElementById('export-data-btn').onclick = function () {
        var data = {
            exportedAt: new Date().toISOString(),
            appVersion: '1.0.0',
            saved: JSON.parse(localStorage.getItem('saved') || '[]'),
            notes: JSON.parse(localStorage.getItem('notes') || '{}'),
            highlights: JSON.parse(localStorage.getItem('highlights') || '{}'),
            history: JSON.parse(localStorage.getItem('history') || '[]'),
            completedChapters: JSON.parse(localStorage.getItem('completedChapters') || '[]'),
            currentPlan: localStorage.getItem('currentPlan') || null,
            streak: JSON.parse(localStorage.getItem('streak') || '{"days":0,"lastDate":"","best":0}')
        };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var d = new Date();
        var stamp = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
        var a = document.createElement('a');
        a.href = url;
        a.download = 'bibeli-mimo-backup-' + stamp + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
        showToast('Backup downloaded', 'success');
    };

    // -------- CLEAR ACTIONS --------
    document.getElementById('clear-saved').onclick = function () {
        openConfirm('Clear Saved Verses?', 'All saved verses will be removed.', function () {
            localStorage.removeItem('saved');
            showToast('Saved verses cleared', 'success');
        });
    };
    document.getElementById('clear-notes').onclick = function () {
        openConfirm('Clear Notes?', 'All notes will be removed.', function () {
            localStorage.removeItem('notes');
            showToast('Notes cleared', 'success');
        });
    };
    document.getElementById('clear-highlights').onclick = function () {
        openConfirm('Clear Highlights?', 'All highlights will be removed.', function () {
            localStorage.removeItem('highlights');
            showToast('Highlights cleared', 'success');
        });
    };
    document.getElementById('clear-history').onclick = function () {
        openConfirm('Clear History?', 'Your reading history will be removed.', function () {
            localStorage.removeItem('history');
            localStorage.removeItem('completedChapters');
            showToast('History cleared', 'success');
        });
    };
    document.getElementById('reset-all').onclick = function () {
        openConfirm('Reset Everything?', 'This will erase ALL your data — saved verses, notes, highlights, history, settings, and Studio presets.', function () {
            var keys = [
                'saved', 'notes', 'highlights', 'history', 'completedChapters',
                'streak', 'lastRead', 'currentPlan',
                'readerFontSize', 'readerLineSpacing', 'readerVerseSpacing',
                'readerTextPadding', 'readerLetterSpacing', 'readerAlign',
                'fontFamily', 'parallelView', 'showVerseNumbers', 'redLetterMode',
                'theme', 'defaultLanguage',
                'reminderOn', 'reminderTime',
                'studio_favorites', 'studio_recents_verse', 'studio_recent_templates',
                'studio_presets', 'studio_brand_colors', 'studio_logo',
                'studio_export_format', 'studio_export_quality', 'studio_export_res',
                'studio_draft', 'studio_onboarded', 'studio_export_state'
            ];
            for (var i = 0; i < keys.length; i++) localStorage.removeItem(keys[i]);
            showToast('Everything reset', 'success');
            setTimeout(function () { window.location.href = '/'; }, 1200);
        });
    };

    // -------- INIT --------
    applyAll();

})();
