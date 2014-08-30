var async = require('async')
  , Location = require('../models/Location')
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
    , address = req.body.address
    , zip = req.body.zip
    , comment = req.body.comment || ''
    ;

  Location.findOne({ geoPoint: [lng,lat] }, function(err, location){
    if (err) {
      console.log('Errored out while finding location with latitude: ' + lat + ' longitude: ' + lng + ": " + err)
    }
    
    var ret = null;
        
    if(location){

      async.waterfall([
        function(cb){
          var report = new Report({
            'comment': comment
          });
          report.save(function(err, r){
            cb(err, r);
          });
        },
        function(report, cb){
          location.reports.push(report._id);
          location.save(function(err, location){
            cb(err, {'location': location, 'report': report});
          })
        }
      ], function(err, rslt){
        if (err) {
          res.json({'error': 'Failed to store report: ' + err});
        } else {
          res.json({'report': rslt.report});
        }
      });
      
    // creating new location for report
    } else {

      var newReport, newLocation, ret;
      async.waterfall([        
        function(cb){
          newReport = new Report({
            'comment': comment
          });
          newReport.save(function(err, r){
            cb(err, r);
          });
        },
        
        function(report, cb){
          console.log(cb);
          newLocation = new Location({
            'address': address,
            'zip': zip,
            'geoPoint': [lng, lat],
            'reports': [report._id]
          });
          newLocation.save(function(err, location){
            cb(err, {'location': location, 'report': report});
          });
        }
      
      ], function(err, rslt){
        if (err) {
          if (newLocation) newLocation.remove().exec();
          if (newReport)   newReport.remove().exec();
          return res.json({'error': 'Failed to store report: ' + err});
        } else {
          res.json({'report': rslt.report});
        }
      });

    }
  })
}

exports.show = function(req, res){
  Report.find(req.params.id, function(report){
    res.json({'report': report})
  })
}
