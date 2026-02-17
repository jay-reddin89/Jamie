const state = {
    user: { name: '', dob: '', country: '', profilePic: '' },
    settings: { sections: ['realtime', 'facts', 'livedthrough', 'top', 'astronomical'] },
    isPuterSignedIn: false
};

const elements = {
    inputSection: document.getElementById('input-section'),
    loadingSection: document.getElementById('loading-section'),
    resultsSection: document.getElementById('results-section'),
    settingsModal: document.getElementById('settings-modal'),
    saveUserBtn: document.getElementById('save-user-btn'),
    generateBtn: document.getElementById('generate-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    puterSigninBtn: document.getElementById('puter-signin-btn'),
    progressBar: document.getElementById('progress-bar'),
    notification: document.getElementById('notification')
};

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupEventListeners();
});

function setupEventListeners() {
    elements.saveUserBtn.addEventListener('click', saveUserData);
    elements.generateBtn.addEventListener('click', startGeneration);
    elements.settingsBtn.addEventListener('click', () => toggleModal(elements.settingsModal, true));
    document.getElementById('settings-cancel-btn').addEventListener('click', () => toggleModal(elements.settingsModal, false));
    document.getElementById('settings-save-btn').addEventListener('click', applySettings);
    document.getElementById('user-pic').addEventListener('change', handlePicUpload);
    elements.puterSigninBtn.addEventListener('click', handlePuterSignIn);
}

function loadUserData() {
    const savedData = localStorage.getItem('jr_life_facts_user');
    if (savedData) {
        state.user = JSON.parse(savedData);
        document.getElementById('user-name').value = state.user.name;
        document.getElementById('user-dob').value = state.user.dob;
        document.getElementById('user-country').value = state.user.country;
        elements.generateBtn.classList.remove('hidden');
    }
}

function saveUserData() {
    state.user.name = document.getElementById('user-name').value;
    state.user.dob = document.getElementById('user-dob').value;
    state.user.country = document.getElementById('user-country').value;
    if (!state.user.name || !state.user.dob) return showNotification('MISSING IDENTIFIER/SEQUENCE');
    localStorage.setItem('jr_life_facts_user', JSON.stringify(state.user));
    showNotification('SEQUENCE INITIALIZED');
    elements.generateBtn.classList.remove('hidden');
}

function handlePicUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => state.user.profilePic = event.target.result;
        reader.readAsDataURL(file);
    }
}

function toggleModal(modal, show) {
    modal.classList.toggle('hidden', !show);
}

function applySettings() {
    state.settings.sections = Array.from(document.querySelectorAll('.section-toggle:checked')).map(cb => cb.dataset.section);
    localStorage.setItem('jr_life_facts_settings', JSON.stringify(state.settings));
    toggleModal(elements.settingsModal, false);
    showNotification('SYSTEM UPDATED');
}

async function handlePuterSignIn() {
    try {
        const res = await puter.auth.signIn();
        document.getElementById('puter-username').textContent = res.username;
        document.getElementById('puter-user-info').classList.remove('hidden');
        elements.puterSigninBtn.classList.add('hidden');
    } catch (e) {}
}

function showNotification(msg) {
    elements.notification.textContent = msg;
    elements.notification.classList.remove('hidden');
    setTimeout(() => elements.notification.classList.add('hidden'), 3000);
}

function startGeneration() {
    elements.inputSection.classList.add('hidden');
    elements.loadingSection.classList.remove('hidden');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(showResults, 600);
        }
        elements.progressBar.style.width = `${progress}%`;
    }, 150);
}

function showResults() {
    elements.loadingSection.classList.add('hidden');
    elements.resultsSection.classList.remove('hidden');
    renderResults();
}

