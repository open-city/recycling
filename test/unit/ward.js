process.env.NODE_ENV = 'test';
require('../../models/Ward');
var cp = require('child_process');

var app = require('../../server')
  , config = require('../../config/config')['test']
  , expect = require('chai').expect
  , mongoose = require('mongoose')
  , Ward = mongoose.model('Ward')
  ;

describe('Unit Tests - Ward', function(){

  describe('reportCount virtual property', function(){
    before(function(done) {
      cp.exec('grunt migrate:all', function(err, stdout, stderr) {
        if (err) {
          throw err;
        }
        Report.create({}, function(err, doc) {
          if (err) {
            throw err;
          }
          done();
        });
      });
    });
    it('should return sum of reports for all locations in ward');
    it('should return count of locations if not populated');
  })

});
