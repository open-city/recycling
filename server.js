var express = require('express')
  , cluster = require('cluster')
  , numCpus = require('os').cpus().length
  , bodyParser = require('body-parser')
  , fs = require('fs')
  , hbs = require('hbs')
  , http = require('http')
  , mongoose = require('mongoose')
  , morgan = require('morgan')
  , compress = require('compression')
  , logger = require('logfmt')
  , routes = require('./routes')
  , reports = require('./routes/reports')
  , locations = require('./routes/locations')
  , fauxAuth = require('./middleware/staging-auth')
  ;

var app = express();
var env = app.get('env');
var config = require('./config/config')[env];

var dbCnx = process.env.MONGOLAB_URI || config.db;
var db = mongoose.connect(dbCnx);
var port = process.env.PORT || config.port || 3000;

// memjs reads appropriate env variables by default.
// zero configuration necessary

app.set('view engine','ejs');
app.engine('html', hbs.__express);
app.use(compress());
app.use(express.static('public'));

app.set('port', port)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

switch (app.get('env')) {
    case 'development':
        app.use(morgan('dev'));
        break;

    case 'staging':
        app.use(fauxAuth);
        break;

    default:
        app.use(morgan('combined'));
        break;
}

app.use(require('./routes/index.js'));
app.get('/reports/count.json', reports.count);
app.get('/reports/:id.json', reports.show);
app.get('/reports.json', reports.index);
app.post('/reports.json', reports.create);
app.get('/locations.json', locations.index);
app.get('/locations/count.json', locations.count);
app.use(require('./routes/wards.js'));

if (cluster.isMaster) {
  for (var i = 0; i < numCpus - 1; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    logger.log({worker: worker.process.pid, msg: 'died', code: code, signal: signal});
  });

} else {
  http.createServer(app).listen(port, function() {
    logger.log({status: 'info', msg: 'server listening', port: port});
  });
}

