process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var MongoClient = require('mongodb').MongoClient
  , fs = require('fs')
  , db_path = (process.env.NODE_ENV === 'production') ? process.env.MONGOLAB_URI : "mongodb://localhost/recycling_" + process.env.NODE_ENV
  ;


var files = fs.readdirSync('./migrations/data/wards/')
var wards = [];
files.forEach(function(file){
  var path = './data/wards/' + file;
  var raw = require(path);
  ward = {
    number: raw.number,
    geometry: raw.geometry,
    alderman: {
      name: raw.alderman.name,
      phone: raw.alderman.voice,
      email: raw.alderman.email
    },
    centroid: raw.centroid
  }
  wards.push(ward);
});

module.exports = {
  requiresDowntime: false, // true or false

  up: function(next) {
    MongoClient.connect(db_path, function(err, db){
      // here we go again
      db.collection('wards').drop(function(err, reply) {
        db.collection('wards').insertMany(wards, function(err, reply) {
          db.collection('locations').find({}, function(err, docs) {
            docs.count(function(err, docsLength){
              if (docsLength === 0) {
                return next();
              }
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
                    { $addToSet: { locations: doc._id }},
                    function(err){
                      if (err) console.error(err);

                      console.log( counter + " of " + docsLength);
                      if (counter >= docsLength) {
                        next();
                      } else {
                        docs.nextObject(processDoc);
                      }
                    }
                  )
                })
              }
            })
          })
        });
      });
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
