var express = require('express')
  , config = require('./config/config')
  , fs = require('fs')
  , hbs = require('hbs')
  , http = require('http')
  , mongoose = require('mongoose')
  , routes = require('./routes')
  , reports = require('./routes/reports')
  , geocode = require('./routes/geocode')
  , locations = require('./routes/locations')
  ;
  
var app = express();
var env = app.get('env');

var dbCnx = config.db.hasOwnProperty(env) ? config.db[env] : process.env.MONGOLAB_URI;
var db = mongoose.connect(dbCnx);

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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})
