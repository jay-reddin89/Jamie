const state = {
    user: { name: '', dob: '', country: '', profilePic: '', gender: '' },
    settings: { sections: ['realtime', 'facts', 'livedthrough', 'top', 'astronomical', 'economic', 'biological', 'standing', 'tech', 'transit'] },
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

// --- Main Results Renderer ---

function renderResults() {
    const sections = state.settings.sections;
    elements.resultsSection.innerHTML = '';

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

    // 2. Real Time Biometrics
    if (sections.includes('realtime')) {
        const { container, content } = createCollapsibleSection('BIOMETRICS STREAM', false);
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

        const grid = document.createElement('div');
        grid.className = 'stats-2x2';
        grid.style.marginTop = '12px';
        grid.innerHTML = `
            <div class="grid-item"><div class="lbl">HEARTBEATS</div><div class="val" id="est-heart">-</div></div>
            <div class="grid-item"><div class="lbl">BREATHS</div><div class="val" id="est-breaths">-</div></div>
            <div class="grid-item"><div class="lbl">HOURS ASLEEP</div><div class="val" id="est-sleep">-</div><span class="unit">EST</span></div>
            <div class="grid-item"><div class="lbl">HOURS CONSUMING</div><div class="val" id="est-eat">-</div><span class="unit">EST</span></div>
            <div class="grid-item"><div class="lbl">WORDS SPOKEN</div><div class="val" id="est-words">-</div><span class="unit">EST</span></div>
            <div class="grid-item"><div class="lbl">WATER CONSUMED</div><div class="val" id="est-water">-</div><span class="unit">LITERS</span></div>
        `;
        content.appendChild(grid);
        elements.resultsSection.appendChild(container);
    }

    // 3. Demographic Facts
    if (sections.includes('facts')) {
        const { container, content } = createCollapsibleSection('DEMOGRAPHIC ANALYSIS');
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

    // New Sections
    if (sections.includes('economic')) renderEconomicPulse();
    if (sections.includes('biological')) renderBiologicalMilestones();
    if (sections.includes('standing')) renderGlobalStanding();
    if (sections.includes('tech')) renderTechnologicalEra();
    if (sections.includes('transit')) renderEarthTransit();

    // 4. Critical Events Log
    if (sections.includes('livedthrough')) {
        const { container, content } = createCollapsibleSection('CRITICAL EVENTS LOG');
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="item-subtitle" style="margin-bottom:12px; display:flex; justify-content:space-between"><span>SOURCE: GLOBAL_HISTORY_DB</span></div>
            <div class="sub-label" style="color:var(--accent-amber); margin: 12px 0 8px;">HISTORICAL TIMELINE (20 EVENTS)</div>
            <div class="timeline" id="timeline-hist" style="margin-bottom: 24px;"></div>
            <div class="sub-label" style="color:var(--accent-amber); margin: 12px 0 8px;">ONCE-IN-A-LIFETIME EVENTS</div>
            <div class="data-list" id="timeline-once" style="margin: 0; border-radius: 8px;"></div>
            <div class="sub-label" style="color:var(--accent-amber); margin: 24px 0 8px;">POSITIVE HUMAN PROGRESS</div>
            <div class="data-list" id="timeline-pos" style="margin: 0; border-radius: 8px;"></div>
            <div class="sub-label" style="color:var(--accent-amber); margin: 24px 0 8px;">TECHNOLOGICAL INVENTIONS</div>
            <div class="data-list" id="timeline-inv" style="margin: 0; border-radius: 8px;"></div>
        `;
        content.appendChild(card);
        elements.resultsSection.appendChild(container);
        renderLivedThroughData();
    }

    // 5. Cultural Archive
    if (sections.includes('top')) {
        const { container, content } = createCollapsibleSection('CULTURAL ARCHIVE');
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="sub-label" style="color:#ff7043">#1 CHART HIT (BIRTH DAY)</div>
            <div style="font-size:1.4rem; margin:8px 0; color:var(--accent-amber)">Smooth</div>
            <div class="item-subtitle">Santana ft. Rob Thomas</div>
            <div class="sub-label" style="margin-top: 16px;">TOP 10 TRACKS THAT WEEK</div>
            <div class="data-list" id="top-songs" style="margin: 8px 0; border-radius: 8px;"></div>

            <hr style="border:0; border-top:1px solid var(--border-color); margin: 24px 0;">
            <div class="sub-label" style="color:#ff7043">#1 TV BROADCAST</div>
            <div style="font-size:1.2rem; margin:8px 0; color:var(--accent-amber)">Friends</div>
            <div class="sub-label" style="margin-top: 16px;">TOP 10 SHOWS THIS SEASON</div>
            <div class="data-list" id="top-tv" style="margin: 8px 0; border-radius: 8px;"></div>

            <hr style="border:0; border-top:1px solid var(--border-color); margin: 24px 0;">
            <div class="sub-label" style="color:#ff7043">#1 CINEMA RELEASE</div>
            <div style="font-size:1.2rem; margin:8px 0; color:var(--accent-amber)">Toy Story 2</div>
            <div class="sub-label" style="margin-top: 16px;">TOP 5 BOX OFFICE HITS</div>
            <div class="data-list" id="top-movies" style="margin: 8px 0; border-radius: 8px;"></div>
        `;
        content.appendChild(card);
        elements.resultsSection.appendChild(container);
        renderTopChartsData();
    }

    // 6. Stellar Alignment
    if (sections.includes('astronomical')) {
        const { container, content } = createCollapsibleSection('STELLAR ALIGNMENT');
        const zodiac = getZodiac(new Date(state.user.dob));
        const age = calculateAge(state.user.dob).years;
        const card = document.createElement('div');
        card.className = 'card';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.innerHTML = `
            <div class="stellar-title" style="font-size: 2rem;">${zodiac.sign.toUpperCase()}</div>
            <div class="item-subtitle" style="margin: 8px 0 16px; color: var(--accent-purple); font-weight: 600;">${zodiac.meaning}</div>
            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                <span class="badge-stone">BIRTHSTONE: DIAMOND</span>
                <span class="badge-stone" style="background: rgba(179, 157, 219, 0.1); color: var(--accent-purple);">ELEMENT: ${zodiac.element.toUpperCase()}</span>
            </div>
            <div class="item-subtitle">STONE MEANING: SYMBOL OF ETERNAL LOVE AND INNER STRENGTH.</div>
            <hr style="border:0; border-top:1px solid var(--border-color); margin: 16px 0;">
            <div class="data-list" style="margin: 0; border: none; background: transparent;">
                <div class="list-item" style="padding: 8px 0; border-color: #222;"><div class="item-main"><div class="item-title">Light Travel Distance</div></div><div class="item-val">${age} LY</div></div>
                <div class="list-item" style="padding: 8px 0; border: none;"><div class="item-main"><div class="item-title">Moon Phase</div></div><div class="item-val">Waning Gibbous</div></div>
            </div>
            <div style="opacity:0.05; font-size:5rem; position:absolute; bottom:-10px; right:-10px;">✨</div>
        `;
        content.appendChild(card);
        elements.resultsSection.appendChild(container);
    }

    // 7. Footer
    const footer = document.createElement('div');
    footer.className = 'footer-actions';
    footer.innerHTML = `<button class="reinit-btn" onclick="location.reload()"><span>🔄</span> NEW ANALYSIS</button>`;
    elements.resultsSection.appendChild(footer);

    startLiveUpdates();
}

// --- New Rendering Functions ---

function renderEconomicPulse() {
    const { container, content } = createCollapsibleSection('ECONOMIC PULSE');
    const age = calculateAge(state.user.dob).years;
    const inflationFactor = Math.pow(1.03, age).toFixed(2);
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Inflation Multiplier</div></div><div class="item-val">${inflationFactor}x</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">$1.00 then is worth</div></div><div class="item-val">$${inflationFactor} today</div></div>
        <div class="list-item"><div class="item-num">03</div><div class="item-main"><div class="item-title">Avg. Milk Price then</div></div><div class="item-val">$${(2.50 / inflationFactor).toFixed(2)}</div></div>
        <div class="list-item"><div class="item-num">04</div><div class="item-main"><div class="item-title">Avg. Gas Price then</div></div><div class="item-val">$${(3.50 / inflationFactor).toFixed(2)}</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function renderBiologicalMilestones() {
    const { container, content } = createCollapsibleSection('BIO MILESTONES');
    const age = calculateAge(state.user.dob);
    const totalDays = age.years * 365;
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Hair Grown</div></div><div class="item-val">~${(totalDays * 0.035).toFixed(1)} meters</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">Nails Grown</div></div><div class="item-val">~${(totalDays * 0.01).toFixed(1)} cm</div></div>
        <div class="list-item"><div class="item-num">03</div><div class="item-main"><div class="item-title">Skin Shed</div></div><div class="item-val">~${(age.years * 0.7).toFixed(1)} kg</div></div>
        <div class="list-item"><div class="item-num">04</div><div class="item-main"><div class="item-title">Total Blinks</div></div><div class="item-val">~${formatLarge(totalDays * 15 * 60 * 16)}</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
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
        <div class="list-item"><div class="item-num">03</div><div class="item-main"><div class="item-title">Generational Cohort</div></div><div class="item-val">${getGeneration(age)}</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function getGeneration(age) {
    const birthYear = new Date().getFullYear() - age;
    if (birthYear >= 2010) return "Gen Alpha";
    if (birthYear >= 1997) return "Gen Z";
    if (birthYear >= 1981) return "Millennial";
    if (birthYear >= 1965) return "Gen X";
    if (birthYear >= 1946) return "Boomer";
    return "Silent Gen";
}

function renderTechnologicalEra() {
    const { container, content } = createCollapsibleSection('TECH ERA');
    const birthYear = new Date(state.user.dob).getFullYear();
    const techItems = [
        { year: 1983, name: "The Internet (TCP/IP)" },
        { year: 1989, name: "World Wide Web" },
        { year: 1991, name: "Linux" },
        { year: 1995, name: "Windows 95" },
        { year: 1998, name: "Google" },
        { year: 2001, name: "Wikipedia / iPod" },
        { year: 2004, name: "Facebook" },
        { year: 2007, name: "iPhone" },
        { year: 2009, name: "Bitcoin" },
        { year: 2010, name: "Instagram" },
        { year: 2015, name: "Ethereum" },
        { year: 2022, name: "ChatGPT (AI Era)" }
    ].filter(i => i.year >= birthYear);

    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = techItems.slice(0, 6).map((item, i) => `
        <div class="list-item"><div class="item-num">${(i+1).toString().padStart(2, '0')}</div><div class="item-main"><div class="item-title">${item.name}</div></div><div class="item-val">${item.year}</div></div>
    `).join('') || '<div class="list-item">AI ERA DEFINED</div>';

    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

function renderEarthTransit() {
    const { container, content } = createCollapsibleSection('EARTH TRANSIT');
    const age = calculateAge(state.user.dob).years;
    const galacticDist = age * 4.5e9; // 4.5 billion miles per year orbital velocity in galaxy
    const leaps = Math.floor(age / 4);
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = `
        <div class="list-item"><div class="item-num">01</div><div class="item-main"><div class="item-title">Galactic Distance Traveled</div></div><div class="item-val">${formatLarge(galacticDist)} miles</div></div>
        <div class="list-item"><div class="item-num">02</div><div class="item-main"><div class="item-title">Leap Years Survived</div></div><div class="item-val">${leaps}</div></div>
        <div class="list-item"><div class="item-num">03</div><div class="item-main"><div class="item-title">Earth Revolutions</div></div><div class="item-val">${age} orbits</div></div>
    `;
    content.appendChild(list);
    elements.resultsSection.appendChild(container);
}

// --- Data Fetchers ---

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
                <div class="time-content">${e.text}</div>
            </div>
        `).join('');
    } catch (e) {
        histBox.innerHTML = '<div class="item-subtitle">ARCHIVE ACCESS FAILED.</div>';
    }

    const onceEvents = ["The Turn of the Millennium (2000)", "Halley's Comet (1986)", "First Image of a Black Hole (2019)", "Hale-Bopp Comet (1997)", "Great Conjunction (2020)", "Total Solar Eclipse", "Mars Perseverance Landing", "Higgs Boson Discovery", "Digital Migration", "Commercial Space Flight"];
    onceBox.innerHTML = onceEvents.map((e, i) => `<div class="list-item" style="padding:8px 12px; font-size:0.8rem; border-color:#222;"><span class="item-num">${i+1}</span> ${e}</div>`).join('');

    const posEvents = ["Global Poverty Rates Halved", "Record Green Energy Growth", "Eradication of Major Diseases", "Global Access to Knowledge", "Marine Sanctuaries Created", "First Malaria Vaccine", "Ozone Layer Recovery", "ISS Occupation (2000+)", "Remote Education Rise", "Global Literacy Peak"];
    posBox.innerHTML = posEvents.map((e, i) => `<div class="list-item" style="padding:8px 12px; font-size:0.8rem; border-color:#222;"><span class="item-num" style="color:var(--accent-green)">${i+1}</span> ${e}</div>`).join('');

    const invEvents = ["The World Wide Web", "Smartphone Revolution", "Generative AI", "Electric Vehicles", "Blockchain & Crypto", "CRISPR Gene Editing", "3D Printing", "Commercial Drones", "Streaming Media", "Reusable Rockets"];
    invBox.innerHTML = invEvents.map((e, i) => `<div class="list-item" style="padding:8px 12px; font-size:0.8rem; border-color:#222;"><span class="item-num" style="color:var(--accent-cyan)">${i+1}</span> ${e}</div>`).join('');
}

function renderTopChartsData() {
    const sBox = document.getElementById('top-songs'), tBox = document.getElementById('top-tv'), mBox = document.getElementById('top-movies');
    if (!sBox) return;
    const songs = ["Smooth", "Say My Name", "Maria Maria", "Breathe", "I Knew I Loved You", "Amazed", "Everything You Want", "Bent", "It's Gonna Be Me", "Be With You"];
    const tv = ["Friends", "ER", "Millionaire", "Frasier", "The West Wing", "The Practice", "60 Minutes", "Touched by an Angel", "Law & Order", "Everybody Loves Raymond"];
    const movies = ["Toy Story 2", "The Green Mile", "Stuart Little", "Any Given Sunday", "Magnolia"];
    sBox.innerHTML = songs.map((s, i) => `<div class="list-item" style="padding:6px 12px; font-size:0.75rem; border-color:#222;"><span class="item-num">${i+1}</span> ${s}</div>`).join('');
    tBox.innerHTML = tv.map((s, i) => `<div class="list-item" style="padding:6px 12px; font-size:0.75rem; border-color:#222;"><span class="item-num">${i+1}</span> ${s}</div>`).join('');
    mBox.innerHTML = movies.map((s, i) => `<div class="list-item" style="padding:6px 12px; font-size:0.75rem; border-color:#222;"><span class="item-num">${i+1}</span> ${s}</div>`).join('');
}

// --- Utils ---

function calculateAge(dobStr) {
    const dob = new Date(dobStr);
    const diff = new Date() - dob;
    return {
        years: Math.floor(diff / 31557600000),
        months: Math.floor(diff / 2629800000),
        weeks: Math.floor(diff / 604800000),
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor(diff / 60000),
        seconds: Math.floor(diff / 1000)
    };
}

function startLiveUpdates() {
    setInterval(() => {
        if (!state.user.dob) return;
        const diff = new Date() - new Date(state.user.dob);
        const age = calculateAge(state.user.dob);
        const update = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

        update('val-seconds', Math.floor(diff / 1000).toLocaleString());
        update('val-years', age.years);
        update('val-months', age.months.toLocaleString());
        update('val-weeks', age.weeks.toLocaleString());
        update('val-days', age.days.toLocaleString());
        update('val-hours', age.hours.toLocaleString());
        update('val-minutes', age.minutes.toLocaleString());
        update('val-born-day', new Date(state.user.dob).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase());

        const mins = diff / 60000, days = diff / 86400000;
        update('est-heart', formatLarge(mins * 72));
        update('est-breaths', formatLarge(mins * 14));
        update('est-sleep', formatLarge(days * 8));
        update('est-eat', formatLarge(days * 1.5));
        update('est-words', formatLarge(days * 15000));
        update('est-water', Math.floor(days * 2.5).toLocaleString());
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
        { sign: 'Virgo', meaning: 'Analytical', element: 'Earth', start: [8, 23], end: [9, 22] },
        { sign: 'Libra', meaning: 'Social', element: 'Air', start: [9, 23], end: [10, 22] },
        { sign: 'Scorpio', meaning: 'Resourceful', element: 'Water', start: [10, 23], end: [11, 21] },
        { sign: 'Sagittarius', meaning: 'Optimistic', element: 'Fire', start: [11, 22], end: [12, 21] }
    ];
    for (const z of zodiacs) if ((month == z.start[0] && day >= z.start[1]) || (month == z.end[0] && day <= z.end[1])) return z;
    return zodiacs[0];
}
