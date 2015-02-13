process.env.NODE_ENV = 'test';
require('../../models/Ward');

var app = require('../../server')
  , config = require('../../config/config')['test']
  , expect = require('chai').expect
  , mongoose = require('mongoose')
  , Report = mongoose.model('Ward')
  ;


describe('Unit Tests - Ward', function(){

  describe('reportCount virtual property', function(){

    it('should return sum of reports for all locations in ward');
    it('should return count of locations if not populated');
  })

});