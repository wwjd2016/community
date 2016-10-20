var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var compressSession = require('express-session');
var methodOverride = require('method-override');
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(compressSession)



module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'production';
  console.log(env)
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'production';
  
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());
  app.use(compressSession({
    secret:"wechat",
    store: new mongoStore({
      url: config.db,
      collection: 'sessions'
    })
  }))
    // pre handle user
  app.use(function(req, res, next) {
    var _user = req.session.userSession;
      app.locals.userLocals = _user;
    next()
  });
  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // if(app.get('env') === 'development'){
  //   app.use(function (err, req, res, next) {
  //     res.status(err.status || 500);
  //     res.render('error', {
  //       message: err.message,
  //       error: err,
  //       title: 'error'
  //     });
  //   });
  // }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('404', {
        title: '404'
      });
  });

};