function renderResults() {
    const sections = state.settings.sections;
    elements.resultsSection.innerHTML = '';

    // 1. Profile Panel
    const profile = document.createElement('div');
    profile.className = 'card profile-card';
    profile.innerHTML = `
        <div class="avatar-hex">${state.user.profilePic ? `<img src="${state.user.profilePic}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : '🧬'}</div>
        <div class="profile-details">
            <div class="sub-label">SUBJECT</div>
            <h2>${state.user.name.toUpperCase() || 'ANONYMOUS'}</h2>
            <div class="location-label">📍 ${state.user.country || 'UNKNOWN LOCALE'}</div>
        </div>
        <div class="badge-active">ACTIVE</div>
    `;
    elements.resultsSection.appendChild(profile);

    // 2. Biometrics Stream
    if (sections.includes('realtime')) {
        const wrap = document.createElement('div');
        wrap.innerHTML = `<div class="section-label">BIOMETRICS STREAM <span style="float:right; color:#ff7043; font-size:0.5rem">●</span></div>`;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="biometrics-main">
                <div class="stream-label"><span>Total Seconds Elapsed</span> <span class="live-feed-text">LIVE_FEED</span></div>
                <div class="large-value" id="val-seconds">-</div>
            </div>
            <div class="biometrics-grid">
                <div class="mini-stat-box"><span class="val" id="val-years">-</span><span class="lbl">YRS</span></div>
                <div class="mini-stat-box"><span class="val" id="val-months">-</span><span class="lbl">MOS</span></div>
                <div class="mini-stat-box"><span class="val" id="val-weeks">-</span><span class="lbl">WKS</span></div>
                <div class="mini-stat-box"><span class="val" id="val-days">-</span><span class="lbl">DAYS</span></div>
            </div>
        `;
        wrap.appendChild(card);
        elements.resultsSection.appendChild(wrap);
    }

    // 3. Physiological Aggregates
    if (sections.includes('realtime')) {
        const wrap = document.createElement('div');
        wrap.innerHTML = `<div class="section-label">PHYSIOLOGICAL AGGREGATES</div>`;
        const grid = document.createElement('div');
        grid.className = 'stats-2x2';
        grid.innerHTML = `
            <div class="grid-item"><div class="lbl">HEARTBEATS</div><div class="val" id="est-heart">-</div></div>
            <div class="grid-item"><div class="lbl">BREATHS</div><div class="val" id="est-breaths">-</div></div>
            <div class="grid-item"><div class="lbl">SLEEP CYCLE</div><div class="val" id="est-sleep">-</div><span class="unit">HRS</span></div>
            <div class="grid-item"><div class="lbl">WORK CYCLE</div><div class="val" id="est-work">-</div><span class="unit">HRS</span></div>
        `;
        wrap.appendChild(grid);
        elements.resultsSection.appendChild(wrap);
    }

    // 4. Demographic Analysis
    if (sections.includes('facts')) {
        const age = calculateAge(state.user.dob).years;
        const wrap = document.createElement('div');
        wrap.innerHTML = `<div class="section-label">DEMOGRAPHIC ANALYSIS</div>`;
        const list = document.createElement('div');
        list.className = 'data-list';
        list.innerHTML = `
            <div class="list-item">
                <div class="item-num">01</div>
                <div class="item-main"><div class="item-title">Global Pop. @ Birth</div><div class="item-subtitle">Historical Estimate</div></div>
                <div class="item-val">~${(6 + (age/50)).toFixed(1)} Billion</div>
            </div>
            <div class="list-item">
                <div class="item-num Generator">02</div>
                <div class="item-main"><div class="item-title">People Older</div><div class="item-subtitle">At time of birth</div></div>
                <div class="item-val">~${(4.5 - (age * 0.05)).toFixed(1)} Billion</div>
            </div>
            <div class="list-item">
                <div class="item-num">03</div>
                <div class="item-main"><div class="item-title">Name Popularity</div><div class="item-subtitle">Rank within cohort</div></div>
                <div class="item-val">Top 10</div>
            </div>
            <div class="list-item">
                <div class="item-num">04</div>
                <div class="item-main"><div class="item-title">Biological Equiv.</div><div class="item-subtitle">Canine scale</div></div>
                <div class="item-val">${(age * 7).toFixed(1)} Yrs</div>
            </div>
        `;
        wrap.appendChild(list);
        elements.resultsSection.appendChild(wrap);
    }

    // 5. Critical Events Log
    if (sections.includes('livedthrough')) {
        const wrap = document.createElement('div');
        wrap.innerHTML = `<div class="section-label">CRITICAL EVENTS LOG</div>`;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<div class="item-subtitle" style="margin-bottom:12px; display:flex; justify-content:space-between"><span>SOURCE: GLOBAL_HISTORY_DB</span> <span>🔄</span></div><div class="timeline" id="timeline-box"></div>`;
        wrap.appendChild(card);
        elements.resultsSection.appendChild(wrap);
        updateTimeline();
    }

    // 6. Audio Index & Stellar Align
    const flex = document.createElement('div');
    flex.className = 'flex-row';

    if (sections.includes('top')) {
        const audio = document.createElement('div');
        audio.className = 'card';
        audio.style.flex = '1';
        audio.innerHTML = `
            <div class="sub-label" style="color:#ff7043">#1 CHART HIT</div>
            <div style="font-size:1.1rem; margin:8px 0">Smooth</div>
            <div class="item-subtitle">Santana ft. Rob T.</div>
            <hr style="border:0; border-top:1px solid var(--border-color); margin:12px 0">
            <div class="sub-label" style="color:#ff7043">CINEMA TOP</div>
            <div style="font-size:0.9rem; margin-top:4px">Toy Story 2</div>
        `;
        flex.appendChild(audio);
    }

    if (sections.includes('astronomical')) {
        const zodiac = getZodiac(new Date(state.user.dob));
        const stellar = document.createElement('div');
        stellar.className = 'stellar-card';
        stellar.innerHTML = `
            <div class="section-label" style="margin:0 0 8px; padding:0">STELLAR ALIGN</div>
            <div class="stellar-title">${zodiac.sign}</div>
            <div class="item-subtitle" style="margin:4px 0 12px">${zodiac.meaning.split(',')[0]}...</div>
            <span class="badge-stone">DIAMOND</span><div style="position:absolute; bottom:10px; right:10px; opacity:0.1; font-size:2rem;">💧</div>
        `;
        flex.appendChild(stellar);
    }
    elements.resultsSection.appendChild(flex);

    // 7. Footer Button
    const footer = document.createElement('div');
    footer.className = 'footer-actions';
    footer.innerHTML = `<button class="reinit-btn" onclick="location.reload()"><span>🔄</span> RE-INITIALIZE SCAN</button>`;
    elements.resultsSection.appendChild(footer);

    startLiveUpdates();
}

function calculateAge(dobStr) {
    const diff = new Date() - new Date(dobStr);
    return {
        years: Math.floor(diff / 31557600000),
        minutes: Math.floor(diff / 60000),
        seconds: Math.floor(diff / 1000)
    };
}

function startLiveUpdates() {
    setInterval(() => {
        const dob = new Date(state.user.dob);
        const now = new Date();
        const diff = now - dob;
        const update = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

        update('val-seconds', Math.floor(diff / 1000).toLocaleString());
        update('val-years', Math.floor(diff / 31557600000));
        update('val-months', Math.floor(diff / 2629800000));
        update('val-weeks', Math.floor(diff / 604800000));
        update('val-days', Math.floor(diff / 86400000));

        const mins = diff / 60000;
        update('est-heart', formatLarge(mins * 72));
        update('est-breaths', formatLarge(mins * 14));
        update('est-sleep', formatLarge(mins / 180));
        update('est-work', formatLarge(mins / 480));
    }, 1000);
}

function formatLarge(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
    return Math.floor(num);
}

async function updateTimeline() {
    const box = document.getElementById('timeline-box');
    try {
        const m = new Date(state.user.dob).getMonth() + 1;
        const d = new Date(state.user.dob).getDate();
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${m}/${d}`);
        const data = await response.json();
        const events = data.events.sort((a, b) => b.year - a.year).slice(0, 3);
        box.innerHTML = events.map(e => `
            <div class="timeline-item">
                <div class="time-year">${e.year}</div>
                <div class="time-line"></div>
                <div class="time-content">${e.text}</div>
            </div>
        `).join('');
    } catch (e) {
        box.innerHTML = '<div class="item-subtitle">FAILED TO ACCESS HISTORICAL ARCHIVES</div>';
    }
}

