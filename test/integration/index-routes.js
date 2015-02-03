process.env.NODE_ENV = 'test';
process.env.PORT = 3001;
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

    // This test needs to be modified so the viewContent can be populated
    // after the initial request is sent.
    // it("Renders the address form", function (done) {
    //   request.get('http://localhost:3000/', function (err, res, body) {
    //     expect(err).to.equal(null);
    //     $ = cheerio.load(body);
    //     console.log($('#viewContent').text());
    //     done();
    //   });
    // });

    it("Highlights the proper nav icon", function (done) {
      request.get('http://localhost:3000/', function (err, res, body) {
        $ = cheerio.load(body);
        expect(err).to.equal(null);
        expect($('.active').text()).to.equal('Report Your Building');
        done();
      });
    });

  });

  describe('GET /about', function () {
    it('Responds with a 200', function (done) {
      request.get('http://localhost:3000/about', function (err, res, body) {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('Highlights the proper nav icon', function (done) {
      request.get('http://localhost:3000/about', function (err, res, body) {
        expect(err).to.equal(null);
        $ = cheerio.load(body);
        expect($('.active').text()).to.equal("About");
        done();
      });
    });
  });
  
  describe('GET /get-involved', function(){
    it('Responds with a 200', function(done){
      request.get('http://localhost:3000/get-involved', function(err, res, body) {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('Highlights the correct nav icon', function (done) {
      request.get('http://localhost:3000/get-involved', function(err, res, body) {
        expect(err).to.equal(null);
        $ = cheerio.load(body);
        expect($('.active').text()).to.equal("Get Involved");
        done();
      });
    });
  });
  
  describe('GET /contact', function(){
    it('Responds with a 200', function(done){
      request.get('http://localhost:3000/contact', function(err, res, body) {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('Highlights the correct nav icon', function (done) {
      request.get('http://localhost:3000/contact', function(err, res, body) {
        expect(err).to.equal(null);
        $ = cheerio.load(body);
        expect($('.active').text()).to.equal("Contact");
        done();
      });
    });

    it('Renders the contact form', function (done) {
      request.get('http://localhost:3000/contact', function (err, res, body) {
        expect(err).to.equal(null);
        $ = cheerio.load(body);
        expect($('#contact-form').length).to.equal(1);
        expect($('button[type="submit"]')).to.exist();
        done();
      });
    });
  });
  
  describe('POST /contact', function () {
    it("Shouldn't succeed without a reCaptcha", function (done) {
      var options = {
        url: 'http://localhost:3000/contact',
        method: "POST",
        body: {name: 'Tommy Test', email: 'test@example.com', subject: 'test', message: 'test'},
        json: true
      };
      request(options, function (err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.status).to.equal('422');
        expect(body.message).to.equal('Please verify you are a human.');
        done();
      });
    });
  });
});
