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
      geoJsonPoint: {
        'type': 'Point',
        coordinates: [0.0, 0.0]
      }
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
      geoJsonPoint: {
        'type': 'Point',
        coordinates: [0.0, 0.0]
      }
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
      geoJsonPoint: {
        'type': 'Point',
        coordinates: [0.0, 0.0]
      }
    });
    location.save(function(err, location){
      expect(err).to.exist;
      // err.message.to.equal('Must provide an address');
      done();
    });
  });

  describe('latitude virtual property', function(){

    it("should return latitude from geoJsonPoint.coordinates", function(done){
      var location = new Location({
        address: "123 Address St",
        reports: [],
        geoJsonPoint:{
          'type': 'Point',
          coordinates: [-87, 49]
        }
      });

      expect(location.latitude).to.equal(49);
      done();
    })

    it("should set latitude to geoJsonPoint.coordinates", function(done){
      var location = new Location({
        address: "123 Address St",
        reports: [],
        geoJsonPoint:{
          'type': 'Point',
          coordinates: [-87, 49]
        }
      });

      location.latitude = 50;
      expect(location.geoJsonPoint.coordinates[1]).to.equal(50);
      done();
    })
  })


  describe('longitude virtual property', function(){
    it("should return longitude from geoJsonPoint.coordinates", function(done){
      var location = new Location({
        address: "123 Address St",
        reports: [],
        geoJsonPoint:{
          'type': 'Point',
          coordinates: [-87, 49]
        }
      });

      expect(location.longitude).to.equal(-87);
      done();
    })

    it("should set longitude to geoJsonPoint.coordinates", function(done){
      var location = new Location({
        address: "123 Address St",
        reports: [],
        geoJsonPoint:{
          'type': 'Point',
          coordinates: [-87, 49]
        }
      });

      location.longitude = -88
      expect(location.geoJsonPoint.coordinates[0]).to.equal(-88);
      done();
    })
  });

  it("should add _id to corresponding ward's locations array");
});
