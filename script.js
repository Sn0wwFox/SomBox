
let alleCijfers = JSON.parse(localStorage.getItem('sombox_grades')) || [];
let currentIdx = parseInt(localStorage.getItem('unboxedCount')) || 0;
let tempData = [];

const track = document.getElementById('spinner-track');
const extraPool = ["WISKUNDE", "NEDERLANDS", "ENGELS", "DUITS", "BIOLOGIE", "NATUURKUNDE", "ECONOMIE", "SCHEIKUNDE", "GESCHIEDENIS", "GYM"];

let spamGoal = 0;
let clicks = 0;
let canClick = true;
const MIN_SPAM = 15;
const MAX_SPAM = 30;

// HIER KUN JE DE TEKST AANPASSEN VOOR DE 'C' KNOP
const MIJN_CUSTOM_TEKST = "(async () => {\n" +
    "    const tab = [...document.querySelectorAll('sl-tab-item')].find(t => t.innerText.includes('Cijfers'));\n" +
    "    if (!tab) return alert(\"Cijferknop niet gevonden!\");\n" +
    "\n" +
    "    // Blocker tonen\n" +
    "    const b = document.body.appendChild(document.createElement('div'));\n" +
    "    b.style = \"position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9e9;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#00f2ff;font-family:sans-serif;\";\n" +
    "    b.innerHTML = `<img src=\"https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTZqdWV0N2thcXPreparationzOG5xMmxsZjEzYmRrMW42ZWU3amlueGZ1cnltdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/um2kBnfo55iW4ZH1Fa/giphy.gif\" style=\"width:200px\"><h1>SomBox...</h1>`;\n" +
    "\n" +
    "    tab.click();\n" +
    "\n" +
    "    setTimeout(() => {\n" +
    "        const res = [...document.querySelectorAll('sl-laatste-resultaat-item')].map(item => {\n" +
    "            const d = item.querySelector('div[role=\"text\"]')?.getAttribute('aria-label').split(',') || [];\n" +
    "            return {\n" +
    "                v: d[0]?.trim() || \"\",\n" +
    "                c: (d[1] && d[2]) ? d[1].trim() + \",\" + d[2].trim() : \"\",\n" +
    "                d: d[3]?.split('•')[0].trim() || \"\"\n" +
    "            };\n" +
    "        });\n" +
    "\n" +
    "        if (res.length) {\n" +
    "            prompt(\"Kopieer code:\", btoa(unescape(encodeURIComponent(JSON.stringify(res)))));\n" +
    "        } else {\n" +
    "            alert(\"Scan mislukt.\");\n" +
    "        }\n" +
    "        window.location.href = '/rooster';\n" +
    "    }, 800);\n" +
    "})();";

// --- HIERONDER DE NIEUWE ZWEVENDE KNOP LOGICA ---
(function injectHelpButton() {
    const btn = document.createElement('div');
    btn.id = 'sombox-help-btn';
    btn.innerHTML = '?';
    
    // Styling met animatie
    const style = document.createElement('style');
    style.innerHTML = `
        #sombox-help-btn {
            position: fixed;
            bottom: 25px;
            right: 25px;
            width: 50px;
            height: 50px;
            background: #00f2ff;
            color: #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', sans-serif;
            font-weight: bold;
            font-size: 24px;
            cursor: pointer;
            z-index: 999999;
            box-shadow: 0 0 15px rgba(0, 242, 255, 0.6);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            user-select: none;
            animation: sombox-pulse 2s infinite;
        }
        #sombox-help-btn:hover {
            transform: scale(1.2) rotate(15deg);
            box-shadow: 0 0 30px rgba(0, 242, 255, 1);
            background: #fff;
        }
        #sombox-help-btn:active {
            transform: scale(0.9);
        }
        @keyframes sombox-pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 242, 255, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(0, 242, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 242, 255, 0); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(btn);

    // Link naar GitHub (pas de URL hieronder aan)
    btn.onclick = () => {
        window.open('https://sn0wwfox.github.io/SomBox/', '_blank');
    };
})();
// --- EINDE ZWEVENDE KNOP LOGICA ---

// UPDATE HOME SCREEN
function updateHome() {
    const info = document.getElementById('case-info');
    const btn = document.getElementById('main-unbox-btn');
    const statsGrid = document.getElementById('stats-grid');
    const barFill = document.getElementById('overall-bar-fill');
    const progText = document.getElementById('progress-text');

    if (barFill && alleCijfers.length > 0) {
        const percentage = (currentIdx / alleCijfers.length) * 100;
        barFill.style.width = `${percentage}%`;
        progText.innerText = `${currentIdx} / ${alleCijfers.length} CASES COLLECTED`;
    } else if (progText) {
        progText.innerText = "0 / 0 CASES COLLECTED";
    }

    if (statsGrid) {
        statsGrid.innerHTML = '';
        for (let i = 0; i < currentIdx; i++) {
            const item = alleCijfers[i];
            if(!item) continue;
            const card = document.createElement('div');
            card.className = 'stat-card';
            const color = item.cijfer >= 5.5 ? '#00f2ff' : '#ff0055';
            card.style.borderColor = color;
            card.innerHTML = `<span class="subj">${item.vak.toUpperCase()}</span><span class="grad" style="color: ${color}">${item.cijfer}</span>`;
            statsGrid.appendChild(card);
        }
    }

    if (alleCijfers.length === 0) {
        if(info) info.innerText = "DATABASE EMPTY: ADD CASES TO START";
        if(btn) btn.style.display = 'none';
    } else if (currentIdx < alleCijfers.length) {
        if(info) {
            info.innerText = `READY TO INITIALIZE: CASE #${currentIdx + 1}`;
            info.style.color = "#00f2ff";
        }
        if(btn) btn.style.display = 'block';
    } else {
        if(info) {
            info.innerText = "COMPLETE DATASET RECOVERED";
            info.style.color = "#ff0055";
        }
        if(btn) btn.style.display = 'none';
    }
}

