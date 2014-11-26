var express = require('express')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , Report = require('../models/Report')
  , router = express.Router()
  ;


router.use(function(req, res, next){
  var tplFiles = fs.readdirSync('./public/js/view_handlers');
  res.locals.tplFiles = tplFiles;
  res.locals.navActive = {
    home: '',
    getinvolved: '',
    about: ''
  }
  next();
});

router.get('/', function(req, res){
  res.locals.navActive.home = 'active';
  res.render('index');
});

router.get('/about', function(req, res) {
  res.locals.navActive.about = 'active';
  res.render('about');
});

router.get('/get-involved', function(req, res) {
  res.locals.navActive.getinvolved = 'active';
  res.render('getinvolved');
});

module.exports = router;
