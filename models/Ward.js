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

  geometry: {
    type: "Mixed",
    required: true,
    index: '2dsphere'
  }
});

module.exports = mongoose.model('Ward', WardSchema);
