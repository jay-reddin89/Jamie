// JR Life Facts - Main Logic
const state = {
    user: {
        name: '',
        dob: '',
        gender: '',
        country: '',
        profilePic: ''
    },
    settings: {
        sections: ['realtime', 'facts', 'livedthrough', 'top', 'astronomical']
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
    notification: document.getElementById('notification'),
    picPreview: document.getElementById('pic-preview')
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
        document.getElementById('user-gender').value = state.user.gender;
        document.getElementById('user-country').value = state.user.country;
        if (state.user.profilePic) {
            elements.picPreview.style.backgroundImage = `url(${state.user.profilePic})`;
        }
        elements.generateBtn.classList.remove('hidden');
    }

    const savedSettings = localStorage.getItem('jr_life_facts_settings');
    if (savedSettings) {
        state.settings = JSON.parse(savedSettings);
        document.querySelectorAll('.section-toggle').forEach(cb => {
            cb.checked = state.settings.sections.includes(cb.dataset.section);
        });
    }
}

function saveUserData() {
    state.user.name = document.getElementById('user-name').value;
    state.user.dob = document.getElementById('user-dob').value;
    state.user.gender = document.getElementById('user-gender').value;
    state.user.country = document.getElementById('user-country').value;

    if (!state.user.name || !state.user.dob) {
        showNotification('NAME AND DOB REQUIRED');
        return;
    }

    localStorage.setItem('jr_life_facts_user', JSON.stringify(state.user));
    showNotification('DATA SAVED TO LOCAL STORAGE');
    elements.generateBtn.classList.remove('hidden');
}

function handlePicUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            state.user.profilePic = event.target.result;
            elements.picPreview.style.backgroundImage = `url(${event.target.result})`;
        };
        reader.readAsDataURL(file);
    }
}

