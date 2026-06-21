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
        light_mode: { ar: 'الوضع الفاتح', en: 'Light Mode' },
        careers: { ar: 'الوظائف', en: 'Careers' },
        contact: { ar: 'تواصل معنا', en: 'Contact Us' },
        faq: { ar: 'الأسئلة الشائعة', en: 'FAQ' },
        get_started: { ar: 'ابدأ مجاناً', en: 'Get Started' },
        back_home: { ar: 'الصفحة الرئيسية', en: 'Back to Home' },
        go_back: { ar: 'رجوع', en: 'Go Back' },
        page_not_found: { ar: 'الصفحة غير موجودة!', en: 'Page Not Found!' },
        error_msg: { ar: 'يبدو إنك وصلت لصفحة مش موجودة أو اتغير رابطها.', en: 'The page you are looking for does not exist or has been moved.' },
        our_clients: { ar: 'ماذا يقول عملاؤنا؟', en: 'What Our Clients Say' },
        client_subtitle: { ar: 'أكثر من ١٠,٠٠٠ مستخدم يثقون بـ QCV', en: 'Over 10,000 users trust QCV' },
        all_templates: { ar: 'الكل', en: 'All' },
        preview: { ar: 'معاينة', en: 'Preview' },
        use_template: { ar: 'استخدام', en: 'Use Template' },
        close: { ar: 'إغلاق', en: 'Close' },
        copy_link: { ar: 'نسخ الرابط', en: 'Copy Link' },
        copied: { ar: 'تم النسخ!', en: 'Copied!' },
        add_section: { ar: 'إضافة قسم', en: 'Add Section' },
        change_template: { ar: 'تغيير القالب', en: 'Change Template' },
        my_cvs: { ar: 'سيري الذاتية', en: 'My CVs' },
        profile: { ar: 'الملف الشخصي', en: 'Profile' },
        logout: { ar: 'تسجيل الخروج', en: 'Logout' },
        apply_now: { ar: 'تقدم الآن', en: 'Apply Now' },
        open_position: { ar: 'وظيفة متاحة', en: 'Open Position' },
        featured: { ar: 'مميزة', en: 'Featured' }
    };

    const pageTranslations = {
        'index.html': {
            ar: { hero_title: 'ابنِ سيرتك الذاتية الاحترافية', hero_sub: 'بأقوى أدوات الذكاء الاصطناعي', hero_cta: 'ابدأ مجاناً', features_title: 'ليه تختار QCV؟', pricing_title: 'خطط مرنة لكل احتياجاتك', faq_title: 'الأسئلة الشائعة' },
            en: { hero_title: 'Build Your Professional CV', hero_sub: 'With Powerful AI Tools', hero_cta: 'Get Started Free', features_title: 'Why Choose QCV?', pricing_title: 'Flexible Plans for Every Need', faq_title: 'Frequently Asked Questions' }
        },
        'careers.html': {
            ar: { hero_title: 'انضم الى مستقبل التوظيف', hero_sub: 'القائم على الذكاء الاصطناعي' },
            en: { hero_title: 'Join the Future of', hero_sub: 'AI-Powered Hiring' }
        }
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
        const html = document.documentElement;
        if (lang === 'ar') {
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
        } else {
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
        }

        // Update data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.textContent = translations[key][lang] || key;
            }
        });

        // Update language switcher buttons
        document.querySelectorAll('.lang-switch').forEach(btn => {
            const arBtn = btn.querySelector('.lang-ar');
            const enBtn = btn.querySelector('.lang-en');
            if (arBtn && enBtn) {
                arBtn.style.opacity = lang === 'ar' ? '1' : '0.5';
                enBtn.style.opacity = lang === 'en' ? '1' : '0.5';
            }
        });

        // Apply page-specific translations
        const page = location.pathname.split('/').pop() || 'index.html';
        const pageT = pageTranslations[page];
        if (pageT && pageT[lang]) {
            Object.keys(pageT[lang]).forEach(key => {
                const el = document.getElementById(key);
                if (el) el.textContent = pageT[lang][key];
            });
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
