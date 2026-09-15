// ============================================================
// CHAPTER READING — Reads and applies all Settings
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

    // -------- SETTINGS --------
    function getNum(key, fallback) {
        var v = localStorage.getItem(key);
        if (v === null) return fallback;
        var n = parseFloat(v);
        return isNaN(n) ? fallback : n;
    }
    function getBool(key, fallback) {
        var v = localStorage.getItem(key);
        if (v === null) return fallback;
        return v === 'true';
    }
    function getSetting(key, fallback) {
        var v = localStorage.getItem(key);
        return v === null ? fallback : v;
    }

    var FONT_MAP = {
        'sans':    "'Inter', -apple-system, sans-serif",
        'serif':   "'Lora', Georgia, serif",
        'display': "'Playfair Display', Georgia, serif",
        'classic': "'Merriweather', Georgia, serif",
        'elegant': "'Cormorant Garamond', Georgia, serif",
        'modern':  "'Josefin Sans', sans-serif"
    };

    // Red letter map — chapters where Jesus speaks
    var RED_LETTER_CHAPTERS = [
        // Matthew
        [40,5],[40,6],[40,7],[40,9],[40,10],[40,11],[40,12],[40,13],[40,15],
        [40,16],[40,17],[40,18],[40,19],[40,20],[40,21],[40,22],[40,23],[40,24],[40,25],[40,26],[40,28],
        // Mark
        [41,2],[41,3],[41,4],[41,5],[41,6],[41,7],[41,8],[41,9],[41,10],
        [41,11],[41,12],[41,13],[41,14],[41,16],
        // Luke
        [42,4],[42,5],[42,6],[42,7],[42,8],[42,9],[42,10],[42,11],[42,12],
        [42,13],[42,14],[42,15],[42,16],[42,17],[42,18],[42,19],[42,20],
        [42,21],[42,22],[42,24],
        // John
        [43,3],[43,4],[43,5],[43,6],[43,7],[43,8],[43,9],[43,10],[43,11],
        [43,12],[43,13],[43,14],[43,15],[43,16],[43,17],[43,18]
    ];
    function isRedLetterChapter(bookNum, chapter) {
        for (var i = 0; i < RED_LETTER_CHAPTERS.length; i++) {
            if (RED_LETTER_CHAPTERS[i][0] === bookNum && RED_LETTER_CHAPTERS[i][1] === chapter) return true;
        }
        return false;
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

    // -------- INJECT DYNAMIC STYLES --------
    function injectStyles() {
        var style = document.createElement('style');
        style.id = 'reader-dynamic-styles';
        style.textContent = `
            .reading-page {
                font-family: ${FONT_MAP[getSetting('fontFamily', 'serif')] || FONT_MAP.serif};
                font-size: ${getNum('readerFontSize', 100)}%;
                padding: ${getNum('readerTextPadding', 20)}px;
            }
            .reading-page .verse-card {
                margin-bottom: ${getNum('readerVerseSpacing', 1.5)}em;
                text-align: ${getSetting('readerAlign', 'left')};
            }
            .reading-page .verse-yoruba,
            .reading-page .verse-english {
                line-height: ${getNum('readerLineSpacing', 1.7)};
                letter-spacing: ${getNum('readerLetterSpacing', 0)}px;
            }
            .reading-page .verse-yoruba {
                font-family: ${FONT_MAP[getSetting('fontFamily', 'serif')] || FONT_MAP.serif};
            }
            .reading-page .verse-english {
                font-family: ${FONT_MAP[getSetting('fontFamily', 'serif')] || FONT_MAP.serif};
            }
            .reading-page .verse-card.red-letter .verse-yoruba,
            .reading-page .verse-card.red-letter .verse-english {
                color: #DC2626;
            }
            body.dark .reading-page .verse-card.red-letter .verse-yoruba,
            body.dark .reading-page .verse-card.red-letter .verse-english {
                color: #F87171;
            }
            body.church .reading-page .verse-card.red-letter .verse-yoruba,
            body.church .reading-page .verse-card.red-letter .verse-english {
                color: #FF6666;
            }
            .reading-page.parallel .verse-card {
                display: grid;
                grid-template-columns: auto 1fr;
                grid-template-areas:
                    "num num"
                    "yo en";
                column-gap: 14px;
                align-items: start;
            }
            .reading-page.parallel .verse-num {
                grid-area: num;
            }
            .reading-page.parallel .verse-yoruba {
                grid-area: yo;
                border-right: 1px solid var(--border);
                padding-right: 14px;
                margin-bottom: 0;
            }
            .reading-page.parallel .verse-english {
                grid-area: en;
                padding-top: 0;
                border-top: none;
                margin-bottom: 0;
            }
            .reading-page.hide-verse-nums .verse-num {
                display: none;
            }
            .reading-page.hide-verse-nums.parallel .verse-card {
                grid-template-areas: "yo en";
            }
        `;
        var existing = document.getElementById('reader-dynamic-styles');
        if (existing) existing.parentNode.removeChild(existing);
        document.head.appendChild(style);
    }

    // -------- INITIALIZE --------
    function getParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

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

    // -------- RENDER --------
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
        container.className = 'reading-page';

        // Apply classes based on settings
        if (getBool('parallelView', false)) container.classList.add('parallel');
        if (!getBool('showVerseNumbers', true)) container.classList.add('hide-verse-nums');

        // Determine which languages to show
        var lang = getSetting('defaultLanguage', 'both');
        var showYo = (lang === 'both' || lang === 'yo');
        var showEn = (lang === 'both' || lang === 'en');

        // Red letter
        var redLetter = getBool('redLetterMode', false) && isRedLetterChapter(state.bookNum, state.chapter);

        if (verses.length === 0) {
            container.innerHTML = '<p style="text-align:center; opacity:0.5; padding:40px 0;">Chapter not found.</p>';
            return;
        }

        var html = '';
        for (var j = 0; j < verses.length; j++) {
            var v = verses[j];
            var key = v.book + '-' + v.chapter + '-' + v.verse;
            var eng = enMap[key] || '';
            var classes = 'verse-card';
            if (highlights[key]) classes += ' highlight-' + highlights[key];
            if (redLetter) classes += ' red-letter';

            var noteText = notes[key] || '';

            html += '<div class="' + classes + '" data-book="' + v.book + '" data-chapter="' + v.chapter + '" data-verse="' + v.verse + '">' +
                '<div class="verse-num">' + v.verse + '</div>';

            if (showYo) {
                html += '<div class="verse-yoruba">' + v.text + '</div>';
            }
            if (showEn && eng) {
                html += '<div class="verse-english">' + eng + '</div>';
            }
            if (noteText) {
                html += '<div class="verse-note">' + noteText + '</div>';
            }

            html += '</div>';
        }
        container.innerHTML = html;

        var cards = container.querySelectorAll('.verse-card');
        for (var k = 0; k < cards.length; k++) {
            cards[k].onclick = function () {
                var b = parseInt(this.dataset.book);
                var c = parseInt(this.dataset.chapter);
                var v = parseInt(this.dataset.verse);
                openActionSheet(b, c, v);
            };
        }

        document.getElementById('read-title').textContent = state.bookName + ' ' + state.chapter;

        // Save progress
        localStorage.setItem('lastRead', JSON.stringify({ b: state.bookCode, c: state.chapter }));

        var completed = [];
        try { completed = JSON.parse(localStorage.getItem('completedChapters') || '[]'); } catch (e) {}
        var chapterKey = state.bookCode + '-' + state.chapter;
        if (completed.indexOf(chapterKey) < 0) {
            completed.push(chapterKey);
            localStorage.setItem('completedChapters', JSON.stringify(completed));
        }

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

        document.getElementById('chapter-nav').style.display = 'flex';
        document.getElementById('btn-prev').disabled = state.chapter <= 1;
        document.getElementById('btn-next').disabled = state.chapter >= state.maxChapter;

        window.scrollTo(0, 0);
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
        return { yo: yo, en: window.bibleData.englishMap[key] || '', key: key };
    }

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
        }
    }

    function handleHighlight() {
        var key = state.activeVerse.book + '-' + state.activeVerse.chapter + '-' + state.activeVerse.verse;
        var order = ['yellow', 'green', 'blue', 'none'];
        var current = highlights[key] || 'none';
        var idx = order.indexOf(current);
        var next = order[(idx + 1) % order.length];
        if (next === 'none') delete highlights[key];
        else highlights[key] = next;
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

        // Remove the old font size buttons if they exist
        var fontDown = document.getElementById('btn-font-down');
        var fontUp = document.getElementById('btn-font-up');
        if (fontDown) fontDown.style.display = 'none';
        if (fontUp) fontUp.style.display = 'none';

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
        injectStyles();
        renderChapter();
        wireEvents();
    }

    window.bibleData.loadAllData().then(boot).catch(function (err) {
        console.error(err);
        showToast('Could not load Bible data', 'error');
    });

})();
