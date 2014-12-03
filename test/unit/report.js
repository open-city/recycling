process.env.NODE_ENV = 'test';
require('../../models/Report');

var app = require('../../server')
  , expect = require('chai').expect
  , mongoose = require('mongoose')
  , Report = mongoose.model('Report')
  ;

describe('Unit Tests - Report', function(){

	// before(function(done){
	// 	async.series([
	// 		function(cb) { testHelpers.emptyCollections(cb); }
	// 		function(cb) { testHelpers.loadFixtures(['reports'], cb) }
	// 	], done);
	// });

	it('Should save a report', function(done){
		var report = new Report({});
		report.save(function(err, report){
			expect(err).to.equal(null);
			expect(report._id.toString()).to.match(/[\w\d]{24}/);
		});
	});
});