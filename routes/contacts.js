var Contact = require('../models/Contact');

exports.create = function(req, res) {
  var contact = new Contact({email: req.body.email});
  contact.save(function(err, contact){
    var resp = {};
    if (err) {
      console.error(err);
      if (err.code === 11000) {
        resp = {
          contact: null,
          status: 'duplicate',
          message: 'We already have your email address on our list.'
        };
      } else {
        resp = {
          contact: null,
          status: 'error',
          message: err.message
        };
      }

    } else {
      resp = {
        contact: contact,
        status: 'success',
        message: null
      };
    }
    
    return res.json(resp);
  })
}