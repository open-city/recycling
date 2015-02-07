var mongoose = require('mongoose')
  , Schema = mongoose.Schema
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
  }]
});

module.exports = mongoose.model('Ward', WardSchema);
