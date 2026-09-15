// ============================================================
// DISCOVER PAGE — Plans, Topics, Devotionals
// ============================================================

(function () {
    'use strict';

    window.SharedNav.init({
        title: 'Discover',
        showBack: false,
        showSearch: true,
        showBell: false,
        showMenu: true,
        showBottomNav: true,
        activeNav: 'discover'
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
        }, 2200);
    }

    // -------- PLANS DATA --------
    var PLANS = [
        {
            key: 'canonical',
            name: 'Read the Whole Bible',
            desc: 'Genesis to Revelation · 1,189 chapters',
            icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'
        },
        {
            key: 'nt-90',
            name: 'New Testament',
            desc: 'Matthew to Revelation · 260 chapters',
            icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>'
        },
        {
            key: 'ot-180',
            name: 'Old Testament',
            desc: 'Genesis to Malachi · 929 chapters',
            icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
        },
        {
            key: 'psalms-30',
            name: 'Psalms',
            desc: 'All 150 Psalms of David',
            icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'
        }
    ];

    // -------- TOPICS DATA --------
    var TOPICS = [
        { key: 'faith',       name: 'Faith',       icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2v20M5 9h14"/></svg>', verses: [['HEB',11,1],['MRK',11,22],['MAT',17,20],['2CO',5,7],['ROM',10,17],['EPH',2,8],['JHN',20,29],['HEB',11,6],['GAL',2,20],['JAS',2,17]] },
        { key: 'love',        name: 'Love',        icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', verses: [['1CO',13,4],['1CO',13,13],['1JN',4,8],['JHN',3,16],['JHN',15,13],['ROM',5,8],['1PE',4,8],['MAT',22,37],['1JN',4,19],['COL',3,14]] },
        { key: 'hope',        name: 'Hope',        icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>', verses: [['ROM',15,13],['JER',29,11],['ROM',5,5],['PSA',42,11],['HEB',6,19],['TIT',2,13],['PSA',71,14],['LAM',3,24],['ROM',8,24],['1PE',1,3]] },
        { key: 'peace',       name: 'Peace',       icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', verses: [['JHN',14,27],['PHP',4,7],['ISA',26,3],['ROM',5,1],['COL',3,15],['PSA',34,14],['MAT',5,9],['ISA',9,6],['NUM',6,26],['2TH',3,16]] },
        { key: 'strength',    name: 'Strength',    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', verses: [['PHP',4,13],['ISA',40,31],['PSA',46,1],['NEH',8,10],['PSA',28,7],['EPH',6,10],['2TI',4,17],['ISA',41,10],['PSA',18,32],['2CO',12,9]] },
        { key: 'prayer',      name: 'Prayer',      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2v20M5 9h14"/></svg>', verses: [['PHP',4,6],['1TH',5,17],['MAT',6,9],['JAS',5,16],['1JN',5,14],['ROM',8,26],['MRK',11,24],['LUK',18,1],['JAS',4,3],['PSA',145,18]] },
        { key: 'praise',      name: 'Praise',      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>', verses: [['PSA',150,6],['PSA',100,1],['HEB',13,15],['PSA',34,1],['PSA',103,1],['EPH',5,19],['PSA',63,3],['PSA',149,1],['COL',3,16],['REV',5,12]] },
        { key: 'joy',         name: 'Joy',         icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>', verses: [['JHN',15,11],['PSA',16,11],['PHP',4,4],['ROM',15,13],['PSA',30,5],['1PE',1,8],['NEH',8,10],['PSA',126,3],['JHN',16,22],['GAL',5,22]] },
        { key: 'wisdom',      name: 'Wisdom',      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>', verses: [['PRO',1,7],['JAS',1,5],['PRO',3,5],['PRO',4,7],['PRO',9,10],['COL',2,3],['PSA',111,10],['PRO',2,6],['EPH',5,15],['JAS',3,17]] },
        { key: 'protection',  name: 'Protection',  icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', verses: [['PSA',91,1],['PSA',121,1],['PSA',46,1],['PRO',18,10],['PSA',27,1],['ISA',41,10],['PSA',46,7],['PSA',121,7],['PRO',30,5],['PSA',34,7]] },
        { key: 'healing',     name: 'Healing',     icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></svg>', verses: [['ISA',53,5],['PSA',147,3],['JER',30,17],['JAS',5,15],['PSA',103,3],['EXO',15,26],['MRK',5,34],['1PE',2,24],['PSA',30,2],['PRO',4,20]] },
        { key: 'forgiveness', name: 'Forgiveness', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>', verses: [['1JN',1,9],['EPH',4,32],['COL',3,13],['PSA',103,12],['MAT',6,14],['MRK',11,25],['LUK',6,37],['ISA',1,18],['ACT',3,19],['EPH',1,7]] },
        { key: 'grace',       name: 'Grace',       icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5z"/></svg>', verses: [['EPH',2,8],['2CO',12,9],['HEB',4,16],['TIT',2,11],['ROM',6,14],['1PE',5,10],['2TI',2,1],['JHN',1,16],['ROM',11,6],['ACT',20,24]] },
        { key: 'mercy',       name: 'Mercy',       icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', verses: [['LAM',3,22],['PSA',103,11],['EPH',2,4],['TIT',3,5],['PSA',145,8],['HEB',4,16],['LUK',6,36],['PSA',86,15],['1PE',1,3],['PSA',136,1]] },
        { key: 'salvation',   name: 'Salvation',   icon: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>', verses: [['JHN',3,16],['ACT',4,12],['ROM',10,9],['EPH',2,8],['TIT',3,5],['ACT',16,31],['ROM',6,23],['JHN',14,6],['ROM',1,16],['2TI',1,9]] }
    ];

    // -------- DEVOTIONALS DATA --------
    var DEVOTIONALS = [
        {
            day: 'Monday',
            title: 'New Beginnings',
            titleYoruba: 'Ìbẹ̀rẹ̀ Tuntun',
            verseRef: 'ISA-43-19',
            body: 'God is always doing something new. Just as He parted the Red Sea and made a way in the wilderness, He is at work in your life today. Do not look only at yesterday\'s disappointments. Look forward — He is making a way where there seems to be no way.',
            bodyYoruba: 'Ọlọ́run ń ṣe nkan tuntun nígbà gbogbo. Gẹ́gẹ́ bí ó ti pín Òkun Pupa, bẹ́ẹ̀ ni ó ń ṣe ọ̀nà nínú aginjù fún ọ lónìí. Má wo ìjákulẹ̀ àná nìkan. Wo iwájú — ó ń ṣe ọ̀nà níbi tí ó dàbí pé kò sí ọ̀nà kankan.',
            prayer: 'Father, thank You for the new thing You are doing in my life. Open my eyes to see it.',
            prayerYoruba: 'Baba, mo dúpẹ́ fún nkan tuntun tí ìwọ ń ṣe nínú ìgbésí ayé mi. Ṣí ojú mi kí n lè rí i.'
        },
        {
            day: 'Tuesday',
            title: 'Trusting the Process',
            titleYoruba: 'Gbẹ́kẹ̀lé Ìṣe',
            verseRef: 'JER-29-11',
            body: 'God\'s plans for you are good. Even when the path feels long and uncertain, His thoughts toward you are of peace, not of evil. Trust the process. The delays are not denials. He is preparing you for what He has prepared for you.',
            bodyYoruba: 'Ètò Ọlọ́run fún ọ dára. Bí ọ̀nà tilẹ̀ jìnnà tí kò sí ìdánilójú, èrò rẹ̀ sí ọ jẹ́ ti àlàáfíà, kì í ṣe ti ibi. Gbẹ́kẹ̀lé ìlànà náà. Ìdádúró kì í ṣe ìkọ̀sílẹ̀. Ó ń pèsè ọ fún ohun tí ó ti pèsè fún ọ.',
            prayer: 'Lord, I trust Your plan for my life. Help me not to be anxious about tomorrow.',
            prayerYoruba: 'Olúwa, mo gbẹ́kẹ̀lé ètò rẹ fún ìgbésí ayé mi. Ràn mí lọ́wọ́ kí n má ṣe àníyàn nípa ọ̀la.'
        },
        {
            day: 'Wednesday',
            title: 'Grace for Today',
            titleYoruba: 'Oore-ọ̀fẹ́ fún Òní',
            verseRef: '2CO-12-9',
            body: 'God\'s grace is sufficient for today. Not for yesterday\'s regrets or tomorrow\'s fears — for today. Whatever you are facing right now, His grace is enough. Stop trying to carry tomorrow\'s weight with today\'s strength.',
            bodyYoruba: 'Oore-ọ̀fẹ́ Ọlọ́run tó fún òní. Kì í ṣe fún àwọn ìbànújẹ́ àná tàbí ẹ̀rù ọ̀la — fún òní ni. Ohunkóhun tí ìwọ ń dojú kọ báyìí, oore-ọ̀fẹ́ rẹ̀ tó. Dáwọ́ dídìí ẹrù ọ̀la pẹ̀lú agbára òní.',
            prayer: 'Thank You, Lord, for Your sufficient grace today. I receive it.',
            prayerYoruba: 'Mo dúpẹ́, Olúwa, fún oore-ọ̀fẹ́ rẹ tí ó tó ní òní. Mo gbà á.'
        },
        {
            day: 'Thursday',
            title: 'Strength in Weakness',
            titleYoruba: 'Agbára nínú Àìlera',
            verseRef: 'ISA-40-31',
            body: 'When you wait on the Lord, He renews your strength. You will mount up with wings like eagles. You will run and not be weary. You will walk and not faint. The secret to strength is not in your ability, but in your dependence on Him.',
            bodyYoruba: 'Nígbà tí ìwọ bá dúró de Olúwa, yóò sọ agbára rẹ di tuntun. Ìwọ yóò gbé ìyẹ́ bí idì. Ìwọ yóò sáré, kò ní rẹ̀ ọ́. Ìwọ yóò rìn, kò ní rẹ̀ ọ́. Àṣírí agbára kì í ṣe nínú agbára rẹ, ṣùgbọ́n nínú ìgbẹ́kẹ̀lé rẹ lórí rẹ̀.',
            prayer: 'Lord, I am weak, but You are strong. Renew my strength today.',
            prayerYoruba: 'Olúwa, mo jẹ́ aláìlera, ṣùgbọ́n ìwọ lágbára. Sọ agbára mi di tuntun ní òní.'
        },
        {
            day: 'Friday',
            title: 'The Peace That Guards',
            titleYoruba: 'Àlàáfíà tí Ó Ń Ṣọ́',
            verseRef: 'PHP-4-7',
            body: 'The peace of God surpasses all understanding. It will guard your heart and your mind in Christ Jesus. This is not a peace that depends on circumstances. It is a peace that comes from knowing that God is in control.',
            bodyYoruba: 'Àlàáfíà Ọlọ́run kọjá òye gbogbo ènìyàn. Yóò ṣọ́ ọkàn rẹ àti èrò rẹ nínú Kristi Jésù. Èyí kì í ṣe àlàáfíà tí ó gbẹ́kẹ̀lé ipò. Ó jẹ́ àlàáfíà tí ó wá láti mímọ̀ pé Ọlọ́run ni ó ń darí.',
            prayer: 'Father, fill me with Your peace that surpasses understanding.',
            prayerYoruba: 'Baba, kún mi pẹ̀lú àlàáfíà rẹ tí ó kọjá òye.'
        },
        {
            day: 'Saturday',
            title: 'Joy in His Presence',
            titleYoruba: 'Ayọ̀ níwájú Rẹ̀',
            verseRef: 'PSA-16-11',
            body: 'In God\'s presence, there is fullness of joy. Not happiness that depends on what happens around you, but joy that comes from who is with you. Take time today to sit quietly before Him. His joy will strengthen you.',
            bodyYoruba: 'Níwájú Ọlọ́run, ayọ̀ kún. Kì í ṣe ayọ̀ tí ó gbẹ́kẹ̀lé ohun tí ó ṣẹlẹ̀ yí ọ ká, ṣùgbọ́n ayọ̀ tí ó wá láti ọ̀dọ̀ ẹni tí ó wà pẹ̀lú rẹ. Ya àkókò lónìí láti jókòó ní ìdákẹ́jẹ́ níwájú rẹ̀. Ayọ̀ rẹ̀ yóò fun ọ lókun.',
            prayer: 'Lord, I want to dwell in Your presence. Let Your joy fill my heart.',
            prayerYoruba: 'Olúwa, mo fẹ́ gbé níwájú rẹ. Jẹ́ kí ayọ̀ rẹ kún ọkàn mi.'
        },
        {
            day: 'Sunday',
            title: 'Rest and Worship',
            titleYoruba: 'Ìsinmi àti Ìjọ́sìn',
            verseRef: 'PSA-23-2',
            body: 'He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. Sunday is a day of rest and worship. Rest is not laziness; it is obedience. And worship is not just a song; it is a lifestyle.',
            bodyYoruba: 'Ó mú mi dùbúlẹ̀ ní pápá oko tútù. Ó ń tọ́ mi lọ sí ẹ̀bá omi tí ó dákẹ́. Ó ń sọ ọkàn mi di tuntun. Ọjọ́ Àìkú jẹ́ ọjọ́ ìsinmi àti ìjọ́sìn. Ìsinmi kì í ṣe ọ̀lẹ; ìgbọràn ni. Ìjọ́sìn kì í sì í ṣe orin nìkan; ọ̀nà ìgbésí ayé ni.',
            prayer: 'Lord, thank You for Your rest. I worship You today with my whole heart.',
            prayerYoruba: 'Olúwa, mo dúpẹ́ fún ìsinmi rẹ. Mo ń jọ́sìn rẹ lónìì pẹ̀lú gbogbo ọkàn mi.'
        }
    ];

    // -------- HELPERS --------
    function findVerse(bCode, c, v) {
        var bookNum = window.bibleData.getBookIndex(bCode) + 1;
        var yoruba = window.bibleData.yoruba;
        for (var i = 0; i < yoruba.length; i++) {
            var y = yoruba[i];
            if (y.book === bookNum && y.chapter === c && y.verse === v) return y;
        }
        return null;
    }

    function getVerseText(bCode, c, v) {
        var yv = findVerse(bCode, c, v);
        if (!yv) return null;
        var bookNum = window.bibleData.getBookIndex(bCode) + 1;
        var key = bookNum + '-' + c + '-' + v;
        return {
            yo: yv.text,
            en: window.bibleData.englishMap[key] || '',
            ref: window.bibleData.englishNames[bookNum - 1] + ' ' + c + ':' + v,
            b: bCode, c: c, v: v
        };
    }

    // -------- RENDER PLANS --------
    function renderPlans() {
        var container = document.getElementById('tab-plans');
        var active = localStorage.getItem('currentPlan') || 'canonical';

        var html = '';
        for (var i = 0; i < PLANS.length; i++) {
            var p = PLANS[i];
            var isActive = p.key === active;
            html +=
                '<div class="plan-tile' + (isActive ? ' active' : '') + '" data-plan="' + p.key + '">' +
                    '<div class="plan-tile-icon">' + p.icon + '</div>' +
                    '<div class="plan-tile-body">' +
                        '<div class="plan-tile-name">' + p.name + '</div>' +
                        '<div class="plan-tile-desc">' + p.desc + '</div>' +
                    '</div>' +
                    (isActive ? '<div class="plan-tile-badge">✓</div>' : '') +
                '</div>';
        }
        container.innerHTML = html;

        var tiles = container.querySelectorAll('.plan-tile');
        for (var j = 0; j < tiles.length; j++) {
            tiles[j].onclick = function () {
                var key = this.dataset.plan;
                localStorage.setItem('currentPlan', key);
                renderPlans();
                showToast('Plan activated', 'success');
            };
        }
    }

    // -------- RENDER TOPICS --------
    function renderTopics() {
        var grid = document.getElementById('topics-grid');
        var html = '';
        for (var i = 0; i < TOPICS.length; i++) {
            var t = TOPICS[i];
            html +=
                '<div class="topic-tile" data-topic="' + t.key + '">' +
                    t.icon +
                    '<span>' + t.name + '</span>' +
                '</div>';
        }
        grid.innerHTML = html;

        var tiles = grid.querySelectorAll('.topic-tile');
        for (var j = 0; j < tiles.length; j++) {
            tiles[j].onclick = function () {
                openTopic(this.dataset.topic);
            };
        }
    }

    // -------- OPEN TOPIC --------
    function openTopic(key) {
        var topic = null;
        for (var i = 0; i < TOPICS.length; i++) {
            if (TOPICS[i].key === key) { topic = TOPICS[i]; break; }
        }
        if (!topic) return;

        document.getElementById('view-main').style.display = 'none';
        document.getElementById('view-topic').style.display = 'block';
        document.getElementById('topic-detail-title').textContent = topic.name;

        var container = document.getElementById('topic-verses');
        var html = '';
        for (var j = 0; j < topic.verses.length; j++) {
            var ref = topic.verses[j];
            var v = getVerseText(ref[0], ref[1], ref[2]);
            if (!v) continue;
            html +=
                '<div class="verse-card" data-b="' + v.b + '" data-c="' + v.c + '" data-v="' + v.v + '">' +
                    '<div class="verse-num">' + v.ref + '</div>' +
                    '<div class="verse-yoruba">' + v.yo + '</div>' +
                    (v.en ? '<div class="verse-english">' + v.en + '</div>' : '') +
                '</div>';
        }
        container.innerHTML = html;

        var cards = container.querySelectorAll('.verse-card');
        for (var k = 0; k < cards.length; k++) {
            cards[k].onclick = function () {
                var b = this.dataset.b;
                var c = this.dataset.c;
                window.location.href = '/read/chapter/?b=' + b + '&c=' + c;
            };
        }
    }

 // -------- RENDER DEVOTIONALS --------
    function renderDevotionals() {
        var container = document.getElementById('devotionals-list');
        var html = '';
        for (var i = 0; i < DEVOTIONALS.length; i++) {
            var d = DEVOTIONALS[i];
            html +=
                '<div class="devotional-card" data-index="' + i + '">' +
                    '<div class="devotional-day">' + d.day + '</div>' +
                    '<div class="devotional-title">' + d.title + '</div>' +
                    '<div class="devotional-preview">' + d.body.substring(0, 100) + '…</div>' +
                '</div>';
        }
        container.innerHTML = html;

        var cards = container.querySelectorAll('.devotional-card');
        for (var j = 0; j < cards.length; j++) {
            cards[j].onclick = function () {
                openDevotional(parseInt(this.dataset.index));
            };
        }
    }

    // -------- OPEN DEVOTIONAL --------
    function openDevotional(index) {
        var d = DEVOTIONALS[index];
        if (!d) return;

        // Parse verse reference
        var parts = d.verseRef.split('-');
        var v = getVerseText(parts[0], parseInt(parts[1]), parseInt(parts[2]));

        document.getElementById('view-main').style.display = 'none';
        document.getElementById('view-devotional').style.display = 'block';

        var html =
            '<div class="dv-title">' + d.title + '</div>' +
            '<div style="font-size:13px; font-style:italic; color:var(--text-soft); margin-bottom:8px;">' + d.titleYoruba + '</div>' +
            '<div class="dv-verse">' +
                v.yo +
                '<div class="dv-verse-en">' + v.en + '</div>' +
                '<div class="dv-verse-ref">' + v.ref + '</div>' +
            '</div>' +
            '<p>' + d.bodyYoruba + '</p>' +
            '<p>' + d.body + '</p>' +
            '<div class="dv-prayer">' +
                '<div class="dv-prayer-title">Prayer · Àdúrà</div>' +
                '<p style="margin:0 0 8px 0; font-style:italic;">' + d.prayerYoruba + '</p>' +
                '<p style="margin:0; font-style:italic; color:var(--text-soft);">' + d.prayer + '</p>' +
            '</div>';

        document.getElementById('devotional-content').innerHTML = html;
        window.scrollTo(0, 0);
    }

    // -------- TABS --------
    function wireTabs() {
        var tabs = document.querySelectorAll('#discover-tabs .tab-btn');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].onclick = function () {
                for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove('active');
                this.classList.add('active');

                document.getElementById('tab-plans').style.display = 'none';
                document.getElementById('tab-topics').style.display = 'none';
                document.getElementById('tab-devotionals').style.display = 'none';

                var tabId = 'tab-' + this.dataset.tab;
                document.getElementById(tabId).style.display = 'block';
            };
        }
    }

    // -------- BACK BUTTONS --------
    function wireBackButtons() {
        document.getElementById('topic-back').onclick = function () {
            document.getElementById('view-topic').style.display = 'none';
            document.getElementById('view-main').style.display = 'block';
        };
        document.getElementById('devotional-back').onclick = function () {
            document.getElementById('view-devotional').style.display = 'none';
            document.getElementById('view-main').style.display = 'block';
        };
    }

    // -------- BOOT --------
    function boot() {
        window.bibleData.loadAllData().then(function () {
            wireTabs();
            wireBackButtons();
            renderPlans();
            renderTopics();
            renderDevotionals();
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
