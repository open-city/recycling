var crypto = require('crypto')
  , mongoose = require('mongoose')
  , Ward = require('./Ward')
  , Schema = mongoose.Schema
  ;


var LocationSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  
  reports: [{
    type: Schema.ObjectId,
    ref: 'Report',
    index: true
  }],
  
  geoJsonPoint: {
    type: 'Mixed',
    required: true,
    index: '2dsphere'
  }
});

LocationSchema.post('save', function(loc){
  var pt = loc.geoJsonPoint;
  Ward.findOne({geometry: { $geoIntersects: { $geometry: pt }}}, function(err, ward){
    if (err) return console.error(err);
    if (ward) {
      ward.locations.addToSet(loc._id);
      ward.save();
    }
  });
})

LocationSchema.path('address').validate(function (address) {
  return !(address == "")
}, 'Must provide an address')

// translates the long/lat into a memcached key
LocationSchema.statics.geoHash = function(lon, lat) {
    idx = lon + "" + lat;
    idx = crypto.createHash('md5').update(idx).digest('hex');
    idx = "geoPoint." + idx;
    return idx;
}

module.exports = mongoose.model("Location", LocationSchema);