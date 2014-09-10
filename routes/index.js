var fs = require('fs')
  , mongoose = require('mongoose')
  , Report = require('../models/Report')
  ;

exports.index = function(req, res){
  Report.find(function(err, reports){
    
    var tplFiles = fs.readdirSync('./public/js/view_handlers');
    
    res.render('index', {tplFiles: tplFiles});
  });
};
