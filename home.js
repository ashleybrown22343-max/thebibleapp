// ============================================================
// HOME PAGE LOGIC
// ============================================================

(function () {
    'use strict';

    // -------- INIT NAV --------
    window.SharedNav.init({
        title: 'Bibeli Mimo',
        subtitle: '',
        showBack: false,
        showSearch: true,
        showBell: false,
        showMenu: true,
        showBottomNav: true,
        activeNav: 'home'
    });

    // -------- GREETING + DATE --------
    function setGreeting() {
        var hour = new Date().getHours();
        var greeting;
        if (hour < 12) greeting = 'Good Morning';
        else if (hour < 17) greeting = 'Good Afternoon';
        else if (hour < 21) greeting = 'Good Evening';
        else greeting = 'Good Night';

        document.getElementById('greeting').textContent = greeting;

        var now = new Date();
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        document.getElementById('date-line').textContent =
            days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()];
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
        }, 2400);
    }

    // -------- LOAD --------
    function boot() {
        setGreeting();
        window.bibleData.loadAllData().then(function () {
            renderVOTD();
            renderContinue();
            renderPlan();
            renderRecent();
            wireActions();
        }).catch(function (err) {
            console.error(err);
            showToast('Could not load Bible data', 'error');
        });
    }

    // -------- VERSE OF THE DAY --------
    function renderVOTD() {
        var yoruba = window.bibleData.yoruba;
        var codes = window.bibleData.codes;
        var names = window.bibleData.englishNames;
        var enMap = window.bibleData.englishMap;

        // Deterministic daily pick — based on day of year
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var dayOfYear = Math.floor(diff / oneDay);

        // Curated pool of beloved verses — used in rotation
        var pool = [
            { b: 'JHN', c: 3, v: 16 },
            { b: 'PSA', c: 23, v: 1 },
            { b: 'JER', c: 29, v: 11 },
            { b: 'PHP', c: 4, v: 13 },
            { b: 'ROM', c: 8, v: 28 },
            { b: 'PRO', c: 3, v: 5 },
            { b: 'ISA', c: 40, v: 31 },
            { b: 'MAT', c: 11, v: 28 },
            { b: 'PSA', c: 46, v: 1 },
            { b: 'JOS', c: 1, v: 9 },
            { b: '1CO', c: 13, v: 4 },
            { b: 'PHP', c: 4, v: 6 },
            { b: 'PSA', c: 91, v: 1 },
            { b: 'MAT', c: 6, v: 33 },
            { b: 'ROM', c: 12, v: 2 },
            { b: '2TI', c: 1, v: 7 },
            { b: 'HEB', c: 11, v: 1 },
            { b: 'GAL', c: 5, v: 22 },
            { b: 'EPH', c: 2, v: 8 },
            { b: 'PSA', c: 119, v: 105 }
        ];

        var pick = pool[dayOfYear % pool.length];
        var bookIdx = codes.indexOf(pick.b);
        var bookNum = bookIdx + 1;

        var verseObj = null;
        for (var i = 0; i < yoruba.length; i++) {
            var y = yoruba[i];
            if (y.book === bookNum && y.chapter === pick.c && y.verse === pick.v) {
                verseObj = y;
                break;
            }
        }
        if (!verseObj) {
            // fallback
            verseObj = yoruba[dayOfYear * 500] || yoruba[0];
        }

        var textEl = document.getElementById('votd-text');
        var refEl = document.getElementById('votd-ref');

        if (verseObj) {
            textEl.textContent = verseObj.text;
            var bookName = names[verseObj.book - 1];
            refEl.textContent = bookName + ' ' + verseObj.chapter + ':' + verseObj.verse;

            // Save for buttons
            window.__votd = {
                book: verseObj.book,
                chapter: verseObj.chapter,
                verse: verseObj.verse,
                code: codes[verseObj.book - 1],
                yoruba: verseObj.text,
                english: enMap[verseObj.book + '-' + verseObj.chapter + '-' + verseObj.verse] || ''
            };
        } else {
            textEl.textContent = 'Verse not found';
            refEl.textContent = '';
        }

        // Optional background image — pick from existing set
        var bgEl = document.getElementById('votd-bg');
        var backgrounds = ['29871.webp','29873.webp','29880.webp','29903.webp','29935.webp'];
        var bgPick = backgrounds[dayOfYear % backgrounds.length];
        bgEl.style.backgroundImage = "url('/backgrounds/" + bgPick + "')";
    }

    // -------- CONTINUE READING --------
    function renderContinue() {
        var last;
        try {
            last = JSON.parse(localStorage.getItem('lastRead') || 'null');
        } catch (e) { last = null; }

        var titleEl = document.getElementById('continue-title');

        if (last && last.b && last.c) {
            var name = window.bibleData.getEnglishName(last.b);
            titleEl.textContent = name + ' ' + last.c;
        } else {
            // Default
            titleEl.textContent = 'Genesis 1';
            last = { b: 'GEN', c: 1 };
        }

        document.getElementById('continue-card').onclick = function () {
            window.location.href = '/read/chapter/?b=' + last.b + '&c=' + last.c;
        };
    }

    // -------- PLAN PROGRESS --------
    function renderPlan() {
        var planKey = localStorage.getItem('currentPlan') || 'canonical';
        var plans = {
            'canonical': { name: 'Bible in 1 Year', start: 1, end: 66 },
            'nt-90':     { name: 'New Testament in 90 Days', start: 40, end: 66 },
            'ot-180':    { name: 'Old Testament in 180 Days', start: 1, end: 39 },
            'psalms-30': { name: 'Psalms in 30 Days', start: 19, end: 19 }
        };
        var plan = plans[planKey] || plans.canonical;

        var completed = [];
        try { completed = JSON.parse(localStorage.getItem('completedChapters') || '[]'); } catch (e) {}

        // Count total chapters in plan
        var totalSet = {};
        var yoruba = window.bibleData.yoruba;
        for (var i = 0; i < yoruba.length; i++) {
            var v = yoruba[i];
            if (v.book >= plan.start && v.book <= plan.end) {
                totalSet[v.book + '-' + v.chapter] = true;
            }
        }
        var totalCount = Object.keys(totalSet).length;

        // Count completed chapters in plan
        var doneCount = 0;
        for (var j = 0; j < completed.length; j++) {
            var parts = completed[j].split('-');
            var bookCode = parts[0];
            var bookNum = window.bibleData.getBookIndex(bookCode) + 1;
            if (bookNum >= plan.start && bookNum <= plan.end) {
                doneCount++;
            }
        }

        var percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

        document.getElementById('plan-text').textContent = plan.name;
        document.getElementById('plan-percent').textContent = percent + '%';
        document.getElementById('plan-progress').style.width = percent + '%';
        document.getElementById('plan-done').textContent = doneCount + ' chapters';
        document.getElementById('plan-total').textContent = totalCount + ' total';

        document.getElementById('plan-card').onclick = function () {
            window.location.href = '/discover/plans/';
        };
    }

    // -------- RECENTLY READ --------
    function renderRecent() {
        var history = [];
        try { history = JSON.parse(localStorage.getItem('history') || '[]'); } catch (e) {}

        var scroll = document.getElementById('recent-scroll');
        scroll.innerHTML = '';

        if (history.length === 0) {
            document.getElementById('recent-head').style.display = 'none';
            return;
        }

        document.getElementById('recent-head').style.display = 'flex';

        for (var i = 0; i < history.length && i < 8; i++) {
            (function (h) {
                var chip = document.createElement('button');
                chip.className = 'recent-chip';
                chip.textContent = window.bibleData.getEnglishName(h.b) + ' ' + h.c;
                chip.onclick = function () {
                    window.location.href = '/read/chapter/?b=' + h.b + '&c=' + h.c;
                };
                scroll.appendChild(chip);
            })(history[i]);
        }
    }

    // -------- ACTIONS --------
    function wireActions() {
        // Random verse
        document.getElementById('qa-random').onclick = function () {
            var yoruba = window.bibleData.yoruba;
            var pick = yoruba[Math.floor(Math.random() * yoruba.length)];
            var code = window.bibleData.codes[pick.book - 1];
            window.location.href = '/read/chapter/?b=' + code + '&c=' + pick.chapter;
        };

        // VOTD Read
        document.getElementById('votd-read').onclick = function () {
            if (!window.__votd) return;
            window.location.href = '/read/chapter/?b=' + window.__votd.code + '&c=' + window.__votd.chapter;
        };

        // VOTD Share
        document.getElementById('votd-share').onclick = function () {
            if (!window.__votd) return;
            var text = window.__votd.yoruba + '\n\n' + window.__votd.english + '\n\n— ' + window.__votd.ref;
            if (navigator.share) {
                navigator.share({ title: 'Bible Verse', text: text }).catch(function () {});
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(function () {
                    showToast('Verse copied', 'success');
                });
            } else {
                showToast('Sharing not supported', 'error');
            }
        };

        // VOTD Studio
        document.getElementById('votd-studio').onclick = function () {
            if (!window.__votd) return;
            window.location.href = '/studio/?b=' + window.__votd.code + '&c=' + window.__votd.chapter + '&v=' + window.__votd.verse;
        };
    }

    // -------- START --------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
