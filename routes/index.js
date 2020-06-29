"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const auth_1 = require("../public/javascripts/auth");
const DatabaseHandler_1 = require("../public/javascripts/DatabaseHandler");
const dbHandler = new DatabaseHandler_1.DatabaseHandler();
const router = express.Router();
const parseForm = bodyParser.urlencoded({ extended: false });
router.get('/', (req, res) => {
    auth_1.ifAuth(req.session, (ok) => {
        if (ok) {
            getStats((stats) => {
                res.render('start', { rawStats: JSON.stringify(stats), user: req.session.user.id });
            });
        }
        else {
            res.redirect('/logging/signin');
        }
    });
});
router.post('/', parseForm, (req, res) => {
    auth_1.ifAuth(req.session, (ok) => {
        if (ok) {
            res.redirect('/quizes/' + req.body.quiz);
        }
        else {
            res.redirect('/logging/signin');
        }
    });
});
function getStats(func) {
    let stats = new Array();
    dbHandler.selectResults((row) => {
        let stat = {};
        stat.quiz = row.quiz;
        stat.result = row.result;
        stat.user = row.user;
        stats.push(stat);
    }, () => {
        func(stats);
    });
}
module.exports = router;
