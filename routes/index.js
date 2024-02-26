var express = require('express')
  , fs = require('fs')
  , router = express.Router()
  , config = require('../config/public/config.json');

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

// Loader.io verification page.  Do not delete.
router.get('/loaderio-f6c2b68c741ca5d56479042a794cf7da', function(req, res) {
  res.send('loaderio-f6c2b68c741ca5d56479042a794cf7da')
});

module.exports = router;
