var express = require('express')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , Report = require('../models/Report')
  , router = express.Router()
  , validator = require('validator')
  , transporter = require('../config/transporter')
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

router.post('/contact', function (req, res, next) {
  
  var form = req.body;
  
  if (!validator.isEmail(form['email'])) {
    next('/contact');
  }

  form['email'] = validator.normalizeEmail(form['email']);
  form['message'] = validator.escape(form['message']);
  
  next();

}, function (req, res, next) {
  
  var mailOptions = {
    from: req.body['email'],
    to: transporter.transporter.options.auth.user,
    subject: req.body['subject'],
    text: req.body['message']
  };
  
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });

  res.send("Thanks!, we'll get right on it!");
});

module.exports = router;
