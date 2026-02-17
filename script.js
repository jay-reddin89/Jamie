const state = {
    user: { name: '', dob: '', country: '', profilePic: '', gender: '', dobDate: null, liveUpdateInterval: null },
    settings: {
        sections: ['realtime', 'facts', 'livedthrough', 'top', 'standing', 'astronomical', 'transit', 'economic', 'tech', 'network', 'eco', 'power', 'knowledge']
    },
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
        if (document.getElementById('user-gender')) {
            document.getElementById('user-gender').value = state.user.gender;
        }
        elements.generateBtn.classList.remove('hidden');
    }
}

function saveUserData() {
    state.user.name = document.getElementById('user-name').value;
    state.user.dob = document.getElementById('user-dob').value;
    state.user.country = document.getElementById('user-country').value;
    state.user.gender = document.getElementById('user-gender').value;

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

// --- Layout Helpers ---

function createCollapsibleSection(label, isCollapsed = true) {
    const container = document.createElement('div');
    container.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'section-label';
    header.style.cursor = 'pointer';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.innerHTML = `<span>${label}</span> <span class="toggle-arrow">${isCollapsed ? '[+]' : '[-]'}</span>`;

    const content = document.createElement('div');
    content.className = 'section-content' + (isCollapsed ? ' hidden' : '');

    header.addEventListener('click', () => {
        const hidden = content.classList.toggle('hidden');
        header.querySelector('.toggle-arrow').textContent = hidden ? '[+]' : '[-]';
    });

    container.appendChild(header);
    container.appendChild(content);
    return { container, content };
}

function createCollapsibleSubSection(label, isCollapsed = true) {
    const container = document.createElement('div');
    container.style.marginTop = '12px';

    const header = document.createElement('div');
    header.className = 'sub-label';
    header.style.cursor = 'pointer';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.color = 'var(--accent-amber)';
    header.innerHTML = `<span>${label}</span> <span class="sub-toggle-arrow">${isCollapsed ? '[+]' : '[-]'}</span>`;

    const content = document.createElement('div');
    content.className = isCollapsed ? 'hidden' : '';

    header.addEventListener('click', () => {
        const hidden = content.classList.toggle('hidden');
        header.querySelector('.sub-toggle-arrow').textContent = hidden ? '[+]' : '[-]';
    });

    container.appendChild(header);
    container.appendChild(content);
    return { container, content };
}

// --- Main Results Renderer ---

function renderResults() {
    const sections = state.settings.sections;
    elements.resultsSection.innerHTML = '';

    // Optimization: Cache parsed DOB once
    state.user.dobDate = state.user.dob ? new Date(state.user.dob) : null;

    // Profile Panel
    const profile = document.createElement('div');
    profile.className = 'card profile-card';
    profile.innerHTML = `
        <div class="avatar-hex">${state.user.profilePic ? `<img src="${state.user.profilePic}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : '🧬'}</div>
        <div class="profile-details">
            <div class="sub-label">SUBJECT</div>
            <h2>${state.user.name.toUpperCase() || 'ANONYMOUS'}</h2>
            <div class="location-label">📍 ${state.user.country || 'UNKNOWN LOCALE'} ${state.user.gender ? `// ${state.user.gender}` : ''}</div>
        </div>
        <div class="badge-active">ACTIVE</div>
    `;
    elements.resultsSection.appendChild(profile);

    const orderedKeys = ['realtime', 'facts', 'livedthrough', 'top', 'standing', 'astronomical', 'transit', 'economic', 'tech', 'network', 'eco', 'power', 'knowledge'];

    orderedKeys.forEach(key => {
        if (sections.includes(key)) {
            switch(key) {
                case 'realtime': renderLiveStats(); break;
                case 'facts': renderNameFacts(); break;
                case 'livedthrough': renderEventsLived(); break;
                case 'top': renderTopMedia(); break;
                case 'standing': renderGlobalStanding(); break;
                case 'astronomical': renderStarFacts(); break;
                case 'transit': renderEarthFacts(); break;
                case 'economic': renderEconomyFacts(); break;
                case 'tech': renderTechFacts(); break;
                case 'network': renderNetworkFacts(); break;
                case 'eco': renderEcoFacts(); break;
                case 'power': renderPowerFacts(); break;
                case 'knowledge': renderKnowledgeFacts(); break;
            }
        }
    });

    const footer = document.createElement('div');
    footer.className = 'footer-actions';
    footer.innerHTML = `
        <button class="reinit-btn" onclick="location.reload()" style="margin-bottom: 12px;"><span>🔄</span> NEW ANALYSIS</button>
        <button class="reinit-btn" id="download-pdf-btn" style="background: var(--accent-cyan);"><span>📄</span> DOWNLOAD PDF SUMMARY</button>
    `;
    elements.resultsSection.appendChild(footer);

    document.getElementById('download-pdf-btn').addEventListener('click', generatePDF);

    startLiveUpdates();
}

// --- Section Renderers ---

function renderLiveStats() {
    const { container, content } = createCollapsibleSection('LIVE STATS', false);
    const dob = new Date(state.user.dob);
    const totalDays = calculateAge(state.user.dob).years * 365;

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
            <div class="mini-stat-box"><span class="val" id="val-hours">-</span><span class="lbl">HRS</span></div>
            <div class="mini-stat-box"><span class="val" id="val-minutes">-</span><span class="lbl">MINS</span></div>
            <div class="mini-stat-box" style="grid-column: span 2; border-color: var(--accent-amber);"><span class="val" id="val-born-day" style="font-size: 0.8rem; color: var(--accent-amber)">-</span><span class="lbl">DAY BORN</span></div>
        </div>
    `;
    content.appendChild(card);

    const subBody = createCollapsibleSubSection('BODY FACTS (BIOMETRIC MILESTONES)', false);
    subBody.content.className = 'data-list';
    subBody.content.style.marginTop = '8px';
    subBody.content.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Hair Grown</div></div><div class="item-val">~${(totalDays * 0.035).toFixed(1)}m</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">Nails Grown</div></div><div class="item-val">~${(totalDays * 0.01).toFixed(1)}cm</div></div>
        <div class="list-item"><div class="item-num">03</div><div class="item-main"><div class="item-title">Skin Shed</div></div><div class="item-val">~${(calculateAge(state.user.dob).years * 0.7).toFixed(1)}kg</div></div>
        <div class="list-item"><div class="item-num">04</div><div class="item-main"><div class="item-title">Total Blinks</div></div><div class="item-val" id="est-blinks">-</div></div>
    `;
    content.appendChild(subBody.container);

    const grid = document.createElement('div');
    grid.className = 'stats-2x2';
    grid.style.marginTop = '12px';
    grid.innerHTML = `
        <div class="grid-item"><div class="lbl">HEARTBEATS</div><div class="val" id="est-heart">-</div></div>
        <div class="grid-item"><div class="lbl">BREATHS</div><div class="val" id="est-breaths">-</div></div>
        <div class="grid-item"><div class="lbl">HOURS ASLEEP</div><div class="val" id="est-sleep">-</div><span class="unit">EST</span></div>
        <div class="grid-item"><div class="lbl">HOURS CONSUMING</div><div class="val" id="est-eat">-</div><span class="unit">EST</span></div>
    `;
    content.appendChild(grid);
    elements.resultsSection.appendChild(container);
}

function renderNameFacts() {
    const { container, content } = createCollapsibleSection('NAME FACTS');
    const age = calculateAge(state.user.dob).years;
    const country = state.user.country || 'Global';
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Global Pop. @ Birth</div></div><div class="item-val">~${(8.1 - (age * 0.085)).toFixed(1)}B</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">People Older</div></div><div class="item-val">~${(4.5 - (age * 0.05)).toFixed(1)}B</div></div>
        <div class="list-item"><div class="item-num">03</div><div class="item-main"><div class="item-title">Name Frequency (${country})</div></div><div class="item-val">~1/2,500</div></div>
        <div class="list-item"><div class="item-num">04</div><div class="item-main"><div class="item-title">Born Same Day</div></div><div class="item-val">~365k</div></div>
        <div class="list-item"><div class="item-num">05</div><div class="item-main"><div class="item-title">Name Popularity (Birth)</div></div><div class="item-val">#${(state.user.name.length * 7 % 100) + 1}</div></div>
        <div class="list-item"><div class="item-num">06</div><div class="item-main"><div class="item-title">Name Popularity (Now)</div></div><div class="item-val">#${(state.user.name.length * 13 % 500) + 50}</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function renderEventsLived() {
    const { container, content } = createCollapsibleSection('EVENTS LIVED');
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="item-subtitle" style="margin-bottom:12px;">SOURCE: GLOBAL_HISTORY_DB</div>`;

    const subHist = createCollapsibleSubSection('HISTORICAL TIMELINE (20 EVENTS)', false);
    subHist.content.id = 'timeline-hist';
    subHist.content.className = 'timeline';

    const subOnce = createCollapsibleSubSection('ONCE-IN-A-LIFETIME EVENTS');
    subOnce.content.id = 'timeline-once';
    subOnce.content.className = 'data-list';

    const subPos = createCollapsibleSubSection('POSITIVE HUMAN PROGRESS');
    subPos.content.id = 'timeline-pos';
    subPos.content.className = 'data-list';

    const subInv = createCollapsibleSubSection('TECHNOLOGICAL INVENTIONS');
    subInv.content.id = 'timeline-inv';
    subInv.content.className = 'data-list';

    card.appendChild(subHist.container);
    card.appendChild(subOnce.container);
    card.appendChild(subPos.container);
    card.appendChild(subInv.container);

    content.appendChild(card);
    elements.resultsSection.appendChild(container);
    renderLivedThroughData();
}

function renderTopMedia() {
    const { container, content } = createCollapsibleSection('TOP MEDIA YEAR BORN');
    const card = document.createElement('div');
    card.className = 'card';

    const subTracks = createCollapsibleSubSection('TOP 10 TRACKS THAT WEEK', false);
    subTracks.content.id = 'top-songs';
    subTracks.content.className = 'data-list';

    const subTV = createCollapsibleSubSection('TOP 10 TV SHOWS THIS SEASON');
    subTV.content.id = 'top-tv';
    subTV.content.className = 'data-list';

    const subMovies = createCollapsibleSubSection('TOP 5 BOX OFFICE HITS');
    subMovies.content.id = 'top-movies';
    subMovies.content.className = 'data-list';

    card.appendChild(subTracks.container);
    card.appendChild(subTV.container);
    card.appendChild(subMovies.container);

    content.appendChild(card);
    elements.resultsSection.appendChild(container);
    renderTopChartsData();
}

function renderGlobalStanding() {
    const { container, content } = createCollapsibleSection('GLOBAL STANDING');
    const age = calculateAge(state.user.dob).years;
    const percentile = Math.min(99, Math.max(1, age * 1.2)).toFixed(1);
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Age Percentile</div></div><div class="item-val">Older than ${percentile}%</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">Global Human Rank</div></div><div class="item-val">~${formatLarge(8e9 * (1 - percentile/100))}</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function renderStarFacts() {
    const { container, content } = createCollapsibleSection('STAR FACTS');
    const zodiac = getZodiac(new Date(state.user.dob));
    const age = calculateAge(state.user.dob).years;
    const card = document.createElement('div');
    card.className = 'card';
    card.style.position = 'relative';
    card.innerHTML = `
        <div class="stellar-title">${zodiac.sign.toUpperCase()}</div>
        <div class="item-subtitle" style="color: var(--accent-purple); font-weight: 600;">${zodiac.meaning}</div>
        <div style="display: flex; gap: 8px; margin: 12px 0;">
            <span class="badge-stone">BIRTHSTONE: DIAMOND</span>
            <span class="badge-stone" style="background: rgba(179, 157, 219, 0.1); color: var(--accent-purple);">ELEMENT: ${zodiac.element.toUpperCase()}</span>
        </div>
        <div class="item-subtitle">STONE MEANING: SYMBOL OF ETERNAL LOVE AND INNER STRENGTH.</div>
        <hr style="border:0; border-top:1px solid var(--border-color); margin: 16px 0;">
        <div class="item-title">Light Travel Distance: <span class="item-val">${age} LY</span></div>
        <div style="opacity:0.05; font-size:4rem; position:absolute; bottom:0; right:0;">✨</div>
    `;
    content.appendChild(card);
    elements.resultsSection.appendChild(container);
}

function renderEarthFacts() {
    const { container, content } = createCollapsibleSection('EARTH FACTS');
    const age = calculateAge(state.user.dob).years;
    const galacticDist = age * 4.5e9;
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Galactic Distance Traveled</div></div><div class="item-val">${formatLarge(galacticDist)} miles</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">Leap Years Survived</div></div><div class="item-val">${Math.floor(age / 4)}</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function renderEconomyFacts() {
    const { container, content } = createCollapsibleSection('ECONOMY FACTS');
    const age = calculateAge(state.user.dob).years;
    const inflationFactor = Math.pow(1.03, age).toFixed(2);
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Inflation Multiplier</div></div><div class="item-val">${inflationFactor}x</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">$1.00 then value</div></div><div class="item-val">$${inflationFactor} today</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function renderTechFacts() {
    const { container, content } = createCollapsibleSection('TECH FACTS');
    const birthYear = new Date(state.user.dob).getFullYear();
    const techItems = [
        { year: 1989, name: "World Wide Web" },
        { year: 1995, name: "Windows 95" },
        { year: 1998, name: "Google Search" },
        { year: 2007, name: "iPhone (Mobile Era)" },
        { year: 2009, name: "Bitcoin" },
        { year: 2022, name: "ChatGPT (AI Era)" }
    ].filter(i => i.year >= birthYear);
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = techItems.map((item, i) => `
        <div class="list-item"><div class="item-num">${(i+1).toString().padStart(2, '0')}</div><div class="item-main"><div class="item-title">${item.name}</div></div><div class="item-val">${item.year}</div></div>
    `).join('') || '<div class="list-item">AI ERA DEFINED</div>';
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function renderNetworkFacts() {
    const { container, content } = createCollapsibleSection('NETWORK FACTS');
    const days = calculateAge(state.user.dob).years * 365;
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Estimated Emails Sent</div></div><div class="item-val">~${formatLarge(days * 20)}</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">Data Consumed (GB)</div></div><div class="item-val">~${formatLarge(days * 5)} GB</div></div>
        <div class="list-item"><div class="item-num">03</div><div class="item-main"><div class="item-title">Internet User Growth</div></div><div class="item-val">+5.2B since birth</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function renderEcoFacts() {
    const { container, content } = createCollapsibleSection('ECO FACTS');
    const age = calculateAge(state.user.dob).years;
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Carbon Footprint</div></div><div class="item-val">~${(age * 4.8).toFixed(1)} Tonnes CO2</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">Waste Produced</div></div><div class="item-val">~${formatLarge(age * 700)} kg</div></div>
        <div class="list-item"><div class="item-num">03</div><div class="item-main"><div class="item-title">Offset Trees Required</div></div><div class="item-val">~${(age * 25).toLocaleString()} trees</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function renderPowerFacts() {
    const { container, content } = createCollapsibleSection('POWER FACTS');
    const days = calculateAge(state.user.dob).years * 365;
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Total Energy Expended</div></div><div class="item-val">~${(days * 8.4).toLocaleString()} MJ</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">Steps Taken</div></div><div class="item-val">~${formatLarge(days * 5000)}</div></div>
        <div class="list-item"><div class="item-num">03</div><div class="item-main"><div class="item-title">Heart Mechanical Work</div></div><div class="item-val">~${formatLarge(days * 100000)} Joules</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function renderKnowledgeFacts() {
    const { container, content } = createCollapsibleSection('KNOWLEDGE FACTS');
    const days = calculateAge(state.user.dob).years * 365;
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Words Read (EST)</div></div><div class="item-val">~${formatLarge(days * 10000)}</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">Books Equivalent</div></div><div class="item-val">~${Math.floor(days / 10)}</div></div>
        <div class="list-item"><div class="item-num">03</div><div class="item-main"><div class="item-title">Human Knowledge Growth</div></div><div class="item-val">~175 Zettabytes</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

// --- Specialized Data Renderers ---

async function renderLivedThroughData() {
    const histBox = document.getElementById('timeline-hist');
    const onceBox = document.getElementById('timeline-once');
    const posBox = document.getElementById('timeline-pos');
    const invBox = document.getElementById('timeline-inv');
    if (!histBox) return;

    try {
        const m = new Date(state.user.dob).getMonth() + 1;
        const d = new Date(state.user.dob).getDate();
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${m}/${d}`);
        const data = await res.json();
        const events = data.events.sort((a, b) => b.year - a.year).slice(0, 20);
        histBox.innerHTML = events.map(e => `
            <div class="timeline-item">
                <div class="time-year">${e.year}</div>
                <div class="time-line"></div>
                <div class="time-content">
                    <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(e.text)}" target="_blank" style="color:inherit; text-decoration:none; border-bottom: 1px dashed var(--accent-cyan);">${e.text}</a>
                </div>
            </div>
        `).join('');
    } catch (e) {
        histBox.innerHTML = '<div class="item-subtitle">ARCHIVE ACCESS FAILED.</div>';
    }

    const createListWithLinks = (items, prefix = 'https://en.wikipedia.org/wiki/') => {
        return items.map((e, i) => `
            <div class="list-item" style="padding:8px 12px; font-size:0.8rem; border-color:#222;">
                <div class="item-num">${i+1}</div>
                <div class="item-main">
                    <a href="${prefix}${encodeURIComponent(e)}" target="_blank" style="color:inherit; text-decoration:none; display:block; border-bottom: 1px dashed #444;">${e}</a>
                </div>
            </div>
        `).join('');
    };

    onceBox.innerHTML = createListWithLinks(["The Turn of the Millennium (2000)", "Halley's Comet", "First Image of a Black Hole", "Hale-Bopp Comet", "Great Conjunction", "Total Solar Eclipse", "Mars Perseverance Landing", "Higgs Boson Discovery", "Digital Migration", "Commercial Space Flight"]);
    posBox.innerHTML = createListWithLinks(["Global Poverty Reduction", "Green Energy Growth", "Medical Breakthroughs", "Global Connectivity", "Marine Sanctuaries", "First Malaria Vaccine", "Ozone Recovery", "ISS Occupation", "Remote Education Rise", "Global Literacy Peak"]);
    invBox.innerHTML = createListWithLinks(["The World Wide Web", "Smartphone Revolution", "Generative AI", "Electric Vehicles", "Blockchain", "CRISPR", "3D Printing", "Drones", "Streaming Media", "Reusable Rockets"]);
}

function renderTopChartsData() {
    const sBox = document.getElementById('top-songs'), tBox = document.getElementById('top-tv'), mBox = document.getElementById('top-movies');
    if (!sBox) return;

    const year = new Date(state.user.dob).getFullYear();
    const era = getEraData(year);

    const createMediaList = (items, type) => {
        const baseUrl = type === 'song' ? 'https://www.youtube.com/results?search_query=' : 'https://www.imdb.com/find?q=';
        return items.map((s, i) => `
            <div class="list-item" style="padding:6px 12px; font-size:0.75rem; border-color:#222;">
                <span class="item-num">${i+1}</span>
                <a href="${baseUrl}${encodeURIComponent(s)}" target="_blank" style="color:inherit; text-decoration:none; flex:1; margin-left:8px; border-bottom: 1px dashed #444;">${s}</a>
            </div>
        `).join('');
    };

    sBox.innerHTML = createMediaList(era.songs, 'song');
    tBox.innerHTML = createMediaList(era.tv, 'tv');
    mBox.innerHTML = createMediaList(era.movies, 'movie');
}

function getEraData(year) {
    if (year >= 2010) {
        return {
            songs: ["Rolling in the Deep", "Party Rock Anthem", "Firework", "E.T.", "Give Me Everything", "Grenade", "Super Bass", "Moves Like Jagger", "The Show Goes On", "The Lazy Song"],
            tv: ["Modern Family", "The Big Bang Theory", "Grey's Anatomy", "Glee", "Dancing with the Stars", "NCIS", "American Idol", "The Voice", "Game of Thrones", "Breaking Bad"],
            movies: ["Avatar", "Toy Story 3", "Alice in Wonderland", "Harry Potter and the Deathly Hallows", "Inception"]
        };
    } else if (year >= 2000) {
        return {
            songs: ["Hanging by a Moment", "Fallin'", "All for You", "Drops of Jupiter", "I'm Real", "Smooth Criminal", "Bootylicious", "U Remind Me", "Hero", "Lady Marmalade"],
            tv: ["Survivor", "ER", "Friends", "CSI: Crime Scene Investigation", "Will & Grace", "The West Wing", "Monday Night Football", "Everybody Loves Raymond", "Frasier", "Law & Order"],
            movies: ["How the Grinch Stole Christmas", "Cast Away", "Mission: Impossible 2", "Gladiator", "What Women Want"]
        };
    } else if (year >= 1990) {
        return {
            songs: ["Smooth", "Say My Name", "Maria Maria", "Breathe", "I Knew I Loved You", "Amazed", "Everything You Want", "Bent", "It's Gonna Be Me", "Be With You"],
            tv: ["Friends", "ER", "Who Wants to Be a Millionaire", "Frasier", "The West Wing", "The Practice", "60 Minutes", "Touched by an Angel", "Law & Order", "Everybody Loves Raymond"],
            movies: ["Toy Story 2", "The Green Mile", "Stuart Little", "Any Given Sunday", "Magnolia"]
        };
    } else {
        return {
            songs: ["Every Breath You Take", "Billie Jean", "Flashdance... What a Feeling", "Down Under", "Beat It", "Total Eclipse of the Heart", "Maneater", "Baby, Come to Me", "Maniac", "Sweet Dreams (Are Made of This)"],
            tv: ["60 Minutes", "Dallas", "M*A*S*H", "Magnum, P.I.", "Dynasty", "Three's Company", "Simon & Simon", "Falcon Crest", "The Love Boat", "The A-Team"],
            movies: ["Return of the Jedi", "Terms of Endearment", "Flashdance", "Trading Places", "WarGames"]
        };
    }
}

// --- Utils ---

function calculateAge(dobStr) {
    // Optimization: Use cached dobDate if available and matching
    const dobDate = (dobStr === state.user.dob && state.user.dobDate) ? state.user.dobDate : new Date(dobStr);
    const diff = new Date() - dobDate;
    return {
        years: Math.floor(diff / 31557600000),
        minutes: Math.floor(diff / 60000),
        seconds: Math.floor(diff / 1000)
    };
}

function startLiveUpdates() {
    // Optimization: Clear existing interval to prevent leaks
    if (state.user.liveUpdateInterval) clearInterval(state.user.liveUpdateInterval);

    const dobDate = state.user.dobDate || new Date(state.user.dob);
    if (!dobDate || isNaN(dobDate.getTime())) return;

    // Optimization: Cache DOM references and move static calculations out of the interval
    const bornDayVal = dobDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const updateEls = {
        seconds: document.getElementById('val-seconds'),
        years: document.getElementById('val-years'),
        months: document.getElementById('val-months'),
        weeks: document.getElementById('val-weeks'),
        days: document.getElementById('val-days'),
        hours: document.getElementById('val-hours'),
        minutes: document.getElementById('val-minutes'),
        bornDay: document.getElementById('val-born-day'),
        heart: document.getElementById('est-heart'),
        breaths: document.getElementById('est-breaths'),
        sleep: document.getElementById('est-sleep'),
        eat: document.getElementById('est-eat'),
        blinks: document.getElementById('est-blinks')
    };

    state.user.liveUpdateInterval = setInterval(() => {
        const diff = new Date() - dobDate;
        const age = calculateAge(state.user.dob);

        if (updateEls.seconds) updateEls.seconds.textContent = Math.floor(diff / 1000).toLocaleString();
        if (updateEls.years) updateEls.years.textContent = age.years;
        if (updateEls.months) updateEls.months.textContent = Math.floor(diff / 2629800000).toLocaleString();
        if (updateEls.weeks) updateEls.weeks.textContent = Math.floor(diff / 604800000).toLocaleString();
        if (updateEls.days) updateEls.days.textContent = Math.floor(diff / 86400000).toLocaleString();
        if (updateEls.hours) updateEls.hours.textContent = Math.floor(diff / 3600000).toLocaleString();
        if (updateEls.minutes) updateEls.minutes.textContent = age.minutes.toLocaleString();
        if (updateEls.bornDay) updateEls.bornDay.textContent = bornDayVal;

        const mins = diff / 60000, days = diff / 86400000;
        if (updateEls.heart) updateEls.heart.textContent = formatLarge(mins * 72);
        if (updateEls.breaths) updateEls.breaths.textContent = formatLarge(mins * 14);
        if (updateEls.sleep) updateEls.sleep.textContent = formatLarge(days * 8);
        if (updateEls.eat) updateEls.eat.textContent = formatLarge(days * 1.5);
        if (updateEls.blinks) updateEls.blinks.textContent = formatLarge(days * 15 * 60 * 16);
    }, 1000);
}

function formatLarge(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
    return Math.floor(num).toLocaleString();
}

function getZodiac(date) {
    const day = date.getDate(), month = date.getMonth() + 1;
    const zodiacs = [
        { sign: 'Capricorn', meaning: 'Strategic', element: 'Earth', start: [12, 22], end: [1, 19] },
        { sign: 'Aquarius', meaning: 'Original', element: 'Air', start: [1, 20], end: [2, 18] },
        { sign: 'Pisces', meaning: 'Artistic', element: 'Water', start: [2, 19], end: [3, 20] },
        { sign: 'Aries', meaning: 'Dynamic', element: 'Fire', start: [3, 21], end: [4, 19] },
        { sign: 'Taurus', meaning: 'Strong', element: 'Earth', start: [4, 20], end: [5, 20] },
        { sign: 'Gemini', meaning: 'Curious', element: 'Air', start: [5, 21], end: [6, 20] },
        { sign: 'Cancer', meaning: 'Sentimental', element: 'Water', start: [6, 21], end: [7, 22] },
        { sign: 'Leo', meaning: 'Outgoing', element: 'Fire', start: [7, 23], end: [8, 22] },
        { sign: 'Virgo', meaning: 'Loyal, Analytical', element: 'Earth', start: [8, 23], end: [9, 22] },
        { sign: 'Libra', meaning: 'Diplomatic, Artistic', element: 'Air', start: [9, 23], end: [10, 22] },
        { sign: 'Scorpio', meaning: 'Resourceful', element: 'Water', start: [10, 23], end: [11, 21] },
        { sign: 'Sagittarius', meaning: 'Optimistic', element: 'Fire', start: [11, 22], end: [12, 21] }
    ];
    for (const z of zodiacs) if ((month == z.start[0] && day >= z.start[1]) || (month == z.end[0] && day <= z.end[1])) return z;
    return zodiacs[0];
}

async function generatePDF() {
    const element = document.getElementById('results-section');
    const opt = {
        margin:       10,
        filename:     `LifeStats_${state.user.name || 'Citizen'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, backgroundColor: '#141614' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    showNotification('GENERATING PDF...');

    // Expand all sections for the PDF
    const contents = element.querySelectorAll('.section-content');
    contents.forEach(c => c.classList.remove('hidden'));
    const subContents = element.querySelectorAll('.card > div > div:not(.sub-label)');
    // This is a bit hacky, but let's just make everything visible
    const hiddens = element.querySelectorAll('.hidden');
    hiddens.forEach(h => h.classList.remove('hidden'));

    html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
        window.open(pdf.output('bloburl'), '_blank');
        showNotification('PDF READY');
    });
}
