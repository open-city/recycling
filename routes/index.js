var express = require('express')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , Report = require('../models/Report')
  , router = express.Router()
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

router.post('/contact', function(req, res) {
  var form = req.body;
  
  switch (form['subject']) {
    case "press":
      form.to = 'claire';
      break;
    case "feedback":
      form.to = ['alex', 'claire'];
      break;
    case "problem":
      form.to = 'alex';
      break;
    case "other":
      form.to = 'claire';
      break;
  }
  
  var mailOptions = {
    from: form['email'],
    to: form['to'],
    subject: form['subject'],
    text: form['message'],
  };
  
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });

});

module.exports = router;
