var crypto = require('crypto')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;


var LocationSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  
  reports: [{
    type: Schema.ObjectId,
    ref: 'Report'
  }],
  
  geoPoint: {
    type: [Number],
    required: true,
    index: '2dsphere'
  }
});

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