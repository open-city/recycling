process.env.NODE_ENV = 'test';
var app = require('../../server')
  , expect = require('chai').expect
  , request = require('request')
  ;

describe("Integration Tests", function(){
  describe('GET /', function(){
    it("Renders the proper template", function(){})
    it("Renders the address form", function(){})
    it("Highlights the proper nav icon", function(){})
    it("Renders the map", function(){})
  });
  describe('GET /about', function(){});
  describe('GET /get-involved', function(){});
  describe('GET /contact', function(){});
  describe('POST /contact', function(){});
});