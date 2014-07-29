var request = require('request');

module.exports.query = function(req,res) {
  
  var badCharsAddr = /[^A-Za-z0-9\.\-\#\s]/g;
  var addr = req.param('address') || '';
  addr = addr.replace(badCharsAddr,'');
  var city = 'Chicago';
  var state = 'IL';
  var zip = req.param('zip') || '';
  zip = zip.replace(/[^0-9\-\s]/g,'');
  var location = [addr,city,state,zip].join(',');
  
  var key = process.env.MAPQUEST_APP_KEY;
  
  if (!key) {
    console.error("No MapQuest Application Key defined");
    res.send(500);
  } else {
    var url = "http://www.mapquestapi.com/geocoding/v1/address";
    var requestParams = {
      form: {
        key: key,
        location: location
      }
    }
    request.post(url, requestParams, function(err, resp, body){
      if (err) {
        console.error(err);
        return res.send(500);
      }
      
      if (resp.statusCode !== 200) {
        console.error("MAPQUEST API FAILURE: " + resp.statusCode);
        return res.send(resp.statusCode);
      }
      
      var body = JSON.parse(body);
      var ret = [];
      body.results[0].locations.forEach(function(loc){
        // unsetting map URL because it exposes our API key
        delete loc.mapUrl;
        ret.push(loc)
      })
      res.json(ret);
    });
  }
}
