"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifAuth = exports.changePassword = exports.check = void 0;
const sqlite3 = require("sqlite3");
function check(login, password, func) {
    const db = new sqlite3.Database('data.db');
    db.all('SELECT * FROM users WHERE login = ? AND password = ?;', [login, password], (err, rows) => {
        let exists = false;
        rows.forEach(row => {
            exists = true;
        });
        func(exists);
    });
}
exports.check = check;
function changePassword(login, newPassword, func) {
    const db = new sqlite3.Database('data.db');
    db.run('REPLACE INTO users VALUES (?, ?);', [login, newPassword], () => {
        func();
    });
}
exports.changePassword = changePassword;
function ifAuth(session, func) {
    if (session.user === undefined) {
        func(false);
    }
    else {
        check(session.user.id, session.user.password, (ok) => {
            if (ok) {
                func(true);
            }
            else {
                func(false);
            }
        });
    }
}
exports.ifAuth = ifAuth;
