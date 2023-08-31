var express = require('express')
  , fs = require('fs')
  , router = express.Router()
  , env = process.env.NODE_ENV || 'dev'
  , config = require('../config/config')[env];

  ;


router.use(function(req, res, next){
  var tplFiles = fs.readdirSync('./public/js/view_handlers');
  res.locals.tplFiles = tplFiles;
  res.locals.navActive = {
    getinvolved: '',
    about: '',
    press: '',
  },
  res.locals.ogurl = '';
  res.locals.currentYear = new Date().getFullYear();
  res.locals.config = config;
  next();
});

router.get('/', function(req, res){
  res.locals.bodyClass = 'index';
  res.render('index');
});

router.get('/about', function(req, res) {
  res.locals.navActive.about = 'active';
  res.locals.bodyClass = 'about';
  res.locals.ogurl = 'about';
  res.render('about', {ogurl: 'about'});
});

router.get('/get-involved', function(req, res) {
  res.locals.navActive.getinvolved = 'active';
  res.locals.bodyClass = 'getinvolved';
  res.locals.ogurl = 'get-involved';
  res.render('getinvolved', {ogurl: 'get-involved'});
});

router.get('/press', function (req, res) {
  res.locals.navActive.press = 'active';
  res.locals.bodyClass = 'press';
  res.locals.ogurl = 'press';
  res.render('press', {ogurl: 'press'});
});

// Loader.io verification page.  Do not delete.
router.get('/loaderio-f6c2b68c741ca5d56479042a794cf7da', function(req, res) {
  res.send('loaderio-f6c2b68c741ca5d56479042a794cf7da')
});

module.exports = router;
