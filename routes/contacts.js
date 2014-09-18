var Contact = require('../models/Contact');

exports.create = function(req, res) {
  var contact = new Contact({email: req.body.email});
  contact.save(function(err, contact){
    if (err) {
      console.error(err);
      return res.send(500);
    } else {
      return res.json(contact);
    }
  })
}