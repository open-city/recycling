var mongoose = require('mongoose')
  , Report = require('../models/Report')
  ;

exports.index = function(req, res){
  Report.find(function(err, reports){
    res.render('index');
  });
};
