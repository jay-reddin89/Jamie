const state = {
    user: { name: '', dob: '', country: '', profilePic: '', gender: '' },
    settings: {
        sections: ['realtime', 'facts', 'livedthrough', 'top', 'standing', 'astronomical', 'transit', 'economic', 'tech', 'network', 'eco', 'power', 'knowledge', 'namemeaning', 'nameworld', 'namejokes']
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

function createDataList(items) {
    const list = document.createElement('div');
    list.className = 'data-list';
    list.innerHTML = items.map((item, i) => `
        <div class="list-item">
            <div class="item-num">${(i + 1).toString().padStart(2, '0')}</div>
            <div class="item-main">
                <div class="item-title">${item.label}</div>
                ${item.subtitle ? `<div class="item-subtitle">${item.subtitle}</div>` : ''}
            </div>
            <div class="item-val" ${item.id ? `id="${item.id}"` : ''}>${item.value || '-'}</div>
        </div>
    `).join('');
    return list;
}

function createCollapsibleSection(label, isCollapsed = true) {
    const container = document.createElement('div');
    container.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'section-label flex-row align-center pointer justify-between';
    header.style.margin = '24px 16px 8px'; // Keeping some margins that were original
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
    container.className = 'margin-top-md';

    const header = document.createElement('div');
    header.className = 'sub-label pointer flex-row justify-between align-center';
    header.style.color = 'var(--accent-amber)';
    header.style.padding = '8px 0';
    header.style.borderBottom = '1px solid var(--md-sys-color-outline-variant)';
    header.innerHTML = `<span style="font-weight: 700; font-size: 0.75rem; letter-spacing: 0.5px; text-transform: uppercase;">${label}</span> <span class="sub-toggle-arrow">${isCollapsed ? '[+]' : '[-]'}</span>`;

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

    // Profile Panel
    const profile = document.createElement('div');
    profile.className = 'card profile-card';
    profile.innerHTML = `
        <div class="avatar-hex">${state.user.profilePic ? `<img src="${state.user.profilePic}" class="avatar-img">` : '🧬'}</div>
        <div class="profile-details">
            <div class="sub-label">User</div>
            <h2>${state.user.name.toUpperCase() || 'ANONYMOUS'}</h2>
            <div class="location-label">📍 ${state.user.country || 'UNKNOWN LOCALE'} ${state.user.gender ? `// ${state.user.gender}` : ''}</div>
        </div>
        <div class="badge-active">ACTIVE</div>
    `;
    elements.resultsSection.appendChild(profile);

    const orderedKeys = ['realtime', 'facts', 'livedthrough', 'top', 'standing', 'astronomical', 'transit', 'economic', 'tech', 'network', 'eco', 'power', 'knowledge', 'namemeaning', 'nameworld', 'namejokes'];

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
                case 'namemeaning': renderNameMeaning(); break;
                case 'nameworld': renderNameWorld(); break;
                case 'namejokes': renderNameJokes(); break;
            }
        }
    });

    const footer = document.createElement('div');
    footer.className = 'footer-actions';
    footer.innerHTML = `
        <button class="reinit-btn margin-bottom-md" onclick="location.reload()"><span>🔄</span> NEW ANALYSIS</button>
        <button class="reinit-btn btn-cyan" id="download-pdf-btn"><span>📄</span> DOWNLOAD PDF SUMMARY</button>
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

    const heroCard = document.createElement('div');
    heroCard.className = 'card';
    heroCard.innerHTML = `
        <div class="biometrics-main">
            <div class="stream-label"><span>Total Seconds Elapsed</span> <span class="live-feed-text">LIVE_FEED</span></div>
            <div class="large-value" id="val-seconds">-</div>
        </div>
    `;
    content.appendChild(heroCard);

    const combinedStats = createDataList([
        { label: 'DAY BORN', id: 'val-born-day', value: '-' },
        { label: 'YEARS ELAPSED', id: 'val-years', value: '-' },
        { label: 'MONTHS ELAPSED', id: 'val-months', value: '-' },
        { label: 'WEEKS ELAPSED', id: 'val-weeks', value: '-' },
        { label: 'DAYS ELAPSED', id: 'val-days', value: '-' },
        { label: 'HOURS ELAPSED', id: 'val-hours', value: '-' },
        { label: 'MINUTES ELAPSED', id: 'val-minutes', value: '-' },
        { label: 'Hair Grown', value: `~${(totalDays * 0.035).toFixed(1)}m`, subtitle: 'BIOMETRIC MILESTONE' },
        { label: 'Nails Grown', value: `~${(totalDays * 0.01).toFixed(1)}cm`, subtitle: 'BIOMETRIC MILESTONE' },
        { label: 'Skin Shed', value: `~${(calculateAge(state.user.dob).years * 0.7).toFixed(1)}kg`, subtitle: 'BIOMETRIC MILESTONE' },
        { label: 'Total Blinks', id: 'est-blinks', value: '-', subtitle: 'BIOMETRIC MILESTONE' },
        { label: 'HEARTBEATS', id: 'est-heart', value: '-', subtitle: 'BIOMETRIC MILESTONE' },
        { label: 'BREATHS', id: 'est-breaths', value: '-', subtitle: 'BIOMETRIC MILESTONE' },
        { label: 'HOURS ASLEEP', id: 'est-sleep', value: '-', subtitle: 'ESTIMATED' },
        { label: 'HOURS CONSUMING', id: 'est-eat', value: '-', subtitle: 'ESTIMATED' }
    ]);
    content.appendChild(combinedStats);

    elements.resultsSection.appendChild(container);
}

function renderNameFacts() {
    const { container, content } = createCollapsibleSection('NAME FACTS');
    const age = calculateAge(state.user.dob).years;
    const country = state.user.country || 'Global';

    content.appendChild(createDataList([
        { label: 'Global Pop. @ Birth', value: `~${(8.1 - (age * 0.085)).toFixed(1)}B` },
        { label: 'People Older', value: `~${(4.5 - (age * 0.05)).toFixed(1)}B` },
        { label: `Name Frequency (${country})`, value: '~1/2,500' },
        { label: 'Born Same Day', value: '~365k' },
        { label: 'Name Popularity (Birth)', value: `#${(state.user.name.length * 7 % 100) + 1}` },
        { label: 'Name Popularity (Now)', value: `#${(state.user.name.length * 13 % 500) + 50}` }
    ]));

    elements.resultsSection.appendChild(container);
}

function renderEventsLived() {
    const { container, content } = createCollapsibleSection('EVENTS LIVED');

    const sourceInfo = document.createElement('div');
    sourceInfo.className = 'item-subtitle';
    sourceInfo.style.margin = '0 16px 8px';
    sourceInfo.textContent = 'SOURCE: GLOBAL_HISTORY_DB';
    content.appendChild(sourceInfo);

    const mainCard = document.createElement('div');
    mainCard.className = 'card';
    mainCard.style.marginTop = '0';

    const subHist = createCollapsibleSubSection('HISTORICAL TIMELINE (20 EVENTS)', false);
    subHist.content.id = 'timeline-hist';
    subHist.content.className = 'timeline margin-top-md';

    const subOnce = createCollapsibleSubSection('ONCE-IN-A-LIFETIME EVENTS');
    subOnce.content.id = 'timeline-once';
    subOnce.content.className = 'data-list';

    const subPos = createCollapsibleSubSection('POSITIVE HUMAN PROGRESS');
    subPos.content.id = 'timeline-pos';
    subPos.content.className = 'data-list';

    const subInv = createCollapsibleSubSection('TECHNOLOGICAL INVENTIONS');
    subInv.content.id = 'timeline-inv';
    subInv.content.className = 'data-list';

    mainCard.appendChild(subHist.container);
    mainCard.appendChild(subOnce.container);
    mainCard.appendChild(subPos.container);
    mainCard.appendChild(subInv.container);

    content.appendChild(mainCard);
    elements.resultsSection.appendChild(container);
    renderLivedThroughData();
}

function renderTopMedia() {
    const { container, content } = createCollapsibleSection('TOP MEDIA YEAR BORN');

    const mainCard = document.createElement('div');
    mainCard.className = 'card';

    const subTracks = createCollapsibleSubSection('TOP 10 TRACKS THAT WEEK', false);
    subTracks.content.id = 'top-songs';
    subTracks.content.className = 'data-list';

    const subTV = createCollapsibleSubSection('TOP 10 TV SHOWS THIS SEASON');
    subTV.content.id = 'top-tv';
    subTV.content.className = 'data-list';

    const subMovies = createCollapsibleSubSection('TOP 5 BOX OFFICE HITS');
    subMovies.content.id = 'top-movies';
    subMovies.content.className = 'data-list';

    mainCard.appendChild(subTracks.container);
    mainCard.appendChild(subTV.container);
    mainCard.appendChild(subMovies.container);

    content.appendChild(mainCard);
    elements.resultsSection.appendChild(container);
    renderTopChartsData();
}

function renderGlobalStanding() {
    const { container, content } = createCollapsibleSection('GLOBAL STANDING');
    const age = calculateAge(state.user.dob).years;
    const percentile = Math.min(99, Math.max(1, age * 1.2)).toFixed(1);

    content.appendChild(createDataList([
        { label: 'Age Percentile', value: `Older than ${percentile}%` },
        { label: 'Global Human Rank', value: `~${formatLarge(8e9 * (1 - percentile/100))}` }
    ]));

    elements.resultsSection.appendChild(container);
}

function renderStarFacts() {
    const { container, content } = createCollapsibleSection('STAR FACTS');
    const zodiac = getZodiac(new Date(state.user.dob));
    const age = calculateAge(state.user.dob).years;
    const card = document.createElement('div');
    card.className = 'card relative';
    card.innerHTML = `
        <div class="stellar-title">${zodiac.sign.toUpperCase()}</div>
        <div class="item-subtitle color-purple font-weight-bold">${zodiac.meaning}</div>
        <div class="flex-row gap-sm margin-vertical-md">
            <span class="badge-stone">BIRTHSTONE: DIAMOND</span>
            <span class="badge-stone badge-purple">ELEMENT: ${zodiac.element.toUpperCase()}</span>
        </div>
        <div class="item-subtitle">STONE MEANING: SYMBOL OF ETERNAL LOVE AND INNER STRENGTH.</div>
        <hr class="divider">
        <div class="item-title">Light Travel Distance: <span class="item-val">${age} LY</span></div>
        <div class="opacity-low font-large-icon absolute-bottom-right">✨</div>
    `;
    content.appendChild(card);
    elements.resultsSection.appendChild(container);
}

function renderEarthFacts() {
    const { container, content } = createCollapsibleSection('EARTH FACTS');
    const age = calculateAge(state.user.dob).years;
    const galacticDist = age * 4.5e9;

    content.appendChild(createDataList([
        { label: 'Galactic Distance Traveled', value: `${formatLarge(galacticDist)} miles` },
        { label: 'Leap Years Survived', value: `${Math.floor(age / 4)}` }
    ]));

    elements.resultsSection.appendChild(container);
}

function renderEconomyFacts() {
    const { container, content } = createCollapsibleSection('ECONOMY FACTS');
    const age = calculateAge(state.user.dob).years;
    const inflationFactor = Math.pow(1.03, age).toFixed(2);

    content.appendChild(createDataList([
        { label: 'Inflation Multiplier', value: `${inflationFactor}x` },
        { label: '$1.00 then value', value: `$${inflationFactor} today` }
    ]));

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

    content.appendChild(createDataList(techItems.map(item => ({
        label: item.name,
        value: `${item.year}`
    }))));

    if (techItems.length === 0) {
        content.innerHTML = '<div class="list-item">AI ERA DEFINED</div>';
    }

    elements.resultsSection.appendChild(container);
}

function renderNetworkFacts() {
    const { container, content } = createCollapsibleSection('NETWORK FACTS');
    const days = calculateAge(state.user.dob).years * 365;

    content.appendChild(createDataList([
        { label: 'Estimated Emails Sent', value: `~${formatLarge(days * 20)}` },
        { label: 'Data Consumed (GB)', value: `~${formatLarge(days * 5)} GB` },
        { label: 'Internet User Growth', value: '+5.2B since birth' }
    ]));

    elements.resultsSection.appendChild(container);
}

function renderEcoFacts() {
    const { container, content } = createCollapsibleSection('ECO FACTS');
    const age = calculateAge(state.user.dob).years;

    content.appendChild(createDataList([
        { label: 'Carbon Footprint', value: `~${(age * 4.8).toFixed(1)} Tonnes CO2` },
        { label: 'Waste Produced', value: `~${formatLarge(age * 700)} kg` },
        { label: 'Offset Trees Required', value: `~${(age * 25).toLocaleString()} trees` }
    ]));

    elements.resultsSection.appendChild(container);
}

function renderPowerFacts() {
    const { container, content } = createCollapsibleSection('POWER FACTS');
    const days = calculateAge(state.user.dob).years * 365;

    content.appendChild(createDataList([
        { label: 'Total Energy Expended', value: `~${(days * 8.4).toLocaleString()} MJ` },
        { label: 'Steps Taken', value: `~${formatLarge(days * 5000)}` },
        { label: 'Heart Mechanical Work', value: `~${formatLarge(days * 100000)} Joules` }
    ]));

    elements.resultsSection.appendChild(container);
}

function renderKnowledgeFacts() {
    const { container, content } = createCollapsibleSection('KNOWLEDGE FACTS');
    const days = calculateAge(state.user.dob).years * 365;

    content.appendChild(createDataList([
        { label: 'Words Read (EST)', value: `~${formatLarge(days * 10000)}` },
        { label: 'Books Equivalent', value: `~${Math.floor(days / 10)}` },
        { label: 'Human Knowledge Growth', value: '~175 Zettabytes' }
    ]));

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
                    <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(e.text)}" target="_blank" class="link-no-decor link-dashed-cyan">${e.text}</a>
                </div>
            </div>
        `).join('');
    } catch (e) {
        histBox.innerHTML = '<div class="item-subtitle">ARCHIVE ACCESS FAILED.</div>';
    }

    const createListWithLinks = (items, prefix = 'https://en.wikipedia.org/wiki/') => {
        return items.map((e, i) => `
            <div class="list-item padding-sm-rect font-size-sm border-subtle">
                <div class="item-num">${i+1}</div>
                <div class="item-main">
                    <a href="${prefix}${encodeURIComponent(e)}" target="_blank" class="link-no-decor display-block link-dashed">${e}</a>
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
        return items.map((item, i) => `
            <div class="list-item padding-xs-rect font-size-xs border-subtle">
                <span class="item-num">${(i + 1).toString().padStart(2, '0')}</span>
                <div class="item-main">
                    <a href="${baseUrl}${encodeURIComponent(item.label)}" target="_blank" class="link-no-decor display-block link-dashed">${item.label}</a>
                    <div class="item-subtitle" style="font-size: 0.65rem; color: var(--md-sys-color-outline); margin-top: 2px;">
                        YEAR: ${item.year} // LENGTH: ${item.length} // TOP: ${item.top}
                    </div>
                </div>
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
            songs: [
                { label: "Rolling in the Deep", year: 2010, length: "3:48", top: "7 Weeks" },
                { label: "Party Rock Anthem", year: 2011, length: "4:23", top: "6 Weeks" },
                { label: "Firework", year: 2010, length: "3:48", top: "4 Weeks" },
                { label: "E.T.", year: 2011, length: "3:26", top: "5 Weeks" },
                { label: "Give Me Everything", year: 2011, length: "4:12", top: "1 Week" },
                { label: "Grenade", year: 2010, length: "3:42", top: "4 Weeks" },
                { label: "Super Bass", year: 2011, length: "3:20", top: "#3 Peak" },
                { label: "Moves Like Jagger", year: 2011, length: "3:21", top: "4 Weeks" },
                { label: "The Show Goes On", year: 2010, length: "3:56", top: "#9 Peak" },
                { label: "The Lazy Song", year: 2011, length: "3:09", top: "#4 Peak" }
            ],
            tv: [
                { label: "Modern Family", year: 2010, length: "22m", top: "#1 Comedy" },
                { label: "The Big Bang Theory", year: 2010, length: "21m", top: "#1 Sitcom" },
                { label: "Grey's Anatomy", year: 2010, length: "43m", top: "#1 Drama" },
                { label: "Glee", year: 2010, length: "44m", top: "Top 10" },
                { label: "Dancing with the Stars", year: 2010, length: "85m", top: "#1 Reality" },
                { label: "NCIS", year: 2010, length: "44m", top: "#1 Scripted" },
                { label: "American Idol", year: 2010, length: "60m", top: "#1 Overall" },
                { label: "The Voice", year: 2011, length: "60m", top: "Top Rated" },
                { label: "Game of Thrones", year: 2011, length: "55m", top: "Cult Classic" },
                { label: "Breaking Bad", year: 2010, length: "47m", top: "Critical Peak" }
            ],
            movies: [
                { label: "Avatar", year: 2010, length: "162m", top: "$2.7B" },
                { label: "Toy Story 3", year: 2010, length: "103m", top: "$1.0B" },
                { label: "Alice in Wonderland", year: 2010, length: "108m", top: "$1.0B" },
                { label: "Harry Potter and the Deathly Hallows", year: 2010, length: "146m", top: "$960M" },
                { label: "Inception", year: 2010, length: "148m", top: "$828M" }
            ]
        };
    } else if (year >= 2000) {
        return {
            songs: [
                { label: "Hanging by a Moment", year: 2000, length: "3:36", top: "1 Week" },
                { label: "Fallin'", year: 2001, length: "3:30", top: "6 Weeks" },
                { label: "All for You", year: 2001, length: "4:24", top: "7 Weeks" },
                { label: "Drops of Jupiter", year: 2001, length: "4:20", top: "#5 Peak" },
                { label: "I'm Real", year: 2001, length: "4:12", top: "5 Weeks" },
                { label: "Smooth Criminal", year: 2001, length: "3:29", top: "Top 10" },
                { label: "Bootylicious", year: 2001, length: "3:28", top: "2 Weeks" },
                { label: "U Remind Me", year: 2001, length: "4:27", top: "4 Weeks" },
                { label: "Hero", year: 2001, length: "4:19", top: "3 Weeks" },
                { label: "Lady Marmalade", year: 2001, length: "4:25", top: "5 Weeks" }
            ],
            tv: [
                { label: "Survivor", year: 2000, length: "44m", top: "#1 Reality" },
                { label: "ER", year: 2000, length: "44m", top: "#1 Drama" },
                { label: "Friends", year: 2000, length: "22m", top: "#1 Comedy" },
                { label: "CSI", year: 2000, length: "44m", top: "Top 5" },
                { label: "Will & Grace", year: 2000, length: "22m", top: "Top 10" },
                { label: "The West Wing", year: 2000, length: "44m", top: "Critical Hit" },
                { label: "Monday Night Football", year: 2000, length: "180m", top: "#1 Sports" },
                { label: "Everybody Loves Raymond", year: 2000, length: "22m", top: "Top 10" },
                { label: "Frasier", year: 2000, length: "22m", top: "Top 15" },
                { label: "Law & Order", year: 2000, length: "44m", top: "Top 20" }
            ],
            movies: [
                { label: "How the Grinch Stole Christmas", year: 2000, length: "104m", top: "$345M" },
                { label: "Cast Away", year: 2000, length: "143m", top: "$429M" },
                { label: "Mission: Impossible 2", year: 2000, length: "123m", top: "$546M" },
                { label: "Gladiator", year: 2000, length: "155m", top: "$460M" },
                { label: "What Women Want", year: 2000, length: "127m", top: "$374M" }
            ]
        };
    } else if (year >= 1990) {
        return {
            songs: [
                { label: "Smooth", year: 1999, length: "4:54", top: "12 Weeks" },
                { label: "Say My Name", year: 1999, length: "4:31", top: "3 Weeks" },
                { label: "Maria Maria", year: 1999, length: "4:22", top: "10 Weeks" },
                { label: "Breathe", year: 1999, length: "4:10", top: "18 Weeks" },
                { label: "I Knew I Loved You", year: 1999, length: "4:10", top: "4 Weeks" },
                { label: "Amazed", year: 1999, length: "4:00", top: "2 Weeks" },
                { label: "Everything You Want", year: 1999, length: "4:17", top: "1 Week" },
                { label: "Bent", year: 2000, length: "4:16", top: "1 Week" },
                { label: "It's Gonna Be Me", year: 2000, length: "3:11", top: "2 Weeks" },
                { label: "Be With You", year: 2000, length: "3:40", top: "3 Weeks" }
            ],
            tv: [
                { label: "Friends", year: 1999, length: "22m", top: "#1 Comedy" },
                { label: "ER", year: 1999, length: "44m", top: "#1 Drama" },
                { label: "Who Wants to Be a Millionaire", year: 1999, length: "60m", top: "#1 Quiz" },
                { label: "Frasier", year: 1999, length: "22m", top: "Top 10" },
                { label: "The West Wing", year: 1999, length: "44m", top: "Critical Peak" },
                { label: "The Practice", year: 1999, length: "44m", top: "Top 10" },
                { label: "60 Minutes", year: 1999, length: "60m", top: "#1 News" },
                { label: "Touched by an Angel", year: 1999, length: "44m", top: "Top 10" },
                { label: "Law & Order", year: 1999, length: "44m", top: "Top 15" },
                { label: "Everybody Loves Raymond", year: 1999, length: "22m", top: "Top 20" }
            ],
            movies: [
                { label: "Toy Story 2", year: 1999, length: "92m", top: "$497M" },
                { label: "The Green Mile", year: 1999, length: "189m", top: "$286M" },
                { label: "Stuart Little", year: 1999, length: "84m", top: "$300M" },
                { label: "Any Given Sunday", year: 1999, length: "162m", top: "$100M" },
                { label: "Magnolia", year: 1999, length: "188m", top: "Cult Classic" }
            ]
        };
    } else {
        return {
            songs: [
                { label: "Every Breath You Take", year: 1983, length: "4:13", top: "8 Weeks" },
                { label: "Billie Jean", year: 1983, length: "4:54", top: "7 Weeks" },
                { label: "Flashdance... What a Feeling", year: 1983, length: "3:53", top: "6 Weeks" },
                { label: "Down Under", year: 1983, length: "3:42", top: "4 Weeks" },
                { label: "Beat It", year: 1983, length: "4:18", top: "3 Weeks" },
                { label: "Total Eclipse of the Heart", year: 1983, length: "4:30", top: "4 Weeks" },
                { label: "Maneater", year: 1983, length: "4:33", top: "4 Weeks" },
                { label: "Baby, Come to Me", year: 1983, length: "3:30", top: "2 Weeks" },
                { label: "Maniac", year: 1983, length: "4:04", top: "2 Weeks" },
                { label: "Sweet Dreams", year: 1983, length: "3:36", top: "1 Week" }
            ],
            tv: [
                { label: "60 Minutes", year: 1983, length: "60m", top: "#1 News" },
                { label: "Dallas", year: 1983, length: "45m", top: "#1 Soap" },
                { label: "M*A*S*H", year: 1983, length: "25m", top: "Finale Peak" },
                { label: "Magnum, P.I.", year: 1983, length: "48m", top: "Top 5" },
                { label: "Dynasty", year: 1983, length: "45m", top: "Top 10" },
                { label: "Three's Company", year: 1983, length: "25m", top: "Top 10" },
                { label: "Simon & Simon", year: 1983, length: "48m", top: "Top 10" },
                { label: "Falcon Crest", year: 1983, length: "45m", top: "Top 10" },
                { label: "The Love Boat", year: 1983, length: "45m", top: "Top 15" },
                { label: "The A-Team", year: 1983, length: "48m", top: "Top 15" }
            ],
            movies: [
                { label: "Return of the Jedi", year: 1983, length: "131m", top: "$475M" },
                { label: "Terms of Endearment", year: 1983, length: "132m", top: "$108M" },
                { label: "Flashdance", year: 1983, length: "95m", top: "$201M" },
                { label: "Trading Places", year: 1983, length: "116m", top: "$90M" },
                { label: "WarGames", year: 1983, length: "114m", top: "$79M" }
            ]
        };
    }
}

function renderNameMeaning() {
    const { container, content } = createCollapsibleSection('NAME MEANING');
    const name = state.user.name || 'Jamie';
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="item-title" style="color: var(--accent-cyan); margin-bottom: 8px;">SHORT VERSION</div>
        <div class="item-subtitle" style="font-size: 1rem; margin-bottom: 16px;">
            ${getNameMeaning(name).short}
        </div>
        <hr class="divider">
        <div class="item-title" style="color: var(--accent-cyan); margin-bottom: 8px; margin-top: 16px;">DETAILED ANALYSIS</div>
        <div class="item-subtitle" style="line-height: 1.5;">
            ${getNameMeaning(name).long}
        </div>
    `;
    content.appendChild(card);
    elements.resultsSection.appendChild(container);
}

function renderNameWorld() {
    const { container, content } = createCollapsibleSection('NAME WORLD');
    const name = state.user.name || 'Jamie';
    const meanings = getNameWorldMeanings(name);

    content.appendChild(createDataList(meanings.map(m => ({
        label: m.lang,
        value: m.meaning,
        subtitle: m.variation
    }))));

    elements.resultsSection.appendChild(container);
}

function renderNameJokes() {
    const { container, content } = createCollapsibleSection('NAME JOKES');
    const name = state.user.name || 'Jamie';
    
    const mainCard = document.createElement('div');
    mainCard.className = 'card';

    const jokeTypes = ['Joke', 'Pun', 'Knock Knock', 'Dad'];
    jokeTypes.forEach(type => {
        const sub = createCollapsibleSubSection(`${type.toUpperCase()}S`, type === 'Joke');
        const jokes = getNameJokes(name, type);
        sub.content.innerHTML = jokes.map((j, i) => `
            <div class="list-item" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div class="item-num">${(i + 1).toString().padStart(2, '0')}</div>
                <div class="item-main">
                    <div class="item-subtitle" style="color: #eee; font-size: 0.85rem;">${j}</div>
                </div>
            </div>
        `).join('');
        mainCard.appendChild(sub.container);
    });

    content.appendChild(mainCard);
    elements.resultsSection.appendChild(container);
}

// --- Data Generators for Name Features ---

function getNameMeaning(name) {
    const n = name.toLowerCase();
    if (n.includes('jamie')) {
        return {
            short: "Supplanter, derived from James.",
            long: "Jamie is a name of Hebrew origin, serving as both a diminutive of James and a standalone name. It means 'supplanter' or 'one who replaces.' Historically, it gained popularity in Scotland and has since become a beloved gender-neutral name worldwide. It conveys a sense of friendliness, versatility, and enduring charm."
        };
    }
    return {
        short: `The name ${name} is a unique identifier with deep personal resonance.`,
        long: `The name ${name} carries a vibration of individuality and character. Names are more than just labels; they are the first gift we receive and the legacy we leave behind. Your name reflects a combination of heritage, parental hope, and the unique path you carve through history.`
    };
}

function getNameWorldMeanings(name) {
    const n = name.toLowerCase();
    if (n.includes('jamie')) {
        return [
            { lang: "Hebrew", meaning: "Supplanter", variation: "Ya'aqov" },
            { lang: "Spanish", meaning: "Supplanter", variation: "Jaime" },
            { lang: "French", meaning: "I Love", variation: "J'aime" },
            { lang: "Italian", meaning: "Supplanter", variation: "Giacomo" },
            { lang: "Scottish", meaning: "Friendly/Fair", variation: "Seumas" }
        ];
    }
    return [
        { lang: "Global", meaning: "Individual", variation: name },
        { lang: "Digital", meaning: "User_Sequence", variation: `ID_${name.length}` },
        { lang: "Historical", meaning: "Witness", variation: "Legacy" },
        { lang: "Linguistic", meaning: "Nominal", variation: "Identifier" }
    ];
}

function getNameJokes(name, type) {
    if (type === 'Joke') {
        return [
            `Why did ${name} cross the road? To get to the other side of the name tag!`,
            `${name} walked into a bar... and the bartender said, "Hey, I've been waiting for a legend!"`,
            `What's ${name}'s favorite exercise? Running through everyone's mind!`,
            `How do you know ${name} is in the room? Don't worry, the vibe will tell you.`,
            `Why is ${name} like a rare diamond? Hard to find and impossible to forget.`
        ];
    } else if (type === 'Pun') {
        return [
            `I'm ${name}-ing to meet you!`,
            `That's just the ${name} of the game.`,
            `Don't ${name} me, I'm just the messenger.`,
            `It's a ${name} shame we didn't meet sooner.`,
            `Keep calm and ${name} on.`
        ];
    } else if (type === 'Knock Knock') {
        return [
            `Knock, knock. Who's there? ${name}. ${name} who? ${name} you glad I'm here?`,
            `Knock, knock. Who's there? Justin. Justin who? Justin time for ${name}!`,
            `Knock, knock. Who's there? Lettuce. Lettuce who? Lettuce in, it's ${name}!`,
            `Knock, knock. Who's there? Honey bee. Honey bee who? Honey bee a dear and say hi to ${name}!`,
            `Knock, knock. Who's there? Tank. Tank who? Tank you for being ${name}!`
        ];
    } else {
        return [
            `What do you call a funny ${name}? A LOL-ie!`,
            `Why did ${name} bring a ladder to the bar? Because they heard the drinks were on the house!`,
            `Did you hear about ${name} joining the space program? They wanted to see if the moon was made of cheese.`,
            `How does ${name} keep their breath fresh? With ${name}-mints!`,
            `What did the ocean say to ${name}? Nothing, it just waved!`
        ];
    }
}

// --- Utils ---

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
        if (!state.user.dob) return;
        const diff = new Date() - new Date(state.user.dob);
        const age = calculateAge(state.user.dob);
        const update = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

        update('val-seconds', Math.floor(diff / 1000).toLocaleString());
        update('val-years', age.years);
        update('val-months', Math.floor(diff / 2629800000).toLocaleString());
        update('val-weeks', Math.floor(diff / 604800000).toLocaleString());
        update('val-days', Math.floor(diff / 86400000).toLocaleString());
        update('val-hours', Math.floor(diff / 3600000).toLocaleString());
        update('val-minutes', age.minutes.toLocaleString());
        update('val-born-day', new Date(state.user.dob).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase());

        const mins = diff / 60000, days = diff / 86400000;
        update('est-heart', formatLarge(mins * 72));
        update('est-breaths', formatLarge(mins * 14));
        update('est-sleep', formatLarge(days * 8));
        update('est-eat', formatLarge(days * 1.5));

        update('est-blinks', formatLarge(days * 15 * 60 * 16));
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
        html2canvas:  { scale: 2, backgroundColor: '#0a0a0a' },
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
