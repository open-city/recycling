process.env.NODE_ENV = 'test';
var app = require('../../server')
  , expect = require('chai').expect
  , request = require('request')
  , cheerio = require('cheerio')
  ;

describe("Integration Tests - Index Route", function(){
  
  describe('GET /', function(){
    it("Responds with a 200", function (done) {
      request.get('http://localhost:3000/', function (err, res, body) {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
    
    it("Renders the address form", function (done) {
      request.get('http://localhost:3000/', function (err, res, body) {
        expect(err).to.equal(null);
        $ = cheerio.load(body);
        console.log($.root().find('#searchForm').length);
        done();
      });
    });
    
    it("Highlights the proper nav icon", function (done) {
      request.get('http:localhost:3000/', function (err, res, body) {
        
        done();
      });
    });
    
    it("Renders the map", function (done) {done();})
  });
  
  describe('GET /about', function(){});
  describe('GET /get-involved', function(){});
  describe('GET /contact', function(){});
  describe('POST /contact', function(){});
});