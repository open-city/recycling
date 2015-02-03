var express = require('express')
  , bodyParser = require('body-parser')
  , fs = require('fs')
  , hbs = require('hbs')
  , http = require('http')
  , mongoose = require('mongoose')
  , morgan = require('morgan')
  , routes = require('./routes')
  , reports = require('./routes/reports')
  , geocode = require('./routes/geocode')
  , locations = require('./routes/locations')
  ;
  
var app = express();
var env = app.get('env');
var config = require('./config/config')[env];

var dbCnx = process.env.MONGOLAB_URI || config.db;
var db = mongoose.connect(dbCnx);

// memjs reads appropriate env variables by default.
// zero configuration necessary

app.set('view engine','ejs');
app.engine('html', hbs.__express);
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

switch (app.get('env')) {
    case 'development':
        app.use(morgan('dev'));
        break;
    case 'test':
      app.set('port', 3001);
    default:
        app.use(morgan('combined'));
        break;
}

app.use(require('./routes/index.js'));
app.get('/reports/:id.json', reports.show);
app.get('/reports.json', reports.index);
app.post('/reports.json', reports.create);
app.get('/geocode.json', geocode.query);
app.get('/locations.json', locations.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})

