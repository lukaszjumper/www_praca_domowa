// Nowe typy danych
interface Question {
    content: string;
    answers: string[];
    correct: number;
    penalty: number;
}

interface Quiz {
    intro: string;
    questions: Question[];
}

// Dane quizów w formacie JSON
let quizes = new Map<string, string>();

quizes.set('geometria', `{
    "intro": "Oto prosty przykładowy test z geometrii. Zachęcamy do sprawdzenia się!",
    "questions": [
      {
        "content": "Oblicz pole prostokąta o bokach 3, 10",
        "answers": [
          "3",
          "30",
          "60",
          "9"
        ],
        "correct": 2,
        "penalty": 2
      },
      {
        "content": "Jakie jest pole kwasratu o boku 2?",
        "answers": [
          "1",
          "2",
          "3",
          "4"
        ],
        "correct": 4,
        "penalty": 4
      },
      {
        "content": "Jaka jest odległość punktów (1,1) i (5, 4) ?",
        "answers": [
          "5",
          "7",
          "11"
        ],
        "correct": 1,
        "penalty": 10
      },
      {
          "content": "Jaki jest obwód kwadratu o boku 3?",
          "answers": [
              "9",
              "12"
          ],
          "correct": 2,
          "penalty": 9
      }
    ]
  }`);

  quizes.set('arytmetyka', `{
    "intro": "Oto test z arytmetyki!",
    "questions": [
      {
        "content": "Oblicz 231+331",
        "answers": [
          "653",
          "566",
          "562",
          "653"
        ],
        "correct": 3,
        "penalty": 15
      },
      {
        "content": "Oblicz 500-342",
        "answers": [
          "258",
          "158",
          "268",
          "168"
        ],
        "correct": 2,
        "penalty": 16
      },
      {
        "content": "Oblicz 4*4*4",
        "answers": [
          "64",
          "16",
          "128",
          "54"
        ],
        "correct": 1,
        "penalty": 20
      },
      {
        "content": "Oblicz 15*15",
        "answers": [
          "225",
          "200",
          "250",
          "325"
        ],
        "correct": 1,
        "penalty": 15
      }
    ]
  }`);

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
const checkbox = document.getElementById('box') as HTMLInputElement;
const scoreNumber = document.getElementById('score');
const timeSpendedBox = document.getElementById('time_spended_box');
const timeSpendedNumber = document.getElementById('time_spended');

// Odczytywanie, który quiz ma być wczytany
const urlParams = new URLSearchParams(window.location.search);
const whichQuiz = urlParams.get('quiz');

let quizData = JSON.parse(quizes.get(whichQuiz)) as Quiz;

// Zmienna określająca czy rozwiązywaniu już się zakończyło
let terminated = false;

// Funkcja spawia, że element jest niedozwolony
function disable(element: HTMLElement) {
    element.style.opacity = '0.3';
    element.style.pointerEvents = 'none';
}

// Cofa działanie funkcji 'disable'
function enable(element: HTMLElement) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'all';
}

// Elementy reprezentujące odpowiedzi na obecnym ekranie
let currentAnswers = new Array<HTMLElement>();

