"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.ifAuth = exports.changePassword = exports.check = void 0;
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
function check(login, password, func) {
    const db = new sqlite3.Database('data.db');
    db.all('SELECT * FROM users WHERE login = ?;', [login], (err, rows) => {
        rows.forEach((row) => {
            bcrypt.compare(password, row.password, (err, result) => {
                func(result);
            });
        });
    });
}
exports.check = check;
function changePassword(login, newPassword, func) {
    const db = new sqlite3.Database('data.db');
    hashPassword(newPassword, (hash) => {
        db.run('REPLACE INTO users VALUES (?, ?);', [login, hash], () => {
            func();
        });
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
function hashPassword(password, func) {
    bcrypt.hash(password, 10, (err, hash) => {
        func(hash);
    });
}
exports.hashPassword = hashPassword;
