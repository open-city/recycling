process.env.NODE_ENV = 'test'
require('../../models/Contact')

var app = require('../../server')
  , expect = require('chai').expect
  , mongoose = require('mongoose')
  , Contact = mongoose.model('Contact')

describe('Unit Tests - Contact', function(){
  it('Should save properly', function(done){
    var contact = new Contact({
      email: "test2@example.com"
    });
    contact.save(function(err, contact){
      expect(err).to.equal(null);
      expect(contact._id.toString()).to.match(/[\w\d]{24}/);
      done();
    });
  });
  it('Should not allow duplicate emails', function(done){
    var contact = new Contact({
      email: "test@example.com"
    });
    contact.save(function(err, contact){
      expect(err).to.exist;
      done();
    });
  });
  it('Should not save invalid email address', function(done){
    var contact = new Contact({
      email: "invalid-email@oame"
    });
    contact.save(function(err, contact){
      expect(err).to.exist();
      done();
    })
  });

});