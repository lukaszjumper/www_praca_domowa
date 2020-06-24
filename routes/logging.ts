import * as express from "express";
import * as csrf from "csurf";
import * as bodyParser from "body-parser";
import {check, changePassword} from "../public/javascripts/auth";

const router = express.Router();
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });

router.get('/signin', csrfProtection, (req, res) => {
    res.render('login', {csrfToken: req.csrfToken()});
});

router.post('/signin', parseForm, csrfProtection, (req, res) => {
    check(req.body.id, req.body.password, (ok) => {
        if(ok) {
            req.session.user = {id: req.body.id, password: req.body.password};
            res.redirect('/');
        }
        else {
            res.render('login', {message: "Nieprawidłowe hasło lub login!", csrfToken: req.csrfToken()});
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
    res.render('change', {csrfToken: req.csrfToken()});
});

router.post('/change', parseForm, csrfProtection, (req, res) => {
    check(req.body.id, req.body.oldpass, (ok) => {
        if (ok) {
            changePassword(req.body.id, req.body.newpass, () => {
                req.session.user = {id: req.body.id, password: req.body.newpass};
                res.redirect('/');
            });
        }
        else {
            res.render('change', {message: "Nieprawidłowe stare hasło lub login!", csrfToken: req.csrfToken()});
        }
    });
});

module.exports = router;