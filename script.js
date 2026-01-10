let alleCijfers = JSON.parse(localStorage.getItem('sombox_grades')) || [];
let currentIdx = parseInt(localStorage.getItem('unboxedCount')) || 0;
let tempData = [];

const track = document.getElementById('spinner-track');
const extraPool = ["WISKUNDE", "NEDERLANDS", "ENGELS", "DUITS", "BIOLOGIE", "NATUURKUNDE", "ECONOMIE", "SCHEIKUNDE", "GESCHIEDENIS", "GYM"];

let spamGoal = 0;
let clicks = 0;
let canClick = true;
let inputLocked = false; // Nieuwe beveiliging tegen te snel klikken
const MIN_SPAM = 15;
const MAX_SPAM = 30;

const MIJN_CUSTOM_TEKST = "(async () => { /* ... je bestaande Somtoday script ... */ })();";

// --- ZWEVENDE KNOP LOGICA ---
(function injectHelpButton() {
    if (document.getElementById('sombox-help-btn')) return;
    const btn = document.createElement('div');
    btn.id = 'sombox-help-btn';
    btn.innerHTML = '?';
    const style = document.createElement('style');
    style.innerHTML = `
        #sombox-help-btn { position: fixed; bottom: 25px; right: 25px; width: 50px; height: 50px; background: #00f2ff; color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-weight: bold; font-size: 24px; cursor: pointer; z-index: 999999; box-shadow: 0 0 15px rgba(0, 242, 255, 0.6); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); user-select: none; animation: sombox-pulse 2s infinite; }
        #sombox-help-btn:hover { transform: scale(1.2) rotate(15deg); background: #fff; }
        @keyframes sombox-pulse { 0% { box-shadow: 0 0 0 0 rgba(0, 242, 255, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(0, 242, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 242, 255, 0); } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(btn);
    btn.onclick = () => window.open('https://github.com/JOUW_GITHUB_GEBRUIKER/REPO', '_blank');
})();

function lockInput(ms = 1000) {
    inputLocked = true;
    setTimeout(() => { inputLocked = false; }, ms);
}

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
    }

    if (statsGrid) {
        statsGrid.innerHTML = '';
        alleCijfers.slice(0, currentIdx).forEach(item => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            const color = item.cijfer >= 5.5 ? '#00f2ff' : '#ff0055';
            card.style.borderColor = color;
            card.innerHTML = `<span class="subj">${item.vak.toUpperCase()}</span><span class="grad" style="color: ${color}">${item.cijfer}</span>`;
            statsGrid.appendChild(card);
        });
    }

    if (alleCijfers.length === 0) {
        if(info) info.innerText = "DATABASE EMPTY";
        if(btn) btn.style.display = 'none';
    } else if (currentIdx < alleCijfers.length) {
        if(info) { info.innerText = `READY: CASE #${currentIdx + 1}`; info.style.color = "#00f2ff"; }
        if(btn) btn.style.display = 'block';
    } else {
        if(info) { info.innerText = "DATA RECOVERED"; info.style.color = "#ff0055"; }
        if(btn) btn.style.display = 'none';
    }
}

// UNBOXING LOGICA
function startRolling() {
    if (currentIdx >= alleCijfers.length || inputLocked) return;
    lockInput(1000); // Kan niet direct weer klikken
    const winVak = alleCijfers[currentIdx].vak.toUpperCase();
    track.innerHTML = '';
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';

    for(let i = 0; i < 85; i++) {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerText = (i === 70) ? winVak : extraPool[Math.floor(Math.random() * extraPool.length)];
        track.appendChild(div);
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
    }, 150);
}

// KEYBOARD HANDLERS
window.addEventListener('keyup', (e) => { if (e.code === 'Space') canClick = true; });

window.addEventListener('keydown', (e) => {
    if (inputLocked) return; // Blokkeer alle keyboard input tijdens de pauze

    const homeVisible = document.getElementById('home-screen')?.style.display !== 'none';
    const spamVisible = document.getElementById('spam-screen')?.style.display === 'flex';
    const proceedBtn = document.getElementById('back-btn');
    const isDone = proceedBtn?.style.display === 'block';

    if (e.code === 'Space') {
        e.preventDefault();
        if (!canClick) return;
        canClick = false;
        if (homeVisible) startRolling();
        else if (spamVisible && isDone) { lockInput(800); location.reload(); }
        else if (spamVisible && !isDone) doSpam();
    }

    // SNELTOETSEN S EN F
    if (e.key.toLowerCase() === 's' && !homeVisible && !isDone) {
        revealGrade(); // Skip naar cijfer
    }
    if (e.key.toLowerCase() === 'f') {
        if (currentIdx < alleCijfers.length) {
            currentIdx = alleCijfers.length;
            localStorage.setItem('unboxedCount', currentIdx);
        }
        location.reload(); // Finish direct
    }
});

function doSpam() {
    const box = document.getElementById('main-box');
    if (clicks < spamGoal) {
        box.classList.add('shaking');
        clicks++;
        let p = clicks / spamGoal;
        box.style.boxShadow = `0 0 ${p * 80}px #00f2ff`;
        if (clicks >= spamGoal) revealGrade();
        setTimeout(() => box.classList.remove('shaking'), 100);
    }
}

function revealGrade() {
    lockInput(1200); // Beveiliging: 1.2 sec geen spatiebalk acceptatie na reveal
    const box = document.getElementById('main-box');
    if(box) box.style.display = 'none';
    
    const cijfer = alleCijfers[currentIdx].cijfer;
    const res = document.getElementById('final-grade');
    res.innerText = cijfer;
    res.style.display = 'block';
    res.style.color = cijfer >= 5.5 ? '#00f2ff' : '#ff0055';
    
    if (cijfer >= 5.5 && window.confetti) confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });

    currentIdx++;
    localStorage.setItem('unboxedCount', currentIdx);
    
    const btn = document.getElementById('back-btn');
    btn.style.display = 'block';
    btn.innerText = (currentIdx < alleCijfers.length) ? "PROCEED [SPACE]" : "FINISH [SPACE]";
}

// ... de rest van je modal/import functies ...
function openModal() { document.getElementById('import-modal').style.display = 'flex'; }
function closeModal() { document.getElementById('import-modal').style.display = 'none'; resetModal(); }
function confirmAndLoad() { localStorage.setItem('sombox_grades', JSON.stringify(tempData)); localStorage.setItem('unboxedCount', 0); location.reload(); }

window.onload = () => { if(window.initParticles) initParticles(); updateHome(); };
