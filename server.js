const express = require('express')
  , bodyParser = require('body-parser')
  , http = require('http')
  , mongoose = require('mongoose')
  , compress = require('compression')
  , logger = require('logfmt')
  , reports = require('./routes/reports')
  , locations = require('./routes/locations')
  ;

const app = express()
  , config = require('./config/public/config.json');

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI environment variable must be set')  
  process.exitCode = 1
}
const dbCnx = process.env.MONGO_URI
  , db = mongoose.connect(dbCnx)
  , port = process.env.PORT || 3000

// memjs reads appropriate env variables by default.
// zero configuration necessary
app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);
app.use(compress());
app.use(express.static('public'));
app.use(express.static('config/public'));

app.set('port', port)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(require('./routes/index.js'));
app.get('/reports/count.json', reports.count);
app.get('/reports/:id.json', reports.show);
app.get('/reports.json', reports.index);
app.post('/reports.json', reports.create);
app.get('/locations.json', locations.index);
app.get('/locations/count.json', locations.count);


http.createServer(app).listen(port, function() {
  logger.log({status: 'info', msg: 'server listening', port: port});
});
