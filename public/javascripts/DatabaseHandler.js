"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseHandler = void 0;
const sqlite3 = require("sqlite3");
class DatabaseHandler {
    selectUser(login, func) {
        DatabaseHandler.db.all('SELECT * FROM users WHERE login = ?;', [login], (err, rows) => {
            rows.forEach((row) => {
                func(row);
            });
        });
    }
    replacePass(login, hash, func) {
        DatabaseHandler.db.run('REPLACE INTO users VALUES (?, ?);', [login, hash], () => {
            func();
        });
    }
    selectQuiz(quizName, rowFunc, after) {
        DatabaseHandler.db.all('SELECT * FROM quizes WHERE name = ?;', [quizName], (err, rows) => {
            rows.forEach((row) => {
                rowFunc(row);
            });
            after();
        });
    }
    selectQuestions(quizName, rowFunc) {
        DatabaseHandler.db.all('SELECT * FROM questions WHERE quiz_name = ?;', [quizName], (err, questionRows) => {
            questionRows.forEach((row) => {
                rowFunc(row, questionRows.length);
            });
        });
    }
    selectAnswers(rowId, rowFunc, after) {
        DatabaseHandler.db.all('SELECT * FROM answers WHERE question_id = ?;', [rowId], (err, answerRows) => {
            answerRows.forEach((row) => {
                rowFunc(row);
            });
            after();
        });
    }
    insertStats(quizName, user, i, answered, times) {
        DatabaseHandler.db.run('INSERT INTO exact_results VALUES (?, ?, ?, ?, ?);', [quizName, user, i, answered, times]);
    }
    insertGeneralStats(quizName, user, finalResult) {
        DatabaseHandler.db.run('INSERT INTO results VALUES (?, ?, ?);', [quizName, user, finalResult]);
    }
    selectStats(quiz, user, rowFunc, after) {
        DatabaseHandler.db.all('SELECT * FROM exact_results WHERE quiz = ? AND user = ?;', [quiz, user], (err, rows) => {
            rows.forEach((row) => {
                rowFunc(row);
            });
            after();
        });
    }
    selectQuizStats(quiz, rowFunc, after) {
        DatabaseHandler.db.all('SELECT question, avg(time) AS avg FROM exact_results WHERE quiz = ? GROUP BY question;', [quiz], (err, rows) => {
            rows.forEach((row) => {
                rowFunc(row);
            });
            after();
        });
    }
    selectResults(rowFunc, after) {
        DatabaseHandler.db.all('SELECT * FROM results;', [], (err, rows) => {
            rows.forEach((row) => {
                rowFunc(row);
            });
            after();
        });
    }
}
exports.DatabaseHandler = DatabaseHandler;
DatabaseHandler.db = new sqlite3.Database('data.db');