// Ładuje odpowiedź
function loadAnswer(i: number, question: Question) {
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
function loadQuestion(question: Question, nr: number) {
    questionNr.innerHTML = nr.toString();
    penaltyNr.innerHTML = question.penalty.toString();
    questionField.innerHTML = question.content;

    const oldAnsCount = currentAnswers.length;
    for (let i=0; i<oldAnsCount; i++) {
        questionBox.removeChild(currentAnswers.pop());
    }

    for (let i=0; i<question.answers.length; i++) {
        loadAnswer(i, question);
    }

    colorAnswers();
    if (terminated) {
        answersBlock();
        timeSpendedNumber.innerHTML =
            (timeSpended[currentQuestion] / 100).toString();

        if (chosen[currentQuestion] === quizData.questions[currentQuestion].correct-1) {
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
    loadQuestion(quizData.questions[currentQuestion], currentQuestion+1);

    if (currentQuestion === quizData.questions.length-1) {
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
    loadQuestion(quizData.questions[currentQuestion], currentQuestion+1);

    if (currentQuestion === quizData.questions.length-2) {
        enable(buttonRight);
    }
    if (currentQuestion === 0) {
        disable(buttonLeft);
    }
}

buttonLeft.onclick = prevQuestion;

// Zapis odpowiedzi
let chosen = new Array<number>();
let timeSpended = new Array<number>();
let answeredCount = 0;

// Zaznacza odpowiednie odpowiedzi
function makeAnswerChosen(answerField: HTMLElement) {
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

function generateAnswerOnClickFunc(answerField: HTMLElement, answerNumber: number) {
    return (event: Event) => {
        makeAnswerChosen(answerField);
        if (chosen[currentQuestion] === undefined) {
            answeredCount++;
        }
        chosen[currentQuestion] = answerNumber;

        if (answeredCount === quizData.questions.length) {
            enable(buttonFirst);
        }
    }
}

// Dostosowuje liczbę do wyświetlania
function customNumberNotation(n: number) : string {
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

// Mierzenie czasu
function timeMeasure() {
    if (terminated) {
        timer.innerHTML = 'Koniec!';
        return;
    }
    const timeStr = customNumberNotation(Math.floor(time / 6000)) + ':'
                  + customNumberNotation(Math.floor(time/100) % 60) + ':'
                  + customNumberNotation(time % 100);
    timer.innerHTML = timeStr;

    time += 1;
    setTimeout(timeMeasure, 10);
}

// Podaje czas od ostatniego wywołania tej funkcji (lub początku wykonywania kodu)
function getTimeSpended(): number {
    const result = time - lastMeasure;
    lastMeasure = time;
    return result;
}

// Wynik końcowy
let endScore = 0;

// Czynności po zakończeniu rozwiązywania
function endGame(event: Event) {
    terminated = true;
    timeSpended[currentQuestion] += getTimeSpended();

    buttonFirst.innerHTML = 'Zakończ';
    buttonFirst.onclick = saveAndEnd;
    buttonSecond.style.display = 'none';
    header.innerHTML = 'Dziękujemy za rozwiązanie quizu!';
    introFiled.innerHTML = 'Poniżej są wyświetlane są Twoje wyniki. Na zielono zaznaczono poprawne odpowiedzi.'

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
    for (let i=0; i<quizData.questions.length; i++) {
        endScore += timeSpended[i];
        if (chosen[i] !== quizData.questions[i].correct-1) {
            endScore += quizData.questions[i].penalty * 100;
        }
    }

    endScore /= 100;
    scoreNumber.innerHTML = endScore.toString();
}

buttonFirst.onclick = endGame;

// Blokuje wybieranie odpowiedzi i zaznacza prawidłowe
function answersBlock() {
    currentAnswers[quizData.questions[currentQuestion].correct-1]
    .style.backgroundColor = 'green';

    for (const ans of currentAnswers) {
        ans.style.pointerEvents = 'none';
    }
}

// Zapisuje wyniki i kończy grę
function saveAndEnd() {
    // Zmienn określająca ile rezultatów jest zapisanych
    // Jest zapisana w localStorage pod nazwą quizu
    let resutsCount: number;

    if (localStorage.getItem(whichQuiz) === null) {
        resutsCount = 1;
    }
    else {
        resutsCount = parseInt(localStorage.getItem(whichQuiz), 10);
    }

    localStorage.setItem(whichQuiz, (resutsCount+1).toString());
    localStorage.setItem(whichQuiz + resutsCount, endScore.toString());


    if (checkbox.checked) {
        saveStats(resutsCount);
    }
    window.location.href = 'start.html';
}

// Zapisywanie statystyk
function saveStats(resutsCount: number) {
    for (let i=0; i<quizData.questions.length; i++) {
        // Czas zapisujemy pod kluczem:
        // nazwa quizu + numer rezultatu + 'time' + nr pytania
        localStorage.setItem(whichQuiz + resutsCount + 'time' + (i+1),
                             timeSpended[i].toString());

        // Poprawność udzielonych odpowiedzi zapisujemy pod  kluczem:
        // nazwa quizu + numer rezultatu + 'answer' + nr pytania
        if (chosen[i] !== quizData.questions[i].correct-1) {
            localStorage
            .setItem(whichQuiz + resutsCount + 'answer' + (i+1), 'fail');
        }
        else {
            localStorage
            .setItem(whichQuiz + resutsCount + 'answer' + (i+1), 'ok');
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