/**
 * QCV Job Matcher — Compares CV against job descriptions
 */

const JobMatcher = {
    match(cvData, jobDescription) {
        if (!jobDescription || !jobDescription.trim()) return null;

        const jobKeywords = this.extractKeywords(jobDescription);
        const cvText = this.getCVText(cvData);
        const cvKeywords = this.extractKeywords(cvText);

        const matched = [...cvKeywords].filter(k => jobKeywords.has(k));
        const missing = [...jobKeywords].filter(k => !cvKeywords.has(k) && k.length > 2);

        const matchPercent = jobKeywords.size > 0
            ? Math.round((matched.length / jobKeywords.size) * 100)
            : 0;

        return {
            matchPercent: Math.min(100, matchPercent),
            matched: matched.slice(0, 20),
            missing: missing.slice(0, 15),
            jobKeywordsCount: jobKeywords.size,
            cvKeywordsCount: cvKeywords.size,
            matchedCount: matched.length,
            sections: this.analyzeSections(cvData, jobKeywords),
            recommendations: this.getJobRecommendations(cvData, jobDescription, matched, missing)
        };
    },

    extractKeywords(text) {
        if (!text) return new Set();
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
            'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'can', 'shall', 'this', 'that',
            'these', 'those', 'it', 'its', 'we', 'our', 'you', 'your', 'they',
            'their', 'he', 'she', 'his', 'her', 'who', 'which', 'what', 'where',
            'when', 'how', 'why', 'all', 'each', 'every', 'both', 'few', 'more',
            'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same',
            'so', 'than', 'too', 'very', 'just', 'because', 'if', 'about', 'as',
            'into', 'through', 'during', 'before', 'after', 'above', 'below',
            'between', 'under', 'again', 'then', 'once', 'here', 'there', 'also',
            'يجب', 'عن', 'مع', 'من', 'في', 'على', 'إلى', 'هو', 'هي', 'نحن',
            'هم', 'التي', 'الذي', 'أن', 'لا', 'قد', 'كان', 'يكون', 'هذا',
            'هذه', 'كل', 'بعد', 'قبل', 'حتى', 'بين', 'تحت', 'أكثر', 'أقل',
            'جيد', 'جيدة', 'أفضل', 'الأفضل', 'ضروري', 'مطلوب', 'يتطلب',
            'years', 'experience', 'year', 'work', 'job', 'position', 'role',
            'looking', 'seeking', 'candidate', 'applicant', 'team', 'company'
        ]);

        const cleaned = text.toLowerCase()
            .replace(/[^\u0600-\u06FFa-z0-9\s\+\#\.]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2 && !stopWords.has(w));

        const bigrams = [];
        for (let i = 0; i < cleaned.length - 1; i++) {
            if (cleaned[i].length > 3 && cleaned[i+1].length > 3) {
                bigrams.push(cleaned[i] + ' ' + cleaned[i+1]);
            }
        }

        const keywords = new Set([...cleaned, ...bigrams]);
        return keywords;
    },

    getCVText(data) {
        const parts = [
            data.name || '',
            data.title || '',
            data.summary || '',
            data.skills || [],
            (data.experience || []).map(e => `${e.role} ${e.company} ${e.description}`).join(' '),
            (data.education || []).map(e => `${e.degree} ${e.school} ${e.description || ''}`).join(' ')
        ];
        return parts.join(' ');
    },

    analyzeSections(data, jobKeywords) {
        const sections = {};

        const titleWords = new Set((data.title || '').toLowerCase().split(/\s+/));
        const titleMatch = [...jobKeywords].filter(k => titleWords.has(k));
        sections.title = {
            score: Math.min(100, Math.round((titleMatch.length / Math.max(jobKeywords.size * 0.1, 1)) * 100)),
            matched: titleMatch.length
        };

        const summaryWords = this.extractKeywords(data.summary || '');
        const summaryMatch = [...jobKeywords].filter(k => summaryWords.has(k));
        sections.summary = {
            score: Math.min(100, Math.round((summaryMatch.length / Math.max(jobKeywords.size * 0.3, 1)) * 100)),
            matched: summaryMatch.length
        };

        const skills = new Set((data.skills || []).map(s => s.toLowerCase()));
        const skillsMatch = [...jobKeywords].filter(k => skills.has(k));
        sections.skills = {
            score: Math.min(100, Math.round((skillsMatch.length / Math.max(jobKeywords.size * 0.25, 1)) * 100)),
            matched: skillsMatch.length
        };

        const expText = (data.experience || []).map(e => `${e.role} ${e.description || ''}`).join(' ');
        const expWords = this.extractKeywords(expText);
        const expMatch = [...jobKeywords].filter(k => expWords.has(k));
        sections.experience = {
            score: Math.min(100, Math.round((expMatch.length / Math.max(jobKeywords.size * 0.35, 1)) * 100)),
            matched: expMatch.length
        };

        return sections;
    },

    getJobRecommendations(cvData, jobDesc, matched, missing) {
        const recs = [];

        if (missing.length > 0) {
            const topMissing = missing.slice(0, 5);
            recs.push({
                type: 'warning',
                icon: '🎯',
                title: 'أضف المهارات المفقودة',
                text: ` considers the following skills: ${topMissing.join(', ')}. أضفها لمهاراتك إذا كنت تملكها.`
            });
        }

        const summary = (cvData.summary || '').toLowerCase();
        const jobLower = jobDesc.toLowerCase();
        const jobWords = new Set(jobLower.split(/\s+/).filter(w => w.length > 3));

        const summaryOverlap = [...jobWords].filter(w => summary.includes(w));
        if (summaryOverlap.length < 3) {
            recs.push({
                type: 'info',
                icon: '📝',
                title: 'خصص الملخص الوظيفي',
                text: 'عدّل ملخصك ليتضمن كلمات وعبارات من إعلان الوظيفة'
            });
        }

        if (matched.length > 5) {
            recs.push({
                type: 'success',
                icon: '✅',
                title: 'توافق جيد مع المهارات',
                text: `لديك ${matched.length} مهارة متطابقة مع المتطلبات`
            });
        }

        return recs;
    },

    getMatchLabel(percent) {
        if (percent >= 80) return { text: 'متوافق جداً', color: '#10b981', emoji: '🟢' };
        if (percent >= 60) return { text: 'توافق جيد', color: '#0ea5e9', emoji: '🔵' };
        if (percent >= 40) return { text: 'توافق متوسط', color: '#f59e0b', emoji: '🟡' };
        return { text: 'يحتاج تحسين', color: '#ef4444', emoji: '🔴' };
    }
};
