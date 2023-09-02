var async = require('async')
  , crypto = require('crypto')
  , cache = require('memjs').Client.create()
  , Location = require('../models/Location')
  ;

exports.index = function(req, res){
  var query = {};
  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  
  var geoKey = "geoPoints.all";
  if(latitude && longitude){
    query = {'geoJsonPoint.coordinates': [longitude, latitude]};
    geoKey = Location.geoHash(longitude, latitude);
  }

  // Need to look up cached location ID from queried
  // geoPoint. Can't store the location based on the
  // geoPoint directly because we need to invalidate the 
  // cached location when new reports are added, and we do
  // that by ID.
  async.waterfall([

    // look up location id by geoKey
    function(callback) {
      cache.get(geoKey, function(err, locationKey){
        if (locationKey) {
          locationKey = locationKey.toString();
        }
        callback(err, geoKey, locationKey);
      });
    },
    
    // get location from id
    function(geoKey, locationKey, callback) {
      if (locationKey) {
        cache.get(locationKey, callback);
      } else {
        callback("No cached value for geoKey: " + geoKey);
      }
    }

  // final callback
  ], function(err, cached){
    if (err) console.error(err);

    // if all has gone well, return cached location info
    if (!err && cached) {
      cached = JSON.parse(cached.toString());
      res.json({'locations': cached});
      return;

    // else look up location info in Mongo and and cache it in memcached.
    } else {
      Location.find(query).populate('reports').then(
        locations => {
        var locId = null;
        if (locations.length === 1) {
          locId = locations[0]._id;
        } else if (locations.length) {
          locId = 'all';
        }

        if (locId) {
          var locationKey = 'locations.' + locId;
          cache.set(geoKey, locationKey, null, 5400);
          cache.set(locationKey, JSON.stringify(locations), null, 5400);
        }
        res.json({'locations': locations});
        return;
      });
    }
  })
};

exports.count = function(req, res) {
  Location.countDocuments().then(
    count => res.json({'locationCount': count}),
    err => {
      console.error(err);
      return res.status(500).send();
    });
};
