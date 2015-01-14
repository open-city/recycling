var crypto = require('crypto')
  , memjs = require('memjs')
  , Location = require('../models/Location')
  ;

exports.index = function(req, res){
  var query = {};
  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  if(latitude && longitude){
    query = {'geoPoint': [longitude, latitude]};
  }

  var cacheIdx = getCacheIndex(query);
  var memjsClient = memjs.Client.create();
  memjsClient.get(cacheIdx, function(err, cached){

    if (!err && cached) {
      res.json({'locations': cached});
      return;
    }

    Location.find(query).populate('reports').exec(function(err, locations){
      res.json({'locations': locations});
      return;
    })

  });

};

function getCacheIndex(query) {
  var idx;
  if (query.hasOwnProperty('geoPoint')) {
    idx = query.geoPoint[0] + "" + query.geoPoint[1];
    idx = crypto.createHash('md5').update(idx).digest('hex');
    idx = "locations_" + idx;
  } else {
    idx = 'locations_all';
  }
  return idx;
}