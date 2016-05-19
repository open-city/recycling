var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , async = require('async')
  , cache = require('memjs').Client.create()
  ;


var WardSchema = new Schema({

  number: {
    type: Number,
    index: true,
    required: true
  },

  centroid: {
    type: "Mixed",
    required: true,
    index: '2dsphere'
  },

  alderman: {
    name: String,
    phone: String,
    email: String
  },

  geometry: {
    type: "Mixed",
    required: true,
    index: '2dsphere'
  },

  locations: [{
    type: Schema.ObjectId,
    ref: 'Location'
  }],


});

WardSchema.set('toObject', { virtuals: true})
WardSchema.set('toJSON', { virtuals: true})

WardSchema.virtual('reportCount').get(function(){
  if (!this.locations) {
    return 0;
  }

  return this.locations.reduce(function(prev, cur){
    var toAdd = cur.reports ? cur.reports.length : 1;
    return prev + toAdd;
  }, 0);
});

WardSchema.virtual('locationCount').get(function() {
  if (!this.locations) {
    return 0;
  }
  return this.locations.length;
});


WardSchema.post('save', function(ward){

  var cacheIdx = 'wards.' + ward.number;
  async.series([
    function(cb) { cache.delete('wards.all', cb); },
    function(cb) { cache.delete(cacheIdx, cb); }
  ])
})

module.exports = mongoose.model('Ward', WardSchema);
