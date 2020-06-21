"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3");
function create() {
    sqlite3.verbose();
    const db = new sqlite3.Database('data.db');
    db.run('CREATE TABLE quizes (name TEXT, intro TEXT);', [], () => {
        db.run('INSERT INTO quizes VALUES ("geometria", "Oto prosty przykładowy test z geometrii. Zachęcamy do sprawdzenia się!");');
        db.run('INSERT INTO quizes VALUES ("arytmetyka", "Oto test z arytmetyki!");');
    });
    db.run('CREATE TABLE questions (id INTEGER PRIMARY KEY, quiz_name TEXT, content TEXT, correct INTEGER, penalty INTEGER);', [], () => {
        db.run('INSERT INTO questions VALUES (0, "geometria", "Oblicz pole prostokąta o bokach 3, 10", 2, 2);');
        db.run('INSERT INTO questions VALUES (1, "geometria", "Jakie jest pole kwasratu o boku 2?", 4, 4);');
        db.run('INSERT INTO questions VALUES (2, "geometria", "Jaka jest odległość punktów (1,1) i (5, 4) ?", 1, 10);');
        db.run('INSERT INTO questions VALUES (3, "geometria", "Jaki jest obwód kwadratu o boku 3?", 2, 9);');
        db.run('INSERT INTO questions VALUES (4, "arytmetyka", "Oblicz 231+331", 3, 15);');
        db.run('INSERT INTO questions VALUES (5, "arytmetyka", "Oblicz 500-342", 2, 16);');
        db.run('INSERT INTO questions VALUES (6, "arytmetyka", "Oblicz 4*4*4", 1, 20);');
        db.run('INSERT INTO questions VALUES (7, "arytmetyka", "Oblicz 15*15", 1, 15);');
    });
    db.run('CREATE TABLE answers (ans_order INTEGER, question_id INTEGER, content TEXT);', [], () => {
        db.run('INSERT INTO answers VALUES (1, 0, "3");');
        db.run('INSERT INTO answers VALUES (2, 0, "30");');
        db.run('INSERT INTO answers VALUES (3, 0, "60");');
        db.run('INSERT INTO answers VALUES (4, 0, "9");');
        db.run('INSERT INTO answers VALUES (1, 1, "1");');
        db.run('INSERT INTO answers VALUES (2, 1, "2");');
        db.run('INSERT INTO answers VALUES (3, 1, "3");');
        db.run('INSERT INTO answers VALUES (4, 1, "4");');
        db.run('INSERT INTO answers VALUES (1, 2, "5");');
        db.run('INSERT INTO answers VALUES (2, 2, "7");');
        db.run('INSERT INTO answers VALUES (3, 2, "11");');
        db.run('INSERT INTO answers VALUES (1, 3, "9");');
        db.run('INSERT INTO answers VALUES (2, 3, "12");');
        db.run('INSERT INTO answers VALUES (1, 4, "653");');
        db.run('INSERT INTO answers VALUES (2, 4, "566");');
        db.run('INSERT INTO answers VALUES (3, 4, "562");');
        db.run('INSERT INTO answers VALUES (4, 4, "653");');
        db.run('INSERT INTO answers VALUES (1, 5, "258");');
        db.run('INSERT INTO answers VALUES (2, 5, "158");');
        db.run('INSERT INTO answers VALUES (3, 5, "268");');
        db.run('INSERT INTO answers VALUES (4, 5, "168");');
        db.run('INSERT INTO answers VALUES (1, 6, "64");');
        db.run('INSERT INTO answers VALUES (2, 6, "16");');
        db.run('INSERT INTO answers VALUES (3, 6, "128");');
        db.run('INSERT INTO answers VALUES (4, 6, "54");');
        db.run('INSERT INTO answers VALUES (1, 7, "225");');
        db.run('INSERT INTO answers VALUES (2, 7, "200");');
        db.run('INSERT INTO answers VALUES (3, 7, "250");');
        db.run('INSERT INTO answers VALUES (4, 7, "325");');
    });
    db.run('CREATE TABLE users (login TEXT, password TEXT);', [], () => {
        db.run('INSERT INTO users VALUES ("user1", "user1");');
        db.run('INSERT INTO users VALUES ("user2", "user2");');
    });
    db.run('CREATE TABLE results (quiz TEXT, user TEXT, result REAL);');
    db.run('CREATE TABLE exact_results (quiz TEXT, user TEXT, question INTEGER, answered INTEGER, time REAL);');
    db.close();
}
create();
