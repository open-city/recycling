var request = require('request')
  ;

module.exports.query = function(req,res) {

  var badCharsAddr = /[^A-Za-z0-9\.\-\#\s]/g;
  var addr = req.param('address') || '';
  addr = addr.replace(badCharsAddr,'');
  var city = 'Chicago';
  var state = 'IL';
  var zip = req.param('zip') || '';
  zip = zip.replace(/[^0-9\-\s]/g,'');
  var location = [addr,city,state,zip].join(',');

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
    res.json(body.results);
  });
}
