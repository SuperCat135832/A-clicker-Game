// Variablen für das Spiel
let score = 0;

// Upgrade 1: Auto-Klicker
let autoClickers = 0;
let autoClickerCost = 15;

// NEU: Upgrade 2: Finger-Skalierung
let fingerLevel = 0;
let fingerCost = 50;

// Elemente aus der HTML-Datei heraussuchen
const scoreDisplay = document.getElementById('score');
const ppsDisplay = document.getElementById('ppsDisplay');
const clickButton = document.getElementById('clickBtn');

const shopToggleBtn = document.getElementById('shopToggleBtn');
const upgradesContainer = document.getElementById('upgradesContainer');

const buyAutoClickerBtn = document.getElementById('buyAutoClicker');
const autoClickerCountDisplay = document.getElementById('autoclicker-count');
const autoClickerCostDisplay = document.getElementById('autoclicker-cost');

const buyFingerUpgradeBtn = document.getElementById('buyFingerUpgrade');
const fingerLevelDisplay = document.getElementById('finger-level');
const fingerCostDisplay = document.getElementById('finger-cost');

// Lade gespeicherten Spielstand aus dem Browser-Speicher
function loadGame() {
    const savedScore = localStorage.getItem('clicker_score_v4');
    const savedAutoClickers = localStorage.getItem('clicker_autoclickers_v4');
    const savedCost = localStorage.getItem('clicker_autoclicker_cost_v4');
    const savedFingerLevel = localStorage.getItem('clicker_finger_level_v4');
    const savedFingerCost = localStorage.getItem('clicker_finger_cost_v4');

    if (savedScore !== null) score = parseInt(savedScore);
    if (savedAutoClickers !== null) autoClickers = parseInt(savedAutoClickers);
    if (savedCost !== null) autoClickerCost = parseInt(savedCost);
    if (savedFingerLevel !== null) fingerLevel = parseInt(savedFingerLevel);
    if (savedFingerCost !== null) fingerCost = parseInt(savedFingerCost);

    updateUI();
}

// Speichere aktuellen Spielstand im Browser-Speicher
function saveGame() {
    localStorage.setItem('clicker_score_v4', score);
    localStorage.setItem('clicker_autoclickers_v4', autoClickers);
    localStorage.setItem('clicker_autoclicker_cost_v4', autoClickerCost);
    localStorage.setItem('clicker_finger_level_v4', fingerLevel);
    localStorage.setItem('clicker_finger_cost_v4', fingerCost);
}

// Berechnet den aktuellen Wert pro manuellem Klick (Basis 1 + 5% von PpS pro Level)
function getClickValue() {
    const pps = autoClickers; // Aktuell gibt jeder Autoklicker genau 1/s
    if (fingerLevel === 0) return 1;
    
    const bonusProzent = fingerLevel * 0.05; // 5%, 10%, 15% ...
    const berechneterWert = 1 + Math.floor(pps * bonusProzent);
    return berechneterWert;
}

// Aktualisiere die Anzeige auf der Webseite und prüft Bedingungen
function updateUI() {
    scoreDisplay.textContent = score;
    
    // Punkte pro Sekunde anzeigen (Jeder Autoklicker bringt 1 Punkt)
    const currentPps = autoClickers;
    ppsDisplay.textContent = `+${currentPps}/s`;

    // Auto-Klicker UI Updates
    autoClickerCountDisplay.textContent = autoClickers;
    autoClickerCostDisplay.textContent = autoClickerCost + " Klicks";
    buyAutoClickerBtn.disabled = score < autoClickerCost;

    // Finger Upgrade UI Updates
    fingerLevelDisplay.textContent = fingerLevel;
    fingerCostDisplay.textContent = fingerCost + " Klicks";
    buyFingerUpgradeBtn.disabled = score < fingerCost;
}

// Erstellt den schwebenden Text an der Mausposition mit dem echten Klickwert
function createFloatingText(x, y, value) {
    const floating = document.createElement('div');
    floating.className = 'floating-text';
    floating.textContent = `+${value}`;
    floating.style.left = `${x}px`;
    floating.style.top = `${y}px`;
    document.body.appendChild(floating);

    setTimeout(() => {
        floating.remove();
    }, 800);
}

// NEU: Logik für den Shop-Umschaltknopf (Öffnen / Schließen)
shopToggleBtn.addEventListener('click', () => {
    const istVersteckt = upgradesContainer.classList.contains('hidden');
    
    if (istVersteckt) {
        upgradesContainer.classList.remove('hidden');
        shopToggleBtn.textContent = '🛒 Shop schließen';
    } else {
        upgradesContainer.classList.add('hidden');
        shopToggleBtn.textContent = '🛒 Shop öffnen';
    }
});

// Funktion, die ausgeführt wird, wenn der Hauptbutton geklickt wird
clickButton.addEventListener('click', (event) => {
    const klickWert = getClickValue();
    score = score + klickWert; 
    createFloatingText(event.clientX, event.clientY, klickWert); 
    updateUI();
    saveGame();
});

// Funktion für den Kauf des Auto-Klickers
buyAutoClickerBtn.addEventListener('click', () => {
    if (score >= autoClickerCost) {
        score = score - autoClickerCost; 
        autoClickers = autoClickers + 1; 
        autoClickerCost = Math.round(autoClickerCost * 1.5); 
        
        updateUI();
        saveGame();
    }
});

// NEU: Funktion für den Kauf des Finger-Upgrades
buyFingerUpgradeBtn.addEventListener('click', () => {
    if (score >= fingerCost) {
        score = score - fingerCost;
        fingerLevel = fingerLevel + 1;
        fingerCost = Math.round(fingerCost * 1.8); // Preis steigt um 80% pro Stufe
        
        updateUI();
        saveGame();
    }
});

// Der Auto-Klicker-Takt (Führt jede Sekunde Klicks aus)
setInterval(() => {
    if (autoClickers > 0) {
        score = score + autoClickers; 
        updateUI();
        saveGame();
    }
}, 1000);

// Beim Starten/Neuladen der Seite alten Spielstand laden
loadGame();
