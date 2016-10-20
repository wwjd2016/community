var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'production';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'wechatsystem'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/wechatsystem'
  },

  test: {
    root: rootPath,
    app: {
      name: 'wechatsystem'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/wechatsystem-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'wechatsystem'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/wechatsystem-development'
  }
};

module.exports = config[env];
