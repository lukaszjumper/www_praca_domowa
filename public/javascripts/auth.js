"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.ifAuth = exports.changePassword = exports.check = void 0;
const bcrypt = require("bcrypt");
const DatabaseHandler_1 = require("./DatabaseHandler");
const dbHandler = new DatabaseHandler_1.DatabaseHandler();
function check(login, password, func) {
    dbHandler.selectUser(login, (row) => {
        bcrypt.compare(password, row.password, (err, result) => {
            func(result);
        });
    });
}
exports.check = check;
function changePassword(login, newPassword, func) {
    hashPassword(newPassword, (hash) => {
        dbHandler.replacePass(login, hash, func);
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
