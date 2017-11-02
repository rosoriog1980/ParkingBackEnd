const bodyParser = require('body-parser');
const liveReload = require('connect-livereload');

function config(app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
  
    if (app.get('env') === 'development') {
      app.use(liveReload({
        port: 35729,
      }));
    }
  }
  
  module.exports = config;