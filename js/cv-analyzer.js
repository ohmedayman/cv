/**
 * QCV AI CV Analyzer — Detailed scoring with specific issue tracking
 * Shows exactly what's missing so users can reach 100%
 */

const CVAnalyzer = {
    analyze(data) {
        const content = this.scoreContent(data);
        const ats = this.scoreATS(data);
        const skills = this.scoreSkills(data);
        const impact = this.scoreImpact(data);
        const contact = this.scoreContact(data);
        const overall = Math.round(
            content.total * 0.25 +
            ats.total * 0.25 +
            skills.total * 0.2 +
            impact.total * 0.15 +
            contact.total * 0.15
        );
        return {
            overall,
            content,
            ats,
            skills,
            impact,
            contact,
            recommendations: this.getRecommendations(data, { content, ats, skills, impact, contact })
        };
    },

    scoreContent(data) {
        const issues = [];
        let score = 0;
        const max = 100;
        const summary = (data.summary || '').trim();
        const exp = data.experience || [];
        const edu = data.education || [];

        // Summary scoring
        if (summary.length === 0) {
            issues.push({ type: 'critical', text: 'Add a professional summary (2-3 lines about your experience)', section: 'summary', fix: '+15' });
        } else if (summary.length < 50) {
            score += 8;
            issues.push({ type: 'warning', text: `Summary too short (${summary.length}/100+ chars) — add more details about your achievements`, section: 'summary', fix: '+7' });
        } else if (summary.length < 100) {
            score += 15;
            issues.push({ type: 'info', text: `Good summary — consider expanding to 100+ chars for better score`, section: 'summary', fix: '+5' });
        } else if (summary.length < 150) {
            score += 20;
            issues.push({ type: 'info', text: 'Strong summary — add numbers/results for even better impact', section: 'summary', fix: '+5' });
        } else {
            score += 25;
        }

        // Experience count
        if (exp.length === 0) {
            issues.push({ type: 'critical', text: 'Add at least 1 work experience entry', section: 'experience', fix: '+10' });
        } else {
            score += 10;
            if (exp.length >= 2) score += 10;
            if (exp.length >= 3) score += 5;
            if (exp.length < 2) {
                issues.push({ type: 'warning', text: 'Add 2+ work experiences for stronger CV', section: 'experience', fix: '+10' });
            }
        }

        // Experience bullet points
        let totalBullets = 0;
        exp.forEach((e, i) => {
            const bullets = (e.description || '').split('\n').filter(l => l.trim().length > 5);
            totalBullets += bullets.length;
            if (bullets.length === 0) {
                issues.push({ type: 'critical', text: `Experience #${i + 1} has no description — add 3-5 bullet points`, section: 'experience', fix: '+5' });
            } else if (bullets.length < 3) {
                score += 2;
                issues.push({ type: 'warning', text: `Experience #${i + 1}: only ${bullets.length} bullet(s) — add ${3 - bullets.length} more`, section: 'experience', fix: '+3' });
            } else {
                score += 5;
                if (bullets.length >= 5) score += 5;
            }
        });

        // Education
        if (edu.length === 0) {
            issues.push({ type: 'info', text: 'Add your educational background', section: 'education', fix: '+5' });
        } else {
            score += 5;
        }

        return { total: Math.min(100, score), max, issues };
    },

    scoreATS(data) {
        const issues = [];
        let score = 0;
        const max = 100;

        // Contact fields
        if (!(data.name || '').trim()) {
            issues.push({ type: 'critical', text: 'Add your full name', section: 'personal', fix: '+10' });
        } else { score += 10; }

        if (!(data.email || '').trim()) {
            issues.push({ type: 'critical', text: 'Add your email address', section: 'personal', fix: '+10' });
        } else { score += 10; }

        if (!(data.phone || '').trim()) {
            issues.push({ type: 'critical', text: 'Add your phone number', section: 'personal', fix: '+10' });
        } else { score += 10; }

        if (!(data.title || '').trim()) {
            issues.push({ type: 'warning', text: 'Add your job title (e.g. "Software Engineer")', section: 'personal', fix: '+10' });
        } else { score += 10; }

        if (!(data.summary || '').trim()) {
            issues.push({ type: 'critical', text: 'Add a professional summary for ATS parsing', section: 'summary', fix: '+15' });
        } else { score += 15; }

        // Skills for ATS
        const skills = data.skills || [];
        if (skills.length < 3) {
            issues.push({ type: 'critical', text: `Only ${skills.length} skill(s) — ATS needs at least 3-5 relevant skills`, section: 'skills', fix: '+10' });
        } else { score += 10; }

        if (skills.length < 5) {
            issues.push({ type: 'warning', text: 'Add 5+ skills to pass ATS keyword filters', section: 'skills', fix: '+5' });
        } else { score += 5; }

        if (skills.length < 8) {
            issues.push({ type: 'info', text: '8+ skills recommended for maximum ATS matching', section: 'skills', fix: '+5' });
        } else { score += 5; }

        // Experience ATS fields
        const exp = data.experience || [];
        exp.forEach((e, i) => {
            if (!(e.role || '').trim()) {
                issues.push({ type: 'warning', text: `Experience #${i + 1}: missing job title`, section: 'experience', fix: '+3' });
            } else { score += 3; }
            if (!(e.company || '').trim()) {
                issues.push({ type: 'warning', text: `Experience #${i + 1}: missing company name`, section: 'experience', fix: '+2' });
            } else { score += 2; }
            if (!(e.duration || '').trim()) {
                issues.push({ type: 'info', text: `Experience #${i + 1}: add work duration (e.g. "2022 - Present")`, section: 'experience', fix: '+2' });
            } else { score += 2; }
            if ((e.description || '').length <= 20) {
                issues.push({ type: 'warning', text: `Experience #${i + 1}: description too short — ATS needs 20+ chars`, section: 'experience', fix: '+3' });
            } else { score += 3; }
        });

        return { total: Math.min(100, score), max, issues };
    },

    scoreSkills(data) {
        const issues = [];
        let score = 0;
        const max = 100;
        const skills = data.skills || [];

        if (skills.length === 0) {
            issues.push({ type: 'critical', text: 'No skills listed — this is the #1 thing ATS systems look for', section: 'skills', fix: '+20' });
        } else {
            score += 10;
            if (skills.length >= 3) score += 20;
            if (skills.length >= 5) score += 15;
            if (skills.length >= 8) score += 15;
            if (skills.length >= 12) score += 10;
        }

        if (skills.length > 0 && skills.length < 5) {
            issues.push({ type: 'warning', text: `Only ${skills.length} skills — aim for 8-12 for best results`, section: 'skills', fix: '+15' });
        }

        if (skills.length >= 5 && skills.length < 8) {
            issues.push({ type: 'info', text: `Good (${skills.length} skills) — add 3+ more to maximize ATS matching`, section: 'skills', fix: '+10' });
        }

        const longSkills = skills.filter(s => s.length > 15);
        if (longSkills.length > 0) {
            score += 5;
            issues.push({ type: 'info', text: `${longSkills.length} skill(s) longer than 15 chars — keep them concise for ATS`, section: 'skills', fix: '+5' });
        } else if (skills.length > 0) {
            score += 10;
        }

        if (skills.length > 0 && skills.length <= 20) score += 10;

        return { total: Math.min(100, score + 10), max, issues };
    },

    scoreImpact(data) {
        const issues = [];
        let score = 0;
        const max = 100;
        const exp = data.experience || [];
        const allDescriptions = exp.map(e => e.description || '').join(' ');

        // Numbers/metrics
        const numbers = allDescriptions.match(/\d+/g) || [];
        if (numbers.length === 0 && exp.length > 0) {
            issues.push({ type: 'critical', text: 'No numbers/metrics in experience — add quantifiable results (e.g. "increased sales by 30%")', section: 'experience', fix: '+15' });
        } else {
            score += 15;
            if (numbers.length >= 3) score += 10;
            if (numbers.length >= 5) score += 10;
        }

        if (numbers.length > 0 && numbers.length < 3 && exp.length > 0) {
            issues.push({ type: 'warning', text: `Only ${numbers.length} number(s) found — add 3+ metrics for stronger impact`, section: 'experience', fix: '+10' });
        }

        // Power verbs
        const powerVerbs = ['lead', 'managed', 'developed', 'designed', 'built', 'achieved', 'increased', 'reduced', 'improved', 'launched', 'created', 'implemented', 'optimized', 'delivered', 'قاد', 'أدرت', 'طورت', 'صممت', 'بنيت', 'حققت', 'زدت', 'قللت', 'حسنت', 'أطلقت'];
        const lower = allDescriptions.toLowerCase();
        const matched = powerVerbs.filter(v => lower.includes(v));
        if (matched.length === 0 && exp.length > 0) {
            issues.push({ type: 'warning', text: 'No action verbs found — start each bullet with words like "Led", "Developed", "Achieved"', section: 'experience', fix: '+10' });
        } else {
            score += 10;
            if (matched.length >= 3) score += 5;
        }

        if (matched.length > 0 && matched.length < 3 && exp.length > 0) {
            issues.push({ type: 'info', text: `Found ${matched.length} action verb(s) — use 3+ different power verbs for maximum impact`, section: 'experience', fix: '+5' });
        }

        // Bullet points count
        const bullets = allDescriptions.split('\n').filter(l => l.trim().length > 10);
        if (bullets.length === 0 && exp.length > 0) {
            issues.push({ type: 'critical', text: 'No bullet points in experience — use line breaks to list achievements', section: 'experience', fix: '+10' });
        } else {
            score += 10;
            if (bullets.length >= 5) score += 5;
        }

        if (bullets.length > 0 && bullets.length < 5 && exp.length > 0) {
            issues.push({ type: 'info', text: `Only ${bullets.length} bullet(s) — aim for 5+ across all experiences`, section: 'experience', fix: '+5' });
        }

        // Percentage or currency symbols
        if (allDescriptions.includes('%') || allDescriptions.includes('$')) {
            score += 10;
        } else if (exp.length > 0) {
            issues.push({ type: 'info', text: 'Add percentages or currency values to show measurable results', section: 'experience', fix: '+10' });
        }

        // Summary numbers
        const summary = (data.summary || '').toLowerCase();
        if (summary.match(/\d+/)) {
            score += 5;
        } else if ((data.summary || '').trim().length > 0) {
            issues.push({ type: 'info', text: 'Add a number to your summary for stronger first impression', section: 'summary', fix: '+5' });
        }

        return { total: Math.min(100, score + 10), max, issues };
    },

    scoreContact(data) {
        const issues = [];
        let score = 0;
        const max = 100;

        if (!(data.name || '').trim()) {
            issues.push({ type: 'critical', text: 'Name is required', section: 'personal', fix: '+25' });
        } else { score += 25; }

        if (!(data.email || '').trim()) {
            issues.push({ type: 'critical', text: 'Email is required', section: 'personal', fix: '+25' });
        } else { score += 25; }

        if (!(data.phone || '').trim()) {
            issues.push({ type: 'critical', text: 'Phone number is required', section: 'personal', fix: '+25' });
        } else { score += 25; }

        if (!(data.title || '').trim()) {
            issues.push({ type: 'warning', text: 'Job title helps recruiters find you faster', section: 'personal', fix: '+25' });
        } else { score += 25; }

        return { total: Math.min(100, score), max, issues };
    },

    getRecommendations(data, scores) {
        const recs = [];

        // Gather all issues from all categories
        const allIssues = [
            ...scores.contact.issues,
            ...scores.content.issues,
            ...scores.ats.issues,
            ...scores.skills.issues,
            ...scores.impact.issues
        ];

        // Deduplicate by section+text
        const seen = new Set();
        allIssues.forEach(issue => {
            const key = issue.section + '|' + issue.text;
            if (!seen.has(key)) {
                seen.add(key);
                recs.push({
                    type: issue.type,
                    icon: issue.type === 'critical' ? '\u2716' : issue.type === 'warning' ? '\u26A0' : '\u2139',
                    title: issue.text,
                    section: issue.section,
                    fix: issue.fix
                });
            }
        });

        // Sort: critical first, then warning, then info
        const order = { critical: 0, warning: 1, info: 2 };
        recs.sort((a, b) => (order[a.type] || 3) - (order[b.type] || 3));

        return recs;
    },

    getGrade(score) {
        if (score >= 95) return { grade: 'ممتاز', label: 'PERFECT', color: '#059669', emoji: '\uD83C\uDFC6' };
        if (score >= 90) return { grade: 'ممتاز', label: 'EXCELLENT', color: '#10b981', emoji: '\uD83C\uDFC6' };
        if (score >= 75) return { grade: 'جيد جداً', label: 'VERY GOOD', color: '#0ea5e9', emoji: '\u2B50' };
        if (score >= 60) return { grade: 'جيد', label: 'GOOD', color: '#f59e0b', emoji: '\uD83D\uDC4D' };
        if (score >= 40) return { grade: 'مقبول', label: 'FAIR', color: '#f97316', emoji: '\uD83D\uDCC8' };
        return { grade: 'يحتاج تحسين', label: 'NEEDS WORK', color: '#ef4444', emoji: '\uD83D\uDD27' };
    }
};
