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
    about: '',
    contact: ''
  }
  next();
});

router.get('/', function(req, res){
  res.locals.navActive.home = 'active';
  res.locals.bodyClass = 'index';
  res.render('index');
});

router.get('/about', function(req, res) {
  res.locals.navActive.about = 'active';
  res.locals.bodyClass = 'about';
  res.render('about');
});

router.get('/get-involved', function(req, res) {
  res.locals.navActive.getinvolved = 'active';
  res.locals.bodyClass = 'getinvolved';
  res.render('getinvolved');
});

router.get('/contact', function(req, res) {
  res.locals.navActive.contact = 'active';
  res.locals.bodyClass = 'contact';
  res.render('contact');
});

router.post('/contact', function(req, res) {
  var form = req.body;
  switch (form['subject']) {
    case "press":
      break;
    case "feedback":
      break;
    case "problem":
      break;
    case "other":
      break;
  }
});

module.exports = router;
