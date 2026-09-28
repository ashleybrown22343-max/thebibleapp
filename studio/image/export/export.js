// ============================================================
// BIBELI MIMO – EXPORT PAGE (Native Canvas + IndexedDB handoff)
// ============================================================

var exportData = null;
var generatedBlob = null;
var generatedFilename = '';

var EXPORT_DB = 'bibeli_export';
var EXPORT_STORE = 'blobs';
var EXPORT_KEY = 'current';

function showView(id) {
    document.querySelectorAll('.export-view').forEach(function (v) { v.classList.remove('active'); });
    document.getElementById(id).classList.add('active');
}
function setProgress(percent, status) {
    document.getElementById('progress-percent').textContent = Math.round(percent) + '%';
    document.getElementById('progress-fill').style.width = percent + '%';
    if (status) document.getElementById('status-text').textContent = status;
}
function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function showError(msg) {
    document.getElementById('error-msg').textContent = msg;
    showView('error-view');
}
function triggerDownload(blob, filename) {
    try {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
    } catch (e) {
        var reader = new FileReader();
        reader.onload = function () {
            var a = document.createElement('a');
            a.href = reader.result;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        reader.readAsDataURL(blob);
    }
}
function computeTargetHeight(w, ratio) {
    if (ratio === 'square') return w;
    if (ratio === 'portrait') return Math.round(w * 5 / 4);
    if (ratio === 'story') return Math.round(w * 16 / 9);
    if (ratio === 'landscape') return Math.round(w * 9 / 16);
    return Math.round(w * 4 / 3);
}

// ---------- INDEXEDDB READ + DELETE ----------
function idbGet(key) {
    return new Promise(function (resolve, reject) {
        var req = indexedDB.open(EXPORT_DB, 1);
        req.onupgradeneeded = function () {
            var db = req.result;
            if (!db.objectStoreNames.contains(EXPORT_STORE)) {
                db.createObjectStore(EXPORT_STORE);
            }
        };
        req.onsuccess = function () {
            var db = req.result;
            var tx = db.transaction(EXPORT_STORE, 'readonly');
            var get = tx.objectStore(EXPORT_STORE).get(key);
            get.onsuccess = function () { resolve(get.result || null); };
            get.onerror = function () { reject(get.error); };
        };
        req.onerror = function () { reject(req.error); };
    });
}

function idbDelete(key) {
    return new Promise(function (resolve) {
        var req = indexedDB.open(EXPORT_DB, 1);
        req.onsuccess = function () {
            var db = req.result;
            try {
                var tx = db.transaction(EXPORT_STORE, 'readwrite');
                tx.objectStore(EXPORT_STORE).delete(key);
                tx.oncomplete = function () { resolve(); };
                tx.onerror = function () { resolve(); };
            } catch (e) { resolve(); }
        };
        req.onerror = function () { resolve(); };
    });
}

// ---------- MAIN FLOW ----------
async function runExportFlow() {
    showView('processing-view');
    setProgress(0, 'Starting…');
    await delay(120);

    var state = exportData.settings || {};
    var targetW = parseInt(exportData.exportRes) || 1080;
    var targetH = computeTargetHeight(targetW, state.ratio || 'square');

    setProgress(20, 'Loading fonts…');
    await RenderEngine.ensureFonts([state.fontFamily, state.refFontFamily, 'Poppins', 'Playfair Display', 'Inter']);
    await delay(100);

    setProgress(50, 'Rendering image…');
    var canvas;
    try {
        canvas = await RenderEngine.render({
            state: state,
            verseYoruba: exportData.verseYoruba,
            verseEnglish: exportData.verseEnglish,
            referenceText: exportData.referenceText,
            backgroundURL: exportData.backgroundURL,
            bgGradient: exportData.bgGradient,
            bgSolid: exportData.bgSolid,
            targetW: targetW,
            targetH: targetH,
            previewW: exportData.previewW || 350
        });
    } catch (e) {
        showError('Rendering failed: ' + (e && e.message ? e.message : e));
        return;
    }

    setProgress(80, 'Preparing file…');
    var format = exportData.exportFormat || 'png';
    var mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
    var quality = format === 'jpg' ? ((exportData.exportQuality || 90) / 100) : 1.0;

    var blob = await new Promise(function (resolve) {
        canvas.toBlob(function (b) { resolve(b); }, mime, quality);
    });

    if (!blob) { showError('Failed to prepare image file.'); return; }
    generatedBlob = blob;

    var refClean = (exportData.referenceText || 'verse').replace(/[:]/g, '-').replace(/\s+/g, '-');
    var now = new Date();
    var stamp = now.getFullYear() + pad2(now.getMonth() + 1) + pad2(now.getDate()) + '-' + pad2(now.getHours()) + pad2(now.getMinutes());
    var ext = format === 'jpg' ? 'jpg' : 'png';
    generatedFilename = 'bible-' + refClean + '-' + stamp + '.' + ext;

    setProgress(95, 'Saving…');
    await delay(100);
    triggerDownload(blob, generatedFilename);

    setProgress(100, 'Done!');
    await delay(300);

    var thumbURL = URL.createObjectURL(blob);
    document.getElementById('preview-thumb').src = thumbURL;
    document.getElementById('filename-display').textContent = generatedFilename;
    showView('success-view');
}

async function shareGenerated() {
    if (!generatedBlob || !generatedFilename) return;
    var file = new File([generatedBlob], generatedFilename, { type: generatedBlob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({ files: [file], title: 'Bible Verse', text: 'Shared from Bibeli Mimo' });
        } catch (e) {
            if (e.name !== 'AbortError') alert('Sharing failed.');
        }
    } else {
        alert('Sharing not supported. The image is already saved.');
    }
}

async function copyGenerated() {
    if (!generatedBlob) return;
    try {
        if (navigator.clipboard && window.ClipboardItem) {
            var item = new ClipboardItem({ [generatedBlob.type]: generatedBlob });
            await navigator.clipboard.write([item]);
            alert('Image copied.');
        } else alert('Copy not supported.');
    } catch (e) { alert('Copy failed. Image saved already.'); }
}

function initExport() {
    document.getElementById('back-btn').onclick = function () { window.location.href = '/studio/image/'; };
    document.getElementById('error-back-action').onclick = function () { window.location.href = '/studio/image/'; };
    document.getElementById('back-studio-action').onclick = function () { window.location.href = '/studio/image/'; };
    document.getElementById('retry-action').onclick = function () { runExportFlow(); };
    document.getElementById('save-again-action').onclick = function () {
        if (generatedBlob && generatedFilename) triggerDownload(generatedBlob, generatedFilename);
    };
    document.getElementById('share-action').onclick = shareGenerated;
    document.getElementById('copy-action').onclick = copyGenerated;

    idbGet(EXPORT_KEY).then(function (data) {
        if (!data) {
            showError('No export data found. Go back to the Studio and try again.');
            return;
        }
        exportData = data;
        // Delete immediately — the payload lives in this page's memory only
        idbDelete(EXPORT_KEY);
        runExportFlow();
    }).catch(function (err) {
        console.error('IndexedDB read failed:', err);
        showError('Could not read export data.');
    });
}

window.addEventListener('load', initExport);
