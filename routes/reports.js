var Location = require('../models/Location')
  , Report = require('../models/Report')
  ;


exports.index = function(req, res){
  var query = {};
  var location = req.query.location;
  if(location){
    query = {'location': location };
  }
  Report.find(query, function(reports){
    res.json({'reports': reports});
  })
};

exports.create = function(req, res){
  var lat = parseFloat(req.body.latitude)
    , lng = parseFloat(req.body.longitude)
    , address = req.body['address']
    ;

  Location.findOne({ geoPoint: [lng,lat] }, function(err, location){
    if (err) {
      console.log('Errored out while finding location with latitude: ' + lat + ' longitude: ' + lng + ": " + err)
    }
    
    if(location){
      console.log('found location');
      var report = new Report({
        'location': [location._id]
      })

      report.save(function(err, savedTask){
        if (err) {
          res.json({'error': 'Failed to store report: ' + err})
        } else {
          res.json({'report': savedTask})
        }
      })
    } else {
      console.log('no location');
      var newLocation = new Location({
        'address': address,
        'geoPoint': [lng, lat]
      })
      
      console.log(newLocation);
      newLocation.save(function(err, location){
        if (err) {
          var txt = 'Failed to save new location: ' + err;
          return res.json({'error': txt});
        }
        
        var report = new Report({
          'location': [location._id]
        })

        report.save(function(err, savedTask){
          if (err) {
            res.json({'error': 'Failed to store report on new location: ' + err})
          } else {
            res.json({'report': savedTask})
          }
        })
      })
    }
  })
}

exports.show = function(req, res){
  Report.find(req.params.id, function(report){
    res.json({'report': report})
  })
}
