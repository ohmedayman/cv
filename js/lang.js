(function() {
    const STORAGE_KEY = 'qcv_lang';
    const DEFAULT_LANG = 'ar';

    const translations = {
        home: { ar: 'الرئيسية', en: 'Home' },
        features: { ar: 'المميزات', en: 'Features' },
        pricing: { ar: 'التسعير', en: 'Pricing' },
        help: { ar: 'المساعدة', en: 'Help' },
        login: { ar: 'تسجيل الدخول', en: 'Login' },
        signup: { ar: 'إنشاء حساب', en: 'Sign Up' },
        templates: { ar: 'القوالب', en: 'Templates' },
        editor: { ar: 'المحرر', en: 'Editor' },
        download: { ar: 'تحميل', en: 'Download' },
        export: { ar: 'تصدير', en: 'Export' },
        save: { ar: 'حفظ', en: 'Save' },
        settings: { ar: 'الإعدادات', en: 'Settings' },
        dark_mode: { ar: 'الوضع الداكن', en: 'Dark Mode' },
        light_mode: { ar: 'الوضع الفاتح', en: 'Light Mode' }
    };

    function getStored() {
        try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
    }

    function setStored(v) {
        try { localStorage.setItem(STORAGE_KEY, v); } catch(e) {}
    }

    function current() {
        return getStored() || DEFAULT_LANG;
    }

    function t(key) {
        const dict = translations[key];
        if (!dict) return key;
        return dict[current()] || dict[DEFAULT_LANG] || key;
    }

    function set(lang) {
        if (lang !== 'ar' && lang !== 'en') return;
        setStored(lang);
        apply(lang);
    }

    function apply(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.textContent = translations[key][lang] || key;
            }
        });
        document.querySelectorAll('.lang-switch').forEach(btn => {
            const arBtn = btn.querySelector('.lang-ar');
            const enBtn = btn.querySelector('.lang-en');
            if (arBtn && enBtn) {
                arBtn.style.opacity = lang === 'ar' ? '1' : '0.5';
                enBtn.style.opacity = lang === 'en' ? '1' : '0.5';
            }
        });
        const html = document.documentElement;
        if (lang === 'ar') {
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
        } else {
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
        }
    }

    function toggleLang() {
        const next = current() === 'ar' ? 'en' : 'ar';
        set(next);
        return next;
    }

    window.QCVLang = { set: set, current: current, t: t, toggle: toggleLang };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { apply(current()); });
    } else {
        apply(current());
    }
})();
