"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const router = express.Router();
const parseForm = bodyParser.urlencoded({ extended: false });
router.get('/', (req, res) => {
    if (req.session.user === undefined) {
        res.redirect('/logging/signin');
    }
    else {
        getStats((stats) => {
            res.render('start', { rawStats: JSON.stringify(stats), user: req.session.user.id });
        });
    }
});
router.post('/', parseForm, (req, res) => {
    res.redirect('/quizes/' + req.body.quiz);
});
function getStats(func) {
    const db = new sqlite3.Database('data.db');
    db.all('SELECT * FROM results;', [], (err, rows) => {
        let stats = new Array();
        rows.forEach((row) => {
            let stat = {};
            stat.quiz = row.quiz;
            stat.result = row.result;
            stat.user = row.user;
            stats.push(stat);
        });
        func(stats);
    });
}
module.exports = router;
