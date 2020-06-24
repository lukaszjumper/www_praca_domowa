// Elemety strony
const buttonLeft = document.getElementById('left_button');
const buttonRight = document.getElementById('right_button');
const buttonFirst = document.getElementById('first_button');
const buttonSecond = document.getElementById('second_button');
const nav = document.getElementById('nav');
const questionField = document.getElementById('question_field');
const questionBox = document.getElementById('question');
const questionNr = document.getElementById('question_nr');
const questionCount = document.getElementById('question_count');
const penaltyNr = document.getElementById('penalty_number');
const penaltyBox = document.getElementById('penalty');
const timer = document.getElementById('time_number');
const introFiled = document.getElementById('intro_text');
const header = document.getElementById('header');
const score = document.getElementById('score_info');
const scoreNumber = document.getElementById('score');
const timeSpendedBox = document.getElementById('time_spended_box');
const timeSpendedNumber = document.getElementById('time_spended');
const avgsNumer = document.getElementById('avg_time');
let quizData = {};
let avgs = [];
function parseQuiz(rawQuiz) {
    rawQuiz = rawQuiz.replace(/&quot;/gi, '"');
    quizData = JSON.parse(rawQuiz);
}
function parseTables(rawAns, rawTimes, rawAvgs) {
    rawAns = rawAns.replace(/&quot;/gi, '"');
    chosen = JSON.parse(rawAns);
    rawTimes = rawTimes.replace(/&quot;/gi, '"');
    timeSpended = JSON.parse(rawTimes);
    rawAvgs = rawAvgs.replace(/&quot;/gi, '"');
    avgs = JSON.parse(rawAvgs);
}
// Zmienna określająca czy rozwiązywaniu już się zakończyło
let terminated = false;
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
let currentAnswers = new Array();
// Ładuje odpowiedź
function loadAnswer(i, question) {
    const answerContent = document.createElement('div');
    answerContent.innerHTML = question.answers[i];
    answerContent.className = 'content';
    const newAnswer = document.createElement('div');
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
    const oldAnsCount = currentAnswers.length;
    for (let i = 0; i < oldAnsCount; i++) {
        questionBox.removeChild(currentAnswers.pop());
    }
    for (let i = 0; i < question.answers.length; i++) {
        loadAnswer(i, question);
    }
    colorAnswers();
    if (terminated) {
        answersBlock();
        timeSpendedNumber.innerHTML =
            timeSpended[currentQuestion].toString();
        avgsNumer.innerHTML = avgs[nr - 1].toString();
        timeSpendedBox.style.display = 'block';
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
let currentQuestion = 0;
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
let chosen = new Array();
let timeSpended = new Array();
let answeredCount = 0;
// Zaznacza odpowiednie odpowiedzi
function makeAnswerChosen(answerField) {
    if (chosen[currentQuestion] !== undefined) {
        const oldChosen = currentAnswers[chosen[currentQuestion]];
        oldChosen.style.backgroundColor = 'rgb(115, 115, 252)';
        oldChosen.style.pointerEvents = 'all';
    }
    if (answerField !== undefined) {
        answerField.style.backgroundColor = 'orange';
        answerField.style.pointerEvents = 'none';
    }
}
function resetTimeSpended() {
    for (let i = 0; i < quizData.questions.length; i++) {
        timeSpended[i] = 0;
    }
}
function colorAnswers() {
    makeAnswerChosen(currentAnswers[chosen[currentQuestion]]);
}
function generateAnswerOnClickFunc(answerField, answerNumber) {
    return (event) => {
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
let time = 0;
let lastMeasure = 0;
let timeStats = new Array();
// Mierzenie czasu
function timeMeasure() {
    if (terminated) {
        timer.innerHTML = 'Koniec!';
        return;
    }
    const timeStr = customNumberNotation(Math.floor(time / 6000)) + ':'
        + customNumberNotation(Math.floor(time / 100) % 60) + ':'
        + customNumberNotation(time % 100);
    timer.innerHTML = timeStr;
    time += 1;
    setTimeout(timeMeasure, 10);
}
// Podaje czas od ostatniego wywołania tej funkcji (lub początku wykonywania kodu)
function getTimeSpended() {
    const result = time - lastMeasure;
    lastMeasure = time;
    return result;
}
// Czynności po zakończeniu rozwiązywania
function endGame(event) {
    terminated = true;
    timeSpended[currentQuestion] += getTimeSpended();
    calcStats();
    sendToServer();
}
// Liczy czas procentowo
function calcStats() {
    for (let i = 0; i < quizData.questions.length; i++) {
        timeStats[i] = timeSpended[i] / time;
    }
}
function sendToServer() {
    const ansForm = document.createElement('form');
    ansForm.method = 'POST';
    const ansInput = document.createElement('input');
    ansInput.name = 'answered';
    ansInput.value = JSON.stringify(chosen);
    ansForm.appendChild(ansInput);
    const statsInput = document.createElement('input');
    statsInput.name = 'stats';
    statsInput.value = JSON.stringify(timeStats);
    ansForm.appendChild(statsInput);
    document.body.appendChild(ansForm);
    ansForm.submit();
}
// Blokuje wybieranie odpowiedzi i zaznacza prawidłowe
function answersBlock() {
    currentAnswers[quizData.questions[currentQuestion].correct - 1]
        .style.backgroundColor = 'green';
    for (const ans of currentAnswers) {
        ans.style.pointerEvents = 'none';
    }
}
function run() {
    loadQuestion(quizData.questions[0], 1);
    resetTimeSpended();
    timeMeasure();
    if (quizData.questions.length === 1) {
        disable(buttonRight);
    }
    // Ładowanie elementów strony i rozpoczęcie działania
    questionCount.innerHTML = quizData.questions.length.toString();
    introFiled.innerHTML = quizData.intro;
    buttonFirst.onclick = endGame;
    buttonSecond.onclick = backToStart;
    disable(buttonFirst);
}
// Przycisk przerwania
function backToStart() {
    window.location.href = '/';
}
// Wyświetlanie wyników
function resultsCustom() {
    terminated = true;
    currentQuestion = 0;
    loadQuestion(quizData.questions[0], 1);
    disable(buttonLeft);
    questionCount.innerHTML = quizData.questions.length.toString();
    if (quizData.questions.length > 1) {
        enable(buttonRight);
    }
    if (quizData.questions.length === 1) {
        disable(buttonRight);
    }
    answersBlock();
    buttonSecond.onclick = backToStart;
}
disable(buttonLeft);
