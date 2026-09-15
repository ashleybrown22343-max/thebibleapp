// ============================================================
// SETTINGS PAGE
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

    // -------- TOAST --------
    function showToast(msg, type) {
        if (!type) type = 'info';
        var container = document.getElementById('toast-container');
        var t = document.createElement('div');
        t.className = 'toast ' + type;
        t.textContent = msg;
        container.appendChild(t);
        setTimeout(function () {
            if (t.parentNode) t.parentNode.removeChild(t);
        }, 2400);
    }

    // -------- THEME --------
    function getTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    function applyTheme(theme) {
        document.body.classList.remove('dark', 'church');
        if (theme === 'dark') document.body.classList.add('dark');
        if (theme === 'church') document.body.classList.add('church');
    }

    function updateThemeButtons() {
        var theme = getTheme();
        var btns = document.querySelectorAll('#theme-control .seg-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.toggle('active', btns[i].dataset.theme === theme);
        }
    }

    function wireTheme() {
        var btns = document.querySelectorAll('#theme-control .seg-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].onclick = function () {
                var theme = this.dataset.theme;
                localStorage.setItem('theme', theme);
                applyTheme(theme);
                updateThemeButtons();
                showToast('Theme: ' + theme, 'success');
            };
        }
    }

    // -------- READING FONT SIZE --------
    function getReadingFontSize() {
        return parseInt(localStorage.getItem('readingFontSize') || '100');
    }

    function wireReadingFontSize() {
        var slider = document.getElementById('reading-font-size');
        var value = document.getElementById('reading-font-value');
        slider.value = getReadingFontSize();
        value.textContent = slider.value + '%';

        slider.oninput = function () {
            localStorage.setItem('readingFontSize', this.value);
            value.textContent = this.value + '%';
        };

        slider.onchange = function () {
            showToast('Reading font: ' + this.value + '%', 'success');
        };
    }

    // -------- LANGUAGE --------
    function getDefaultLanguage() {
        return localStorage.getItem('defaultLanguage') || 'both';
    }

    function updateLangButtons() {
        var lang = getDefaultLanguage();
        var btns = document.querySelectorAll('#lang-control .seg-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.toggle('active', btns[i].dataset.lang === lang);
        }
    }

    function wireLanguage() {
        var btns = document.querySelectorAll('#lang-control .seg-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].onclick = function () {
                var lang = this.dataset.lang;
                localStorage.setItem('defaultLanguage', lang);
                updateLangButtons();
                var label = lang === 'both' ? 'Both' : (lang === 'yo' ? 'Yoruba' : 'English');
                showToast('Default language: ' + label, 'success');
            };
        }
    }

    // -------- NOTIFICATIONS --------
    function wireReminder() {
        var toggle = document.getElementById('reminder-toggle');
        var timeRow = document.getElementById('reminder-time-row');
        var timeInput = document.getElementById('reminder-time');

        var reminderOn = localStorage.getItem('reminderOn') === 'true';
        var reminderTime = localStorage.getItem('reminderTime') || '08:00';

        toggle.classList.toggle('active', reminderOn);
        timeRow.style.display = reminderOn ? 'flex' : 'none';
        timeInput.value = reminderTime;

        toggle.onclick = function () {
            var isOn = !this.classList.contains('active');
            this.classList.toggle('active', isOn);
            localStorage.setItem('reminderOn', isOn ? 'true' : 'false');
            timeRow.style.display = isOn ? 'flex' : 'none';

            if (isOn) {
                // Request notification permission
                if ('Notification' in window && Notification.permission === 'default') {
                    Notification.requestPermission().then(function (perm) {
                        if (perm === 'granted') {
                            showToast('Reminder turned on', 'success');
                        } else {
                            showToast('Notification permission denied', 'error');
                            toggle.classList.remove('active');
                            localStorage.setItem('reminderOn', 'false');
                            timeRow.style.display = 'none';
                        }
                    });
                } else if (Notification.permission === 'denied') {
                    showToast('Notifications blocked in browser settings', 'error');
                    this.classList.remove('active');
                    localStorage.setItem('reminderOn', 'false');
                    timeRow.style.display = 'none';
                } else {
                    showToast('Reminder turned on', 'success');
                }
            } else {
                showToast('Reminder turned off', 'info');
            }
        };

        timeInput.onchange = function () {
            localStorage.setItem('reminderTime', this.value);
            showToast('Reminder time: ' + this.value, 'success');
        };
    }

    // -------- CONFIRM MODAL --------
    var confirmCallback = null;

    function openConfirm(title, message, onConfirm) {
        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-message').textContent = message;
        confirmCallback = onConfirm;
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

    // -------- EXPORT DATA --------
    function wireExportData() {
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

            var json = JSON.stringify(data, null, 2);
            var blob = new Blob([json], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var now = new Date();
            var stamp = now.getFullYear() + pad2(now.getMonth() + 1) + pad2(now.getDate());
            var a = document.createElement('a');
            a.href = url;
            a.download = 'bibeli-mimo-backup-' + stamp + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
            showToast('Backup downloaded', 'success');
        };
    }

    function pad2(n) { return (n < 10 ? '0' : '') + n; }

    // -------- CLEAR ACTIONS --------
    function wireClearActions() {
        document.getElementById('clear-saved').onclick = function () {
            openConfirm(
                'Clear Saved Verses?',
                'This will remove all your saved verses. This cannot be undone.',
                function () {
                    localStorage.removeItem('saved');
                    showToast('Saved verses cleared', 'success');
                }
            );
        };

        document.getElementById('clear-notes').onclick = function () {
            openConfirm(
                'Clear Notes?',
                'This will remove all your notes. This cannot be undone.',
                function () {
                    localStorage.removeItem('notes');
                    showToast('Notes cleared', 'success');
                }
            );
        };

        document.getElementById('clear-highlights').onclick = function () {
            openConfirm(
                'Clear Highlights?',
                'This will remove all your highlights. This cannot be undone.',
                function () {
                    localStorage.removeItem('highlights');
                    showToast('Highlights cleared', 'success');
                }
            );
        };

        document.getElementById('clear-history').onclick = function () {
            openConfirm(
                'Clear History?',
                'This will remove your reading history. This cannot be undone.',
                function () {
                    localStorage.removeItem('history');
                    localStorage.removeItem('completedChapters');
                    showToast('History cleared', 'success');
                }
            );
        };

        document.getElementById('reset-all').onclick = function () {
            openConfirm(
                'Reset Everything?',
                'This will erase ALL your data — saved verses, notes, highlights, history, settings, and Studio presets. This cannot be undone.',
                function () {
                    var keysToClear = [
                        'saved', 'notes', 'highlights', 'history',
                        'completedChapters', 'streak', 'lastRead',
                        'currentPlan', 'readingFontSize', 'fontSize',
                        'lineSpacing', 'theme', 'defaultLanguage',
                        'reminderOn', 'reminderTime',
                        'studio_favorites', 'studio_recents_verse',
                        'studio_recent_templates', 'studio_presets',
                        'studio_brand_colors', 'studio_logo',
                        'studio_export_format', 'studio_export_quality',
                        'studio_export_res', 'studio_draft',
                        'studio_onboarded', 'studio_export_state'
                    ];
                    for (var i = 0; i < keysToClear.length; i++) {
                        localStorage.removeItem(keysToClear[i]);
                    }
                    showToast('Everything reset', 'success');
                    setTimeout(function () {
                        window.location.href = '/';
                    }, 1200);
                }
            );
        };
    }

    // -------- BOOT --------
    function boot() {
        // Apply current theme immediately
        applyTheme(getTheme());

        updateThemeButtons();
        updateLangButtons();

        wireTheme();
        wireReadingFontSize();
        wireLanguage();
        wireReminder();
        wireExportData();
        wireClearActions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
