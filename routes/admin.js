const express = require('express')
  , router = express.Router()
  , Reports = require('../models/Report')
  ;

router.get('/', function(req, res, next) {
  let reports = Reports.find();
  res.render('admin', {reports: reports});
});

module.exports = function(app) {
  app.use('/admin', router);
};
