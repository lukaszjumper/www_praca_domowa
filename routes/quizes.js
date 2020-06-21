"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const router = express.Router();
const parseForm = bodyParser.urlencoded({ extended: false });
router.get('/', (req, res) => {
    res.redirect('/');
});
router.get('/:quizName', (req, res) => {
    if (req.session.user === undefined) {
        res.redirect('/');
    }
    userResults(req.session.user.id, req.params.quizName, (userAns, userTimes) => {
        req.session.quiz = {};
        if (userAns.length === 0) { // Sprawdzenie czy quiz był już rozwiązywany
            loadQuiz(req.params.quizName, req.session.quiz, (quizToLoad) => {
                req.session.time = Date.now();
                res.render('main', { rawQuiz: JSON.stringify(quizToLoad) });
            });
        }
        else {
            loadQuiz(req.params.quizName, req.session.quiz, (quizToLoad) => {
                res.render('results', { rawQuiz: JSON.stringify(quizToLoad),
                    rawAns: JSON.stringify(userAns), rawTimes: JSON.stringify(userTimes) });
            });
        }
    });
});
router.post('/:quizName', parseForm, (req, res) => {
    const time = (Date.now() - req.session.time) / 1000;
    const answered = JSON.parse(req.body.answered);
    const timeStats = JSON.parse(req.body.stats);
    const timesSpended = new Array();
    for (let i = 0; i < answered.length; i++) {
        timesSpended[i] = Math.round((timeStats[i] * time + Number.EPSILON) * 100) / 100;
    }
    saveStats(answered, timesSpended, req.params.quizName, req.session.user.id, req.session.quiz);
    res.redirect('/');
});
function loadQuiz(quizName, quiz, func) {
    const db = new sqlite3.Database('data.db');
    db.all('SELECT * FROM quizes WHERE name = ?;', [quizName], (err, rows) => {
        rows.forEach((row) => {
            quiz.intro = row.intro; // Jest tylko jeden wynik
        });
        quiz.questions = new Array();
        db.all('SELECT * FROM questions WHERE quiz_name = ?;', [quizName], (err, questionRows) => {
            let loadedCount = 0;
            questionRows.forEach((row) => {
                let newQuestion = {};
                quiz.questions.push(newQuestion);
                newQuestion.content = row.content;
                newQuestion.correct = row.correct;
                newQuestion.penalty = row.penalty;
                newQuestion.answers = new Array();
                db.all('SELECT * FROM answers WHERE question_id = ?;', [row.id], (err, answerRows) => {
                    answerRows.forEach((ansRow) => {
                        newQuestion.answers.push(ansRow.content);
                    });
                    loadedCount++;
                    if (loadedCount === questionRows.length) {
                        func(quiz);
                    }
                });
            });
        });
    });
}
function saveStats(answered, times, quizName, user, quiz) {
    const db = new sqlite3.Database('data.db');
    for (let i = 0; i < answered.length; i++) {
        db.run('INSERT INTO exact_results VALUES (?, ?, ?, ?, ?);', [quizName, user, i, answered[i], times[i]]);
    }
    let finalResult = 0;
    for (let i = 0; i < answered.length; i++) {
        finalResult += times[i];
        if (answered[i] === quiz.questions[i].correct + 1) {
            finalResult += quiz.questions[i].penalty;
        }
    }
    db.run('INSERT INTO results VALUES (?, ?, ?);', [quizName, user, finalResult]);
    db.close();
}
function userResults(user, quiz, func) {
    const db = new sqlite3.Database('data.db');
    let userAns = [];
    let userTimes = [];
    db.all('SELECT * FROM exact_results WHERE quiz = ? AND user = ?;', [quiz, user], (err, rows) => {
        rows.forEach((row) => {
            userAns[row.question] = row.answered;
            userTimes[row.question] = row.time;
        });
        func(userAns, userTimes);
    });
    db.close();
}
module.exports = router;
