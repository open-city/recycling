process.env.NODE_ENV = 'test';
require('../../models/Report');

var app = require('../../server')
  , expect = require('chai').expect
  , mongoose = require('mongoose')
  , Report = mongoose.model('Report')
  ;

describe('Unit Tests - Report', function(){

	it('should save a report', function(done){
		var report = new Report({comment: "This is a comment", date: new Date()});
		report.save().then(report => {
			expect(report._id.toString()).to.match(/[\w\d]{24}/);
			done();
		}, null);
	});

	it('should not require a comment', function(done){
		var report = new Report({date: new Date()});
		report.save().then(r => done(), null);
	});

	it('should add a date if one is not provided', function(done){
		var report = new Report({});
		report.save().then(report => {
			expect(report.date).to.exist;
			done();
		}, null);
	});

});