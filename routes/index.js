var express = require('express')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , Report = require('../models/Report')
  , router = express.Router()
  ;


router.use(function(req, res, next){
  var tplFiles = fs.readdirSync('./public/js/view_handlers');
  res.locals.tplFiles = tplFiles;
  next();
});

router.get('/', function(req, res){
  res.render('index');
});

router.get('/about', function(req, res) {
  res.render('about');
});

router.get('/get-involved', function(req, res) {
  res.render('getinvolved');
});

module.exports = router;
