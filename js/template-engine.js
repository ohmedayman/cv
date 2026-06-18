/**
 * QCV Template Engine — 15 ATS-Friendly CV Templates (English)
 * All templates follow professional ATS format from Wozber/Canva/Enhancv
 */

const QCVTemplates = {
    registry: {},

    register(id, template) {
        this.registry[id] = template;
    },

    render(templateId, data) {
        const tpl = this.registry[templateId];
        if (!tpl) return this.registry['classic'].render(data);
        return tpl.render(data);
    },

    getAll() {
        return Object.values(this.registry).map(t => ({
            id: t.id, name: t.name, nameAr: t.nameAr,
            category: t.category, description: t.description, accent: t.accent || '#10b981'
        }));
    },

    getByCategory(cat) {
        return this.getAll().filter(t => t.category === cat);
    }
};

/* ---- Helper: custom sections ---- */
function _customSections(sections) {
    if (!sections || !sections.length) return '';
    return sections.map(sec => {
        const items = (sec.items || []).filter(i => i.title || i.description);
        if (!items.length) return '';
        let h = `<div class="tpl-section"><h2 class="tpl-section-title">${sec.title.toUpperCase()}</h2>`;
        items.forEach(item => {
            h += _item(item.title, item.subtitle, item.date, item.description);
        });
        h += '</div>';
        return h;
    }).join('');
}

/* ---- Helper: contact line ---- */
function _contactLine(d) {
    const p = [];
    if (d.email) p.push(d.email);
    if (d.phone) p.push(d.phone);
    if (d.location) p.push(d.location);
    if (d.linkedin) p.push(d.linkedin);
    return p.join(' | ');
}

/* ---- Helper: section title ---- */
function _sectionTitle(title) {
    return `<h2 class="tpl-section-title">${title}</h2>`;
}

/* ---- Helper: experience/education item ---- */
function _item(left, sub, date, desc) {
    let h = `<div class="tpl-item"><div class="tpl-item-row"><span class="tpl-item-left">${left}</span><span class="tpl-item-date">${date||''}</span></div>`;
    if (sub) h += `<div class="tpl-item-sub">${sub}</div>`;
    if (desc) {
        const lines = desc.split('\n').filter(l=>l.trim()).map(l=>'<div class="tpl-bullet">• '+l.trim().replace(/^[-•]\s*/,'')+'</div>').join('');
        h += `<div class="tpl-item-desc">${lines}</div>`;
    }
    h += '</div>';
    return h;
}

/* ---- Helper: skills text ---- */
function _skillsText(skills) {
    return skills.join(', ');
}

/* ---- Helper: languages text ---- */
function _langsText(langs) {
    return langs.map(l => l.name + (l.level ? ' — ' + l.level : '')).join(' | ');
}

/* ============================================================
   TEMPLATE 1: CLASSIC — ATS-Friendly (Wozber style)
   ============================================================ */
