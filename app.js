var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var sequelize = require('./models/').sequelize;

try {
  sequelize.authenticate();
  sequelize.sync();
  console.log('****Connection has been established successfully****');
  
} catch (error) {
  console.error('****Unable to connect to the database:', error);
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  console.log(`----REQUEST IS: ${req.path}`);
  // set locals, only providing error in development
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.path = req.path;

  // render the error page
  if(err.status === 404){
    res.status(404).render('page-not-found', {err});
  }else{
    err.message = err.message || "Oops! Something went wrong on the server.";
    res.status(err.status || 500).render('error', {err});
  }
  console.log(`----ERROR: ${err.status} - ${err.message}`);

});

module.exports = app;
