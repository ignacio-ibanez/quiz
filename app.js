var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var https = require('https');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next){

    // guardar path en session.redir para despues de login
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }

    // Hacer visible req.session = req.session en las vistas
    res.locals.session = req.session;
    next(); 
});

// auto-logout
app.use(function(req, res, next){
    var date = new Date();
    var horaNuevo = date.getHours();
    var minutosNuevo = date.getMinutes();
    var segundosNuevo = date.getSeconds();

    if(req.session.user){
        var hora = req.session.user.horaSe;
        var minutos = req.session.user.minutosSe;
        var segundos = req.session.user.segundosSe;

        var out = 0;

        if(horaNuevo !== hora){
            if(((minutosNuevo + 60) >= (minutos + 2)) && (segundos >= segundosNuevo)){
                out = 1;
                console.log("Sesion cerrada");
                delete req.session.user;
                res.redirect(req.session.redir.toString());
            }
        }else {
            if( (minutosNuevo >= (minutos + 2)) && (segundos >= segundosNuevo)){
                out = 1;
                console.log("Sesion cerrada");
                delete req.session.user;
                res.redirect(req.session.redir.toString());
            }
        }
        if(out === 0){
            req.session.user.horaSe = horaNuevo;
            req.session.user.minutosSe = minutosNuevo;
            req.session.user.segundosSe = segundosNuevo;
        }
    } 
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
