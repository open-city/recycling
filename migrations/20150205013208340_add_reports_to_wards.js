process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var MongoClient = require('mongodb').MongoClient
  , db_path = (process.env.NODE_ENV === 'production') ? process.env.MONGOLAB_URI : "mongodb://localhost/recycling_" + process.env.NODE_ENV
  ;


module.exports = {
  requiresDowntime: false, // true or false

  up: function(next) {
    MongoClient.connect(db_path, function(err, db){
      db.collection('locations').find({}, function(err, docs){
        docs.count(function(err, docsLength){
          var counter = 0;
          docs.nextObject(processDoc)

          function processDoc(err, doc) {
            if (doc === null) return;
            counter++;
            db.collection('wards').findOne({
              geometry: { $geoIntersects: { $geometry: doc.geoJsonPoint }}
            }, function(err, ward){
              if (!ward) {
                console.log('no ward found for location ' + doc.address.trim())
                docs.nextObject(processDoc)
                return
              }
              db.collection('wards').update(
                {_id: ward._id},
                { $push: { locations: doc._id }}, 
                function(err){
                  if (err) console.error(err);

                  console.log( counter + " of " + docsLength);
                  if (counter >= docsLength) {
                    next();
                  } else {
                    docs.nextObject(processDoc)
                  }
                }
              )
            })
          }
        })
      })
    });
  },

  down: function(next) {
    MongoClient.connect(db_path, function(err, db){
      db.collection('wards').update({}, {$unset: {'locations':1}}, {multi:true}, next);
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