// UNBOXING LOGICA
function startRolling() {
    if (currentIdx >= alleCijfers.length) return;
    const winVak = alleCijfers[currentIdx].vak.toUpperCase();
    track.innerHTML = '';
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';

    let vorig = "";
    for(let i = 0; i < 85; i++) {
        const div = document.createElement('div');
        div.className = 'item';
        let vak = (i === 70) ? winVak : extraPool[Math.floor(Math.random() * extraPool.length)];
        while(vak === vorig) { vak = extraPool[Math.floor(Math.random() * extraPool.length)]; }
        div.innerText = vak;
        track.appendChild(div);
        vorig = vak;
    }

    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('roll-screen').style.display = 'flex';

    setTimeout(() => {
        const itemW = 161;
        const stopAt = (70 * itemW) - (window.innerWidth / 2) + (itemW / 2);
        track.style.transition = 'transform 6s cubic-bezier(0.05, 0, 0.1, 1)';
        track.style.transform = `translateX(-${stopAt}px)`;
        setTimeout(triggerFlash, 6000);
    }, 100);
}

function triggerFlash() {
    const flash = document.getElementById('flashbang');
    flash.classList.remove('flash-active');
    void flash.offsetWidth;
    flash.classList.add('flash-active');
    spamGoal = Math.floor(Math.random() * (MAX_SPAM - MIN_SPAM + 1)) + MIN_SPAM;
    clicks = 0;

    setTimeout(() => {
        document.getElementById('roll-screen').style.display = 'none';
        document.getElementById('spam-screen').style.display = 'flex';
        document.getElementById('won-subject').innerText = alleCijfers[currentIdx].vak.toUpperCase();
        document.getElementById('final-grade').style.display = 'none';
        document.getElementById('back-btn').style.display = 'none';
        document.getElementById('main-box').style.display = 'flex';
        document.getElementById('main-box').style.boxShadow = "none";
    }, 150);
}

// KEYBOARD & SPAM
window.addEventListener('keyup', (e) => { if (e.code === 'Space') canClick = true; });

window.addEventListener('keydown', (e) => {
    const homeVisible = document.getElementById('home-screen')?.style.display !== 'none';
    const spamVisible = document.getElementById('spam-screen')?.style.display === 'flex';
    const proceedBtn = document.getElementById('back-btn');
    const isDone = proceedBtn?.style.display === 'block';

    if (e.code === 'Space') {
        e.preventDefault();
        if (!canClick) return;
        canClick = false;
        if (homeVisible) startRolling();
        else if (spamVisible && isDone) location.reload();
        else if (spamVisible && !isDone) doSpam();
    }
});

function doSpam() {
    const box = document.getElementById('main-box');
    if (clicks < spamGoal) {
        box.classList.add('shaking');
        clicks++;
        let p = clicks / spamGoal;
        box.style.boxShadow = `0 0 ${p * 80}px #00f2ff`;
        box.style.borderColor = `rgba(0, 242, 255, ${0.3 + (p * 0.7)})`;
        if (clicks >= spamGoal) revealGrade();
        setTimeout(() => box.classList.remove('shaking'), 100);
    }
}

function revealGrade() {
    const box = document.getElementById('main-box');
    box.style.display = 'none';
    const cijfer = alleCijfers[currentIdx].cijfer;
    const res = document.getElementById('final-grade');
    res.innerText = cijfer;
    res.style.display = 'block';
    res.style.color = cijfer >= 5.5 ? '#00f2ff' : '#ff0055';
    if (cijfer >= 5.5 && window.confetti) confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });

    currentIdx++;
    localStorage.setItem('unboxedCount', currentIdx);
    setTimeout(() => {
        const btn = document.getElementById('back-btn');
        btn.style.display = 'block';
        btn.innerText = (currentIdx < alleCijfers.length) ? "PROCEED [SPACE]" : "FINISH [SPACE]";
    }, 500);
}