QCVTemplates.register('classic', {
    id: 'classic', name: 'Classic', nameAr: 'كلاسيكي',
    category: 'ats', description: 'ATS-friendly single-column, clean headings, pipe-separated contact',
    accent: '#10b981',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-classic">
            <div class="tc-header">
                <h1 class="tc-name">${d.name || 'YOUR NAME'}</h1>
                <div class="tc-title">${d.title || 'JOB TITLE'}</div>
                ${contact ? `<div class="tc-contact">${contact}</div>` : ''}
            </div>
            ${d.summary ? `<div class="tpl-section">${_sectionTitle('PROFESSIONAL SUMMARY')}<p class="tpl-text">${d.summary}</p></div>` : ''}
            ${(d.experience||[]).length ? `<div class="tpl-section">${_sectionTitle('PROFESSIONAL EXPERIENCE')}${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.education||[]).length ? `<div class="tpl-section">${_sectionTitle('EDUCATION')}${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.skills||[]).length ? `<div class="tpl-section">${_sectionTitle('TECHNICAL SKILLS')}<p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
            ${(d.languages||[]).length ? `<div class="tpl-section">${_sectionTitle('LANGUAGES')}<p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
            ${_customSections(d.customSections)}
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 2: MODERN — Clean with accent header
   ============================================================ */
QCVTemplates.register('modern', {
    id: 'modern', name: 'Modern', nameAr: 'عصري',
    category: 'modern', description: 'Accent header with clean single-column body',
    accent: '#0ea5e9',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-modern">
            <div class="tm-header">
                <div class="tm-avatar">${(d.name||'Y')[0].toUpperCase()}</div>
                <div class="tm-info">
                    <h1 class="tm-name">${d.name || 'YOUR NAME'}</h1>
                    <div class="tm-title">${d.title || 'JOB TITLE'}</div>
                    ${contact ? `<div class="tm-contact">${contact}</div>` : ''}
                </div>
            </div>
            <div class="tm-body">
                ${d.summary ? `<div class="tpl-section"><h2 class="tm-section-title"><span class="tm-dot"></span>Professional Summary</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
                ${(d.experience||[]).length ? `<div class="tpl-section"><h2 class="tm-section-title"><span class="tm-dot"></span>Professional Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
                ${(d.education||[]).length ? `<div class="tpl-section"><h2 class="tm-section-title"><span class="tm-dot"></span>Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
                ${(d.skills||[]).length ? `<div class="tpl-section"><h2 class="tm-section-title"><span class="tm-dot"></span>Skills</h2><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
                ${(d.languages||[]).length ? `<div class="tpl-section"><h2 class="tm-section-title"><span class="tm-dot"></span>Languages</h2><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
                ${_customSections(d.customSections)}
            </div>
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 3: PROFESSIONAL — ATS-optimized
   ============================================================ */
QCVTemplates.register('professional', {
    id: 'professional', name: 'Professional', nameAr: 'احترافي',
    category: 'ats', description: 'Maximum ATS compatibility, clean layout',
    accent: '#334155',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-professional">
            <div class="tp-header">
                <h1 class="tp-name">${d.name || 'YOUR NAME'}</h1>
                <div class="tp-title">${d.title || 'JOB TITLE'}</div>
                ${contact ? `<div class="tp-contact">${contact}</div>` : ''}
            </div>
            <hr class="tp-divider">
            ${d.summary ? `<div class="tpl-section">${_sectionTitle('PROFESSIONAL SUMMARY')}<p class="tpl-text">${d.summary}</p></div>` : ''}
            ${(d.experience||[]).length ? `<div class="tpl-section">${_sectionTitle('WORK EXPERIENCE')}${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.education||[]).length ? `<div class="tpl-section">${_sectionTitle('EDUCATION')}${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.skills||[]).length ? `<div class="tpl-section">${_sectionTitle('TECHNICAL SKILLS')}<p class="tpl-skills-text">${d.skills.join(' • ')}</p></div>` : ''}
            ${(d.languages||[]).length ? `<div class="tpl-section">${_sectionTitle('LANGUAGES')}<p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
            ${_customSections(d.customSections)}
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 4: CREATIVE — Gradient header, modern feel
   ============================================================ */
QCVTemplates.register('creative', {
    id: 'creative', name: 'Creative', nameAr: 'إبداعي',
    category: 'creative', description: 'Gradient header with modern accent colors',
    accent: '#8b5cf6',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-creative">
            <div class="tc-header-creative">
                <div class="tc-avatar-creative">${(d.name||'Y')[0].toUpperCase()}</div>
                <h1 class="tc-name-creative">${d.name || 'YOUR NAME'}</h1>
                <div class="tc-title-creative">${d.title || 'JOB TITLE'}</div>
                ${contact ? `<div class="tc-contact-creative">${contact}</div>` : ''}
            </div>
            <div class="tc-body-creative">
                ${d.summary ? `<div class="tpl-section"><h2 class="tc-stitle-creative">✦ Professional Summary</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
                ${(d.experience||[]).length ? `<div class="tpl-section"><h2 class="tc-stitle-creative">✦ Professional Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
                ${(d.education||[]).length ? `<div class="tpl-section"><h2 class="tc-stitle-creative">✦ Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
                ${(d.skills||[]).length ? `<div class="tpl-section"><h2 class="tc-stitle-creative">✦ Skills</h2><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
                ${(d.languages||[]).length ? `<div class="tpl-section"><h2 class="tc-stitle-creative">✦ Languages</h2><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
                ${_customSections(d.customSections)}
            </div>
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 5: EXECUTIVE — Serif, elegant
   ============================================================ */
QCVTemplates.register('executive', {
    id: 'executive', name: 'Executive', nameAr: 'تنفيذي',
    category: 'classic', description: 'Serif font, elegant for senior positions',
    accent: '#1e293b',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-executive">
            <div class="tex-header">
                <h1 class="tex-name">${d.name || 'YOUR NAME'}</h1>
                <div class="tex-title">${d.title || ''}</div>
                ${contact ? `<div class="tex-contact">${contact}</div>` : ''}
            </div>
            ${d.summary ? `<div class="tpl-section"><h2 class="tex-section-title">Professional Summary</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
            ${(d.experience||[]).length ? `<div class="tpl-section"><h2 class="tex-section-title">Professional Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.education||[]).length ? `<div class="tpl-section"><h2 class="tex-section-title">Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.skills||[]).length ? `<div class="tpl-section"><h2 class="tex-section-title">Core Competencies</h2><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
            ${(d.languages||[]).length ? `<div class="tpl-section"><h2 class="tex-section-title">Languages</h2><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
            ${_customSections(d.customSections)}
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 6: TECHNICAL — Dark header, skills sidebar
   ============================================================ */
QCVTemplates.register('technical', {
    id: 'technical', name: 'Technical', nameAr: 'تقني',
    category: 'modern', description: 'Dark header with sidebar for skills',
    accent: '#06b6d4',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-technical">
            <div class="tt-header">
                <div class="tt-left">
                    <h1 class="tt-name">${d.name || 'YOUR NAME'}</h1>
                    <div class="tt-title">${d.title || ''}</div>
                </div>
                <div class="tt-right">
                    ${d.email ? `<div>${d.email}</div>` : ''}
                    ${d.phone ? `<div>${d.phone}</div>` : ''}
                </div>
            </div>
            <div class="tt-body">
                <div class="tt-main">
                    ${d.summary ? `<div class="tpl-section"><h2 class="tt-stitle">Professional Summary</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
                    ${(d.experience||[]).length ? `<div class="tpl-section"><h2 class="tt-stitle">Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
                    ${(d.education||[]).length ? `<div class="tpl-section"><h2 class="tt-stitle">Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
                    ${_customSections(d.customSections)}
                </div>
                <div class="tt-sidebar">
                    ${(d.skills||[]).length ? `<div class="tpl-section"><h2 class="tt-stitle">Technical Skills</h2><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
                    ${(d.languages||[]).length ? `<div class="tpl-section"><h2 class="tt-stitle">Languages</h2><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
                </div>
            </div>
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 7: MINIMALIST — Ultra clean
   ============================================================ */
QCVTemplates.register('minimalist', {
    id: 'minimalist', name: 'Minimalist', nameAr: 'بسيط',
    category: 'classic', description: 'Ultra clean with maximum whitespace',
    accent: '#64748b',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-minimalist">
            <div class="tmi-name">${d.name || 'YOUR NAME'}</div>
            <div class="tmi-contact">${d.title ? d.title + ' · ' : ''}${contact}</div>
            ${d.summary ? `<div class="tpl-section"><div class="tmi-stitle">SUMMARY</div><p class="tpl-text">${d.summary}</p></div>` : ''}
            ${(d.experience||[]).length ? `<div class="tpl-section"><div class="tmi-stitle">EXPERIENCE</div>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.education||[]).length ? `<div class="tpl-section"><div class="tmi-stitle">EDUCATION</div>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.skills||[]).length ? `<div class="tpl-section"><div class="tmi-stitle">SKILLS</div><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
            ${(d.languages||[]).length ? `<div class="tpl-section"><div class="tmi-stitle">LANGUAGES</div><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
            ${_customSections(d.customSections)}
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 8: SIDEBAR — Two-column with colored sidebar
   ============================================================ */
QCVTemplates.register('sidebar', {
    id: 'sidebar', name: 'Sidebar', nameAr: 'جانبي',
    category: 'modern', description: 'Two-column with colored left sidebar',
    accent: '#3b82f6',
    render(d) {
        return `
        <div class="tpl-sidebar">
            <div class="ts-left-panel">
                <div class="ts-avatar">${(d.name||'Y')[0].toUpperCase()}</div>
                <h1 class="ts-name">${d.name || 'YOUR NAME'}</h1>
                <div class="ts-title">${d.title || ''}</div>
                <div class="ts-contact-panel">
                    ${d.email ? `<div>${d.email}</div>` : ''}
                    ${d.phone ? `<div>${d.phone}</div>` : ''}
                </div>
                ${(d.skills||[]).length ? `<div class="ts-panel-section"><h3>Skills</h3><div class="ts-skills-panel">${d.skills.map(s=>'<span>'+s+'</span>').join('')}</div></div>` : ''}
                ${(d.languages||[]).length ? `<div class="ts-panel-section"><h3>Languages</h3>${d.languages.map(l=>'<div class="ts-edu-item">'+l.name+(l.level?' — '+l.level:'')+'</div>').join('')}</div>` : ''}
            </div>
            <div class="ts-right-panel">
                ${d.summary ? `<div class="tpl-section"><h2 class="ts-stitle">Professional Summary</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
                ${(d.experience||[]).length ? `<div class="tpl-section"><h2 class="ts-stitle">Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
                ${(d.education||[]).length ? `<div class="tpl-section"><h2 class="ts-stitle">Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
                ${_customSections(d.customSections)}
            </div>
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 9: TWO-COLUMN — Balanced layout
   ============================================================ */
QCVTemplates.register('two-column', {
    id: 'two-column', name: 'Two Column', nameAr: 'عمودين',
    category: 'modern', description: 'Balanced two-column layout',
    accent: '#14b8a6',
    render(d) {
        return `
        <div class="tpl-twocol">
            <div class="ttc-header">
                <h1>${d.name || 'YOUR NAME'}</h1>
                <div>${d.title || ''}</div>
                <div class="ttc-contact-line">${_contactLine(d)}</div>
            </div>
            <div class="ttc-body">
                <div class="ttc-col-main">
                    ${d.summary ? `<div class="tpl-section"><h2 class="ttc-stitle">Professional Summary</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
                    ${(d.experience||[]).length ? `<div class="tpl-section"><h2 class="ttc-stitle">Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
                    ${(d.education||[]).length ? `<div class="tpl-section"><h2 class="ttc-stitle">Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
                </div>
                <div class="ttc-col-side">
                    <div class="ttc-contact-side">
                        <h2>Contact</h2>
                        ${d.email ? `<div>${d.email}</div>` : ''}
                        ${d.phone ? `<div>${d.phone}</div>` : ''}
                    </div>
                    ${(d.skills||[]).length ? `<div class="tpl-section"><h2 class="ttc-stitle">Skills</h2><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
                    ${(d.languages||[]).length ? `<div class="tpl-section"><h2 class="ttc-stitle">Languages</h2><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
                    ${_customSections(d.customSections)}
                </div>
            </div>
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 10: BOLD — Large header, strong type
   ============================================================ */
QCVTemplates.register('bold', {
    id: 'bold', name: 'Bold', nameAr: 'جريء',
    category: 'modern', description: 'Large bold header with strong typography',
    accent: '#f59e0b',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-bold">
            <div class="tb-header">
                <div class="tb-big-name">${d.name || 'YOUR NAME'}</div>
                <div class="tb-tagline">${d.title || ''}</div>
                ${contact ? `<div class="tb-contact-row">${contact}</div>` : ''}
            </div>
            <div class="tb-body">
                ${d.summary ? `<div class="tpl-section"><h2 class="tb-stitle">— Professional Summary</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
                ${(d.experience||[]).length ? `<div class="tpl-section"><h2 class="tb-stitle">— Professional Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
                ${(d.education||[]).length ? `<div class="tpl-section"><h2 class="tb-stitle">— Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
                ${(d.skills||[]).length ? `<div class="tpl-section"><h2 class="tb-stitle">— Skills</h2><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
                ${(d.languages||[]).length ? `<div class="tpl-section"><h2 class="tb-stitle">— Languages</h2><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
                ${_customSections(d.customSections)}
            </div>
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 11: ELEGANT — Warm tones, serif
   ============================================================ */
QCVTemplates.register('elegant', {
    id: 'elegant', name: 'Elegant', nameAr: 'أنيق',
    category: 'classic', description: 'Warm tones with serif typography',
    accent: '#b45309',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-elegant">
            <div class="tel-header">
                <h1 class="tel-name">${d.name || 'YOUR NAME'}</h1>
                <div class="tel-rule"></div>
                <div class="tel-title">${d.title || ''}</div>
                ${contact ? `<div class="tel-contact">${contact}</div>` : ''}
            </div>
            ${d.summary ? `<div class="tpl-section"><h2 class="tel-stitle">Professional Summary</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
            ${(d.experience||[]).length ? `<div class="tpl-section"><h2 class="tel-stitle">Professional Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.education||[]).length ? `<div class="tpl-section"><h2 class="tel-stitle">Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.skills||[]).length ? `<div class="tpl-section"><h2 class="tel-stitle">Skills</h2><p class="tpl-skills-text">${d.skills.join(' • ')}</p></div>` : ''}
            ${(d.languages||[]).length ? `<div class="tpl-section"><h2 class="tel-stitle">Languages</h2><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
            ${_customSections(d.customSections)}
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 12: ATS-SAFE — Maximum ATS compatibility
   ============================================================ */
QCVTemplates.register('ats-safe', {
    id: 'ats-safe', name: 'ATS Safe', nameAr: 'آمن لل ATS',
    category: 'ats', description: 'Maximum ATS compatibility, no fancy formatting',
    accent: '#059669',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-ats">
            <div class="tats-name">${d.name || 'YOUR NAME'}</div>
            ${d.title ? `<div class="tats-title">${d.title}</div>` : ''}
            <div class="tats-contact">${contact}</div>
            ${d.summary ? `<div class="tpl-section"><div class="tats-stitle">PROFESSIONAL SUMMARY</div><p class="tpl-text">${d.summary}</p></div>` : ''}
            ${(d.experience||[]).length ? `<div class="tpl-section"><div class="tats-stitle">WORK EXPERIENCE</div>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.education||[]).length ? `<div class="tpl-section"><div class="tats-stitle">EDUCATION</div>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.skills||[]).length ? `<div class="tpl-section"><div class="tats-stitle">SKILLS</div><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
            ${(d.languages||[]).length ? `<div class="tpl-section"><div class="tats-stitle">LANGUAGES</div><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
            ${_customSections(d.customSections)}
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 13: ACADEMIC — Publications, research
   ============================================================ */
QCVTemplates.register('academic', {
    id: 'academic', name: 'Academic', nameAr: 'أكاديمي',
    category: 'classic', description: 'Academic CV with research focus',
    accent: '#7c3aed',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-academic">
            <div class="ta-header">
                <h1>${d.name || 'YOUR NAME'}</h1>
                <div class="ta-title">${d.title || ''}</div>
                ${contact ? `<div class="ta-contact">${contact}</div>` : ''}
            </div>
            ${d.summary ? `<div class="tpl-section"><h2>Research Interests</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
            ${(d.education||[]).length ? `<div class="tpl-section"><h2>Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.experience||[]).length ? `<div class="tpl-section"><h2>Professional Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.skills||[]).length ? `<div class="tpl-section"><h2>Skills & Tools</h2><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
            ${(d.languages||[]).length ? `<div class="tpl-section"><h2>Languages</h2><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
            ${_customSections(d.customSections)}
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 14: STARTUP — Casual, project-forward
   ============================================================ */
QCVTemplates.register('startup', {
    id: 'startup', name: 'Startup', nameAr: 'شركة ناشئة',
    category: 'modern', description: 'Dynamic style for startup culture',
    accent: '#10b981',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-startup">
            <div class="tst-header">
                <div class="tst-badge">${(d.name||'Y')[0].toUpperCase()}</div>
                <div>
                    <h1>${d.name || 'YOUR NAME'}</h1>
                    <div class="tst-title">${d.title || ''}</div>
                </div>
            </div>
            ${contact ? `<div class="tst-contact">${contact}</div>` : ''}
            ${d.summary ? `<div class="tpl-section"><h2>About Me</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
            ${(d.experience||[]).length ? `<div class="tpl-section"><h2>Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.education||[]).length ? `<div class="tpl-section"><h2>Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
            ${(d.skills||[]).length ? `<div class="tpl-section"><h2>Tech Stack</h2><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
            ${(d.languages||[]).length ? `<div class="tpl-section"><h2>Languages</h2><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
            ${_customSections(d.customSections)}
        </div>`;
    }
});

/* ============================================================
   TEMPLATE 15: INTERNATIONAL — Multilingual, clean
   ============================================================ */
QCVTemplates.register('international', {
    id: 'international', name: 'International', nameAr: 'دولي',
    category: 'modern', description: 'Clean international CV format',
    accent: '#2563eb',
    render(d) {
        const contact = _contactLine(d);
        return `
        <div class="tpl-intl">
            <div class="ti-header">
                <h1 class="ti-name">${d.name || 'YOUR NAME'}</h1>
                <div class="ti-title">${d.title || ''}</div>
                ${contact ? `<div class="ti-contact">${contact}</div>` : ''}
            </div>
            <div class="ti-grid">
                <div class="ti-main">
                    ${d.summary ? `<div class="tpl-section"><h2 class="ti-stitle">Professional Summary</h2><p class="tpl-text">${d.summary}</p></div>` : ''}
                    ${(d.experience||[]).length ? `<div class="tpl-section"><h2 class="ti-stitle">Work Experience</h2>${d.experience.map(e=>_item(e.role, e.company, e.duration, e.description)).join('')}</div>` : ''}
                    ${(d.education||[]).length ? `<div class="tpl-section"><h2 class="ti-stitle">Education</h2>${d.education.map(e=>_item(e.degree, e.school, e.duration, e.description)).join('')}</div>` : ''}
                </div>
                <div class="ti-side">
                    ${(d.skills||[]).length ? `<div class="tpl-section"><h2 class="ti-stitle">Skills</h2><p class="tpl-skills-text">${_skillsText(d.skills)}</p></div>` : ''}
                    ${(d.languages||[]).length ? `<div class="tpl-section"><h2 class="ti-stitle">Languages</h2><p class="tpl-skills-text">${_langsText(d.languages)}</p></div>` : ''}
                </div>
            </div>
        </div>`;
    }
});
