var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;


var LocationSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  
  zip: {
    type: String,
    required: true
  },
  
  geoPoint: {
    type: [Number],
    required: true,
    index: '2dsphere'
  }
});

module.exports = mongoose.model("Location", LocationSchema);