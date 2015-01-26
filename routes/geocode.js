var request = require('request')
  ;

module.exports.query = function(req,res) {

  var badCharsAddr = /[^A-Za-z0-9\.\-\#\s]/g;
  var addr = req.query.address || '';
  addr = addr.replace(badCharsAddr,'');
  var city = 'Chicago';
  var state = 'IL';
  var location = [addr,city,state].join(',');

  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location;
  request.get(url, function(err, resp, body){
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    if (resp.statusCode !== 200) {
      console.error("GOOGLE API FAILURE: " + resp.statusCode);
      return res.send(resp.statusCode);
    }

    var body = JSON.parse(body);
    var results = filter_results(body.results);
    if (results.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(results);
    }
  });
}

/**
 * Parses the returned address from the Google Maps api 
 * into an object with properties 'street_number', 'route',
 * 'city', 'state', 'zip'
 */
var parseGoogleAddress = function(addr) {
  var ret = {};
  var propMap = {
    'administrative_area_level_1': 'state',
    'administrative_area_level_2': 'county',
    'locality': 'city',
    'postal_code': 'zip',
    'postal_code_suffix': 'zip_plus_four'   
  }
  addr.address_components.forEach(function(part){
    var googleProp = part.types[0];
    var prop = propMap[googleProp] || googleProp;
    ret[prop] = part.long_name;
  })
  ret.number_and_route = ret.street_number + ' ' + ret.route;
  ret.geometry = addr.geometry;
  return ret;
}

var filter_results = function(rslts) {
  var filtered = [];
  rslts.forEach(function(address){
    address = parseGoogleAddress(address);
    console.log(address);
    if (address.street_number 
    &&  address.route
    &&  address.city === 'Chicago'
    &&  address.state === 'Illinois') {
      filtered.push(address);
    }
  });
  return filtered;
}
