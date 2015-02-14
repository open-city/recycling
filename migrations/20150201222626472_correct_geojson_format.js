process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var MongoClient = require('mongodb').MongoClient
  , db_path = (process.env.NODE_ENV === 'production') ? process.env.MONGOLAB_URI : "mongodb://localhost/recycling_" + process.env.NODE_ENV
  ;


module.exports = {
  requiresDowntime: false, // true or false

  up: function(next) {
    MongoClient.connect(db_path, function(err, db){
      var counter = 0;
      var cursor = db.collection('locations').find()

      cursor.toArray(function(err, docs){
        docs.forEach(function(doc, idx){
          var geoJsonPoint = {
            type: 'Point',
            coordinates: [
              doc.geoPoint[0],
              doc.geoPoint[1]
            ]
          }

          db.collection('locations').update(
            {_id: doc._id}, 
            {$set: {"geoJsonPoint": geoJsonPoint}, $unset: {"geoPoint": 1}}, 
          function(err){
            if (idx >= docs.length - 1) {
              console.log(idx + " locations processed");
              next();
            }
          })
        })
      })

    });
  },

  down: function(next) {
    MongoClient.connect(db_path, function(err, db){
      db.collection('locations').find({}, function(err, docs){
        var processDoc = function(err, doc) {
          if (doc === null) {
            next();
            return;
          }

          var geoPoint = doc.geoJsonPoint.coordinates;

          db.collection('locations').update(
            {_id: doc._id}, 
            {$set: {"geoPoint": geoPoint}, $unset: {"geoJsonPoint": 1}}, 
          function(err){
            docs.nextObject(processDoc);
          })
        }

        docs.nextObject(processDoc);
      })
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