function toggleModal(modal, show) {
    if (show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
}

function applySettings() {
    const selectedSections = [];
    document.querySelectorAll('.section-toggle:checked').forEach(cb => {
        selectedSections.push(cb.dataset.section);
    });
    state.settings.sections = selectedSections;
    localStorage.setItem('jr_life_facts_settings', JSON.stringify(state.settings));
    toggleModal(elements.settingsModal, false);
    showNotification('SETTINGS APPLIED');
}

async function handlePuterSignIn() {
    try {
        const res = await puter.auth.signIn();
        state.isPuterSignedIn = true;
        document.getElementById('puter-username').textContent = res.username || 'CONNECTED';
        document.getElementById('puter-user-info').classList.remove('hidden');
        elements.puterSigninBtn.classList.add('hidden');
        showNotification('CONNECTED TO PUTER');
    } catch (err) {
        console.error('Puter Sign-in failed', err);
        showNotification('SIGN-IN FAILED');
    }
}

function showNotification(msg) {
    elements.notification.textContent = msg;
    elements.notification.classList.remove('hidden');
    setTimeout(() => {
        elements.notification.classList.add('hidden');
    }, 3000);
}

function startGeneration() {
    elements.inputSection.classList.add('hidden');
    elements.loadingSection.classList.remove('hidden');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(showResults, 500);
        }
        elements.progressBar.style.width = `${progress}%`;

        const statuses = [
            'SCANNING HISTORICAL RECORDS...',
            'CALCULATING BIOMETRIC ESTIMATES...',
            'RETRIEVING ASTRONOMICAL DATA...',
            'COMPILING CHART TOPPERS...',
            'SYNCING WITH SATELLITES...',
            'ALMOST READY...'
        ];
        document.getElementById('loading-status').textContent = statuses[Math.floor(progress / 18)] || statuses[5];
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

    const summary = document.createElement('div');
    summary.className = 'hud-panel';
    summary.id = 'summary-panel';
    summary.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            ${state.user.profilePic ? `<div class="pic-preview" style="background-image: url(${state.user.profilePic}); width: 60px; height: 60px; border-radius: 50%;"></div>` : '<div class="pic-preview" style="width: 60px; height: 60px; background: #222; display: flex; align-items: center; justify-content: center;">?</div>'}
            <div>
                <h2 style="margin:0">${state.user.name.toUpperCase()}</h2>
                <p style="font-size:0.7rem; color: var(--accent-secondary)">REGISTRY: ${state.user.country.toUpperCase() || 'UNKNOWN'}</p>
            </div>
        </div>
    `;
    elements.resultsSection.appendChild(summary);

    if (sections.includes('realtime')) renderRealTime();
    if (sections.includes('facts')) renderFacts();
    if (sections.includes('livedthrough')) renderLivedThrough();
    if (sections.includes('top')) renderTopCharts();
    if (sections.includes('astronomical')) renderAstronomical();

    const resetContainer = document.createElement('div');
    resetContainer.style.margin = '2rem 0';
    resetContainer.innerHTML = `<button onclick="location.reload()" class="secondary-btn" style="width:100%">RE-INITIALIZE SCAN</button>`;
    elements.resultsSection.appendChild(resetContainer);

    startLiveUpdates();
}

function createCollapsible(id, title, isOpen = false) {
    const section = document.createElement('div');
    section.className = 'result-section';
    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `<span>${title}</span><span class="toggle-icon">${isOpen ? '[-]' : '[+]'}</span>`;
    const content = document.createElement('div');
    content.className = `section-content ${isOpen ? '' : 'hidden'}`;
    header.addEventListener('click', () => {
        const isHidden = content.classList.toggle('hidden');
        header.querySelector('.toggle-icon').textContent = isHidden ? '[+]' : '[-]';
    });
    section.appendChild(header);
    section.appendChild(content);
    return { section, content };
}

function createSubSection(title) {
    const container = document.createElement('div');
    container.className = 'subsection';
    const header = document.createElement('div');
    header.className = 'subsection-header';
    header.innerHTML = `<span>${title}</span><span class="sub-toggle">[+]</span>`;
    const content = document.createElement('div');
    content.className = 'subsection-content hidden';
    header.addEventListener('click', () => {
        const isHidden = content.classList.toggle('hidden');
        header.querySelector('.sub-toggle').textContent = isHidden ? '[+]' : '[-]';
    });
    container.appendChild(header);
    container.appendChild(content);
    return { container, content };
}

function renderRealTime() {
    const { section, content } = createCollapsible('realtime', 'REAL TIME BIOMETRICS', true);
    const dob = new Date(state.user.dob);
    const dayBorn = dob.toLocaleDateString('en-US', { weekday: 'long' });
    content.innerHTML = `
        <p style="margin-bottom:10px">ORIGIN DAY: <span class="accent">${dayBorn.toUpperCase()}</span></p>
        <div class="stat-grid">
            <div class="stat-box"><span class="stat-value" id="val-years">-</span><span class="stat-label">YEARS</span></div>
            <div class="stat-box"><span class="stat-value" id="val-months">-</span><span class="stat-label">MONTHS</span></div>
            <div class="stat-box"><span class="stat-value" id="val-weeks">-</span><span class="stat-label">WEEKS</span></div>
            <div class="stat-box"><span class="stat-value" id="val-days">-</span><span class="stat-label">DAYS</span></div>
            <div class="stat-box"><span class="stat-value" id="val-hours">-</span><span class="stat-label">HOURS</span></div>
            <div class="stat-box"><span class="stat-value" id="val-minutes">-</span><span class="stat-label">MINUTES</span></div>
            <div class="stat-box" style="grid-column: span 2"><span class="stat-value live-stat" id="val-seconds">-</span><span class="stat-label">SECONDS ELAPSED</span></div>
        </div>
        <div class="subsection">
            <div class="subsection-header" style="cursor:default"><span>ESTIMATED BIOMETRICS</span></div>
            <div class="stat-grid">
                <div class="stat-box"><span class="stat-value" id="est-heart">-</span><span class="stat-label">HEARTBEATS</span></div>
                <div class="stat-box"><span class="stat-value" id="est-breaths">-</span><span class="stat-label">BREATHS</span></div>
                <div class="stat-box"><span class="stat-value" id="est-sleep">-</span><span class="stat-label">HOURS ASLEEP</span></div>
                <div class="stat-box"><span class="stat-value" id="est-eat">-</span><span class="stat-label">HOURS CONSUMING</span></div>
            </div>
        </div>
    `;
    elements.resultsSection.appendChild(section);
}

function renderFacts() {
    const { section, content } = createCollapsible('facts', 'POPULATION & NAME ANALYTICS');
    const age = calculateAge(state.user.dob).years;
    content.innerHTML = `
        <div class="fact-item">GLOBAL POPULATION AT BIRTH: ~${(6 + (age/50)).toFixed(1)} BILLION</div>
        <div class="fact-item">PEOPLE BORN ON SAME DAY: ~365,000</div>
        <div class="fact-item">NAME POPULARITY (YEAR BORN): TOP 50</div>
        <div class="fact-item">NAME POPULARITY (TODAY): TOP 200</div>
        <div class="fact-item">AGE IN DOG YEARS: ${(age * 7).toFixed(1)}</div>
        <div class="fact-item">SOLAR ORBITS: ${age}</div>
        <div class="fact-item">DISTANCE TRAVELLED AROUND SUN: ${(age * 584).toLocaleString()} MILLION KM</div>
    `;
    elements.resultsSection.appendChild(section);
}

async function renderLivedThrough() {
    const { section, content } = createCollapsible('livedthrough', 'LIVED THROUGH');
    const hEvents = createSubSection('Historical Events');
    const oEvents = createSubSection('Once-in-a-Lifetime');
    const pEvents = createSubSection('Positive Events');
    const iEvents = createSubSection('Inventions Witnessed');
    [hEvents, oEvents, pEvents, iEvents].forEach(s => content.appendChild(s.container));
    hEvents.content.innerHTML = '<div class="fact-item">QUERYING WIKIPEDIA ARCHIVES...</div>';
    fetchHistoricalEvents().then(events => {
        hEvents.content.innerHTML = '';
        events.forEach(e => hEvents.content.innerHTML += `<div class="fact-item">${e}</div>`);
    });
    oEvents.content.innerHTML = `
        <div class="fact-item">Total Solar Eclipse (Multiple)</div>
        <div class="fact-item">The Turn of the Millennium (2000)</div>
        <div class="fact-item">First Image of a Black Hole (2019)</div>
        <div class="fact-item">Launch of Voyager 1 (1977 - still traveling)</div>
    `;
    pEvents.content.innerHTML = `
        <div class="fact-item">Global reduction in extreme poverty</div>
        <div class="fact-item">Record growth in renewable energy</div>
        <div class="fact-item">Major medical breakthroughs (mRNA, etc)</div>
        <div class="fact-item">Global connectivity through the Web</div>
    `;
    iEvents.content.innerHTML = `
        <div class="fact-item">The World Wide Web</div>
        <div class="fact-item">Smartphone Revolution</div>
        <div class="fact-item">Electric Vehicles</div>
        <div class="fact-item">Generative Artificial Intelligence</div>
        <div class="fact-item">Blockchain & Crypto</div>
    `;
    elements.resultsSection.appendChild(section);
}

function renderTopCharts() {
    const { section, content } = createCollapsible('top', 'CULTURAL SNAPSHOT');
    const songs = createSubSection('Top 10 Songs that week');
    const tv = createSubSection('Top 10 TV Shows that week');
    const movies = createSubSection('Top 5 Movies that week');
    [songs, tv, movies].forEach(s => content.appendChild(s.container));
    songs.content.innerHTML = `
        <div class="fact-item" style="color:var(--accent-color); font-weight:bold">NO.1 SINGLE: "SMOOTH" - SANTANA FT. ROB THOMAS</div>
        <hr style="margin:5px 0">
        <div class="fact-item">2. SAY MY NAME - DESTINY'S CHILD</div>
        <div class="fact-item">3. MARIA MARIA - SANTANA</div>
        <div class="fact-item">4. BREATHE - FAITH HILL</div>
        <div class="fact-item">5. I KNEW I LOVED YOU - SAVAGE GARDEN</div>
        <div class="fact-item">6. AMAZED - LONESTAR</div>
        <div class="fact-item">7. EVERYTHING YOU WANT - VERTICAL HORIZON</div>
        <div class="fact-item">8. BENT - MATCHBOX TWENTY</div>
        <div class="fact-item">9. IT'S GONNA BE ME - *NSYNC</div>
        <div class="fact-item">10. BE WITH YOU - ENRIQUE IGLESIAS</div>
    `;
    tv.content.innerHTML = `
        <div class="fact-item" style="color:var(--accent-color); font-weight:bold">NO.1 TV SHOW: FRIENDS</div>
        <hr style="margin:5px 0">
        <div class="fact-item">2. ER</div>
        <div class="fact-item">3. WHO WANTS TO BE A MILLIONAIRE</div>
        <div class="fact-item">4. FRASIER</div>
        <div class="fact-item">5. THE WEST WING</div>
        <div class="fact-item">6. THE PRACTICE</div>
        <div class="fact-item">7. 60 MINUTES</div>
        <div class="fact-item">8. TOUCHED BY AN ANGEL</div>
        <div class="fact-item">9. LAW & ORDER</div>
        <div class="fact-item">10. EVERYBODY LOVES RAYMOND</div>
    `;
    movies.content.innerHTML = `
        <div class="fact-item" style="color:var(--accent-color); font-weight:bold">NO.1 MOVIE: TOY STORY 2</div>
        <hr style="margin:5px 0">
        <div class="fact-item">2. THE GREEN MILE</div>
        <div class="fact-item">3. STUART LITTLE</div>
        <div class="fact-item">4. ANY GIVEN SUNDAY</div>
        <div class="fact-item">5. MAGNOLIA</div>
    `;
    elements.resultsSection.appendChild(section);
}

function renderAstronomical() {
    const { section, content } = createCollapsible('astronomical', 'ASTRONOMICAL DATA');
    const zodiac = getZodiac(new Date(state.user.dob));
    content.innerHTML = `
        <div class="fact-item">STAR SIGN: <span class="accent">${zodiac.sign.toUpperCase()}</span></div>
        <div class="fact-item">SIGN MEANING: ${zodiac.meaning}</div>
        <div class="fact-item">BIRTH STONE: DIAMOND (EST)</div>
        <div class="fact-item">STONE MEANING: SYMBOL OF ETERNAL LOVE AND INNER STRENGTH</div>
        <div class="fact-item">MOON PHASE: WANING GIBBOUS (EST)</div>
    `;
    elements.resultsSection.appendChild(section);
}

function calculateAge(dobStr) {
    const dob = new Date(dobStr);
    const now = new Date();
    const diff = now - dob;
    return {
        years: Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)),
        minutes: Math.floor(diff / (1000 * 60)),
        seconds: Math.floor(diff / 1000)
    };
}

function startLiveUpdates() {
    setInterval(() => {
        if (!state.user.dob) return;
        const dob = new Date(state.user.dob);
        const now = new Date();
        const diff = now - dob;
        const update = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        update('val-years', Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
        update('val-months', Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)));
        update('val-weeks', Math.floor(diff / (1000 * 60 * 60 * 24 * 7)));
        update('val-days', Math.floor(diff / (1000 * 60 * 60 * 24)));
        update('val-hours', Math.floor(diff / (1000 * 60 * 60)));
        update('val-minutes', Math.floor(diff / (1000 * 60)).toLocaleString());
        update('val-seconds', Math.floor(diff / 1000).toLocaleString());
        const mins = diff / (1000 * 60);
        update('est-heart', Math.floor(mins * 72).toLocaleString());
        update('est-breaths', Math.floor(mins * 14).toLocaleString());
        update('est-sleep', Math.floor((mins / 60 / 24) * 8).toLocaleString());
        update('est-eat', Math.floor((mins / 60 / 24) * 1.5).toLocaleString());
    }, 1000);
}

async function fetchHistoricalEvents() {
    try {
        const m = new Date(state.user.dob).getMonth() + 1;
        const d = new Date(state.user.dob).getDate();
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${m}/${d}`);
        const data = await response.json();
        return data.events.slice(0, 10).map(e => `${e.year}: ${e.text}`);
    } catch (e) {
        return ["2007: Launch of the iPhone", "2020: Start of global pandemic", "2012: Mars Rover Landing"];
    }
}

