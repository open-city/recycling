var express = require('express')
  , fs = require('fs')
  , hbs = require('hbs')
  , http = require('http')
  , routes = require('./routes')
  , reports = require('./routes/reports')
  , geocode = require('./routes/geocode')
  , locations = require('./routes/locations')
  , db = require('./models')
  ;
  
var app = express();

// Load environment vars if present in file
var envVarsPath = "./config/envvars.js";
if (fs.existsSync(envVarsPath)) {
    var envvars = require(envVarsPath);
    for (var key in envvars) {
        
        // don't clobber existing vars
        if (!process.env.hasOwnProperty(key)) {
            process.env[key] = envvars[key];
        }
    }
}

app.set('view engine','ejs');
app.engine('html', hbs.__express);
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000)
app.use(express.logger('dev'))
app.use(express.urlencoded())
app.use(express.json())
app.use(app.router)

if ('development' === app.get('env')) {
    app.use(express.errorHandler())
}

app.get('/', routes.index)
app.get('/reports/:id.json', reports.show)
app.get('/reports.json', reports.index)
app.post('/reports.json', reports.create)
app.get('/geocode.json', geocode.query)
app.get('/locations.json', locations.index)

db
  .sequelize
  .sync()
  .complete(function(err) {
    if (err) {
      throw err[0]
    } else {
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'))
      })
    }
  })
