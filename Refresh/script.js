// ==========================================
// LIFE STATS APPLICATION
// Modern JavaScript Implementation
// ==========================================

// Global State
let userData = {
    name: '',
    dob: null,
    gender: '',
    country: '',
    photoUrl: null
};

let updateInterval = null;
let isInitialized = false;

// Optimization Cache
const numberFormatter = new Intl.NumberFormat('en-US');
const counterElements = {};
const lastCounterValues = {};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    attachEventListeners();
    initializeApp();
});

async function initializeApp() {
    let savedData = null;

    try {
        const local = localStorage.getItem('lifeStatsUserData');
        if (local) savedData = JSON.parse(local);
    } catch (e) {
        console.error("localStorage access failed", e);
    }

    if (!savedData) {
        try {
            if (typeof puter !== 'undefined' && puter.kv) {
                const res = await Promise.race([
                    puter.kv.get('lifeStatsUserData'),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Puter timeout')), 1000))
                ]);
                if (res) savedData = JSON.parse(res);
            }
        } catch (e) {
            console.warn("Puter.js KV access failed", e);
        }
    }

    if (savedData && !isInitialized) {
        userData = savedData;
        if (userData.dob) userData.dob = new Date(userData.dob);
        showDashboard();
        startLiveCounters();
    } else if (!isInitialized) {
        showOnboarding();
    }

    isInitialized = true;
    document.body.classList.add('app-ready');
    console.log("APP READY");
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function attachEventListeners() {
    const onboardingForm = document.getElementById('onboarding-form');
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', handleFormSubmit);
    }

    const photoInput = document.getElementById('photo');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }

    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', handleExportPDF);
    }

    const mediaTabs = document.querySelectorAll('.media-tab');
    mediaTabs.forEach(tab => {
        tab.addEventListener('click', () => handleMediaTabClick(tab));
    });
}

// ==========================================
// FORM HANDLING
// ==========================================
function handleFormSubmit(e) {
    e.preventDefault();
    console.log("SUBMITTING...");

    const formData = new FormData(e.target);
    userData.name = formData.get('name');
    userData.dob = new Date(formData.get('dob'));
    userData.gender = formData.get('gender');
    userData.country = formData.get('country');

    if (!userData.dob || isNaN(userData.dob.getTime()) || userData.dob > new Date()) {
        showNotification('Please enter a valid birth date', 'error');
        return;
    }

    isInitialized = true; // Mark as initialized to prevent initializeApp from overwriting
    saveUserData(userData);
    showDashboard();
    startLiveCounters();
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            userData.photoUrl = event.target.result;
            const fileText = document.querySelector('.file-text');
            if (fileText) fileText.textContent = file.name;
        };
        reader.readAsDataURL(file);
    }
}

function handleReset() {
    if (confirm('Are you sure you want to reset all data?')) {
        clearUserData();
        userData = { name: '', dob: null, gender: '', country: '', photoUrl: null };
        if (updateInterval) clearInterval(updateInterval);
        // Clear caches
        for (const key in lastCounterValues) delete lastCounterValues[key];
        for (const key in counterElements) delete counterElements[key];
        showOnboarding();
    }
}

