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
        featured: { ar: 'مميزة', en: 'Featured' },

        how_works: { ar: 'كيف يعمل', en: 'How it Works' },
        jobs: { ar: 'الوظائف', en: 'Jobs' },
        start_free: { ar: 'ابدأ مجاناً الآن', en: 'Start Free Now' },
        view_plans: { ar: 'شاهد الباقات', en: 'View Plans' },
        subscribe_now: { ar: 'اشترك الآن', en: 'Subscribe Now' },
        contact_us: { ar: 'تواصل معنا', en: 'Contact Us' },
        whatsapp: { ar: 'واتساب', en: 'WhatsApp' },
        help_center: { ar: 'مركز المساعدة', en: 'Help Center' },
        about_us: { ar: 'من نحن', en: 'About Us' },
        privacy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
        terms: { ar: 'شروط الاستخدام', en: 'Terms of Service' },
        copyright: { ar: 'جميع الحقوق محفوظة', en: 'All Rights Reserved' },

        hero_badge: { ar: 'مدعوم بالذكاء الاصطناعي', en: 'Powered by AI' },
        hero_title: { ar: 'ابنِ سيرة ذاتية <span class="hl">ذكية ومتوافقة</span> مع أنظمة الـ ATS', en: 'Build <span class="hl">Smart CVs</span> That Pass ATS Systems' },
        hero_sub: { ar: 'منشئ سير ذاتية احترافي يعتمد على الذكاء الاصطناعي لمساعدتك في بناء سيرة ذاتية تتجاوز أنظمة الفرز الآلي وتلفت انتباه الموظفين', en: 'Professional AI-powered CV builder to help you create resumes that pass applicant tracking systems and impress recruiters' },
        trust_text: { ar: 'تم استخدامه من قبل +10,000 مستخدم', en: 'Trusted by 10,000+ users' },

        stat_templates: { ar: 'قالب سيرة ذاتية', en: 'CV Templates' },
        stat_rating: { ar: 'تقييم المستخدمين', en: 'User Rating' },
        stat_success: { ar: 'نسبة النجاح في المقابلات', en: 'Interview Success Rate' },
        stat_users: { ar: 'مستخدم نشط', en: 'Active Users' },

        features_title: { ar: 'ليه تختار QCV؟', en: 'Why Choose QCV?' },
        features_sub: { ar: 'أدوات متقدمة مدعومة بالذكاء الاصطناعي لبناء سيرة ذاتية احترافية تتجاوز أنظمة الفرز الآلي', en: 'Advanced AI-powered tools to build professional CVs that beat ATS filters' },
        feature1_title: { ar: 'مساعد الذكاء الاصطناعي', en: 'AI Assistant' },
        feature1_desc: { ar: 'مساعد ذكي يساعدك في صياغة الملخص الوظيفي واختيار المهارات المطلوبة', en: 'Smart assistant helps you craft your professional summary and select required skills' },
        feature2_title: { ar: 'تحليل قوة الـ CV', en: 'CV Score Analysis' },
        feature2_desc: { ar: 'مؤشر حي يحلل قوة سيرتك الذاتية ويعطيك تقييم فوري مع اقتراحات', en: 'Live indicator analyzes your CV strength and gives instant feedback with suggestions' },
        feature3_title: { ar: 'قوالب ATS احترافية', en: 'Professional ATS Templates' },
        feature3_desc: { ar: 'مجموعة من القوالب المعتمدة لتخطي أنظمة الفرز الذكية', en: 'Curated templates designed to pass smart applicant tracking systems' },
        feature4_title: { ar: 'حفظ سحابي آمن', en: 'Secure Cloud Storage' },
        feature4_desc: { ar: 'بياناتك محفوظة ومؤمنة على السحابة مع إمكانية الوصول من أي جهاز', en: 'Your data is safely stored on the cloud and accessible from any device' },

        how_title: { ar: 'كيف يعمل QCV؟', en: 'How Does QCV Work?' },
        how_sub: { ar: '3 خطوات بسيطة للحصول على سيرة ذاتية احترافية متوافقة مع الـ ATS', en: '3 simple steps to get an ATS-friendly professional CV' },
        step1_title: { ar: 'سجل حسابك مجاناً', en: 'Sign Up for Free' },
        step1_desc: { ar: 'أنشئ حسابك في ثوانٍ باستخدام بريدك الإلكتروني أو حساب Google', en: 'Create your account in seconds using your email or Google account' },
        step2_title: { ar: 'أدخل بياناتك', en: 'Enter Your Details' },
        step2_desc: { ar: 'اكتب معلوماتك الشخصية والمهنية وسيقوم الذكاء الاصطناعي بمساعدتك', en: 'Add your personal and professional info — AI will help you along the way' },
        step3_title: { ar: 'حمّل سيرتك الذاتية', en: 'Download Your CV' },
        step3_desc: { ar: 'اختر القالب المناسب وحمّل سيرتك الذاتية بصيغة PDF جاهزة للإرسال', en: 'Choose the right template and download your CV as a ready-to-send PDF' },

        pricing_title: { ar: 'ابدأ مجاناً أو انتقل للباقة المميزة', en: 'Start Free or Go Premium' },
        pricing_sub: { ar: 'اختر الباقة المناسبة لاحتياجاتك مع إمكانية الترقية في أي وقت', en: 'Choose the plan that fits your needs with the option to upgrade anytime' },

        plan_free_name: { ar: 'الباقة المجانية', en: 'Free Plan' },
        plan_free_desc: { ar: 'للمبتدئين والطلاب', en: 'For beginners and students' },
        plan_free_price: { ar: 'مجاني', en: 'Free' },
        plan_free_f1: { ar: 'بناء سيرة ذاتية واحدة', en: 'Build one CV' },
        plan_free_f2: { ar: 'قالب ATS أساسي', en: '1 basic ATS template' },
        plan_free_f3: { ar: 'تنزيل PDF', en: 'PDF download' },
        plan_free_f4: { ar: 'مساعد الذكاء الاصطناعي', en: 'AI assistant' },
        plan_free_f5: { ar: 'قوالب متعددة', en: 'Multiple templates' },
        plan_free_f6: { ar: 'دعم فني مباشر', en: 'Live support' },

        plan_pro_name: { ar: 'الباقة الاحترافية', en: 'Pro Plan' },
        plan_pro_desc: { ar: 'للمحترفين والباحثين عن عمل', en: 'For professionals and job seekers' },
        plan_pro_period: { ar: '/ شهرياً', en: '/ month' },
        plan_pro_f1: { ar: 'سير ذاتية غير محدودة', en: 'Unlimited CVs' },
        plan_pro_f2: { ar: 'جميع القوالب الاحترافية', en: 'All premium templates' },
        plan_pro_f3: { ar: 'تنزيل PDF عالي الجودة', en: 'High-quality PDF export' },
        plan_pro_f4: { ar: 'مساعد الذكاء الاصطناعي (50 طلب/يوم)', en: 'AI assistant (50 requests/day)' },
        plan_pro_f5: { ar: 'تحليل قوة الـ CV', en: 'CV score analysis' },
        plan_pro_f6: { ar: 'دعم فني مباشر', en: 'Live support' },
        plan_pro_badge: { ar: 'الأشهر', en: 'Most Popular' },

        plan_unlim_name: { ar: 'الباقة غير المحدودة', en: 'Unlimited Plan' },
        plan_unlim_desc: { ar: 'للشركات والفرق الكبيرة', en: 'For companies and large teams' },
        plan_unlim_f1: { ar: 'سير ذاتية غير محدودة', en: 'Unlimited CVs' },
        plan_unlim_f2: { ar: 'جميع القوالب الاحترافية', en: 'All premium templates' },
        plan_unlim_f3: { ar: 'تنزيل PDF عالي الجودة', en: 'High-quality PDF export' },
        plan_unlim_f4: { ar: 'مساعد الذكاء الاصطناعي (غير محدود)', en: 'AI assistant (unlimited)' },
        plan_unlim_f5: { ar: 'تحليل قوة الـ CV المتقدم', en: 'Advanced CV analysis' },
        plan_unlim_f6: { ar: 'دعم فني مباشر 24/7', en: '24/7 live support' },

        cta_title: { ar: 'جاهز تبني سيرتك الذاتية الاحترافية؟', en: 'Ready to Build Your Professional CV?' },
        cta_sub: { ar: 'ابدأ الآن مجاناً واحصل على سيرة ذاتية متوافقة مع الـ ATS في دقائق معدودة', en: 'Start for free and get an ATS-friendly CV in minutes' },

        footer_brand: { ar: 'منشئ سير ذاتية ذكي مدعوم بالذكاء الاصطناعي لمساعدتك في الحصول على الوظيفة الأحلام', en: 'Smart AI-powered CV builder to help you land your dream job' },
        footer_product: { ar: 'المنتج', en: 'Product' },
        footer_support: { ar: 'الدعم', en: 'Support' },
        footer_company: { ar: 'الشركة', en: 'Company' },

        faq_title: { ar: 'الأسئلة الشائعة', en: 'Frequently Asked Questions' },
        faq_q1: { ar: 'ما هو الـ ATS ولماذا أحتاج سيرة ذاتية متوافقة معه؟', en: 'What is ATS and why do I need an ATS-compatible CV?' },
        faq_a1: { ar: 'الـ ATS (Applicant Tracking System) هو نظام آلي تستخدمه الشركات الكبيرة لفرز وتصنيف السير الذاتية. QCV يضمن أن سيرتك الذاتية متوافقة مع هذه الأنظمة لتصلك للمقابلة.', en: 'ATS (Applicant Tracking System) is an automated system used by large companies to filter and sort resumes. QCV ensures your CV is compatible with these systems to get you to the interview.' },
        faq_q2: { ar: 'هل الباقة المجانية تكفي لبناء سيرة ذاتية احترافية؟', en: 'Is the free plan enough to build a professional CV?' },
        faq_a2: { ar: 'نعم! الباقة المجانية توفر لك كل ما تحتاجه لبناء سيرة ذاتية احترافية واحدة مع قالب أساسي وتنزيل PDF.', en: 'Yes! The free plan gives you everything you need to build one professional CV with a basic template and PDF download.' },
        faq_q3: { ar: 'كيف يعمل مساعد الذكاء الاصطناعي في QCV؟', en: 'How does the AI assistant work in QCV?' },
        faq_a3: { ar: 'مساعد QCV الذكي يحلل محتوى سيرتك الذاتية ويقترح تحسينات فورية مثل صياغة أفضل للملخص الوظيفي.', en: 'QCV\'s smart assistant analyzes your CV content and suggests instant improvements like better phrasing for your professional summary.' },
        faq_q4: { ar: 'هل يمكنني إلغاء اشتراك QCV في أي وقت؟', en: 'Can I cancel my QCV subscription anytime?' },
        faq_a4: { ar: 'نعم، يمكنك إلغاء اشتراكي في أي وقت دون أي رسوم إضافية. بياناتك ستبقى محفوظة.', en: 'Yes, you can cancel your subscription anytime without any extra fees. Your data will remain saved.' },
        faq_q5: { ar: 'هل بياناتي آمنة على منصة QCV؟', en: 'Is my data safe on QCV?' },
        faq_a5: { ar: 'نعم، جميع بياناتك محفوظة بشكل آمن على سحابة Firebase مع تشفير متقدم.', en: 'Yes, all your data is securely stored on Firebase cloud with advanced encryption.' },

        // ===== Login Page =====
        login_title: { ar: 'تسجيل الدخول', en: 'Login' },
        login_subtitle: { ar: 'مرحباً بعودتك! سجّل دخولك للمتابعة', en: 'Welcome back! Sign in to continue' },
        full_name: { ar: 'الاسم الكامل', en: 'Full Name' },
        email_label: { ar: 'البريد الإلكتروني', en: 'Email' },
        password_label: { ar: 'كلمة المرور', en: 'Password' },
        forgot_password: { ar: 'نسيت كلمة المرور؟', en: 'Forgot Password?' },
        submit_login: { ar: 'تسجيل الدخول', en: 'Login' },
        submit_signup: { ar: 'إنشاء حساب', en: 'Sign Up' },
        google_login: { ar: 'الدخول بـ Google', en: 'Sign in with Google' },
        no_account: { ar: 'ليس لديك حساب؟', en: "Don't have an account?" },
        create_account: { ar: 'إنشاء حساب', en: 'Create Account' },
        has_account: { ar: 'لديك حساب بالفعل؟', en: 'Already have an account?' },
        sign_in: { ar: 'تسجيل الدخول', en: 'Sign In' },
        reset_password: { ar: 'إعادة تعيين كلمة المرور', en: 'Reset Password' },
        reset_subtitle: { ar: 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين', en: 'Enter your email and we will send you a reset link' },
        reset_send: { ar: 'إرسال', en: 'Send' },
        back_to_login: { ar: 'العودة لتسجيل الدخول', en: 'Back to Login' },
        create_new_account: { ar: 'إنشاء حساب جديد', en: 'Create New Account' },
        signup_subtitle: { ar: 'أنشئ حسابك وابدأ في بناء سيرتك الذاتية', en: 'Create your account and start building your CV' },
        signup_btn: { ar: 'إنشاء حساب', en: 'Sign Up' },
        login_toggle: { ar: 'لديك حساب؟ سجّل الدخول', en: 'Have an account? Sign in' },
        signup_toggle: { ar: 'ليس لديك حساب؟ أنشئ حساباً', en: "Don't have an account? Sign up" },
        password_req_length: { ar: 'على الأقل 8 أحرف', en: 'At least 8 characters' },
        password_req_upper: { ar: 'حرف كبير واحد على الأقل', en: 'At least one uppercase letter' },
        password_req_number: { ar: 'رقم واحد على الأقل', en: 'At least one number' },
        password_req_special: { ar: 'رمز خاص واحد على الأقل', en: 'At least one special character' },

        // ===== Templates Page =====
        templates_title: { ar: 'اختر القالب المناسب لك', en: 'Choose the Right Template for You' },
        templates_sub: { ar: 'قوالب احترافية متوافقة مع أنظمة الـ ATS', en: 'Professional templates compatible with ATS systems' },
        templates_count: { ar: 'قالب متاح', en: 'Templates Available' },
        ats_compatible: { ar: 'متوافق مع ATS', en: 'ATS Compatible' },
        user_rating: { ar: 'تقييم المستخدمين', en: 'User Rating' },
        preview_template: { ar: 'معاينة القالب', en: 'Preview Template' },
        use_template_en: { ar: 'استخدام القالب', en: 'Use Template' },
        unlock_template: { ar: 'فتح القالب', en: 'Unlock Template' },
        free_badge: { ar: 'مجاني', en: 'Free' },
        locked_badge: { ar: 'مقفل', en: 'Locked' },
        back_to_home: { ar: 'العودة للرئيسية', en: 'Back to Home' },

        // ===== Help Page =====
        help_title: { ar: 'مركز المساعدة', en: 'Help Center' },
        help_sub: { ar: 'كيف يمكننا مساعدتك؟', en: 'How can we help you?' },
        help_search: { ar: 'ابحث عن إجابة...', en: 'Search for an answer...' },
        help_browse: { ar: 'تصفح الأقسام', en: 'Browse Sections' },
        help_all: { ar: 'الكل', en: 'All' },
        help_getting_started: { ar: 'البدء', en: 'Getting Started' },
        help_account: { ar: 'الحساب', en: 'Account' },
        help_billing: { ar: 'الفواتير', en: 'Billing' },
        help_technical: { ar: 'الدعم الفني', en: 'Technical' },
        help_faq_title: { ar: 'الأسئلة الشائعة', en: 'Frequently Asked Questions' },
        help_faq_sub: { ar: 'إجابات سريعة لأكثر الأسئلة شيوعاً', en: 'Quick answers to common questions' },
        help_quick_links: { ar: 'روابط سريعة', en: 'Quick Links' },
        help_quick_links_sub: { ar: 'وصول سريع لأهم الصفحات', en: 'Quick access to important pages' },
        help_contact_title: { ar: 'تواصل معنا', en: 'Contact Us' },
        help_contact_sub: { ar: 'لم تجد الإجابة؟ تواصل معنا مباشرة', en: "Couldn't find an answer? Contact us directly" },
        help_email: { ar: 'البريد الإلكتروني', en: 'Email' },
        help_email_desc: { ar: 'أرسل لنا رسالة وسناجيب خلال 24 ساعة', en: 'Send us a message and we will reply within 24 hours' },
        help_whatsapp: { ar: 'واتساب', en: 'WhatsApp' },
        help_whatsapp_desc: { ar: 'تواصل معنا مباشرة عبر واتساب', en: 'Contact us directly via WhatsApp' },
        help_facebook: { ar: 'فيسبوك', en: 'Facebook' },
        help_facebook_desc: { ar: 'تابعنا وتواصل معنا عبر فيسبوك', en: 'Follow and contact us on Facebook' },
        help_pricing: { ar: 'التسعير', en: 'Pricing' },
        help_pricing_desc: { ar: 'شاهد الباقات والأسعار', en: 'View plans and pricing' },
        help_login: { ar: 'تسجيل الدخول', en: 'Login' },
        help_login_desc: { ar: 'سجّل دخولك لإدارة حسابك', en: 'Sign in to manage your account' },
        help_features: { ar: 'المميزات', en: 'Features' },
        help_features_desc: { ar: 'اكتشف مميزات QCV', en: 'Discover QCV features' },
        help_how: { ar: 'كيف يعمل', en: 'How it Works' },
        help_how_desc: { ar: 'تعرّف على خطوات بناء سيرتك الذاتية', en: 'Learn how to build your CV' },

        // ===== Careers Page =====
        careers_title: { ar: 'انضم لفريق QCV', en: 'Join Our Team' },
        careers_sub: { ar: 'نسعى دائماً لاستقطاب أفضل المواهب', en: 'We are always looking for the best talent' },
        careers_badge: { ar: 'وظائف متاحة', en: 'Open Positions' },
        careers_desc: { ar: 'اكتشف الفرصة المناسبة وابدأ مسيرتك المهنية معنا', en: 'Discover the right opportunity and start your career with us' },
        careers_browse: { ar: 'تصفح الوظائف', en: 'Browse Jobs' },
        careers_offer_title: { ar: 'ماذا نقدم؟', en: 'What We Offer' },
        careers_offer_sub: { ar: 'بيئة عمل مثالية لتطورك المهني', en: 'An ideal work environment for your professional growth' },
        careers_smart_hiring: { ar: 'توظيف ذكي', en: 'Smart Hiring' },
        careers_smart_hiring_desc: { ar: 'عملية توظيف سريعة وعادلة تعتمد على الكفاءة', en: 'A fast and fair hiring process based on merit' },
        careers_comfortable_work: { ar: 'بيئة عمل مريحة', en: 'Comfortable Work' },
        careers_comfortable_work_desc: { ar: 'مكان عمل مرن يدعم التوازن بين العمل والحياة', en: 'A flexible workspace that supports work-life balance' },
        careers_innovation: { ar: 'بيئة الابتكار', en: 'Innovation Environment' },
        careers_innovation_desc: { ar: 'فرصة للعمل على تقنيات حديثة ومشاريع مبتكرة', en: 'Opportunity to work on modern technologies and innovative projects' },
        careers_empowering: { ar: 'تمكين الموظفين', en: 'Employee Empowerment' },
        careers_empowering_desc: { ar: 'ندعم موظفينا بالتدريب والتطوير المستمر', en: 'We support our employees with continuous training and development' },
        careers_benefits_title: { ar: 'المميزات والرواتب', en: 'Benefits & Salary' },
        careers_benefits_sub: { ar: 'نقدّم باقة مميزات شاملة لجميع الموظفين', en: 'We offer a comprehensive benefits package for all employees' },
        careers_salary: { ar: 'رواتب تنافسية', en: 'Competitive Salary' },
        careers_salary_desc: { ar: 'رواتب مجزية تناسب الخبرة والكفاءة', en: 'Rewards that match experience and competence' },
        careers_vacation: { ar: 'إجازات مرنة', en: 'Flexible Vacation' },
        careers_vacation_desc: { ar: 'إجازات سنوية مرنة مع إجازات إضافية', en: 'Flexible annual leave with additional days off' },
        careers_health: { ar: 'تأمين صحي', en: 'Health Insurance' },
        careers_health_desc: { ar: 'تأمين صحي شامل للموظفين وأسرهم', en: 'Comprehensive health insurance for employees and families' },
        careers_open_positions: { ar: 'الوظائف المتاحة', en: 'Open Positions' },
        careers_no_jobs: { ar: 'لا توجد وظائف متاحة حالياً', en: 'No open positions at the moment' },
        careers_not_found_title: { ar: 'لم نجد الوظيفة', en: 'Position Not Found' },
        careers_not_found_desc: { ar: 'الوظيفة التي تبحث عنها غير متاحة أو تم نقلها', en: 'The position you are looking for is not available or has been moved' },
        careers_contact_us: { ar: 'تواصل معنا', en: 'Contact Us' },

        // ===== Pay Page =====
        pay_title: { ar: 'إتمام الدفع', en: 'Complete Payment' },
        pay_subtitle: { ar: 'اختر طريقة الدفع المناسبة لك', en: 'Choose your preferred payment method' },
        pay_step1: { ar: 'اختر الباقة', en: 'Choose Plan' },
        pay_step2: { ar: 'بيانات الدفع', en: 'Payment Data' },
        pay_step3: { ar: 'التأكيد', en: 'Confirm' },
        pay_choose_plan: { ar: 'اختر الباقة', en: 'Choose Plan' },
        pay_payment_data: { ar: 'بيانات الدفع', en: 'Payment Data' },
        pay_confirm: { ar: 'التأكيد', en: 'Confirm' },
        pay_back: { ar: 'رجوع', en: 'Back' },
        pay_next: { ar: 'التالي', en: 'Next' },
        pay_vodafone: { ar: 'فودافون كاش', en: 'Vodafone Cash' },
        pay_vodafone_desc: { ar: 'ادفع عبر فودافون كاش', en: 'Pay via Vodafone Cash' },
        pay_fawry: { ar: 'فوري', en: 'Fawry' },
        pay_fawry_desc: { ar: 'ادفع عبر فوري', en: 'Pay via Fawry' },
        pay_instapay: { ar: 'إنستاباي', en: 'Instapay' },
        pay_instapay_desc: { ar: 'ادفع عبر إنستاباي', en: 'Pay via Instapay' },
        pay_wallet_label: { ar: 'رقم المحفظة', en: 'Wallet Number' },
        pay_wallet_number: { ar: 'رقم المحفظة', en: 'Wallet Number' },
        pay_copy: { ar: 'نسخ', en: 'Copy' },
        pay_transfer: { ar: 'تحويل', en: 'Transfer' },
        pay_name: { ar: 'الاسم', en: 'Name' },
        pay_name_placeholder: { ar: 'أدخل اسمك الكامل', en: 'Enter your full name' },
        pay_phone: { ar: 'رقم الهاتف', en: 'Phone Number' },
        pay_phone_placeholder: { ar: 'أدخل رقم هاتفك', en: 'Enter your phone number' },
        pay_wallet: { ar: 'المحفظة', en: 'Wallet' },
        pay_wallet_placeholder: { ar: 'أدخل رقم المحفظة', en: 'Enter wallet number' },
        pay_notes: { ar: 'ملاحظات', en: 'Notes' },
        pay_notes_placeholder: { ar: 'أضف أي ملاحظات إضافية', en: 'Add any additional notes' },
        pay_submit: { ar: 'إرسال الدفع', en: 'Submit Payment' },
        pay_success_title: { ar: 'تم الدفع بنجاح!', en: 'Payment Successful!' },
        pay_success_desc: { ar: 'تم استلام طلبك وسيتم مراجعته قريباً', en: 'Your request has been received and will be reviewed shortly' },
        pay_waiting: { ar: 'في انتظار المراجعة', en: 'Awaiting Review' },
        pay_receipt_title: { ar: 'إيصال الدفع', en: 'Payment Receipt' },
        pay_download_receipt: { ar: 'تحميل الإيصال', en: 'Download Receipt' },
        pay_whatsapp_share: { ar: 'مشاركة عبر واتساب', en: 'Share via WhatsApp' },
        pay_back_editor: { ar: 'العودة للمحرر', en: 'Back to Editor' },

        // ===== 404 Page =====
        error_title: { ar: 'عذراً!', en: 'Oops!' },
        error_home: { ar: 'الصفحة الرئيسية', en: 'Home' },
        error_back: { ar: 'رجوع', en: 'Go Back' }
    };

    const pageTranslations = {
        index: ['hero_badge','hero_title','hero_sub','trust_text','stat_templates','stat_rating','stat_success','stat_users','features_title','features_sub','feature1_title','feature1_desc','feature2_title','feature2_desc','feature3_title','feature3_desc','feature4_title','feature4_desc','how_title','how_sub','step1_title','step1_desc','step2_title','step2_desc','step3_title','step3_desc','pricing_title','pricing_sub','plan_free_name','plan_free_desc','plan_free_price','plan_free_f1','plan_free_f2','plan_free_f3','plan_free_f4','plan_free_f5','plan_free_f6','plan_pro_name','plan_pro_desc','plan_pro_period','plan_pro_f1','plan_pro_f2','plan_pro_f3','plan_pro_f4','plan_pro_f5','plan_pro_f6','plan_pro_badge','plan_unlim_name','plan_unlim_desc','plan_unlim_f1','plan_unlim_f2','plan_unlim_f3','plan_unlim_f4','plan_unlim_f5','plan_unlim_f6','cta_title','cta_sub','our_clients','client_subtitle','faq_title','faq_q1','faq_a1','faq_q2','faq_a2','faq_q3','faq_a3','faq_q4','faq_a4','faq_q5','faq_a5','footer_brand','footer_product','footer_support','footer_company'],
        login: ['login_title','login_subtitle','full_name','email_label','password_label','forgot_password','submit_login','submit_signup','google_login','no_account','create_account','has_account','sign_in','reset_password','reset_subtitle','reset_send','back_to_login','create_new_account','signup_subtitle','signup_btn','login_toggle','signup_toggle','password_req_length','password_req_upper','password_req_number','password_req_special'],
        templates: ['templates_title','templates_sub','templates_count','ats_compatible','user_rating','preview_template','use_template_en','unlock_template','free_badge','locked_badge','back_to_home'],
        help: ['help_title','help_sub','help_search','help_browse','help_all','help_getting_started','help_account','help_billing','help_technical','help_faq_title','help_faq_sub','help_quick_links','help_quick_links_sub','help_contact_title','help_contact_sub','help_email','help_email_desc','help_whatsapp','help_whatsapp_desc','help_facebook','help_facebook_desc','help_pricing','help_pricing_desc','help_login','help_login_desc','help_features','help_features_desc','help_how','help_how_desc'],
        careers: ['careers_title','careers_sub','careers_badge','careers_desc','careers_browse','careers_offer_title','careers_offer_sub','careers_smart_hiring','careers_smart_hiring_desc','careers_comfortable_work','careers_comfortable_work_desc','careers_innovation','careers_innovation_desc','careers_empowering','careers_empowering_desc','careers_benefits_title','careers_benefits_sub','careers_salary','careers_salary_desc','careers_vacation','careers_vacation_desc','careers_health','careers_health_desc','careers_open_positions','careers_no_jobs','careers_not_found_title','careers_not_found_desc','careers_contact_us'],
        pay: ['pay_title','pay_subtitle','pay_step1','pay_step2','pay_step3','pay_choose_plan','pay_payment_data','pay_confirm','pay_back','pay_next','pay_vodafone','pay_vodafone_desc','pay_fawry','pay_fawry_desc','pay_instapay','pay_instapay_desc','pay_wallet_label','pay_wallet_number','pay_copy','pay_transfer','pay_name','pay_name_placeholder','pay_phone','pay_phone_placeholder','pay_wallet','pay_wallet_placeholder','pay_notes','pay_notes_placeholder','pay_submit','pay_success_title','pay_success_desc','pay_waiting','pay_receipt_title','pay_download_receipt','pay_whatsapp_share','pay_back_editor'],
        error404: ['error_title','error_msg','error_home','error_back']
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

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.textContent = translations[key][lang] || key;
            }
        });

        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (translations[key]) {
                el.innerHTML = translations[key][lang] || key;
            }
        });

        document.querySelectorAll('.lang-switch').forEach(btn => {
            const arBtn = btn.querySelector('.lang-ar');
            const enBtn = btn.querySelector('.lang-en');
            if (arBtn && enBtn) {
                arBtn.style.opacity = lang === 'ar' ? '1' : '0.5';
                enBtn.style.opacity = lang === 'en' ? '1' : '0.5';
                arBtn.style.background = lang === 'ar' ? 'var(--accent)' : 'transparent';
                arBtn.style.color = lang === 'ar' ? '#fff' : 'var(--text)';
                enBtn.style.background = lang === 'en' ? 'var(--accent)' : 'transparent';
                enBtn.style.color = lang === 'en' ? '#fff' : 'var(--text)';
            }
        });
    }

    function toggleLang() {
        const next = current() === 'ar' ? 'en' : 'ar';
        set(next);
        return next;
    }

    window.QCVLang = { set: set, current: current, t: t, toggle: toggleLang, pageTranslations: pageTranslations };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { apply(current()); });
    } else {
        apply(current());
    }
})();
