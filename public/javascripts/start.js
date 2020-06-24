const gameSelect = document.getElementById('game_select');
const start = document.getElementById('start');
const table = document.getElementById('best');
const emptyRow = document.getElementById('empty_row');
const buttonText = document.getElementById('start');
let statsData = {};
let currentUser = '';
// Rozpoczęcie odpowiedniego quizu
function startGame(event) {
    const startForm = document.createElement('form');
    startForm.method = 'POST';
    const quizChosen = document.createElement('input');
    quizChosen.name = 'quiz';
    quizChosen.value = gameSelect.value;
    startForm.appendChild(quizChosen);
    document.body.appendChild(startForm);
    startForm.submit();
}
start.onclick = startGame;
function parseStats(rawStats) {
    rawStats = rawStats.replace(/&quot;/gi, '"');
    statsData = JSON.parse(rawStats);
}
function runStartScreen() {
    quizSelection();
}
// Ładuje dane do tabeli wyników
function loadStats() {
    const quiz = gameSelect.value;
    const results = new Array();
    const gamers = new Array();
    for (let i of statsData) {
        if (i.quiz === quiz) {
            results.push(i.result);
            gamers.push(i.user);
        }
    }
    results.sort();
    return [results, gamers];
}
// Zpis odpowiednich wierszy tabeli wyników
let rows = new Array();
rows.push(emptyRow);
function clearTable() {
    const tableLength = rows.length;
    for (let i = 0; i < tableLength; i++) {
        rows.pop().remove();
    }
}
// Wyświetlanie tabeli wyników
function seeStats() {
    const [results, gamers] = loadStats();
    clearTable();
    if (results.length === 0) {
        const newRow = table.insertRow(1);
        rows.push(newRow);
        const ordinal = newRow.insertCell(0);
        const score = newRow.insertCell(1);
        const gamer = newRow.insertCell(2);
        ordinal.innerHTML = '-';
        score.innerHTML = '-';
        gamer.innerHTML = '-';
        return;
    }
    for (let i = 0; i < Math.min(5, results.length); i++) {
        const newRow = table.insertRow(i + 1);
        rows.push(newRow);
        const ordinal = newRow.insertCell(0);
        const score = newRow.insertCell(1);
        const gamer = newRow.insertCell(2);
        ordinal.innerHTML = (i + 1).toString() + '.';
        score.innerHTML = results[i].toString();
        gamer.innerHTML = gamers[i];
    }
}
function quizSelection() {
    seeStats();
    const quiz = gameSelect.value;
    let done = false;
    for (let i of statsData) {
        if (i.quiz === quiz && i.user === currentUser) {
            done = true;
        }
    }
    if (done === true) {
        buttonText.innerHTML = 'Wyniki';
    }
    else {
        buttonText.innerHTML = 'Zacznij!';
    }
}
gameSelect.onclick = quizSelection;
