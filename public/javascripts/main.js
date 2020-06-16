"use strict";
// Dane quizów w formacie JSON
var quizes = new Map();
quizes.set('geometria', "{\n    \"intro\": \"Oto prosty przyk\u0142adowy test z geometrii. Zach\u0119camy do sprawdzenia si\u0119!\",\n    \"questions\": [\n      {\n        \"content\": \"Oblicz pole prostok\u0105ta o bokach 3, 10\",\n        \"answers\": [\n          \"3\",\n          \"30\",\n          \"60\",\n          \"9\"\n        ],\n        \"correct\": 2,\n        \"penalty\": 2\n      },\n      {\n        \"content\": \"Jakie jest pole kwasratu o boku 2?\",\n        \"answers\": [\n          \"1\",\n          \"2\",\n          \"3\",\n          \"4\"\n        ],\n        \"correct\": 4,\n        \"penalty\": 4\n      },\n      {\n        \"content\": \"Jaka jest odleg\u0142o\u015B\u0107 punkt\u00F3w (1,1) i (5, 4) ?\",\n        \"answers\": [\n          \"5\",\n          \"7\",\n          \"11\"\n        ],\n        \"correct\": 1,\n        \"penalty\": 10\n      },\n      {\n          \"content\": \"Jaki jest obw\u00F3d kwadratu o boku 3?\",\n          \"answers\": [\n              \"9\",\n              \"12\"\n          ],\n          \"correct\": 2,\n          \"penalty\": 9\n      }\n    ]\n  }");
quizes.set('arytmetyka', "{\n    \"intro\": \"Oto test z arytmetyki!\",\n    \"questions\": [\n      {\n        \"content\": \"Oblicz 231+331\",\n        \"answers\": [\n          \"653\",\n          \"566\",\n          \"562\",\n          \"653\"\n        ],\n        \"correct\": 3,\n        \"penalty\": 15\n      },\n      {\n        \"content\": \"Oblicz 500-342\",\n        \"answers\": [\n          \"258\",\n          \"158\",\n          \"268\",\n          \"168\"\n        ],\n        \"correct\": 2,\n        \"penalty\": 16\n      },\n      {\n        \"content\": \"Oblicz 4*4*4\",\n        \"answers\": [\n          \"64\",\n          \"16\",\n          \"128\",\n          \"54\"\n        ],\n        \"correct\": 1,\n        \"penalty\": 20\n      },\n      {\n        \"content\": \"Oblicz 15*15\",\n        \"answers\": [\n          \"225\",\n          \"200\",\n          \"250\",\n          \"325\"\n        ],\n        \"correct\": 1,\n        \"penalty\": 15\n      }\n    ]\n  }");
// Elemety strony
var buttonLeft = document.getElementById('left_button');
var buttonRight = document.getElementById('right_button');
var buttonFirst = document.getElementById('first_button');
var buttonSecond = document.getElementById('second_button');
var nav = document.getElementById('nav');
var questionField = document.getElementById('question_field');
var questionBox = document.getElementById('question');
var questionNr = document.getElementById('question_nr');
var questionCount = document.getElementById('question_count');
var penaltyNr = document.getElementById('penalty_number');
var penaltyBox = document.getElementById('penalty');
var timer = document.getElementById('time_number');
var introFiled = document.getElementById('intro_text');
var header = document.getElementById('header');
var score = document.getElementById('score_info');
var checkbox = document.getElementById('box');
var scoreNumber = document.getElementById('score');
var timeSpendedBox = document.getElementById('time_spended_box');
var timeSpendedNumber = document.getElementById('time_spended');
// Odczytywanie, który quiz ma być wczytany
var urlParams = new URLSearchParams(window.location.search);
var whichQuiz = urlParams.get('quiz');
var quizData = JSON.parse(quizes.get(whichQuiz));
// Zmienna określająca czy rozwiązywaniu już się zakończyło
var terminated = false;
// Funkcja spawia, że element jest niedozwolony
function disable(element) {
    element.style.opacity = '0.3';
    element.style.pointerEvents = 'none';
}
// Cofa działanie funkcji 'disable'
function enable(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'all';
}
// Elementy reprezentujące odpowiedzi na obecnym ekranie
var currentAnswers = new Array();
// Ładuje odpowiedź
function loadAnswer(i, question) {
    var answerContent = document.createElement('div');
    answerContent.innerHTML = question.answers[i];
    answerContent.className = 'content';
    var newAnswer = document.createElement('div');
    newAnswer.className = 'answer quiz_table';
    newAnswer.appendChild(answerContent);
    currentAnswers.push(newAnswer);
    questionBox.appendChild(newAnswer);
    newAnswer.onclick = generateAnswerOnClickFunc(newAnswer, i);
}
// Ładuje pytanie wraz z odpowiedziami
function loadQuestion(question, nr) {
    questionNr.innerHTML = nr.toString();
    penaltyNr.innerHTML = question.penalty.toString();
    questionField.innerHTML = question.content;
    var oldAnsCount = currentAnswers.length;
    for (var i = 0; i < oldAnsCount; i++) {
        questionBox.removeChild(currentAnswers.pop());
    }
    for (var i = 0; i < question.answers.length; i++) {
        loadAnswer(i, question);
    }
    colorAnswers();
    if (terminated) {
        answersBlock();
        timeSpendedNumber.innerHTML =
            (timeSpended[currentQuestion] / 100).toString();
        if (chosen[currentQuestion] === quizData.questions[currentQuestion].correct - 1) {
            penaltyBox.style.visibility = 'hidden';
        }
        else {
            penaltyBox.style.color = 'red';
            penaltyBox.style.visibility = 'visible';
        }
    }
}
// Numer obecnie wyświetlanego pytania
var currentQuestion = 0;
// Przełączanie pytań
function nextQuestion() {
    timeSpended[currentQuestion] += getTimeSpended();
    currentQuestion++;
    loadQuestion(quizData.questions[currentQuestion], currentQuestion + 1);
    if (currentQuestion === quizData.questions.length - 1) {
        disable(buttonRight);
    }
    if (currentQuestion === 1) {
        enable(buttonLeft);
    }
}
buttonRight.onclick = nextQuestion;
function prevQuestion() {
    timeSpended[currentQuestion] += getTimeSpended();
    currentQuestion--;
    loadQuestion(quizData.questions[currentQuestion], currentQuestion + 1);
    if (currentQuestion === quizData.questions.length - 2) {
        enable(buttonRight);
    }
    if (currentQuestion === 0) {
        disable(buttonLeft);
    }
}
buttonLeft.onclick = prevQuestion;
// Zapis odpowiedzi
var chosen = new Array();
var timeSpended = new Array();
var answeredCount = 0;
// Zaznacza odpowiednie odpowiedzi
function makeAnswerChosen(answerField) {
    if (chosen[currentQuestion] !== undefined) {
        var oldChosen = currentAnswers[chosen[currentQuestion]];
        oldChosen.style.backgroundColor = 'rgb(115, 115, 252)';
        oldChosen.style.pointerEvents = 'all';
    }
    if (answerField !== undefined) {
        answerField.style.backgroundColor = 'orange';
        answerField.style.pointerEvents = 'none';
    }
}
function resetTimeSpended() {
    for (var i = 0; i < quizData.questions.length; i++) {
        timeSpended[i] = 0;
    }
}
function colorAnswers() {
    makeAnswerChosen(currentAnswers[chosen[currentQuestion]]);
}
function generateAnswerOnClickFunc(answerField, answerNumber) {
    return function (event) {
        makeAnswerChosen(answerField);
        if (chosen[currentQuestion] === undefined) {
            answeredCount++;
        }
        chosen[currentQuestion] = answerNumber;
        if (answeredCount === quizData.questions.length) {
            enable(buttonFirst);
        }
    };
}
// Dostosowuje liczbę do wyświetlania
function customNumberNotation(n) {
    if (n < 10) {
        return '0' + n.toString();
    }
    else {
        return n.toString();
    }
}
// Zmienne służące mierzeniu czasu
var time = 0;
var lastMeasure = 0;
// Mierzenie czasu
function timeMeasure() {
    if (terminated) {
        timer.innerHTML = 'Koniec!';
        return;
    }
    var timeStr = customNumberNotation(Math.floor(time / 6000)) + ':'
        + customNumberNotation(Math.floor(time / 100) % 60) + ':'
        + customNumberNotation(time % 100);
    timer.innerHTML = timeStr;
    time += 1;
    setTimeout(timeMeasure, 10);
}
// Podaje czas od ostatniego wywołania tej funkcji (lub początku wykonywania kodu)
function getTimeSpended() {
    var result = time - lastMeasure;
    lastMeasure = time;
    return result;
}
// Wynik końcowy
var endScore = 0;
// Czynności po zakończeniu rozwiązywania
function endGame(event) {
    terminated = true;
    timeSpended[currentQuestion] += getTimeSpended();
    buttonFirst.innerHTML = 'Zakończ';
    buttonFirst.onclick = saveAndEnd;
    buttonSecond.style.display = 'none';
    header.innerHTML = 'Dziękujemy za rozwiązanie quizu!';
    introFiled.innerHTML = 'Poniżej są wyświetlane są Twoje wyniki. Na zielono zaznaczono poprawne odpowiedzi.';
    currentQuestion = 0;
    loadQuestion(quizData.questions[0], 1);
    disable(buttonLeft);
    if (quizData.questions.length > 1) {
        enable(buttonRight);
    }
    answersBlock();
    if (window.matchMedia("(min-width: 600px)").matches) {
        nav.style.gridTemplateRows = '100px 50px 100px auto';
    }
    else {
        score.style.height = '100px';
    }
    score.style.visibility = 'visible';
    timeSpendedBox.style.display = 'block';
    scoreCount();
}
// Liczy wyniki i wypisuje
function scoreCount() {
    for (var i = 0; i < quizData.questions.length; i++) {
        endScore += timeSpended[i];
        if (chosen[i] !== quizData.questions[i].correct - 1) {
            endScore += quizData.questions[i].penalty * 100;
        }
    }
    endScore /= 100;
    scoreNumber.innerHTML = endScore.toString();
}
buttonFirst.onclick = endGame;
// Blokuje wybieranie odpowiedzi i zaznacza prawidłowe
function answersBlock() {
    currentAnswers[quizData.questions[currentQuestion].correct - 1]
        .style.backgroundColor = 'green';
    for (var _i = 0, currentAnswers_1 = currentAnswers; _i < currentAnswers_1.length; _i++) {
        var ans = currentAnswers_1[_i];
        ans.style.pointerEvents = 'none';
    }
}
// Zapisuje wyniki i kończy grę
function saveAndEnd() {
    // Zmienn określająca ile rezultatów jest zapisanych
    // Jest zapisana w localStorage pod nazwą quizu
    var resutsCount;
    if (localStorage.getItem(whichQuiz) === null) {
        resutsCount = 1;
    }
    else {
        resutsCount = parseInt(localStorage.getItem(whichQuiz), 10);
    }
    localStorage.setItem(whichQuiz, (resutsCount + 1).toString());
    localStorage.setItem(whichQuiz + resutsCount, endScore.toString());
    if (checkbox.checked) {
        saveStats(resutsCount);
    }
    window.location.href = 'start.html';
}
// Zapisywanie statystyk
function saveStats(resutsCount) {
    for (var i = 0; i < quizData.questions.length; i++) {
        // Czas zapisujemy pod kluczem:
        // nazwa quizu + numer rezultatu + 'time' + nr pytania
        localStorage.setItem(whichQuiz + resutsCount + 'time' + (i + 1), timeSpended[i].toString());
        // Poprawność udzielonych odpowiedzi zapisujemy pod  kluczem:
        // nazwa quizu + numer rezultatu + 'answer' + nr pytania
        if (chosen[i] !== quizData.questions[i].correct - 1) {
            localStorage
                .setItem(whichQuiz + resutsCount + 'answer' + (i + 1), 'fail');
        }
        else {
            localStorage
                .setItem(whichQuiz + resutsCount + 'answer' + (i + 1), 'ok');
        }
    }
}
// Przycisk przerwania
function backToStart() {
    window.location.href = 'start.html';
}
buttonSecond.onclick = backToStart;
// Ładowanie elementów strony i rozpoczęcie działania
questionCount.innerHTML = quizData.questions.length.toString();
introFiled.innerHTML = quizData.intro;
header.innerHTML = whichQuiz;
disable(buttonFirst);
loadQuestion(quizData.questions[0], 1);
disable(buttonLeft);
if (quizData.questions.length === 1) {
    disable(buttonRight);
}
resetTimeSpended();
timeMeasure();
