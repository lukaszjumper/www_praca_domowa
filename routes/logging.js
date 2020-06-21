"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const csrf = require("csurf");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const router = express.Router();
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });
router.get('/signin', csrfProtection, (req, res) => {
    res.render('login', { csrfToken: req.csrfToken() });
});
router.post('/signin', parseForm, csrfProtection, (req, res) => {
    check(req.body.id, req.body.password, (ok) => {
        if (ok) {
            req.session.user = { id: req.body.id };
            res.redirect('/');
        }
        else {
            res.render('login', { message: "Nieprawidłowe hasło lub login!", csrfToken: req.csrfToken() });
        }
    });
});
router.get('/logout', csrfProtection, (req, res) => {
    req.session.destroy(() => {
        console.log('logged out');
    });
    res.redirect('/logging/signin');
});
router.get('/change', csrfProtection, (req, res) => {
    res.render('change', { csrfToken: req.csrfToken() });
});
router.post('/change', parseForm, csrfProtection, (req, res) => {
    check(req.body.id, req.body.oldpass, (ok) => {
        if (ok) {
            changePassword(req.body.id, req.body.newpass, () => {
                res.redirect('/');
            });
        }
        else {
            res.render('change', { message: "Nieprawidłowe stare hasło lub login!", csrfToken: req.csrfToken() });
        }
    });
});
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
function changePassword(login, newPassword, func) {
    const db = new sqlite3.Database('data.db');
    db.run('INSERT INTO users VALUES (?, ?);', [login, newPassword], () => {
        func();
    });
}
module.exports = router;
