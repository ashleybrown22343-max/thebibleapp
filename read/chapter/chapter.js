// ============================================================
// CHAPTER READING PAGE
// ============================================================

(function () {
    'use strict';

    window.SharedNav.init({
        title: 'Reading',
        showBack: false,
        showSearch: false,
        showBell: false,
        showMenu: true,
        showBottomNav: true,
        activeNav: 'read'
    });

    // -------- STATE --------
    var state = {
        bookCode: 'GEN',
        bookNum: 1,
        bookName: 'Genesis',
        chapter: 1,
        maxChapter: 50,
        activeVerse: null
    };

    var highlights = {};
    var notes = {};
    var saved = [];

    try { highlights = JSON.parse(localStorage.getItem('highlights') || '{}'); } catch (e) {}
    try { notes = JSON.parse(localStorage.getItem('notes') || '{}'); } catch (e) {}
    try { saved = JSON.parse(localStorage.getItem('saved') || '[]'); } catch (e) {}

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
        }, 2200);
    }

    // -------- URL PARAMS --------
    function getParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    // -------- READER FONT SIZE --------
    var readerFontSize = parseInt(localStorage.getItem('readingFontSize') || '100');

    function applyReaderFontSize() {
        document.getElementById('reading-content').style.fontSize = readerFontSize + '%';
    }

    function showFontHint() {
        var hint = document.getElementById('font-hint');
        hint.textContent = 'Font size: ' + readerFontSize + '%';
        hint.classList.add('show');
        setTimeout(function () { hint.classList.remove('show'); }, 1200);
    }

    function changeFontSize(delta) {
        readerFontSize = Math.max(80, Math.min(160, readerFontSize + delta));
        localStorage.setItem('readingFontSize', String(readerFontSize));
        applyReaderFontSize();
        showFontHint();
    }

    // -------- RENDER VERSES --------
    function renderChapter() {
        var yoruba = window.bibleData.yoruba;
        var enMap = window.bibleData.englishMap;

        var verses = [];
        for (var i = 0; i < yoruba.length; i++) {
            if (yoruba[i].book === state.bookNum && yoruba[i].chapter === state.chapter) {
                verses.push(yoruba[i]);
            }
        }

        var container = document.getElementById('reading-content');

        if (verses.length === 0) {
            container.innerHTML = '<p style="text-align:center; opacity:0.5; padding:40px 0;">Chapter not found.</p>';
            return;
        }

        var html = '';
        for (var j = 0; j < verses.length; j++) {
            var v = verses[j];
            var key = v.book + '-' + v.chapter + '-' + v.verse;
            var eng = enMap[key] || '';
            var highlightClass = '';
            if (highlights[key]) {
                highlightClass = ' highlight-' + highlights[key];
            }
            var noteText = notes[key] || '';

            html += '<div class="verse-card' + highlightClass + '" data-book="' + v.book + '" data-chapter="' + v.chapter + '" data-verse="' + v.verse + '">' +
                '<div class="verse-num">' + v.verse + '</div>' +
                '<div class="verse-yoruba">' + v.text + '</div>' +
                (eng ? '<div class="verse-english">' + eng + '</div>' : '') +
                (noteText ? '<div class="verse-note">' + noteText + '</div>' : '') +
                '</div>';
        }
        container.innerHTML = html;

        // Wire verse taps
        var cards = container.querySelectorAll('.verse-card');
        for (var k = 0; k < cards.length; k++) {
            cards[k].onclick = function () {
                var b = parseInt(this.dataset.book);
                var c = parseInt(this.dataset.chapter);
                var v = parseInt(this.dataset.verse);
                openActionSheet(b, c, v);
            };
        }

        // Header title
        document.getElementById('read-title').textContent = state.bookName + ' ' + state.chapter;
        var headerTitle = document.querySelector('.app-header-title');
        if (headerTitle) headerTitle.textContent = state.bookName;

        // Save progress
        localStorage.setItem('lastRead', JSON.stringify({ b: state.bookCode, c: state.chapter }));

        // Track completed chapter
        var completed = [];
        try { completed = JSON.parse(localStorage.getItem('completedChapters') || '[]'); } catch (e) {}
        var chapterKey = state.bookCode + '-' + state.chapter;
        if (completed.indexOf(chapterKey) < 0) {
            completed.push(chapterKey);
            localStorage.setItem('completedChapters', JSON.stringify(completed));
        }

        // Update history
        var history = [];
        try { history = JSON.parse(localStorage.getItem('history') || '[]'); } catch (e) {}
        var newEntry = { b: state.bookCode, c: state.chapter };
        var filtered = [];
        for (var m = 0; m < history.length; m++) {
            if (history[m].b !== newEntry.b || history[m].c !== newEntry.c) {
                filtered.push(history[m]);
            }
        }
        filtered.unshift(newEntry);
        if (filtered.length > 10) filtered = filtered.slice(0, 10);
        localStorage.setItem('history', JSON.stringify(filtered));

        // Chapter nav
        document.getElementById('chapter-nav').style.display = 'flex';
        document.getElementById('btn-prev').disabled = state.chapter <= 1;
        document.getElementById('btn-next').disabled = state.chapter >= state.maxChapter;

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // -------- DETERMINE MAX CHAPTER --------
    function findMaxChapter() {
        var yoruba = window.bibleData.yoruba;
        var max = 0;
        for (var i = 0; i < yoruba.length; i++) {
            if (yoruba[i].book === state.bookNum) {
                if (yoruba[i].chapter > max) max = yoruba[i].chapter;
            }
        }
        state.maxChapter = max || 50;
    }

    // -------- ACTION SHEET --------
    function openActionSheet(b, c, v) {
        state.activeVerse = { book: b, chapter: c, verse: v };
        document.getElementById('sheet-ref').textContent = state.bookName + ' ' + c + ':' + v;
        document.getElementById('sheet-overlay').classList.add('show');
        document.getElementById('action-sheet').classList.add('show');
    }

    function closeActionSheet() {
        document.getElementById('sheet-overlay').classList.remove('show');
        document.getElementById('action-sheet').classList.remove('show');
    }

    // -------- GET VERSE TEXT --------
    function getActiveVerseText() {
        if (!state.activeVerse) return { yo: '', en: '', key: '' };
        var a = state.activeVerse;
        var key = a.book + '-' + a.chapter + '-' + a.verse;
        var yo = '';
        for (var i = 0; i < window.bibleData.yoruba.length; i++) {
            var x = window.bibleData.yoruba[i];
            if (x.book === a.book && x.chapter === a.chapter && x.verse === a.verse) {
                yo = x.text;
                break;
            }
        }
        return {
            yo: yo,
            en: window.bibleData.englishMap[key] || '',
            key: key
        };
    }

    // -------- ACTIONS --------
    function handleCopy() {
        var v = getActiveVerseText();
        var fullText = state.bookName + ' ' + state.activeVerse.chapter + ':' + state.activeVerse.verse + '\n\n' + v.yo + '\n\n' + v.en;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(fullText).then(function () {
                closeActionSheet();
                showToast('Copied to clipboard', 'success');
            });
        } else {
            showToast('Copy not supported', 'error');
        }
    }

    function handleShare() {
        var v = getActiveVerseText();
        var fullText = v.yo + '\n\n' + v.en + '\n\n— ' + state.bookName + ' ' + state.activeVerse.chapter + ':' + state.activeVerse.verse;
        if (navigator.share) {
            navigator.share({ title: 'Bible Verse', text: fullText }).then(function () {
                closeActionSheet();
            }).catch(function () {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(fullText).then(function () {
                closeActionSheet();
                showToast('Copied instead', 'info');
            });
        } else {
            showToast('Sharing not supported', 'error');
        }
    }

    function handleHighlight() {
        var key = state.activeVerse.book + '-' + state.activeVerse.chapter + '-' + state.activeVerse.verse;
        var order = ['yellow', 'green', 'blue', 'none'];
        var current = highlights[key] || 'none';
        var idx = order.indexOf(current);
        var next = order[(idx + 1) % order.length];

        if (next === 'none') {
            delete highlights[key];
        } else {
            highlights[key] = next;
        }
        localStorage.setItem('highlights', JSON.stringify(highlights));
        closeActionSheet();
        renderChapter();
        showToast(next === 'none' ? 'Highlight removed' : 'Highlighted: ' + next, 'success');
    }

    function handleNote() {
        var key = state.activeVerse.book + '-' + state.activeVerse.chapter + '-' + state.activeVerse.verse;
        document.getElementById('note-input').value = notes[key] || '';
        document.getElementById('note-overlay').classList.add('show');
        closeActionSheet();
    }

    function handleSave() {
        var key = state.activeVerse.book + '-' + state.activeVerse.chapter + '-' + state.activeVerse.verse;
        var idx = saved.indexOf(key);
        if (idx >= 0) {
            saved.splice(idx, 1);
            showToast('Removed from Saved', 'info');
        } else {
            saved.push(key);
            showToast('Saved', 'success');
        }
        localStorage.setItem('saved', JSON.stringify(saved));
        closeActionSheet();
    }

    function handleImage() {
        var a = state.activeVerse;
        var code = window.bibleData.codes[a.book - 1];
        closeActionSheet();
        window.location.href = '/studio/?b=' + code + '&c=' + a.chapter + '&v=' + a.verse;
    }

    function handleReadAloud() {
        var v = getActiveVerseText();
        var text = v.en || v.yo;
        if (!text) return;
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            closeActionSheet();
            return;
        }
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
        closeActionSheet();
    }

    // -------- SAVE NOTE --------
    function saveNote() {
        var key = state.activeVerse.book + '-' + state.activeVerse.chapter + '-' + state.activeVerse.verse;
        var text = document.getElementById('note-input').value.trim();
        if (text === '') {
            delete notes[key];
            showToast('Note removed', 'info');
        } else {
            notes[key] = text;
            showToast('Note saved', 'success');
        }
        localStorage.setItem('notes', JSON.stringify(notes));
        document.getElementById('note-overlay').classList.remove('show');
        renderChapter();
    }

    // -------- NAVIGATION --------
    function goPrev() {
        if (state.chapter > 1) {
            window.location.href = '/read/chapter/?b=' + state.bookCode + '&c=' + (state.chapter - 1);
        }
    }

    function goNext() {
        if (state.chapter < state.maxChapter) {
            window.location.href = '/read/chapter/?b=' + state.bookCode + '&c=' + (state.chapter + 1);
        }
    }

    // -------- WIRE EVENTS --------
    function wireEvents() {
        document.getElementById('btn-back').onclick = function () {
            window.location.href = '/read/?b=' + state.bookCode;
        };
        document.getElementById('btn-prev').onclick = goPrev;
        document.getElementById('btn-next').onclick = goNext;
        document.getElementById('btn-font-down').onclick = function () { changeFontSize(-10); };
        document.getElementById('btn-font-up').onclick = function () { changeFontSize(10); };

        document.getElementById('btn-share').onclick = function () {
            var yoruba = window.bibleData.yoruba;
            var lines = [];
            for (var i = 0; i < yoruba.length; i++) {
                if (yoruba[i].book === state.bookNum && yoruba[i].chapter === state.chapter) {
                    lines.push(yoruba[i].text);
                }
            }
            var text = state.bookName + ' ' + state.chapter + '\n\n' + lines.join(' ');
            if (navigator.share) {
                navigator.share({ title: state.bookName + ' ' + state.chapter, text: text }).catch(function () {});
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(function () {
                    showToast('Chapter copied', 'success');
                });
            }
        };

        document.getElementById('sheet-overlay').onclick = closeActionSheet;
        document.getElementById('sheet-cancel').onclick = closeActionSheet;

        document.getElementById('act-copy').onclick = handleCopy;
        document.getElementById('act-share').onclick = handleShare;
        document.getElementById('act-highlight').onclick = handleHighlight;
        document.getElementById('act-note').onclick = handleNote;
        document.getElementById('act-save').onclick = handleSave;
        document.getElementById('act-image').onclick = handleImage;
        document.getElementById('act-read').onclick = handleReadAloud;

        document.getElementById('note-cancel').onclick = function () {
            document.getElementById('note-overlay').classList.remove('show');
        };
        document.getElementById('note-save').onclick = saveNote;
    }

    // -------- BOOT --------
    function boot() {
        var bookParam = (getParam('b') || 'GEN').toUpperCase();
        var chapterParam = parseInt(getParam('c') || '1');

        var bookIdx = window.bibleData.getBookIndex(bookParam);
        if (bookIdx < 0) {
            window.location.href = '/read/';
            return;
        }

        state.bookCode = bookParam;
        state.bookNum = bookIdx + 1;
        state.bookName = window.bibleData.englishNames[bookIdx];
        state.chapter = isNaN(chapterParam) || chapterParam < 1 ? 1 : chapterParam;

        findMaxChapter();

        applyReaderFontSize();
        renderChapter();
        wireEvents();
    }

    window.bibleData.loadAllData().then(boot).catch(function (err) {
        console.error(err);
        showToast('Could not load Bible data', 'error');
    });

})();
