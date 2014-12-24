process.env.NODE_ENV = 'test';
require('../../models/Location');

var app = require('../../server')
  , expect = require('chai').expect
  , mongoose = require('mongoose')
  , Location = mongoose.model('Location')
  ;

describe('Unit Tests - Location', function(){
  
  it('Should save properly', function(done){
    var location = new Location({
      address: "222 Merchandise Mart Plaza, Chicago, IL",
      reports: [],
      geoPoint: [0.0, 0.0]
    });
    location.save(function(err, location){
      expect(err).to.equal(null);
      expect(location._id.toString()).to.match(/[\w\d]{24}/);
      done();
    });
  });

  it("should require an address", function(done){
    var location = new Location({
      address: null,
      reports: [],
      geoPoint: [0.0, 0.0]
    });
    location.save(function(err, location){
      expect(err).to.exist;
      done();
    });
  });

  it("should not allow address to be empty string", function(done){
    var location = new Location({
      address: "",
      reports: [],
      geoPoint: [0.0, 0.0]
    });
    location.save(function(err, location){
      expect(err).to.exist;
      err.message.to.equal('Must provide an address');
    });
  });

});