// ============================================================
// MORE PAGE
// ============================================================

(function () {
    'use strict';

    window.SharedNav.init({
        title: 'More',
        showBack: false,
        showSearch: false,
        showBell: false,
        showMenu: true,
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

    // -------- SHARE --------
    document.getElementById('share-app-btn').onclick = function () {
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

    // -------- FEEDBACK --------
    document.getElementById('feedback-btn').onclick = function () {
        var subject = 'Bibeli Mimo Feedback';
        var body = 'Hello,\n\nI want to share the following feedback about the Bibeli Mimo app:\n\n\n\n— Sent from Bibeli Mimo';

        // Try mailto first
        var mailto = 'mailto:feedback@bibeli-mimo.app?subject=' +
            encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);

        window.location.href = mailto;
    };

})();
