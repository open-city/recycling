var db = require('../models');

exports.index = function(req, res){
  var query = {};
  var latitude = req.query.latitude;
  var longitude = req.query.longitude;
  if(latitude && longitude){
    query['where'] = {'latitude': latitude, 'longitude': longitude};
  } else if(latitude){
    query['where'] = {'latitude': latitude};
  } else if(longitude){
    query['where'] = {'longitude': longitude};
  }

  db.Location.findAll(query).success(function(locations){
    res.json({'locations': locations});
  })
};
