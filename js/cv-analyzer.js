/**
 * QCV AI CV Analyzer — Scores and analyzes CV quality
 * Rules-based scoring + improvement suggestions
 */

const CVAnalyzer = {
    analyze(data) {
        const scores = {
            overall: 0,
            content: this.scoreContent(data),
            ats: this.scoreATS(data),
            skills: this.scoreSkills(data),
            impact: this.scoreImpact(data),
            contact: this.scoreContact(data)
        };
        scores.overall = Math.round(
            scores.content * 0.25 +
            scores.ats * 0.25 +
            scores.skills * 0.2 +
            scores.impact * 0.15 +
            scores.contact * 0.15
        );
        scores.recommendations = this.getRecommendations(data, scores);
        return scores;
    },

    scoreContent(data) {
        let score = 0;
        const summary = (data.summary || '').trim();
        if (summary.length > 0) score += 15;
        if (summary.length >= 50) score += 10;
        if (summary.length >= 100) score += 10;
        if (summary.length >= 150) score += 10;
        if (summary.length > 300) score += 5;

        const exp = data.experience || [];
        if (exp.length >= 1) score += 10;
        if (exp.length >= 2) score += 10;
        if (exp.length >= 3) score += 5;

        exp.forEach(e => {
            const bullets = (e.description || '').split('\n').filter(l => l.trim().length > 5);
            if (bullets.length >= 3) score += 5;
            if (bullets.length >= 5) score += 5;
        });

        const edu = data.education || [];
        if (edu.length >= 1) score += 5;

        return Math.min(100, score);
    },

    scoreATS(data) {
        let score = 0;
        if ((data.name || '').trim().length > 0) score += 10;
        if ((data.email || '').trim().length > 0) score += 10;
        if ((data.phone || '').trim().length > 0) score += 10;
        if ((data.title || '').trim().length > 0) score += 10;
        if ((data.summary || '').trim().length > 0) score += 15;

        const skills = data.skills || [];
        if (skills.length >= 3) score += 10;
        if (skills.length >= 5) score += 5;
        if (skills.length >= 8) score += 5;

        const exp = data.experience || [];
        exp.forEach(e => {
            if ((e.role || '').length > 0) score += 3;
            if ((e.company || '').length > 0) score += 2;
            if ((e.duration || '').length > 0) score += 2;
            if ((e.description || '').length > 20) score += 3;
        });

        return Math.min(100, score);
    },

    scoreSkills(data) {
        const skills = data.skills || [];
        let score = 0;
        if (skills.length >= 3) score += 20;
        if (skills.length >= 5) score += 15;
        if (skills.length >= 8) score += 15;
        if (skills.length >= 12) score += 10;
        if (skills.length > 0) score += 10;

        const longSkills = skills.filter(s => s.length > 15);
        if (longSkills.length === 0) score += 10;
        if (skills.length > 0 && skills.length <= 20) score += 10;

        return Math.min(100, score + 10);
    },

    scoreImpact(data) {
        let score = 0;
        const exp = data.experience || [];
        const allDescriptions = exp.map(e => e.description || '').join(' ');
        const numbers = allDescriptions.match(/\d+/g) || [];
        if (numbers.length >= 1) score += 15;
        if (numbers.length >= 3) score += 10;
        if (numbers.length >= 5) score += 10;

        const powerVerbs = ['قاد', 'أدرت', 'طورت', 'صممت', 'بنيت', 'حققت', 'زدت', 'قللت', 'حسنت', 'أطلقت', 'lead', 'managed', 'developed', 'designed', 'built', 'achieved', 'increased', 'reduced', 'improved', 'launched', 'created', 'implemented', 'optimized', 'delivered'];
        const lower = allDescriptions.toLowerCase();
        const matched = powerVerbs.filter(v => lower.includes(v));
        if (matched.length >= 1) score += 10;
        if (matched.length >= 3) score += 5;

        const bullets = allDescriptions.split('\n').filter(l => l.trim().length > 10);
        if (bullets.length >= 5) score += 10;
        if (bullets.length >= 10) score += 5;

        if (allDescriptions.includes('%') || allDescriptions.includes('$')) score += 10;

        const summary = (data.summary || '').toLowerCase();
        if (summary.match(/\d+/)) score += 5;

        return Math.min(100, score + 10);
    },

    scoreContact(data) {
        let score = 0;
        if ((data.name || '').trim().length > 0) score += 25;
        if ((data.email || '').trim().length > 0) score += 25;
        if ((data.phone || '').trim().length > 0) score += 25;
        if ((data.title || '').trim().length > 0) score += 25;
        return score;
    },

    getRecommendations(data, scores) {
        const recs = [];
        const summary = (data.summary || '').trim();
        const exp = data.experience || [];
        const skills = data.skills || [];
        const allDesc = exp.map(e => e.description || '').join(' ');

        if (summary.length < 50) {
            recs.push({ type: 'critical', icon: '📝', title: 'أضف ملخصاً وظيفياً', text: 'اكتب 2-3 جمل عن خبراتك وأهدافك المهنية', section: 'summary' });
        } else if (summary.length < 100) {
            recs.push({ type: 'warning', icon: '✏️', title: 'طوّر الملخص الوظيفي', text: 'أضف المزيد من التفاصيل عن إنجازاتك ومهاراتك الرئيسية', section: 'summary' });
        }

        if (skills.length < 5) {
            recs.push({ type: 'critical', icon: '🛠️', title: 'أضف المزيد من المهارات', text: 'الهدف 8-12 مهارة على الأقل لتعزيز ظهورك في ATS', section: 'skills' });
        }

        const hasNumbers = allDesc.match(/\d+/);
        if (!hasNumbers && exp.length > 0) {
            recs.push({ type: 'warning', icon: '📊', title: 'أضف أرقاماً وإنجازات قابلة للقياس', text: 'استخدم أرقاماً مثل "قللت الوقت بنسبة 30%" أو "زدت المبيعات بـ 50,000 جنيه"', section: 'experience' });
        }

        const powerVerbs = ['lead', 'managed', 'developed', 'designed', 'built', 'achieved', 'increased', 'reduced', 'improved', 'launched', 'قاد', 'أدرت', 'طورت', 'صممت', 'حققت'];
        const lower = allDesc.toLowerCase();
        const hasVerbs = powerVerbs.some(v => lower.includes(v));
        if (!hasVerbs && exp.length > 0) {
            recs.push({ type: 'info', icon: '💪', title: 'استخدم أفعال قوية', text: 'ابدأ كل نقطة بفعل قوي مثل "قادت" أو "طورت" أو "حققت"', section: 'experience' });
        }

        if (exp.length === 0) {
            recs.push({ type: 'critical', icon: '💼', title: 'أضف خبرات عملية', text: 'الخبرات العملية هي الجزء الأهم في سيرتك الذاتية', section: 'experience' });
        }

        if (exp.some(e => !(e.duration || '').trim())) {
            recs.push({ type: 'warning', icon: '📅', title: 'أكمل تواريخ العمل', text: 'تأكد من إدخال مدة العمل لكل خبرة', section: 'experience' });
        }

        if ((data.education || []).length === 0) {
            recs.push({ type: 'info', icon: '🎓', title: 'أضف المؤهلات التعليمية', text: 'حتى لو كانت خبرتك أكبر، التعليم يعزز ثقة المُوظف', section: 'education' });
        }

        if (!(data.email || '').trim()) {
            recs.push({ type: 'critical', icon: '📧', title: 'أضف بريدك الإلكتروني', text: '필수 معلومات التواصل', section: 'personal' });
        }

        return recs;
    },

    getGrade(score) {
        if (score >= 90) return { grade: 'ممتاز', label: 'EXCELLENT', color: '#10b981', emoji: '🏆' };
        if (score >= 75) return { grade: 'جيد جداً', label: 'VERY GOOD', color: '#0ea5e9', emoji: '⭐' };
        if (score >= 60) return { grade: 'جيد', label: 'GOOD', color: '#f59e0b', emoji: '👍' };
        if (score >= 40) return { grade: 'مقبول', label: 'FAIR', color: '#f97316', emoji: '📈' };
        return { grade: 'يحتاج تحسين', label: 'NEEDS WORK', color: '#ef4444', emoji: '🔧' };
    }
};
