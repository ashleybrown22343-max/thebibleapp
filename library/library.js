// ============================================================
// LIBRARY — Saved / Notes / Highlights / History
// ============================================================

(function () {
    'use strict';

    window.SharedNav.init({
        title: 'My Library',
        showBack: false,
        showSearch: false,
        showBell: false,
        showMenu: true,
        showBottomNav: true,
        activeNav: 'library'
    });

    var currentTab = 'saved';

    // -------- LOCAL STORAGE --------
    function getSaved() {
        try { return JSON.parse(localStorage.getItem('saved') || '[]'); } catch (e) { return []; }
    }
    function getNotes() {
        try { return JSON.parse(localStorage.getItem('notes') || '{}'); } catch (e) { return {}; }
    }
    function getHighlights() {
        try { return JSON.parse(localStorage.getItem('highlights') || '{}'); } catch (e) { return {}; }
    }
    function getHistory() {
        try { return JSON.parse(localStorage.getItem('history') || '[]'); } catch (e) { return []; }
    }
    function setSaved(arr) { localStorage.setItem('saved', JSON.stringify(arr)); }
    function setNotes(obj) { localStorage.setItem('notes', JSON.stringify(obj)); }
    function setHighlights(obj) { localStorage.setItem('highlights', JSON.stringify(obj)); }

    // -------- HELPERS --------
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

    function showToast(msg, type) {
        if (!type) type = 'info';
        var container = document.getElementById('toast-container');
        var t = document.createElement('div');
        t.className = 'toast ' + type;
        t.textContent = msg;
        container.appendChild(t);
        setTimeout(function () {
            if (t.parentNode) t.parentNode.removeChild(t);
        }, 2200);
    }

    // -------- VERSE LOOKUP --------
    function parseKey(key) {
        var parts = key.split('-');
        if (parts.length !== 3) return null;
        return {
            bookCode: parts[0],
            chapter: parseInt(parts[1]),
            verse: parseInt(parts[2])
        };
    }

    function getVerseData(bookCode, chapter, verse) {
        var bookIdx = window.bibleData.getBookIndex(bookCode);
        if (bookIdx < 0) return null;
        var bookNum = bookIdx + 1;

        var yoruba = window.bibleData.yoruba;
        var yv = null;
        for (var i = 0; i < yoruba.length; i++) {
            var y = yoruba[i];
            if (y.book === bookNum && y.chapter === chapter && y.verse === verse) {
                yv = y;
                break;
            }
        }
        if (!yv) return null;

        var key = bookNum + '-' + chapter + '-' + verse;
        return {
            bookCode: bookCode,
            bookName: window.bibleData.englishNames[bookIdx],
            bookNum: bookNum,
            chapter: chapter,
            verse: verse,
            yoruba: yv.text,
            english: window.bibleData.englishMap[key] || '',
            reference: window.bibleData.englishNames[bookIdx] + ' ' + chapter + ':' + verse
        };
    }

    function openChapter(bookCode, chapter) {
        window.location.href = '/read/chapter/?b=' + bookCode + '&c=' + chapter;
    }

    // -------- EMPTY STATE --------
    function renderEmpty(icon, title, desc) {
        return '<div class="lib-empty">' +
            icon +
            '<h3>' + title + '</h3>' +
            '<p>' + desc + '</p>' +
            '</div>';
    }

    // -------- SAVED TAB --------
    function renderSaved() {
        var container = document.getElementById('tab-content');
        var saved = getSaved();

        if (saved.length === 0) {
            container.innerHTML = renderEmpty(
                '<svg fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
                'No saved verses yet',
                'Tap any verse in the Bible and choose Save to keep it here.'
            );
            return;
        }

        var html = '';
        for (var i = 0; i < saved.length; i++) {
            var key = saved[i];
            var p = parseKey(key);
            if (!p) continue;
            var data = getVerseData(p.bookCode, p.chapter, p.verse);
            if (!data) continue;

            html +=
                '<div class="lib-card" data-key="' + key + '" data-b="' + data.bookCode + '" data-c="' + data.chapter + '">' +
                    '<div class="lib-card-head">' +
                        '<div class="lib-card-ref">' + data.reference + '</div>' +
                        '<div class="lib-card-actions">' +
                            '<button class="lib-icon-btn" data-action="image" title="Create Image">' +
                                '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
                            '</button>' +
                            '<button class="lib-icon-btn danger" data-action="delete" title="Delete">' +
                                '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="lib-verse-yoruba">' + escapeHtml(data.yoruba) + '</div>' +
                    (data.english ? '<div class="lib-verse-english">' + escapeHtml(data.english) + '</div>' : '') +
                '</div>';
        }
        container.innerHTML = html;
        wireCards();
    }

    // -------- NOTES TAB --------
    function renderNotes() {
        var container = document.getElementById('tab-content');
        var notes = getNotes();
        var keys = Object.keys(notes);

        if (keys.length === 0) {
            container.innerHTML = renderEmpty(
                '<svg fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
                'No notes yet',
                'Tap any verse in the Bible and choose Note to write your thoughts.'
            );
            return;
        }

        var html = '';
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var p = parseKey(key);
            if (!p) continue;
            var data = getVerseData(p.bookCode, p.chapter, p.verse);
            if (!data) continue;

            html +=
                '<div class="lib-card" data-key="' + key + '" data-b="' + data.bookCode + '" data-c="' + data.chapter + '">' +
                    '<div class="lib-card-head">' +
                        '<div class="lib-card-ref">' + data.reference + '</div>' +
                        '<div class="lib-card-actions">' +
                            '<button class="lib-icon-btn" data-action="edit-note" title="Edit Note">' +
                                '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
                            '</button>' +
                            '<button class="lib-icon-btn danger" data-action="delete-note" title="Delete">' +
                                '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="lib-verse-yoruba">' + escapeHtml(data.yoruba) + '</div>' +
                    (data.english ? '<div class="lib-verse-english">' + escapeHtml(data.english) + '</div>' : '') +
                    '<div class="lib-note-body">' + escapeHtml(notes[key]) + '</div>' +
                '</div>';
        }
        container.innerHTML = html;
        wireCards();
    }

    // -------- HIGHLIGHTS TAB --------
    function renderHighlights() {
        var container = document.getElementById('tab-content');
        var highlights = getHighlights();
        var keys = Object.keys(highlights);

        if (keys.length === 0) {
            container.innerHTML = renderEmpty(
                '<svg fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m9 11-6 6v3h3l6-6"/><path d="m16 12 6 6-3 3-6-6"/><path d="M14.5 4.5 19 9"/></svg>',
                'No highlights yet',
                'Tap any verse in the Bible and choose Highlight to color it.'
            );
            return;
        }

        var html = '';
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var p = parseKey(key);
            if (!p) continue;
            var data = getVerseData(p.bookCode, p.chapter, p.verse);
            if (!data) continue;
            var color = highlights[key];

            html +=
                '<div class="lib-card" data-key="' + key + '" data-b="' + data.bookCode + '" data-c="' + data.chapter + '">' +
                    '<div class="lib-card-head">' +
                        '<div class="lib-card-ref">' + data.reference +
                            '<span class="lib-highlight-tag ' + color + '"></span>' +
                        '</div>' +
                        '<div class="lib-card-actions">' +
                            '<button class="lib-icon-btn" data-action="image" title="Create Image">' +
                                '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
                            '</button>' +
                            '<button class="lib-icon-btn danger" data-action="remove-highlight" title="Remove">' +
                                '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="lib-verse-yoruba">' + escapeHtml(data.yoruba) + '</div>' +
                    (data.english ? '<div class="lib-verse-english">' + escapeHtml(data.english) + '</div>' : '') +
                '</div>';
        }
        container.innerHTML = html;
        wireCards();
    }

    // -------- HISTORY TAB --------
    function renderHistory() {
        var container = document.getElementById('tab-content');
        var history = getHistory();

        if (history.length === 0) {
            container.innerHTML = renderEmpty(
                '<svg fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
                'No reading history',
                'Chapters you read will appear here so you can continue anytime.'
            );
            return;
        }

        var html = '';
        for (var i = 0; i < history.length; i++) {
            var h = history[i];
            var bookIdx = window.bibleData.getBookIndex(h.b);
            if (bookIdx < 0) continue;
            var bookName = window.bibleData.englishNames[bookIdx];
            var isLatest = (i === 0);

            html +=
                '<div class="lib-card" data-b="' + h.b + '" data-c="' + h.c + '">' +
                    '<div class="lib-card-head">' +
                        '<div class="lib-card-ref">' + bookName + ' ' + h.c + '</div>' +
                        '<div class="history-meta">' + (isLatest ? 'Latest' : 'Earlier') + '</div>' +
                    '</div>' +
                    '<div class="lib-verse-english">Tap to continue reading this chapter.</div>' +
                '</div>';
        }
        container.innerHTML = html;
        wireCards();
    }

    // -------- WIRE CARDS --------
    function wireCards() {
        var cards = document.querySelectorAll('.lib-card');

        for (var i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', function (e) {
                // Ignore if click was on an action button
                if (e.target.closest('[data-action]')) return;
                var b = this.dataset.b;
                var c = this.dataset.c;
                if (b && c) openChapter(b, parseInt(c));
            });

            // Action buttons
            var btns = cards[i].querySelectorAll('[data-action]');
            for (var j = 0; j < btns.length; j++) {
                btns[j].addEventListener('click', function (e) {
                    e.stopPropagation();
                    var action = this.dataset.action;
                    var card = this.closest('.lib-card');
                    var key = card.dataset.key;
                    handleAction(action, key);
                });
            }
        }
    }

    // -------- ACTIONS --------
    function handleAction(action, key) {
        if (action === 'delete') {
            var saved = getSaved();
            var newSaved = [];
            for (var i = 0; i < saved.length; i++) {
                if (saved[i] !== key) newSaved.push(saved[i]);
            }
            setSaved(newSaved);
            showToast('Removed from Saved', 'info');
            renderSaved();
        }
        else if (action === 'delete-note') {
            var notes = getNotes();
            delete notes[key];
            setNotes(notes);
            showToast('Note deleted', 'info');
            renderNotes();
        }
        else if (action === 'edit-note') {
            // Open the verse in reading view with note editor ready
            var p = parseKey(key);
            if (!p) return;
            window.location.href = '/read/chapter/?b=' + p.bookCode + '&c=' + p.chapter + '&editNote=' + p.verse;
        }
        else if (action === 'remove-highlight') {
            var highlights = getHighlights();
            delete highlights[key];
            setHighlights(highlights);
            showToast('Highlight removed', 'info');
            renderHighlights();
        }
        else if (action === 'image') {
            var parts = key.split('-');
            if (parts.length !== 3) return;
            window.location.href = '/studio/?b=' + parts[0] + '&c=' + parts[1] + '&v=' + parts[2];
        }
    }

    // -------- TABS --------
    function wireTabs() {
        var tabs = document.querySelectorAll('#library-tabs .tab-btn');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].onclick = function () {
                for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove('active');
                this.classList.add('active');
                currentTab = this.dataset.tab;
                render();
            };
        }
    }

    // -------- RENDER CURRENT --------
    function render() {
        if (currentTab === 'saved') renderSaved();
        else if (currentTab === 'notes') renderNotes();
        else if (currentTab === 'highlights') renderHighlights();
        else if (currentTab === 'history') renderHistory();
    }

    // -------- TAB COUNT BADGES --------
    function updateTabCounts() {
        var counts = {
            saved: getSaved().length,
            notes: Object.keys(getNotes()).length,
            highlights: Object.keys(getHighlights()).length,
            history: getHistory().length
        };
        var tabs = document.querySelectorAll('#library-tabs .tab-btn');
        for (var i = 0; i < tabs.length; i++) {
            var id = tabs[i].dataset.tab;
            var label = tabs[i].textContent.replace(/\s+\d+$/, '').trim();
            // Reset base label
            if (id === 'saved') label = 'Saved';
            if (id === 'notes') label = 'Notes';
            if (id === 'highlights') label = 'Marks';
            if (id === 'history') label = 'History';
            tabs[i].textContent = label + (counts[id] > 0 ? ' (' + counts[id] + ')' : '');
        }
    }

    // -------- BOOT --------
    function boot() {
        window.bibleData.loadAllData().then(function () {
            wireTabs();
            updateTabCounts();
            render();
        }).catch(function (err) {
            console.error(err);
            showToast('Could not load Bible data', 'error');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
