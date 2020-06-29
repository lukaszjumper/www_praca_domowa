import * as sqlite3 from "sqlite3";

export class DatabaseHandler {
    static db = new sqlite3.Database('data.db');

    selectUser(login: string, func: (row) => void) {
        DatabaseHandler.db.all('SELECT * FROM users WHERE login = ?;', [login], (err, rows) => {
            rows.forEach((row) => {
                func(row);
            });
        });
    }

    replacePass(login: string, hash: string, func: () => void)  {
        DatabaseHandler.db.run('REPLACE INTO users VALUES (?, ?);', [login, hash], () => {
            func();
        });
    }

    selectQuiz(quizName: string, rowFunc: (row) => void, after: () => void) {
        DatabaseHandler.db.all('SELECT * FROM quizes WHERE name = ?;', [quizName], (err, rows) => {
            rows.forEach((row) => {
                rowFunc(row);
            });
            after();
        });
    }

    selectQuestions(quizName: string, rowFunc: (row, rowsCount) => void) {
        DatabaseHandler.db.all('SELECT * FROM questions WHERE quiz_name = ?;', [quizName], (err, questionRows) => {
            questionRows.forEach((row) => {
                rowFunc(row, questionRows.length);
            });
        });
    }

    selectAnswers(rowId, rowFunc: (row) => void, after: () => void) {
        DatabaseHandler.db.all('SELECT * FROM answers WHERE question_id = ?;', [rowId], (err, answerRows) => {
            answerRows.forEach((row) => {
                rowFunc(row);
            });
            after();
        });
    }

    insertStats(quizName: string, user: string, i: number, answered: number, times: number) {
        DatabaseHandler.db.run('INSERT INTO exact_results VALUES (?, ?, ?, ?, ?);', [quizName, user, i, answered, times]);
    }

    insertGeneralStats(quizName: string, user: string, finalResult: number) {
        DatabaseHandler.db.run('INSERT INTO results VALUES (?, ?, ?);', [quizName, user, finalResult]);
    }

    selectStats(quiz: string, user: string, rowFunc: (row) => void, after: () => void) {
        DatabaseHandler.db.all('SELECT * FROM exact_results WHERE quiz = ? AND user = ?;', [quiz, user], (err, rows) => {
            rows.forEach((row) => {
                rowFunc(row);
            });
            after();
        });
    }

    selectQuizStats(quiz: string, rowFunc: (row) => void, after: () => void) {
        DatabaseHandler.db.all('SELECT question, avg(time) AS avg FROM exact_results WHERE quiz = ? GROUP BY question;',
                                 [quiz], (err, rows) => {
            rows.forEach((row) => {
                rowFunc(row);
            });
            after();
        });
    }

    selectResults(rowFunc: (row) => void, after: () => void) {
        DatabaseHandler.db.all('SELECT * FROM results;', [], (err, rows) => {
            rows.forEach((row) => {
                rowFunc(row);
            });
            after();
        });
    }
 }
