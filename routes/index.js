var express = require('express')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , cache = require('memjs').Client.create()
  , Report = require('../models/Report')
  , Ward = require('../models/Ward')
  , Location = require('../models/Location')
  , router = express.Router()
  , request = require('request')
  , validator = require('validator')
  , transporter = require('../lib/transporter')
  ;


router.use(function(req, res, next){
  var tplFiles = fs.readdirSync('./public/js/view_handlers');
  res.locals.tplFiles = tplFiles;
  res.locals.navActive = {
    getinvolved: '',
    about: '',
    press: '',
    contact: ''
  },
  res.locals.ogurl = '';
  res.locals.currentYear = new Date().getFullYear();
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

router.get('/contact', function(req, res) {
  res.locals.navActive.contact = 'active';
  res.locals.bodyClass = 'contact';
  res.locals.ogurl = 'contact';
  res.render('contact', {ogurl: 'contact'});
});

router.post('/contact', function (req, res, next) {

  var captcha = req.body['g_recaptcha_response'];
  var url = 'https://www.google.com/recaptcha/api/siteverify?secret='+process.env['CAPTCHA_SECRET']+'+&response='+captcha;
  request.get(url, function (err, googResponse, body) {
    if (err) { console.error(error); }
    var response = JSON.parse(body);
    if (response['success'] == true) {
      next();
    } else {
      res.json({status: '422', message: 'Please verify you are a human.'});
    }
  });


}, function (req, res, next) {

  var form = req.body;

  if (!validator.isEmail(form['email'])) {
    res.json({'status': '422', 'message':'Email address invalid'});
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
      res.json({'status': '500', 'message':'Server error'});
    } else {
      console.log('Message sent: ' + info.response);
      res.json({'status': '200'});
    }
  });
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
