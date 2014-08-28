var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;
  
var ReportSchema = new Schema({
  location: {
    type: Schema.ObjectId,
    ref: 'Location'
  },
  
  comment: {
    type: String
  }
});

module.exports = mongoose.model('Report', ReportSchema);