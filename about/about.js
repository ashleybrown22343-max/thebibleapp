// ============================================================
// ABOUT PAGE
// ============================================================

(function () {
    'use strict';

    window.SharedNav.init({
        title: 'About',
        showBack: true,
        showSearch: false,
        showBell: false,
        showMenu: false,
        showBottomNav: true,
        activeNav: 'more'
    });

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

    document.getElementById('about-share').onclick = function () {
        var url = window.location.origin;
        var text = 'Read the Bible in Yoruba & English — free, offline, no ads.\n\n' + url;

        if (navigator.share) {
            navigator.share({ title: 'Bibeli Mimo', text: text, url: url })
                .catch(function () {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function () {
                showToast('Link copied to clipboard', 'success');
            });
        } else {
            showToast('Copy this link: ' + url, 'info');
        }
    };

    document.getElementById('about-feedback').onclick = function () {
        var subject = 'Bibeli Mimo Feedback';
        var body = 'Hello,\n\nI want to share the following feedback about the Bibeli Mimo app:\n\n\n\n— Sent from Bibeli Mimo';
        window.location.href = 'mailto:feedback@bibeli-mimo.app?subject=' +
            encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
    };

})();
