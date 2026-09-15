// ============================================================
// DOWNLOAD PAGE
// ============================================================

(function () {
    'use strict';

    // No SharedNav — this page is standalone (no bottom nav, no menu)
    // Just handle the PWA install prompt

    var deferredPrompt = null;
    var installBtn = document.getElementById('install-native-btn');

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) installBtn.style.display = 'flex';
    });

    if (installBtn) {
        installBtn.onclick = function () {
            if (!deferredPrompt) {
                alert('Use your browser menu and choose "Install App" or "Add to Home Screen".');
                return;
            }
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function (choice) {
                if (choice.outcome === 'accepted') {
                    installBtn.style.display = 'none';
                }
                deferredPrompt = null;
            });
        };
    }

})();
