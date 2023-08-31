var async = require('async')
  , cache = require('memjs').Client.create()
  , crypto = require('crypto')
  , mongoose = require('mongoose')
  , Report = require('./Report')
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
}, {
    toJSON:   { virtuals: true },
    toObject: { virtuals: true }
});

LocationSchema.virtual('latitude').get(function(){
  return this.geoJsonPoint.coordinates[1];
})

LocationSchema.virtual('latitude').set(function(lat){
  this.geoJsonPoint.coordinates[1] = lat;
})

LocationSchema.virtual('longitude').get(function(){
  return this.geoJsonPoint.coordinates[0];
})

LocationSchema.virtual('longitude').set(function(lat){
  this.geoJsonPoint.coordinates[0] = lat;
})



LocationSchema.post('save', function(loc){
  var pt = loc.geoJsonPoint;
  Ward.findOne({geometry: { $geoIntersects: { $geometry: pt }}}).then(
    ward => {
      if (ward) {
        ward.locations.addToSet(loc._id);
        ward.save().then(_, err => console.error(err));
      }
    },
    err => console.error(err)
  );

  cacheIdx = 'locations.' + loc._id.toString();
  async.series([
    function(cb){ cache.delete('locations.all', cb); },
    function(cb){ cache.delete(cacheIdx, cb); },
  ])

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