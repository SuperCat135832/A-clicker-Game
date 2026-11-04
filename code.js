// Variablen für das Spiel
let score = 0;
let autoClickers = 0;
let autoClickerCost = 15;

// Elemente aus der HTML-Datei heraussuchen
const scoreDisplay = document.getElementById('score');
const clickButton = document.getElementById('clickBtn');
const buyAutoClickerBtn = document.getElementById('buyAutoClicker');
const autoClickerCountDisplay = document.getElementById('autoclicker-count');
const autoClickerCostDisplay = document.getElementById('autoclicker-cost');

// Lade gespeicherten Spielstand aus dem Browser-Speicher
function loadGame() {
    const savedScore = localStorage.getItem('clicker_score');
    const savedAutoClickers = localStorage.getItem('clicker_autoclickers');
    const savedCost = localStorage.getItem('clicker_autoclicker_cost');

    if (savedScore !== null) score = parseInt(savedScore);
    if (savedAutoClickers !== null) autoClickers = parseInt(savedAutoClickers);
    if (savedCost !== null) autoClickerCost = parseInt(savedCost);

    updateUI();
}

// Speichere aktuellen Spielstand im Browser-Speicher
function saveGame() {
    localStorage.setItem('clicker_score', score);
    localStorage.setItem('clicker_autoclickers', autoClickers);
    localStorage.setItem('clicker_autoclicker_cost', autoClickerCost);
}

// Aktualisiere die Anzeige auf der Webseite und prüft Bedingungen
function updateUI() {
    scoreDisplay.textContent = score;
    autoClickerCountDisplay.textContent = autoClickers;
    autoClickerCostDisplay.textContent = autoClickerCost + " Klicks";

    // Deaktiviere den Kauf-Button, wenn man zu wenige Klicks hat
    buyAutoClickerBtn.disabled = score < autoClickerCost;
}

// Erstellt den schwebenden "+1" Text an der Mausposition
function createFloatingText(x, y) {
    const floating = document.createElement('div');
    floating.className = 'floating-text';
    floating.textContent = '+1';
    floating.style.left = `${x}px`;
    floating.style.top = `${y}px`;
    document.body.appendChild(floating);

    // Entfernt das Element nach der Animation aus dem HTML-Code
    setTimeout(() => {
        floating.remove();
    }, 800);
}

// Funktion, die ausgeführt wird, wenn der Hauptbutton geklickt wird
clickButton.addEventListener('click', (event) => {
    score = score + 1; // Erhöhe die Punkte um 1
    createFloatingText(event.clientX, event.clientY); // Zeige Effekt an Mausposition
    updateUI();
    saveGame();
});

// Funktion für den Kauf des Auto-Klickers
buyAutoClickerBtn.addEventListener('click', () => {
    if (score >= autoClickerCost) {
        score = score - autoClickerCost; // Ziehe Kosten ab
        autoClickers = autoClickers + 1; // Erhöhe Anzahl der Auto-Klicker
        autoClickerCost = Math.round(autoClickerCost * 1.5); // Erhöhe Preis für den nächsten um 50%
        
        updateUI();
        saveGame();
    }
});

// Der Auto-Klicker-Takt (Führt jede Sekunde [1000ms] Klicks im Hintergrund aus)
setInterval(() => {
    if (autoClickers > 0) {
        score = score + autoClickers; // Füge Punkte hinzu (1 pro Sekunde je Auto-Klicker)
        updateUI();
        saveGame();
    }
}, 1000);

// Beim Starten/Neuladen der Seite alten Spielstand laden
loadGame();
