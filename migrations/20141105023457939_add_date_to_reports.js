process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var async = require('async')
  , MongoClient = require('mongodb').MongoClient
  , db_path = (process.env.NODE_ENV === 'production') ? process.env.MONGOLAB_URI : "mongodb://localhost/recycling_" + process.env.NODE_ENV
  ;


module.exports = {
  requiresDowntime: false, // true or false

  up: function(next) {
    MongoClient.connect(db_path, function(err, db){
      db.collection('reports').find({}, function(err, docs){
        var processDoc = function(err, doc) {
          if (doc === null) {
            next();
            return;
          }
          
          var ts = doc._id.getTimestamp();
          var d = new Date(ts);
          doc.date = d;
          db.collection('reports').update({_id:doc._id}, {date: d}, function(err){
            docs.nextObject(processDoc);
          })
        }
        docs.nextObject(processDoc);
      });
    });
  },

  down: function(next) {
    MongoClient.connect(db_path, function(err, db){
      db.collection('reports').find({}, function(err, docs){
        var processDoc = function(err, doc) {
          if (doc === null) {
            next();
            return;
          }
          
          var ts = doc._id.getTimestamp();
          var d = new Date(ts);
          doc.date = d;
          db.collection('reports').update({_id:doc._id}, {$unset: {date: 1}}, function(err){
            docs.nextObject(processDoc);
          })
        }
        docs.nextObject(processDoc);
      });
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
