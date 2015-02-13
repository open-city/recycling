process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var MongoClient = require('mongodb').MongoClient
  , async = require('async')
  , fs = require('fs')
  , db_path = (process.env.NODE_ENV === 'production') ? process.env.MONGOLAB_URI : "mongodb://localhost/recycling_" + process.env.NODE_ENV
  ;

module.exports = {
  requiresDowntime: false, // true or false

  up: function(next) {

    var wards = fs.readFileSync('./migrations/data/ward_emails.json').toString();
    wards = JSON.parse(wards);

    MongoClient.connect(db_path, function(err, db){
      // up...

      counter = 0;
      wards.forEach(function(ward){
        
        console.log("Added email " + ward.email + " to ward " + ward.number);
        db.collection('wards').update(
          {number:ward.number}, 
          {$set: {'alderman.email': ward.email}},
          function(err, rslt){
            if (err) console.error(err);

            counter++;
            if (counter === wards.length) {
              next();
            }
          }
        )
      })
    });
  },

  down: function(next) {
    MongoClient.connect(db_path, function(err, db){
      db.collection('wards').update({}, {$unset: {'alderman.email':1}}, {multi:true}, next);
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
