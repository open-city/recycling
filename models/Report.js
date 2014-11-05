var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;
  
var ReportSchema = new Schema({
  comment: {
    type: String
  },
  
  date: {
    type: Date
  }
});

ReportSchema.pre('save', function(next){
  this.date = new Date();
  next();
})

module.exports = mongoose.model('Report', ReportSchema);