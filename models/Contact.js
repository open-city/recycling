var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;
  
var ContactSchema = new Schema({
  email: {
    type: String
  }
});

ContactSchema.path('email').validate(function (email) {
   var emailRegex = /^([\w-\.\+]+@([\w-]+\.)+[\w-]+)?$/;
   return emailRegex.test(email);
}, 'The e-mail field cannot be empty.')

module.exports = mongoose.model('Contact', ContactSchema);