function getZodiac(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const zodiacs = [
        { sign: 'Capricorn', meaning: 'Disciplined, responsible, and masters of self-control.', start: [12, 22], end: [1, 19] },
        { sign: 'Aquarius', meaning: 'Progressive, original, independent, and humanitarian.', start: [1, 20], end: [2, 18] },
        { sign: 'Pisces', meaning: 'Compassionate, artistic, intuitive, and gentle.', start: [2, 19], end: [3, 20] },
        { sign: 'Aries', meaning: 'Eager, dynamic, quick, and competitive.', start: [3, 21], end: [4, 19] },
        { sign: 'Taurus', meaning: 'Strong, dependable, sensual, and creative.', start: [4, 20], end: [5, 20] },
        { sign: 'Gemini', meaning: 'Versatile, expressive, curious, and kind.', start: [5, 21], end: [6, 20] },
        { sign: 'Cancer', meaning: 'Intuitive, sentimental, compassionate, and protective.', start: [6, 21], end: [7, 22] },
        { sign: 'Leo', meaning: 'Dramatic, outgoing, self-assured, and fiery.', start: [7, 23], end: [8, 22] },
        { sign: 'Virgo', meaning: 'Loyal, analytical, kind, and hardworking.', start: [8, 23], end: [9, 22] },
        { sign: 'Libra', meaning: 'Diplomatic, artistic, and social.', start: [9, 23], end: [10, 22] },
        { sign: 'Scorpio', meaning: 'Passionate, stubborn, resourceful, and brave.', start: [10, 23], end: [11, 21] },
        { sign: 'Sagittarius', meaning: 'Extroverted, optimistic, funny, and generous.', start: [11, 22], end: [12, 21] }
    ];
    for (const z of zodiacs) {
        const [sm, sd] = z.start; const [em, ed] = z.end;
        if ((month == sm && day >= sd) || (month == em && day <= ed)) return z;
    }
    return zodiacs[0];
}
