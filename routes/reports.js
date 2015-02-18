var async = require('async')
  , cache = require('memjs').Client.create()
  , Location = require('../models/Location')
  , Report = require('../models/Report')
  ;


exports.index = function(req, res){
  var query = {};
  var location = req.query.location;
  if(location){
    query = {'location': location };
  }
  Report.find(query, function(err, reports){
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
      console.error('Errored out while finding location with latitude: ' + lat + ' longitude: ' + lng + ": " + err)
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
          // invalidating cache for this location 
          // and locations.all so they'll be regenerated
          // next time they are requested
          var cacheIdx = 'locations.' + rslt.location._id;
          cache.delete(cacheIdx, function(err, success){
            // have to wait and do the second in a callback
            // or memcachier complains about concurrent connections
            cache.delete('locations.all');
          }); 

          res.json({
            'report': rslt.report,
            'location': rslt.location
          });
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
          
          // rolling back 
          if (typeof newLocation == 'object' && !newLocation.isNew) {
            Location.findOneAndRemove({_id: newLocation._id}).exec();
          }
          
          if (typeof newReport == 'object' && !newReport.isNew) {
            Report.findOneAndRemove({_id: newReport._id}).exec();
          }
          
          return res.json({'error': 'Failed to store report: ' + err});
          
        } else {
          cache.delete('locations.all');
          res.json({
            'report': rslt.report,
            'location': rslt.location
          });
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

exports.count = function(req, res){
  res.json({'reportCount':Report.count()});
};
