// Global Array to act as memory for the Recycle Bin
let trashBin = [];

// Main Live Rendering Core
function updateLiveCV() {
    // Helper function to safely update text safely handling placeholders if empty
    const safeSetText = (targetId, sourceId) => {
        const sourceEl = document.getElementById(sourceId);
        const targetEl = document.getElementById(targetId);
        if (sourceEl && targetEl) {
            targetEl.innerText = sourceEl.value || '';
        }
    };

    // Static fields mapping
    safeSetText('cvName', 'inputName');
    safeSetText('cvTitle', 'inputTitle');
    safeSetText('cvContact', 'inputContact');
    safeSetText('cvLinks', 'inputLinks');
    safeSetText('cvSkills', 'inputSkills');

    // Section Titles Mapping (Smooth User Customization)
    safeSetText('cvSummaryTitle', 'inputSummaryTitle');
    safeSetText('cvExperienceTitle', 'inputExperienceTitle');
    safeSetText('cvEducationTitle', 'inputEducationTitle');
    safeSetText('cvSkillsTitle', 'inputSkillsTitle');

    // Handle Summary Text Block
    const summaryInput = document.getElementById('inputSummary');
    const summaryOutput = document.getElementById('cvSummary');
    if (summaryInput && summaryOutput) {
        summaryOutput.innerText = summaryInput.value || '';
    }

    // Compile Experience Repeater Output
    const expBlocks = document.querySelectorAll('#experience-repeater-container .repeater-item-block');
    let expHTML = '';
    expBlocks.forEach(block => {
        const fields = block.querySelectorAll('input, textarea');
        if (fields.length >= 4 && (fields[0].value || fields[1].value)) {
            // Convert newline characters into safe web breaks for correct layout styling
            const formattedDesc = fields[3].value.replace(/\n/g, '<br>');
            expHTML += `
                <div class="cv-render-item">
                    <div class="cv-render-meta">
                        <span><strong>${fields[0].value}</strong>, ${fields[1].value}</span>
                        <span class="duration-span">${fields[2].value}</span>
                    </div>
                    <div class="section-text-p">${formattedDesc}</div>
                </div>
            `;
        }
    });
    document.getElementById('cvExperienceOutput').innerHTML = expHTML;

    // Compile Education Repeater Output
    const eduBlocks = document.querySelectorAll('#education-repeater-container .repeater-item-block');
    let eduHTML = '';
    eduBlocks.forEach(block => {
        const fields = block.querySelectorAll('input, textarea');
        if (fields.length >= 4 && (fields[0].value || fields[1].value)) {
            const formattedDetails = fields[3].value.replace(/\n/g, '<br>');
            eduHTML += `
                <div class="cv-render-item">
                    <div class="cv-render-meta">
                        <span><strong>${fields[0].value}</strong> - ${fields[1].value}</span>
                        <span class="duration-span">${fields[2].value}</span>
                    </div>
                    <div class="section-text-p">${formattedDetails}</div>
                </div>
            `;
        }
    });
    document.getElementById('cvEducationOutput').innerHTML = eduHTML;
}

// Append Experience Input Block & Intercept deletion to feed Trash Bin
function addExperienceBlock(role, company, duration, desc) {
    const container = document.getElementById('experience-repeater-container');
    if (!container) return;

    const block = document.createElement('div');
    block.className = 'repeater-item-block';
    block.innerHTML = `
        <div class="form-group"><label>Role / Job Title:</label><input type="text" value="${role}" oninput="updateLiveCV()"></div>
        <div class="form-group"><label>Company:</label><input type="text" value="${company}" oninput="updateLiveCV()"></div>
        <div class="form-group"><label>Duration:</label><input type="text" value="${duration}" oninput="updateLiveCV()"></div>
        <div class="form-group"><label>Responsibilities:</label><textarea rows="3" oninput="updateLiveCV()">${desc}</textarea></div>
        <button class="btn-delete-item" onclick="sendToTrash(this, 'experience')">✕ Delete Item</button>
    `;
    container.appendChild(block);
    updateLiveCV();
}

// Append Education Input Block & Intercept deletion to feed Trash Bin
function addEducationBlock(degree, school, duration, desc) {
    const container = document.getElementById('education-repeater-container');
    if (!container) return;

    const block = document.createElement('div');
    block.className = 'repeater-item-block';
    block.innerHTML = `
        <div class="form-group"><label>Degree / Certificate:</label><input type="text" value="${degree}" oninput="updateLiveCV()"></div>
        <div class="form-group"><label>Institution:</label><input type="text" value="${school}" oninput="updateLiveCV()"></div>
        <div class="form-group"><label>Duration:</label><input type="text" value="${duration}" oninput="updateLiveCV()"></div>
        <div class="form-group"><label>Details:</label><textarea rows="2" oninput="updateLiveCV()">${desc}</textarea></div>
        <button class="btn-delete-item" onclick="sendToTrash(this, 'education')">✕ Delete Item</button>
    `;
    container.appendChild(block);
    updateLiveCV();
}

// Intercept deletion, package data and save into trash array
function sendToTrash(buttonElement, type) {
    const block = buttonElement.parentElement;
    const fields = block.querySelectorAll('input, textarea');

    const trashItem = {
        id: Date.now(),
        type: type,
        label: fields[0].value || (type === 'experience' ? 'Untitled Job' : 'Untitled Degree'),
        data: {
            f1: fields[0].value,
            f2: fields[1].value,
            f3: fields[2].value,
            f4: fields[3].value
        }
    };

    trashBin.push(trashItem);
    block.remove();
    updateLiveCV();
    renderTrashBin();
}

