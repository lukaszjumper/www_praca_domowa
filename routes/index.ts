import * as express from "express";
import * as sqlite3 from "sqlite3";
import * as bodyParser from "body-parser";
import {Stats} from "../public/javascripts/types";

const router = express.Router();
const parseForm = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
  if (req.session.user === undefined) {
    res.redirect('/logging/signin');
  }
  else {
    getStats((stats) => {
      res.render('start', {rawStats: JSON.stringify(stats), user: req.session.user.id});
    })
  }
});

router.post('/', parseForm, (req, res) => {
  res.redirect('/quizes/' + req.body.quiz);
});

function getStats(func: (loadedStats: Stats[]) => void) {
  const db = new sqlite3.Database('data.db');
  db.all('SELECT * FROM results;', [], (err, rows) => {
    let stats = new Array<Stats>();
    rows.forEach((row) => {
      let stat = {} as Stats;
      stat.quiz = row.quiz;
      stat.result = row.result;
      stat.user = row.user;
      stats.push(stat);
    });
    func(stats);
  });
}


module.exports = router;