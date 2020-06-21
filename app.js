var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

var indexRouter = require('./routes/index');
var quizesRouter = require('./routes/quizes');
var loggingRouter = require('./routes/logging');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    store: new SQLiteStore,
    cookie: {},
    secret: "Z058otg5NO9RnAzyXJu3N2GtYfBFUzNnigBbm0m0EBhY2IBGMNTdJIB19fsmqhQZWBblp50Jgs5pN2NPLIBAsa69GJjLelyQn4TAowWfOyXDyl88ElhvGVWkwLKOu5rx",
    resave: true,
    saveUninitialized: false
}));

//app.use('/', indexRouter);
app.use('/quizes', quizesRouter);
app.use('/logging', loggingRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
