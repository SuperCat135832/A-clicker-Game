// Variablen für das Spiel
let score = 0;

// Elemente aus der HTML-Datei heraussuchen
const scoreDisplay = document.getElementById('score');
const clickButton = document.getElementById('clickBtn');

// Funktion, die ausgeführt wird, wenn der Button geklickt wird
clickButton.addEventListener('click', () => {
    score = score + 1; // Erhöhe die Punkte um 1
    scoreDisplay.textContent = score; // Aktualisiere die Zahl auf der Webseite
});
