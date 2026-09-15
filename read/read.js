// ============================================================
// READ PAGE — Books Grid + Chapters Grid
// ============================================================

(function () {
    'use strict';

    window.SharedNav.init({
        title: 'Read',
        showBack: false,
        showSearch: true,
        showBell: false,
        showMenu: true,
        showBottomNav: true,
        activeNav: 'read'
    });

    // -------- STATE --------
    var oldTestamentCount = 39; // Books 1-39 are OT, 40-66 are NT

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

    // -------- URL PARAMS --------
    function getUrlParam(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    // -------- BOOKS GRID --------
    function renderBooks(testament) {
        var grid = document.getElementById('books-grid');
        grid.innerHTML = '';

        var codes = window.bibleData.codes;
        var names = window.bibleData.englishNames;

        var startIdx, endIdx;
        if (testament === 'new') {
            startIdx = 39;
            endIdx = 66;
        } else {
            startIdx = 0;
            endIdx = 39;
        }

        for (var i = startIdx; i < endIdx; i++) {
            (function (idx) {
                var code = codes[idx];
                var name = names[idx];

                var tile = document.createElement('button');
                tile.className = 'grid-item' + (idx >= 39 ? ' new-testament' : '');
                tile.textContent = name;
                tile.onclick = function () {
                    window.location.href = '/read/?b=' + code;
                };
                grid.appendChild(tile);
            })(i);
        }
    }

    // -------- CHAPTERS GRID --------
    function renderChapters(bookCode) {
        document.getElementById('books-view').style.display = 'none';
        document.getElementById('chapters-view').style.display = 'block';

        var bookIdx = window.bibleData.getBookIndex(bookCode);
        if (bookIdx < 0) {
            window.location.href = '/read/';
            return;
        }

        var bookNum = bookIdx + 1;
        var bookName = window.bibleData.englishNames[bookIdx];

        document.getElementById('chapter-book-name').textContent = bookName;

        // Find max chapter for this book
        var maxChapter = 0;
        var yoruba = window.bibleData.yoruba;
        for (var i = 0; i < yoruba.length; i++) {
            if (yoruba[i].book === bookNum) {
                if (yoruba[i].chapter > maxChapter) {
                    maxChapter = yoruba[i].chapter;
                }
            }
        }

        // Which chapters have we read?
        var completed = [];
        try { completed = JSON.parse(localStorage.getItem('completedChapters') || '[]'); } catch (e) {}

        var grid = document.getElementById('chapters-grid');
        grid.innerHTML = '';

        for (var c = 1; c <= maxChapter; c++) {
            (function (chap) {
                var key = bookCode + '-' + chap;
                var isRead = completed.indexOf(key) >= 0;

                var tile = document.createElement('button');
                tile.className = 'grid-item' + (isRead ? ' read' : '');
                tile.textContent = chap;
                tile.onclick = function () {
                    window.location.href = '/read/chapter/?b=' + bookCode + '&c=' + chap;
                };
                grid.appendChild(tile);
            })(c);
        }

        // Back button
        document.getElementById('back-to-books').onclick = function () {
            window.location.href = '/read/';
        };

        // Update nav title
        var titleEl = document.querySelector('.app-header-title');
        if (titleEl) titleEl.textContent = bookName;
    }

    // -------- TABS --------
    function wireTabs() {
        var tabs = document.querySelectorAll('#testament-tabs .tab-btn');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].onclick = function () {
                for (var j = 0; j < tabs.length; j++) {
                    tabs[j].classList.remove('active');
                }
                this.classList.add('active');
                renderBooks(this.dataset.testament);
            };
        }
    }

    // -------- BOOT --------
    function boot() {
        window.bibleData.loadAllData().then(function () {
            var bookParam = getUrlParam('b');

            if (bookParam) {
                renderChapters(bookParam.toUpperCase());
            } else {
                wireTabs();
                renderBooks('old');
            }
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
