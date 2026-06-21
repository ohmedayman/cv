/**
 * QCV Tutorial System — Step-by-step guided tours
 * Shows tooltip messages to teach users how to use each feature
 */

const QCVTutorial = {
    _currentStep: 0,
    _steps: [],
    _active: false,
    _overlay: null,
    _tooltip: null,

    init() {
        if (document.getElementById('tutorialOverlay')) return;
        this._overlay = document.createElement('div');
        this._overlay.id = 'tutorialOverlay';
        this._overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9998;display:none;transition:opacity 0.3s';
        this._overlay.onclick = () => this.end();
        document.body.appendChild(this._overlay);

        this._tooltip = document.createElement('div');
        this._tooltip.id = 'tutorialTooltip';
        this._tooltip.style.cssText = 'position:fixed;z-index:9999;background:#fff;border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,0.2);max-width:340px;padding:0;display:none;transition:all 0.35s cubic-bezier(0.16,1,0.3,1);font-family:Cairo,Inter,sans-serif;overflow:hidden';
        document.body.appendChild(this._tooltip);
    },

    start(steps) {
        if (!steps || !steps.length) return;
        this.init();
        this._steps = steps;
        this._currentStep = 0;
        this._active = true;
        this._overlay.style.display = 'block';
        setTimeout(() => this._overlay.style.opacity = '1', 10);
        this._showStep();
    },

    _showStep() {
        if (this._currentStep >= this._steps.length) { this.end(); return; }
        const step = this._steps[this._currentStep];
        const el = document.querySelector(step.target);

        if (!el) { this._currentStep++; this._showStep(); return; }

        // Highlight element
        this._overlay.style.background = 'rgba(0,0,0,0.5)';
        const rect = el.getBoundingClientRect();
        el.style.position = 'relative';
        el.style.zIndex = '10000';
        el.style.boxShadow = '0 0 0 4px rgba(0,3,201,0.4)';
        el.style.borderRadius = el.style.borderRadius || '8px';
        el._tutorialOldZIndex = el.style.zIndex;
        el._tutorialOldShadow = el.style.boxShadow;

        // Build tooltip
        const isLast = this._currentStep === this._steps.length - 1;
        const progress = ((this._currentStep + 1) / this._steps.length * 100).toFixed(0);

        this._tooltip.innerHTML = `
            <div style="background:linear-gradient(135deg,#0003c9,#2563eb);padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
                <span style="color:#fff;font-weight:700;font-size:0.85rem">${step.title || 'Quick Tip'}</span>
                <span style="color:rgba(255,255,255,0.7);font-size:0.7rem">${this._currentStep + 1}/${this._steps.length}</span>
            </div>
            <div style="padding:16px 18px">
                <p style="color:#1a1a2e;font-size:0.88rem;line-height:1.7;margin:0 0 14px 0">${step.message}</p>
                ${step.tip ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 12px;margin-bottom:14px;font-size:0.78rem;color:#166534"><i class="fas fa-lightbulb" style="margin-left:6px;color:#22c55e"></i>${step.tip}</div>` : ''}
                <div style="display:flex;gap:8px;justify-content:flex-end">
                    <button onclick="QCVTutorial.end()" style="padding:7px 14px;border:1px solid #e5e7eb;background:#fff;color:#6b7280;border-radius:8px;font-weight:600;font-size:0.78rem;cursor:pointer;font-family:inherit;transition:all 0.2s">Skip All</button>
                    ${!isLast ? `<button onclick="QCVTutorial.next()" style="padding:7px 16px;background:#0003c9;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:0.78rem;cursor:pointer;font-family:inherit;transition:all 0.2s">Next</button>` : ''}
                    ${isLast ? `<button onclick="QCVTutorial.end()" style="padding:7px 16px;background:#10b981;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:0.78rem;cursor:pointer;font-family:inherit;transition:all 0.2s"><i class="fas fa-check" style="margin-right:4px"></i> Got it!</button>` : ''}
                </div>
            </div>
            <div style="height:3px;background:#f3f4f6"><div style="height:100%;width:${progress}%;background:linear-gradient(90deg,#0003c9,#2563eb);transition:width 0.3s;border-radius:0 3px 3px 0"></div></div>
        `;
        this._tooltip.style.display = 'block';

        // Position tooltip
        setTimeout(() => {
            const tRect = this._tooltip.getBoundingClientRect();
            let top = rect.top - tRect.height - 12;
            let left = rect.left + (rect.width / 2) - (tRect.width / 2);

            if (top < 10) top = rect.bottom + 12;
            if (left < 10) left = 10;
            if (left + tRect.width > window.innerWidth - 10) left = window.innerWidth - tRect.width - 10;

            this._tooltip.style.top = top + 'px';
            this._tooltip.style.left = left + 'px';
            this._tooltip.style.opacity = '1';
            this._tooltip.style.transform = 'translateY(0) scale(1)';

            // Scroll into view
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 20);
    },

    next() {
        this._clearHighlight();
        this._currentStep++;
        this._tooltip.style.opacity = '0';
        this._tooltip.style.transform = 'translateY(8px) scale(0.97)';
        setTimeout(() => this._showStep(), 200);
    },

    end() {
        this._active = false;
        this._clearHighlight();
        this._overlay.style.opacity = '0';
        this._tooltip.style.opacity = '0';
        this._tooltip.style.transform = 'translateY(8px) scale(0.97)';
        setTimeout(() => {
            this._overlay.style.display = 'none';
            this._tooltip.style.display = 'none';
        }, 300);
        localStorage.setItem('qcv_tutorial_done', '1');
    },

    _clearHighlight() {
        const highlighted = document.querySelectorAll('[style*="z-index: 10000"]');
        highlighted.forEach(el => {
            el.style.zIndex = el._tutorialOldZIndex || '';
            el.style.boxShadow = el._tutorialOldShadow || '';
        });
    },

    shouldShow() {
        return !localStorage.getItem('qcv_tutorial_done');
    }
};

// Auto-show tutorial on first visit
window.QCVTutorial = QCVTutorial;
