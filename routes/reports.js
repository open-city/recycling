var db = require('../models');

exports.index = function(req, res){
  db.Report.findAll().success(function(reports){
    res.json({'reports': reports});
  })
};

exports.create = function(req, res){
  var lat = req.param('latitude'),
      lng = req.param('longitude'),
      address = req.param('address');

  db.Location.find({
    'where': {'latitude': lat, 'longitude': lng}
  }).success(function(location){
    if(location){
      var report = db.Report.build({
        'recyclingAvailable': req.param('recyclingAvailable'),
        'locationId': location['id']
      })

      report.save().success(function(savedTask){
        res.json({'report': savedTask})
      }).error(function(){
        res.json({'error': 'Failed to store report'})
      })
    } else {
      var newLocation = db.Location.build({
        'latitude': lat,
        'longitude': lng,
        'address': address
      })
      newLocation.save().success(function(location){
        var report = db.Report.build({
          'recyclingAvailable': req.param('recyclingAvailable'),
          'locationId': location['id']
        })

        report.save().success(function(savedTask){
          res.json({'report': savedTask})
        }).error(function(){
          res.json({'error': 'Failed to store report'})
        })
      })
    }
  }).error(function(error){
    console.log('Errored out while finding location with latitude: ' + lat + ' longitude: ' + lng)
  })
}

exports.show = function(req, res){
  db.Report.find({'where': {'id': req.params.id}})
  .success(function(report){
    res.json({'report': report})
  })
}
