var Location = require('../models/Location')
  ;

exports.index = function(req, res){
  var query = {};
  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  if(latitude && longitude){
    query = {'geoPoint': [longitude, latitude]};
  }

  Location.find(query, function(err, locations){
    res.json({'locations': locations});
  })
};
