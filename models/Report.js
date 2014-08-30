var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;
  
var ReportSchema = new Schema({
  comment: {
    type: String
  }
});

module.exports = mongoose.model('Report', ReportSchema);