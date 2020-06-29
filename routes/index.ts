import * as express from "express";
import * as sqlite3 from "sqlite3";
import * as bodyParser from "body-parser";
import {Stats} from "../public/javascripts/types";
import {ifAuth} from "../public/javascripts/auth";
import { DatabaseHandler } from "../public/javascripts/DatabaseHandler";

const dbHandler = new DatabaseHandler();

const router = express.Router();
const parseForm = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
  ifAuth(req.session, (ok) => {
    if (ok) {
      getStats((stats) => {
        res.render('start', {rawStats: JSON.stringify(stats), user: req.session.user.id});
      });
    }
    else {
      res.redirect('/logging/signin');
    }
  });
});

router.post('/', parseForm, (req, res) => {
  ifAuth(req.session, (ok) => {
    if (ok) {
      res.redirect('/quizes/' + req.body.quiz);
    }
    else {
      res.redirect('/logging/signin')
    }
  });
});

function getStats(func: (loadedStats: Stats[]) => void) {
  let stats = new Array<Stats>();
  dbHandler.selectResults((row) => {
      let stat = {} as Stats;
      stat.quiz = row.quiz;
      stat.result = row.result;
      stat.user = row.user;
      stats.push(stat);
    }, () => {
    func(stats);
  });
}


module.exports = router;