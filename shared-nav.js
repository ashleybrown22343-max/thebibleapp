// ============================================================
// SHARED NAVIGATION — Injects header, drawer, bottom nav
// Every page calls: window.SharedNav.init({ ... })
// ============================================================

(function () {
    'use strict';

    var SharedNav = {};

    // ---------- ICONS ----------
    var ICONS = {
        menu: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        close: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        search: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        bell: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
        home: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
        book: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        compass: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
        bookmark: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
        more: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
        settings: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        studio: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
        info: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        share: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
        heart: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    };

    // ---------- NAV ITEMS ----------
    var NAV_ITEMS = [
        { id: 'home',     label: 'Home',     href: '/',           icon: 'home' },
        { id: 'read',     label: 'Read',     href: '/read/',      icon: 'book' },
        { id: 'discover', label: 'Discover', href: '/discover/',  icon: 'compass' },
        { id: 'library',  label: 'Library',  href: '/library/',   icon: 'bookmark' },
        { id: 'more',     label: 'More',     href: '/more/',      icon: 'more' }
    ];

    // ---------- DRAWER LINKS ----------
    var DRAWER_LINKS = [
        { section: 'Bible' },
        { href: '/',           icon: 'home',     label: 'Home' },
        { href: '/read/',      icon: 'book',     label: 'Read Bible' },
        { href: '/discover/',  icon: 'compass',  label: 'Discover' },
        { section: 'Personal' },
        { href: '/library/',   icon: 'bookmark', label: 'My Library' },
        { href: '/library/highlights/', icon: 'heart', label: 'Highlights' },
        { href: '/studio/',    icon: 'studio',   label: 'Image Studio' },
        { section: 'More' },
        { href: '/settings/',  icon: 'settings', label: 'Settings' },
        { href: '/more/',      icon: 'more',     label: 'More Options' }
    ];

    // ---------- BUILD HTML ----------
    function buildHeader(options) {
        var title = options.title || 'Bibeli Mimo';
        var subtitle = options.subtitle || '';
        var showBack = !!options.showBack;
        var showSearch = options.showSearch !== false;
        var showBell = options.showBell !== false;
        var showMenu = options.showMenu !== false;

        var header = document.createElement('header');
        header.className = 'app-header';

        var leftBtn = '';
        if (showBack) {
            leftBtn = '<button class="header-icon-btn" id="nav-back-btn" aria-label="Back">' +
                '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>' +
                '</button>';
        } else if (showMenu) {
            leftBtn = '<button class="header-icon-btn" id="nav-menu-btn" aria-label="Menu">' + ICONS.menu + '</button>';
        } else {
            leftBtn = '<div style="width:40px;"></div>';
        }

        var rightBtns = '';
        if (showSearch) {
            rightBtns += '<a href="/discover/search/" class="header-icon-btn" aria-label="Search">' + ICONS.search + '</a>';
        }
        if (showBell) {
            rightBtns += '<a href="/settings/" class="header-icon-btn" aria-label="Notifications">' + ICONS.bell + '</a>';
        }

        header.innerHTML =
            leftBtn +
            '<div style="flex:1; text-align:center; min-width:0;">' +
                '<div class="app-header-title">' + title + '</div>' +
                (subtitle ? '<div class="app-header-sub">' + subtitle + '</div>' : '') +
            '</div>' +
            '<div class="header-actions">' + rightBtns + '</div>';

        return header;
    }

    function buildDrawer() {
        var drawer = document.createElement('aside');
        drawer.className = 'drawer';
        drawer.id = 'nav-drawer';

        var bodyHtml = '';
        for (var i = 0; i < DRAWER_LINKS.length; i++) {
            var item = DRAWER_LINKS[i];
            if (item.section) {
                bodyHtml += '<div class="drawer-section-title">' + item.section + '</div>';
            } else {
                bodyHtml +=
                    '<a href="' + item.href + '" class="drawer-link">' +
                        ICONS[item.icon] +
                        '<span>' + item.label + '</span>' +
                    '</a>';
            }
        }

        drawer.innerHTML =
            '<div class="drawer-hero">' +
                '<div class="drawer-hero-logo">B</div>' +
                '<h2>Bibeli Mimo</h2>' +
                '<p>Yoruba & English Bible</p>' +
            '</div>' +
            '<div class="drawer-body">' + bodyHtml + '</div>' +
            '<div class="drawer-footer">Version 1.0.0</div>';

        return drawer;
    }

    function buildOverlay() {
        var overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        overlay.id = 'nav-drawer-overlay';
        return overlay;
    }

    function buildBottomNav(activeId) {
        var nav = document.createElement('nav');
        nav.className = 'bottom-nav';

        var html = '';
        for (var i = 0; i < NAV_ITEMS.length; i++) {
            var item = NAV_ITEMS[i];
            var activeClass = (item.id === activeId) ? ' active' : '';
            html +=
                '<a href="' + item.href + '" class="nav-item' + activeClass + '" data-nav="' + item.id + '">' +
                    ICONS[item.icon] +
                    '<span>' + item.label + '</span>' +
                '</a>';
        }
        nav.innerHTML = html;
        return nav;
    }

    // ---------- DRAWER LOGIC ----------
    function openDrawer() {
        var drawer = document.getElementById('nav-drawer');
        var overlay = document.getElementById('nav-drawer-overlay');
        if (drawer) drawer.classList.add('open');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        var drawer = document.getElementById('nav-drawer');
        var overlay = document.getElementById('nav-drawer-overlay');
        if (drawer) drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // ---------- INIT ----------
    SharedNav.init = function (options) {
        options = options || {};

        var body = document.body;

        // 1. Inject header
        var header = buildHeader(options);
        body.insertBefore(header, body.firstChild);

        // 2. Inject drawer + overlay
        body.appendChild(buildDrawer());
        body.appendChild(buildOverlay());

        // 3. Inject bottom nav (unless disabled)
        if (options.showBottomNav !== false) {
            body.appendChild(buildBottomNav(options.activeNav || ''));
        }

        // 4. Wire up menu button
        var menuBtn = document.getElementById('nav-menu-btn');
        if (menuBtn) menuBtn.onclick = openDrawer;

        var backBtn = document.getElementById('nav-back-btn');
        if (backBtn) backBtn.onclick = function () {
            if (window.history.length > 1) window.history.back();
            else window.location.href = '/';
        };

        var overlay = document.getElementById('nav-drawer-overlay');
        if (overlay) overlay.onclick = closeDrawer;

        // 5. Apply saved theme
        var theme = localStorage.getItem('theme') || 'light';
        if (theme === 'dark') body.classList.add('dark');
        if (theme === 'church') body.classList.add('church');
    };

    SharedNav.icons = ICONS;

    window.SharedNav = SharedNav;
})();