async function handleExportPDF() {
    const element = document.getElementById('dashboard-screen');
    const opt = {
        margin: 10,
        filename: `LifeStats_${userData.name || 'Citizen'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#0a0a0a' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(element).save();
    } else {
        showNotification("PDF library not loaded.", "error");
    }
}

// ==========================================
// SCREEN NAVIGATION
// ==========================================
function showOnboarding() {
    document.getElementById('onboarding-screen').classList.add('active');
    document.getElementById('dashboard-screen').classList.remove('active');
}

function showDashboard() {
    document.getElementById('onboarding-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
    populateDashboard();
}

// ==========================================
// DASHBOARD POPULATION
// ==========================================
function populateDashboard() {
    console.log("POPULATING...");
    document.getElementById('user-name-display').textContent = `Welcome, ${userData.name}`;

    const birthYear = userData.dob.getFullYear();
    const ageData = calculateAge(userData.dob);
    document.getElementById('user-info-display').textContent =
        `Born in ${birthYear} • ${ageData.years} years old • ${userData.country}`;

    const profilePhoto = document.getElementById('profile-photo');
    const placeholder = document.querySelector('.profile-photo-placeholder');
    if (userData.photoUrl) {
        profilePhoto.src = userData.photoUrl;
        profilePhoto.classList.add('active');
        placeholder.style.display = 'none';
    } else {
        profilePhoto.classList.remove('active');
        placeholder.style.display = 'flex';
    }

    updateLifetimeStats();
    updateZodiacInfo();
    updateGlobalStanding();
    loadHistoricalEvents();
    loadHistoricalMedia();
}

// ==========================================
// LIVE COUNTERS
// ==========================================
function startLiveCounters() {
    // Clear dirty checking cache to force immediate update
    for (const key in lastCounterValues) delete lastCounterValues[key];
    updateLiveCounters();
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(updateLiveCounters, 1000);
}

function updateLiveCounters() {
    if (!userData.dob) return;
    const age = calculateAge(userData.dob);
    const units = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

    // Performance Optimization: Cache DOM lookups and use dirty checking to minimize DOM writes
    units.forEach(unit => {
        const value = age[unit];
        if (lastCounterValues[unit] !== value) {
            if (!counterElements[unit]) {
                counterElements[unit] = document.getElementById(`counter-${unit}`);
            }
            if (counterElements[unit]) {
                counterElements[unit].textContent = formatNumber(value);
                lastCounterValues[unit] = value;
            }
        }
    });
}

function calculateAge(birthDate) {
    const now = new Date();
    const diff = now - birthDate;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);

    return { years, months, weeks, days, hours, minutes, seconds };
}

// ==========================================
// LIFETIME STATISTICS
// ==========================================
function updateLifetimeStats() {
    if (!userData.dob) return;
    const diff = new Date() - userData.dob;
    const mins = diff / 60000;
    const days = diff / 86400000;

    document.getElementById('stat-heartbeats').textContent = formatLargeNumber(Math.floor(mins * 72));
    document.getElementById('stat-breaths').textContent = formatLargeNumber(Math.floor(mins * 14));
    document.getElementById('stat-sleep').textContent = formatLargeNumber(Math.floor(days * 8));
    document.getElementById('stat-meals').textContent = formatLargeNumber(Math.floor(days * 1.5));
    document.getElementById('stat-blinks').textContent = formatLargeNumber(Math.floor(days * 15 * 60 * 16));
}

// ==========================================
// ZODIAC INFORMATION
// ==========================================
function updateZodiacInfo() {
    if (!userData.dob) return;
    const month = userData.dob.getMonth() + 1;
    const day = userData.dob.getDate();

    const zodiac = getZodiacSign(month, day);

    document.getElementById('zodiac-symbol').textContent = zodiac.symbol;
    document.getElementById('zodiac-sign').textContent = zodiac.sign;
    document.getElementById('zodiac-element').textContent = zodiac.element;
    document.getElementById('zodiac-meaning').textContent = zodiac.traits;
}

function getZodiacSign(month, day) {
    const signs = [
        { sign: 'Capricorn', symbol: '♑', element: 'Earth', start: [12, 22], end: [1, 19], traits: 'Ambitious, disciplined, patient, careful, humorous, reserved' },
        { sign: 'Aquarius', symbol: '♒', element: 'Air', start: [1, 20], end: [2, 18], traits: 'Progressive, original, independent, humanitarian, idealistic' },
        { sign: 'Pisces', symbol: '♓', element: 'Water', start: [2, 19], end: [3, 20], traits: 'Compassionate, artistic, intuitive, gentle, wise, musical' },
        { sign: 'Aries', symbol: '♈', element: 'Fire', start: [3, 21], end: [4, 19], traits: 'Courageous, determined, confident, enthusiastic, optimistic, honest, passionate' },
        { sign: 'Taurus', symbol: '♉', element: 'Earth', start: [4, 20], end: [5, 20], traits: 'Reliable, patient, practical, devoted, responsible, stable' },
        { sign: 'Gemini', symbol: '♊', element: 'Air', start: [5, 21], end: [6, 20], traits: 'Gentle, affectionate, curious, adaptable, quick learner' },
        { sign: 'Cancer', symbol: '♋', element: 'Water', start: [6, 21], end: [7, 22], traits: 'Tenacious, loyal, emotional, sympathetic, persuasive' },
        { sign: 'Leo', symbol: '♌', element: 'Fire', start: [7, 23], end: [8, 22], traits: 'Creative, passionate, generous, warm-hearted, cheerful, humorous' },
        { sign: 'Virgo', symbol: '♍', element: 'Earth', start: [8, 23], end: [9, 22], traits: 'Loyal, analytical, kind, hardworking, practical' },
        { sign: 'Libra', symbol: '♎', element: 'Air', start: [9, 23], end: [10, 22], traits: 'Cooperative, diplomatic, gracious, fair-minded, social' },
        { sign: 'Scorpio', symbol: '♏', element: 'Water', start: [10, 23], end: [11, 21], traits: 'Resourceful, brave, passionate, stubborn, true friend' },
        { sign: 'Sagittarius', symbol: '♐', element: 'Fire', start: [11, 22], end: [12, 21], traits: 'Generous, idealistic, great sense of humor, enthusiastic' }
    ];
    for (const zodiac of signs) {
        if ((month === zodiac.start[0] && day >= zodiac.start[1]) || (month === zodiac.end[0] && day <= zodiac.end[1])) return zodiac;
    }
    return signs[0];
}

// ==========================================
// GLOBAL STANDING
// ==========================================
function updateGlobalStanding() {
    if (!userData.dob) return;
    const birthYear = userData.dob.getFullYear();
    const populationData = {
        1950: 2.5, 1960: 3.0, 1970: 3.7, 1980: 4.4, 1990: 5.3,
        2000: 6.1, 2010: 6.9, 2020: 7.8, 2025: 8.0
    };

    let worldPopulation = 7.9;
    for (const year in populationData) {
        if (birthYear >= parseInt(year)) worldPopulation = populationData[year];
    }

    const daysInYear = 365.25;
    const dayOfYear = Math.floor((userData.dob - new Date(birthYear, 0, 1)) / 86400000);
    const dailyBirths = (worldPopulation * 1e9 * 0.019) / daysInYear;
    const estimatedRank = Math.floor(worldPopulation * 1e9 - (dailyBirths * (daysInYear - dayOfYear)));

    document.getElementById('global-rank').innerHTML =
        `${formatLargeNumber(estimatedRank)}<span class="rank-suffix">${getOrdinalSuffix(estimatedRank)}</span>`;
    document.getElementById('world-population').textContent = `${worldPopulation.toFixed(1)}B`;
    document.getElementById('birth-year').textContent = birthYear;
}

function getOrdinalSuffix(num) {
    const j = num % 10, k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
}

// ==========================================
// HISTORICAL EVENTS (Wikipedia API)
// ==========================================
async function loadHistoricalEvents() {
    if (!userData.dob) return;
    const m = userData.dob.getMonth() + 1;
    const d = userData.dob.getDate();
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${m}/${d}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const events = data.events.sort((a, b) => b.year - a.year).slice(0, 5);

        const container = document.getElementById('history-container');
        container.innerHTML = '';
        events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'history-card';
            card.innerHTML = `<div class="history-year">${event.year}</div><div class="history-event">${event.text}</div>`;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading historical events:', error);
        document.getElementById('history-container').innerHTML = '<div class="history-card"><div class="history-event">Unable to load historical events.</div></div>';
    }
}

// ==========================================
// HISTORICAL MEDIA
// ==========================================
function loadHistoricalMedia() {
    if (!userData.dob) return;
    const birthYear = userData.dob.getFullYear();
    document.getElementById('media-year').textContent = birthYear;
    const mediaData = getEraData(birthYear);

    populateMediaList('music-list', mediaData.songs.map(s => ({ title: s, info: '' })));
    populateMediaList('movies-list', mediaData.movies.map(m => ({ title: m, info: '' })));
    populateMediaList('tv-list', mediaData.tv.map(t => ({ title: t, info: '' })));
}

function populateMediaList(listId, items) {
    const list = document.getElementById(listId);
    list.innerHTML = '';
    items.forEach((item, index) => {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.innerHTML = `
            <div class="media-rank">${index + 1}</div>
            <div class="media-title">${item.title}</div>
            <div class="media-artist">${item.artist || item.info}</div>
        `;
        list.appendChild(mediaItem);
    });
}

function getEraData(year) {
    if (year >= 2010) {
        return {
            songs: ["Rolling in the Deep", "Party Rock Anthem", "Firework", "E.T.", "Give Me Everything"],
            tv: ["Modern Family", "The Big Bang Theory", "Grey's Anatomy", "Glee", "Game of Thrones"],
            movies: ["Avatar", "Toy Story 3", "Alice in Wonderland", "Inception", "Iron Man 2"]
        };
    } else if (year >= 2000) {
        return {
            songs: ["Hanging by a Moment", "Fallin'", "All for You", "Drops of Jupiter", "Lady Marmalade"],
            tv: ["Survivor", "ER", "Friends", "CSI", "The West Wing"],
            movies: ["The Grinch", "Cast Away", "Mission: Impossible 2", "Gladiator", "X-Men"]
        };
    } else if (year >= 1990) {
        return {
            songs: ["Smooth", "Say My Name", "Maria Maria", "Breathe", "I Knew I Loved You"],
            tv: ["Friends", "ER", "Frasier", "The West Wing", "Law & Order"],
            movies: ["Toy Story 2", "The Green Mile", "Stuart Little", "Magnolia", "The Matrix"]
        };
    } else {
        return {
            songs: ["Every Breath You Take", "Billie Jean", "Flashdance", "Beat It", "Sweet Dreams"],
            tv: ["60 Minutes", "Dallas", "M*A*S*H", "Magnum, P.I.", "Dynasty"],
            movies: ["Return of the Jedi", "Terms of Endearment", "Flashdance", "Trading Places", "WarGames"]
        };
    }
}

function handleMediaTabClick(clickedTab) {
    const tabName = clickedTab.getAttribute('data-tab');
    document.querySelectorAll('.media-tab').forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');
    document.querySelectorAll('.media-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`media-${tabName}`).classList.add('active');
}

// ==========================================
// DATA PERSISTENCE
// ==========================================
function saveUserData(data) {
    try {
        localStorage.setItem('lifeStatsUserData', JSON.stringify(data));
        if (typeof puter !== 'undefined' && puter.kv) {
            puter.kv.set('lifeStatsUserData', JSON.stringify(data)).catch(e => console.warn(e));
        }
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

function clearUserData() {
    try {
        localStorage.removeItem('lifeStatsUserData');
        if (typeof puter !== 'undefined' && puter.kv) {
            puter.kv.del('lifeStatsUserData').catch(e => console.warn(e));
        }
    } catch (error) {
        console.error('Error clearing user data:', error);
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatNumber(num) {
    // Optimization: Use pre-instantiated Intl.NumberFormat for better performance
    return numberFormatter.format(num);
}

function formatLargeNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return numberFormatter.format(num);
}

// ==========================================
// NOTIFICATIONS
// ==========================================
function showNotification(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
