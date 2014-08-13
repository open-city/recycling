var db = require('../models');

exports.index = function(req, res){
  db.Report.findAll().success(function(reports){
    res.json({'reports': reports});
  })
};

exports.create = function(req, res){
  var lat = req.body['latitude'],
      lng = req.body['longitude'],
      address = req.body['address'];

  db.Location.find({
    'where': {'latitude': lat, 'longitude': lng}
  }).success(function(location){
    if(location){
      var report = db.Report.build({
        'recyclingAvailable': Number(req.body['recyclingAvailable']),
        'locationId': location['id']
      })

      report.save().success(function(savedTask){
        res.json({'report': savedTask})
      }).error(function(error){
        res.json({'error': 'Failed to store report: ' + error})
      })
    } else {
      var newLocation = db.Location.build({
        'latitude': lat,
        'longitude': lng,
        'address': address
      })
      newLocation.save().success(function(location){
        var report = db.Report.build({
          'recyclingAvailable': Number(req.body['recyclingAvailable']),
          'locationId': location['id']
        })

        report.save().success(function(savedTask){
          res.json({'report': savedTask})
        }).error(function(error){
          res.json({'error': 'Failed to store report on new location: ' + error})
        })
      })
    }
  }).error(function(error){
    console.log('Errored out while finding location with latitude: ' + lat + ' longitude: ' + lng + ": " + error)
  })
}

exports.show = function(req, res){
  db.Report.find({'where': {'id': req.params.id}})
  .success(function(report){
    res.json({'report': report})
  })
}
