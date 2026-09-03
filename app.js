async function init() {
    const splash = document.getElementById('splash-screen');
    try {
        // Test Yoruba data
        const yRes = await fetch('data/yoruba.json');
        if (!yRes.ok) {
            splash.innerHTML = "ERROR: Could not find 'data/yoruba.json'. <br>Please make sure the 'data' folder is in GitHub.";
            return;
        }
        const yoruba = await yRes.json();
        splash.innerHTML = `<h3>Success!</h3><p>Yoruba data loaded successfully.<br>Found ${yoruba.length} verses.</p>`;
    } catch(e) {
        splash.innerHTML = `ERROR: ${e.message}<br>Check if your internet is on.`;
    }
}
init();
