(function() {
    const STORAGE_KEY = 'qcv_theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    const root = document.documentElement;

    const darkVars = {
        '--bg': '#0f172a',
        '--bg2': '#0f172a',
        '--card': '#1e293b',
        '--border': '#334155',
        '--text': '#e2e8f0',
        '--muted': '#94a3b8',
        '--light': '#64748b',
        '--accent-light': 'rgba(99,102,241,0.15)',
        '--input': '#1e293b'
    };

    const lightVars = {
        '--bg': '#fff',
        '--bg2': '#f9fafb',
        '--card': '#fff',
        '--border': '#e5e7eb',
        '--text': '#1a1a2e',
        '--muted': '#6b7280',
        '--light': '#9ca3af',
        '--accent-light': '#eef2ff',
        '--input': '#f9fafb'
    };

    function getStored() {
        try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
    }

    function setStored(v) {
        try { localStorage.setItem(STORAGE_KEY, v); } catch(e) {}
    }

    function apply(theme) {
        const vars = theme === DARK ? darkVars : lightVars;
        for (const [k, v] of Object.entries(vars)) {
            root.style.setProperty(k, v);
        }
        root.setAttribute('data-theme', theme);
        updateButtons(theme);
    }

    function updateButtons(theme) {
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            const sunIcon = btn.querySelector('.icon-sun');
            const moonIcon = btn.querySelector('.icon-moon');
            if (sunIcon && moonIcon) {
                sunIcon.style.display = theme === DARK ? 'none' : 'inline';
                moonIcon.style.display = theme === DARK ? 'inline' : 'none';
            }
            btn.title = theme === DARK ? 'Switch to light mode' : 'Switch to dark mode';
        });
    }

    function current() {
        return root.getAttribute('data-theme') || getStored() || LIGHT;
    }

    function toggle() {
        const next = current() === DARK ? LIGHT : DARK;
        setStored(next);
        apply(next);
        return next;
    }

    function init() {
        const saved = getStored() || LIGHT;
        apply(saved);
    }

    window.QCVTheme = { toggle: toggle, current: current };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
