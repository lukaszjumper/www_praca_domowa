const gameSelect = document.getElementById('game_select') as HTMLSelectElement;
const start = document.getElementById('start');
const table = document.getElementById('best') as HTMLTableElement;
const emptyRow = document.getElementById('empty_row') as HTMLTableRowElement;

// Rozpoczęcie odpowiedniego quizu
function startGame(event: Event) {
    window.location.href = 'quiz.html?quiz=' + gameSelect.value;
}

start.onclick = startGame;

// Ładuje dane do tabeli wyników
function loadStats(): number[] {
    const quiz = gameSelect.value;
    let resutsCount: number;

    if (localStorage.getItem(quiz) === null) {
        return null;
    }
    else {
        resutsCount = parseInt(localStorage.getItem(quiz), 10);
    }

    const results =  new Array<number>();

    for (let i = 1; i < resutsCount; i++) {
        results.push(parseFloat(localStorage.getItem(quiz + i)));
    }

    results.sort();
    return results;
}

// Zpis odpowiednich wierszy tabeli wyników
let rows = new Array<HTMLTableRowElement>();
rows.push(emptyRow);

function clearTable() {
    const tableLength = rows.length;
    for(let i=0; i<tableLength; i++) {
        rows.pop().remove();
    }
}

// Wyświetlanie tabeli wyników
function seeStats() {
    const results = loadStats();
    clearTable();

    if (results === null) {
        const newRow = table.insertRow(1);
        rows.push(newRow);

        const ordinal = newRow.insertCell(0);
        const score = newRow.insertCell(1);

        ordinal.innerHTML = '-';
        score.innerHTML = '-';

        return;
    }

    for (let i = 0; i < Math.min(10, results.length); i++) {
        const newRow = table.insertRow(i+1);
        rows.push(newRow);

        const ordinal = newRow.insertCell(0);
        const score = newRow.insertCell(1);

        ordinal.innerHTML = (i+1).toString() + '.';
        score.innerHTML = results[i].toString();
    }
}

gameSelect.onclick = seeStats;
seeStats();

