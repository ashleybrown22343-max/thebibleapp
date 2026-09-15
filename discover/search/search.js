// ============================================================
// SEARCH PAGE — Full Bible Search (Yoruba + English)
// ============================================================

(function () {
    'use strict';

    window.SharedNav.init({
        title: 'Search',
        showBack: false,
        showSearch: false,
        showBell: false,
        showMenu: true,
        showBottomNav: true,
        activeNav: 'discover'
    });

    var searchTimeout = null;
    var langYo = true;
    var langEn = true;
    var MAX_RESULTS = 100;

    // -------- SAFE HIGHLIGHT --------
    function highlightMatches(text, query) {
        if (!query || query.length < 2) return escapeHtml(text);
        var lowerText = text.toLowerCase();
        var lowerQuery = query.toLowerCase();
        var out = '';
        var pos = 0;

        while (true) {
            var idx = lowerText.indexOf(lowerQuery, pos);
            if (idx < 0) {
                out += escapeHtml(text.substring(pos));
                break;
            }
            out += escapeHtml(text.substring(pos, idx));
            out += '<mark>' + escapeHtml(text.substring(idx, idx + query.length)) + '</mark>';
            pos = idx + query.length;
        }
        return out;
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

    // -------- SEARCH --------
    function performSearch(query) {
        var results = document.getElementById('results');
        var emptyState = document.getElementById('empty-state');

        if (query.length < 2) {
            results.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        results.innerHTML = '<p style="text-align:center; opacity:0.5; padding:20px;">Searching...</p>';

        setTimeout(function () {
            var found = [];
            var lowerQuery = query.toLowerCase();

            // Search Yoruba
            if (langYo) {
                var yoruba = window.bibleData.yoruba;
                for (var i = 0; i < yoruba.length; i++) {
                    if (found.length >= MAX_RESULTS) break;
                    var y = yoruba[i];
                    if (y.text && y.text.toLowerCase().indexOf(lowerQuery) >= 0) {
                        found.push({
                            book: y.book,
                            chapter: y.chapter,
                            verse: y.verse,
                            text: y.text,
                            lang: 'Yoruba'
                        });
                    }
                }
            }

            // Search English
            if (langEn) {
                var english = window.bibleData.english;
                for (var j = 0; j < english.length; j++) {
                    if (found.length >= MAX_RESULTS) break;
                    var e = english[j];
                    if (e.text && e.text.toLowerCase().indexOf(lowerQuery) >= 0) {
                        found.push({
                            book: e.book,
                            chapter: e.chapter,
                            verse: e.verse,
                            text: e.text,
                            lang: 'English'
                        });
                    }
                }
            }

            // Render
            if (found.length === 0) {
                results.innerHTML = '<div class="empty-state" style="display:block;"><p>No results found for "<strong>' + escapeHtml(query) + '</strong>"</p></div>';
                return;
            }

            var html = '<p style="font-size:13px; color:var(--text-soft); margin-bottom:12px; font-weight:600;">Found ' + found.length + ' verse' + (found.length === 1 ? '' : 's') + '</p>';
            for (var k = 0; k < found.length; k++) {
                var v = found[k];
                var bookName = window.bibleData.englishNames[v.book - 1];
                var code = window.bibleData.codes[v.book - 1];
                html +=
                    '<div class="search-result" data-b="' + code + '" data-c="' + v.chapter + '">' +
                        '<div class="search-result-lang">' + v.lang + '</div>' +
                        '<div class="search-result-ref">' + bookName + ' ' + v.chapter + ':' + v.verse + '</div>' +
                        '<div class="search-result-text">' + highlightMatches(v.text, query) + '</div>' +
                    '</div>';
            }
            results.innerHTML = html;

            // Wire taps
            var items = results.querySelectorAll('.search-result');
            for (var m = 0; m < items.length; m++) {
                items[m].onclick = function () {
                    var b = this.dataset.b;
                    var c = this.dataset.c;
                    window.location.href = '/read/chapter/?b=' + b + '&c=' + c;
                };
            }
        }, 50);
    }

    // -------- WIRE --------
    function wireFilters() {
        var chips = document.querySelectorAll('.filter-chip');
        for (var i = 0; i < chips.length; i++) {
            chips[i].onclick = function () {
                var lang = this.dataset.lang;
                if (lang === 'yo') langYo = !langYo;
                if (lang === 'en') langEn = !langEn;

                if (!langYo && !langEn) {
                    // Don't allow both off
                    if (lang === 'yo') langYo = true;
                    if (lang === 'en') langEn = true;
                    showToast('Keep at least one language on', 'info');
                }

                this.classList.toggle('active', (lang === 'yo' && langYo) || (lang === 'en' && langEn));

                // Re-run search
                var q = document.getElementById('search-input').value.trim();
                if (q.length >= 2) performSearch(q);
            };
        }
    }

    // -------- BOOT --------
    function boot() {
        window.bibleData.loadAllData().then(function () {
            wireFilters();

            var input = document.getElementById('search-input');
            input.addEventListener('input', function (e) {
                var q = e.target.value.trim();
                if (searchTimeout) clearTimeout(searchTimeout);
                searchTimeout = setTimeout(function () {
                    performSearch(q);
                }, 300);
            });

            document.getElementById('btn-back').onclick = function () {
                window.location.href = '/discover/';
            };

            // Focus the input
            setTimeout(function () { input.focus(); }, 100);
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