function getZodiac(date) {
    const day = date.getDate(), month = date.getMonth() + 1;
    const zodiacs = [
        { sign: 'Capricorn', meaning: 'Disciplined, responsible', start: [12, 22], end: [1, 19] },
        { sign: 'Aquarius', meaning: 'Progressive, original', start: [1, 20], end: [2, 18] },
        { sign: 'Pisces', meaning: 'Compassionate, artistic', start: [2, 19], end: [3, 20] },
        { sign: 'Aries', meaning: 'Eager, dynamic', start: [3, 21], end: [4, 19] },
        { sign: 'Taurus', meaning: 'Strong, dependable', start: [4, 20], end: [5, 20] },
        { sign: 'Gemini', meaning: 'Versatile, expressive', start: [5, 21], end: [6, 20] },
        { sign: 'Cancer', meaning: 'Intuitive, sentimental', start: [6, 21], end: [7, 22] },
        { sign: 'Leo', meaning: 'Dramatic, outgoing', start: [7, 23], end: [8, 22] },
        { sign: 'Virgo', meaning: 'Loyal, analytical', start: [8, 23], end: [9, 22] },
        { sign: 'Libra', meaning: 'Diplomatic, artistic', start: [9, 23], end: [10, 22] },
        { sign: 'Scorpio', meaning: 'Passionate, stubborn', start: [10, 23], end: [11, 21] },
        { sign: 'Sagittarius', meaning: 'Extroverted, optimistic', start: [11, 22], end: [12, 21] }
    ];
    for (const z of zodiacs) {
        if ((month == z.start[0] && day >= z.start[1]) || (month == z.end[0] && day <= z.end[1])) return z;
    }
    return zodiacs[0];
}
