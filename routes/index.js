var db = require('../models');

exports.index = function(req, res){
  db.Report.findAll().success(function(reports){
    res.render('index');
  })
};
