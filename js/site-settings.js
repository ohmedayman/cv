/**
 * QCV Site Settings Loader
 * Loads settings from Firebase and applies them to the current page
 * Include this script in any page that should respect admin settings
 */
(function(){
    const CFG = {
        apiKey: "AIzaSyA2pXUB830VPoro1BChDY0Ii5Gt_BTrK8I",
        authDomain: "qwcv-1cfad.firebaseapp.com",
        databaseURL: "https://qwcv-1cfad-default-rtdb.firebaseio.com",
        projectId: "qwcv-1cfad",
        storageBucket: "qwcv-1cfad.firebasestorage.app",
        messagingSenderId: "792471802122",
        appId: "1:792471802122:web:808e04099afc90315aaaf3"
    };

    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
        import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

        const app = initializeApp(${JSON.stringify(CFG)});
        const db = getDatabase(app);

        let siteData = {};

        // ===== LOAD ALL SETTINGS =====
        onValue(ref(db, 'siteSettings'), (snap) => {
            siteData = snap.val() || {};
            applyAll();
        });

        function applyAll() {
            applyColors();
            applyBanner();
            applySEO();
            applyMaintenance();
        }

        // ===== COLORS =====
        function applyColors() {
            const c = siteData.colors || {};
            const root = document.documentElement;
            if(c.primary) root.style.setProperty('--accent', c.primary);
            if(c.accent) root.style.setProperty('--sky', c.accent);
            if(c.background) root.style.setProperty('--bg', c.background);
            if(c.cardBg) root.style.setProperty('--card', c.cardBg);
            if(c.text) root.style.setProperty('--text', c.text);
            if(c.muted) root.style.setProperty('--muted', c.muted);
            if(c.border) root.style.setProperty('--border', c.border);
        }

        // ===== BANNER =====
        function applyBanner() {
            const b = siteData.banner || {};
            if(!b.enabled || !b.text) return;
            const existing = document.getElementById('site-banner');
            if(existing) existing.remove();
            const banner = document.createElement('div');
            banner.id = 'site-banner';
            banner.style.cssText = 'background:' + (b.bgColor || '#0003c9') + ';color:' + (b.textColor || '#fff') + ';text-align:center;padding:10px 20px;font-size:0.85rem;font-weight:600;font-family:Cairo,sans-serif;position:relative;z-index:9999';
            banner.innerHTML = b.link
                ? '<a href="' + b.link + '" style="color:' + (b.textColor || '#fff') + ';text-decoration:none">' + b.text + '</a>'
                : b.text;
            document.body.insertBefore(banner, document.body.firstChild);
        }

        // ===== SEO =====
        function applySEO() {
            const s = siteData.seo || {};
            if(s.title) document.title = s.title;
            if(s.description) {
                let meta = document.querySelector('meta[name="description"]');
                if(meta) meta.content = s.description;
            }
            if(s.keywords) {
                let meta = document.querySelector('meta[name="keywords"]');
                if(meta) meta.content = s.keywords;
            }
            if(s.ogImage) {
                let meta = document.querySelector('meta[property="og:image"]');
                if(meta) meta.content = s.ogImage;
            }
        }

        // ===== MAINTENANCE =====
        function applyMaintenance() {
            const m = siteData.maintenance || {};
            if(!m.enabled) return;
            const page = location.pathname.split('/').pop() || 'index.html';
            const bypassPages = ['admin.html', 'admin-setup.html', 'login.html'];
            if(bypassPages.includes(page)) return;
            const ip = '';
            if(m.allowedIPs && m.allowedIPs.includes(ip)) return;
            document.documentElement.innerHTML = '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>صيانة - QCV</title><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#f9fafb;color:#1a1a2e;font-family:Cairo,sans-serif;min-height:100vh;display:flex;justify-content:center;align-items:center;text-align:center;padding:20px}.box{max-width:500px}.icon{font-size:5rem;margin-bottom:20px;opacity:0.3}h1{font-size:2rem;font-weight:900;margin-bottom:12px}p{color:#6b7280;font-size:1.1rem;line-height:1.8}</style></head><body><div class="box"><div class="icon">🔧</div><h1>الموقع قيد الصيانة</h1><p>' + (m.message || 'سنعود قريباً. شكراً لصبركم.') + '</p></div></body>';
        }

        // ===== CONTACT =====
        window.QCVSettings = {
            get data() { return siteData; },
            get contact() { return siteData.contact || {}; },
            get footer() { return siteData.footer || {}; },
            get hero() { return siteData.hero || {}; },
            get pricing() { return siteData.pricing || {}; },
            get notifications() { return siteData.notifications || {}; },
            get colors() { return siteData.colors || {}; },
            get general() { return siteData.general || {}; }
        };
    `;
    document.head.appendChild(script);
})();
