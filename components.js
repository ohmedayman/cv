/* QCV Shared Components — FAB Menu + Google Translate + Dark/Light Mode */
(function() {
    if (localStorage.getItem('qcv_theme') === 'light') {
        document.body.classList.add('light-mode');
    }
    document.addEventListener('DOMContentLoaded', function() {
        var btn = document.getElementById('qcvThemeIcon');
        if (btn && document.body.classList.contains('light-mode')) {
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        }
    });
})();

/* FAB Toggle */
function toggleFab() {
    document.getElementById('qcvFab').classList.toggle('open');
}

/* Theme */
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    var isLight = document.body.classList.contains('light-mode');
    var icon = document.getElementById('qcvThemeIcon');
    if (isLight) {
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    } else {
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    }
    localStorage.setItem('qcv_theme', isLight ? 'light' : 'dark');
}

/* Google Translate */
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'ar',
        includedLanguages: 'ar,en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

/* Translate Dropdown */
function toggleTranslate() {
    document.getElementById('translateDropdown').classList.toggle('show');
}

function translatePage(lang) {
    var s = document.querySelector('#google_translate_element select');
    if (s) { s.value = lang; s.dispatchEvent(new Event('change')); }
    document.querySelectorAll('.qcv-lang-option').forEach(function(el) { el.classList.remove('active'); });
    var opts = document.querySelectorAll('.qcv-lang-option');
    if (lang === 'ar' && opts[1]) {
        opts[1].classList.add('active');
    } else if (opts[0]) {
        opts[0].classList.add('active');
    }
    document.getElementById('translateDropdown').classList.remove('show');
    /* Move FAB to left for Arabic */
    var fab = document.getElementById('qcvFab');
    if (fab) {
        if (lang === 'ar') {
            fab.style.right = 'auto';
            fab.style.left = '24px';
        } else {
            fab.style.right = '24px';
            fab.style.left = 'auto';
        }
    }
}

/* Close on outside click */
document.addEventListener('click', function(e) {
    if (!e.target.closest('.qcv-fab')) {
        document.getElementById('qcvFab').classList.remove('open');
        var dd = document.getElementById('translateDropdown');
        if (dd) dd.classList.remove('show');
    }
});

/* Move FAB to left when RTL (Arabic translation) */
function checkRTL() {
    var fab = document.getElementById('qcvFab');
    if (!fab) return;
    var isArabic = document.documentElement.dir === 'rtl' ||
                   document.body.dir === 'rtl' ||
                   document.documentElement.getAttribute('lang') === 'ar' ||
                   document.querySelector('.goog-te-banner-frame') !== null;
    if (isArabic) {
        fab.style.right = 'auto';
        fab.style.left = '24px';
    } else {
        fab.style.right = '24px';
        fab.style.left = 'auto';
    }
}
setInterval(checkRTL, 500);
document.addEventListener('DOMContentLoaded', checkRTL);
