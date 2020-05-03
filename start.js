"use strict";
var gameSelect = document.getElementById('game_select');
var start = document.getElementById('start');
var table = document.getElementById('best');
var emptyRow = document.getElementById('empty_row');
// Rozpoczęcie odpowiedniego quizu
function startGame(event) {
    window.location.href = 'quiz.html?quiz=' + gameSelect.value;
}
start.onclick = startGame;
// Ładuje dane do tabeli wyników
function loadStats() {
    var quiz = gameSelect.value;
    var resutsCount;
    if (localStorage.getItem(quiz) === null) {
        return null;
    }
    else {
        resutsCount = parseInt(localStorage.getItem(quiz), 10);
    }
    var results = new Array();
    for (var i = 1; i < resutsCount; i++) {
        results.push(parseFloat(localStorage.getItem(quiz + i)));
    }
    results.sort();
    return results;
}
// Zpis odpowiednich wierszy tabeli wyników
var rows = new Array();
rows.push(emptyRow);
function clearTable() {
    var tableLength = rows.length;
    for (var i = 0; i < tableLength; i++) {
        rows.pop().remove();
    }
}
// Wyświetlanie tabeli wyników
function seeStats() {
    var results = loadStats();
    clearTable();
    if (results === null) {
        var newRow = table.insertRow(1);
        rows.push(newRow);
        var ordinal = newRow.insertCell(0);
        var score_1 = newRow.insertCell(1);
        ordinal.innerHTML = '-';
        score_1.innerHTML = '-';
        return;
    }
    for (var i = 0; i < Math.min(10, results.length); i++) {
        var newRow = table.insertRow(i + 1);
        rows.push(newRow);
        var ordinal = newRow.insertCell(0);
        var score_2 = newRow.insertCell(1);
        ordinal.innerHTML = (i + 1).toString() + '.';
        score_2.innerHTML = results[i].toString();
    }
}
gameSelect.onclick = seeStats;
seeStats();