// POPUP & IMPORT LOGICA
function openModal() { document.getElementById('import-modal').style.display = 'flex'; }
function closeModal() {
    document.getElementById('import-modal').style.display = 'none';
    resetModal();
}

function toggleInput() {
    const isCode = document.getElementById('code-section').style.display !== 'none';
    document.getElementById('code-section').style.display = isCode ? 'none' : 'block';
    document.getElementById('manual-section').style.display = isCode ? 'block' : 'none';
}

function addManualRow() {
    const div = document.createElement('div'); div.className = 'manual-row';
    div.innerHTML = '<input type="text" placeholder="VAKNAAM" class="m-v" style="flex: 2;"> <input type="text" placeholder="CIJFER" class="m-c" style="flex: 1;">';
    document.getElementById('manual-rows').appendChild(div);
}

function processManual() {
    const v = document.querySelectorAll('.m-v'), c = document.querySelectorAll('.m-c');
    tempData = [];
    v.forEach((el, i) => {
        if(el.value) tempData.push({
            vak: el.value.toUpperCase(),
            cijfer: parseFloat(c[i].value.replace(',', '.'))
        });
    });
    if(tempData.length > 0) showConfirm(tempData.length);
}

function showConfirm(count) {
    document.getElementById('input-steps').style.display = 'none';
    document.getElementById('confirm-step').style.display = 'block';
    document.getElementById('confirm-msg').innerText = `${count} CASES DETECTED`;
    document.getElementById('modal-title').innerText = "VERIFICATION SUCCESS";
}

function confirmAndLoad() {
    localStorage.setItem('sombox_grades', JSON.stringify(tempData));
    localStorage.setItem('unboxedCount', 0);
    location.reload();
}

function resetModal() {
    document.getElementById('input-steps').style.display = 'block';
    document.getElementById('confirm-step').style.display = 'none';
    document.getElementById('modal-title').innerText = "SYSTEM DATA IMPORT";
    tempData = [];
}

// CUSTOM UTILS
function copyCustomText() {
    navigator.clipboard.writeText(MIJN_CUSTOM_TEKST);
    const btn = document.getElementById('btn-copy-custom');
    if (btn) {
        const oldText = btn.innerText;
        btn.innerText = "✓";
        setTimeout(() => btn.innerText = oldText, 1000);
    }
}

function fullReset() {
    if (confirm("WARNING: PERMANENTLY WIPE DATABASE? ALL UNBOXED DATA WILL BE LOST.")) {
        localStorage.clear();
        location.reload();
    }
}

// PARTICLES & INIT
function initParticles() {
    if(!window.particlesJS) return;
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 160, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#00f2ff" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.4 },
            "size": { "value": 2, "random": true },
            "line_linked": { "enable": true, "distance": 110, "color": "#00f2ff", "opacity": 0.2, "width": 1 },
            "move": { "enable": true, "speed": 1.5 }
        },
        "interactivity": {
            "detect_on": "window",
            "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
            "modes": { "grab": { "distance": 200, "line_linked": { "opacity": 0.6 } } }
        }
    });
}

function updateDateLabel(input) {
    const status = document.getElementById('date-status');
    if (input.value) {
        const [y, m, d] = input.value.split('-');
        status.innerText = `FILTER: SINCE ${d}-${m}-${y}`;
    } else {
        status.innerText = "";
    }
}

function processCode() {
    const val = document.getElementById('sombox-code').value.trim();
    const filterDateValue = document.getElementById('date-filter').value;

    if (!val) return alert("NO CODE DETECTED");

    try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(val))));
        let filtered = decoded;

        if (filterDateValue) {
            const selectedDate = new Date(filterDateValue);
            selectedDate.setHours(0, 0, 0, 0);

            filtered = decoded.filter(item => {
                const [d, m, y] = item.d.split('-');
                const itemDate = new Date(y, m - 1, d);
                return itemDate >= selectedDate;
            });
        }

        tempData = filtered.map(i => ({
            vak: i.v.toUpperCase(),
            cijfer: parseFloat(i.c.replace(',', '.'))
        }));

        if (tempData.length === 0) {
            alert("NO CASES FOUND FOR THE SELECTED PERIOD");
        } else {
            showConfirm(tempData.length);
        }

    } catch(e) {
        alert("CRITICAL ERROR: DATA INVALID");
        console.error(e);
    }
}

window.onload = () => { initParticles(); updateHome(); };