// Render the Trash Panel inside sidebar
function renderTrashBin() {
    const container = document.getElementById('trashBinContainer');
    if (!container) return;

    if (trashBin.length === 0) {
        container.innerHTML = '<p class="empty-trash-msg">No deleted items yet.</p>';
        return;
    }

    container.innerHTML = '';
    trashBin.forEach(item => {
        const card = document.createElement('div');
        card.className = 'trash-item-card';
        card.innerHTML = `
            <span class="trash-item-info">[${item.type === 'experience' ? 'Job' : 'Edu'}] ${item.label}</span>
            <button class="btn-restore-item" onclick="restoreFromTrash(${item.id})">↩️ Restore</button>
        `;
        container.appendChild(card);
    });
}

// Restore action: Pull from array and feed back into layout
function restoreFromTrash(id) {
    const index = trashBin.findIndex(item => item.id === id);
    if (index !== -1) {
        const item = trashBin[index];
        if (item.type === 'experience') {
            addExperienceBlock(item.data.f1, item.data.f2, item.data.f3, item.data.f4);
        } else {
            addEducationBlock(item.data.f1, item.data.f2, item.data.f3, item.data.f4);
        }
        trashBin.splice(index, 1);
        renderTrashBin();
    }
}

// Template Switcher
function changeCVTemplate() {
    const selector = document.getElementById('templateSelector');
    const cvDoc = document.getElementById('cv-document');
    if (selector && cvDoc) {
        cvDoc.classList.remove('ats-classic', 'ats-executive', 'ats-minimalist', 'ats-tech');
        cvDoc.classList.add(selector.value);
    }
}

// Sliders Event Syncing Initialization
function initSliders() {
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const lineHeightSlider = document.getElementById('lineHeightSlider');
    const paddingSlider = document.getElementById('paddingSlider');

    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--cv-font-size', e.target.value + 'px');
        });
    }
    if (lineHeightSlider) {
        lineHeightSlider.addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--cv-line-height', e.target.value);
        });
    }
    if (paddingSlider) {
        paddingSlider.addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--cv-padding', e.target.value + 'mm');
        });
    }
}

// Strictly Force One-Page PDF Output Engine
function triggerPDFDownload() {
    const node = document.getElementById('cv-document');
    const nameInput = document.getElementById('inputName');
    const currentName = (nameInput && nameInput.value) ? nameInput.value : 'ATS_Resume';

    if (!node) {
        console.error("Error: Target element #cv-document not found.");
        return;
    }

    const options = {
        margin: 0,
        filename: `${currentName.replace(/\s+/g, '_')}_1Page_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 3,
            useCORS: true,
            logging: false,
            letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Execute standard html2pdf build pipeline
    html2pdf().set(options).from(node).save();
}

// 🔒 Strict Admin Authentication Gate
function checkAdminAuth() {
    const isAuth = localStorage.getItem('qcv_admin_authenticated');
    const wall = document.getElementById('adminLoginWall');

    if (isAuth === 'true') {
        if (wall) wall.style.display = 'none';
    } else {
        if (wall) {
            wall.style.display = 'flex';
            // Setup enter key trigger for login input field
            const passInput = document.getElementById('adminPasswordInput');
            if (passInput) {
                passInput.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        verifyAdminPassword();
                    }
                });
            }
        }
    }
}

function verifyAdminPassword() {
    const inputField = document.getElementById('adminPasswordInput');
    const errorMsg = document.getElementById('loginErrorMsg');

    if (!inputField) return;

    if (inputField.value === 'mohamed1#') {
        localStorage.setItem('qcv_admin_authenticated', 'true');
        const wall = document.getElementById('adminLoginWall');
        if (wall) wall.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
    } else {
        if (errorMsg) {
            errorMsg.innerText = "❌ Access Denied: Incorrect Password.";
            errorMsg.style.display = 'block';
        }
        inputField.value = '';
        inputField.focus();
    }
}

// Boot application setup
window.onload = function () {
    // 1. Initialise core static event observers for text boxes if needed
    const allInputs = document.querySelectorAll('.editor-sidebar input, .editor-sidebar textarea');
    allInputs.forEach(input => {
        if (!input.hasAttribute('oninput') && input.id !== 'adminPasswordInput') {
            input.addEventListener('input', updateLiveCV);
        }
    });

    // 2. Load basic mock records
    addExperienceBlock(
        "FOUNDER & LEAD DEVELOPER",
        "PROOF MEDIA AGENCY",
        "2025 - Present",
        "- Architected corporate web solutions and full-stack software structures.\n- Optimized data fetching schemas and API pipelines."
    );
    addEducationBlock(
        "B.Sc. IN INFORMATION TECHNOLOGY",
        "SUT UNIVERSITY",
        "2025 - Present",
        "- Focusing on web architectures, network configurations, and systemic cybersecurity protocols."
    );

    // 3. Kickoff layout sync tools
    initSliders();
    updateLiveCV();
};

// Bind Admin Gate Check on Content Load
document.addEventListener("DOMContentLoaded", checkAdminAuth);