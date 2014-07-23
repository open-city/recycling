var db = require('../models');

exports.index = function(req, res){
  db.Report.findAll().success(function(reports){
    res.json({'reports': reports});
  })
};

exports.create = function(req, res){
  var report = db.Report.build({
    'recyclingAvailable': req.param('recyclingAvailable')
  })

  report.save().success(function(savedTask){
    res.json({'report': savedTask})
  }).error(function(){
    res.json({'error': 'Failed to store report'})
  })
}
