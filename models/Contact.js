var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;
  
var ContactSchema = new Schema({
  email: {
    type: String,
    index: {
      unique: true,
      dropDups: true
    }
  }
});

ContactSchema.path('email').validate(function (email) {
   var emailRegex = /^([\w-\.\+]+@([\w-]+\.)+[\w-]+)?$/;
   return emailRegex.test(email);
}, 'The e-mail field cannot be empty.')

module.exports = mongoose.model('Contact', ContactSchema);