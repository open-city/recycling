process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var MongoClient = require('mongodb').MongoClient
  , async = require('async')
  , db_path = (process.env.NODE_ENV === 'production') ? process.env.MONGOLAB_URI : "mongodb://localhost/recycling_" + process.env.NODE_ENV
  ;


module.exports = {
  requiresDowntime: false, // true or false

  up: function(next) {
    MongoClient.connect(db_path, function(err, db){
      async.parallel([
        function(callback){
          db.collection('wards').update(
            {'alderman.name':"Patrick J. Oconnor"},
            {$set: {'alderman.name': "Patrick J. O'Connor"}},
            callback
          )
        },

        function(callback){
          db.collection('wards').update(
            {'alderman.name':"Mary Oconnor"},
            {$set: {'alderman.name': "Mary O'Connor"}},
            callback
          )
        },
      ], next)
    });
  },

  down: function(next) {
    MongoClient.connect(db_path, function(err, db){
      // down...
      next();
    });
  },

  test: function(){
    if (process.end.NODE_ENV !== 'test') {
      console.error("Please run migrate:test with `NODE_ENV=test`")
      return;
    }
    describe('up', function(){
      before(function(){})
      after(function(){})
      it('works');
    });

    describe('down', function(){
      before(function(){})
      after(function(){})
      it('works');
    });
  }
}
