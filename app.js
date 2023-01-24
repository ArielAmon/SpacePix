var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// enable sessions
app.use(session({
    secret:"somesecretkey",
    resave: false, // Force save of session for each request
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: {maxAge: 10*60*1000 } // milliseconds!
}));

function nocache(req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0,max-age=0,s-maxage=0');
    next();
}

function isLoggedIn(req, res, next) {
    console.log("logged in")
    if (req.session.isConnected) {
        next();
    }
    else if(!req.cookies.connect) {
        res.redirect('/');
    }
    else {
        res.redirect('/');
    }
}

function isNotLoggedIn(req, res, next) {
    console.log("Not logged in")
    if (!req.session.isConnected) {
        next();
    }
    else {
        res.redirect('/home');
    }
}

app.use('/home',nocache, isLoggedIn ,homeRouter);
app.use('/',nocache, isNotLoggedIn,indexRouter);
app.use('/users',nocache, isNotLoggedIn,usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
