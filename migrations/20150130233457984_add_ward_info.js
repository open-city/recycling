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
    number: parseInt(raw.number,10),
    geometry: raw.geometry,
    alderman: {
      name: raw.alderman.name,
      phone: raw.alderman.voice
    },
    centroid: raw.centroid
  }
  wards.push(ward);
});

module.exports = {
  requiresDowntime: false, // true or false

  up: function(next) {
    MongoClient.connect(db_path, function(err, db){
      db.collection('wards').insert(wards, next);
    });
  },

  down: function(next) {
    MongoClient.connect(db_path, function(err, db){
      db.collection('wards').drop(next);
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

function ucwords(string) {
  var a = string.split(' ');
  a.forEach(function(word, i){
    word = word.toLowerCase();
    word = word.charAt(0).toUpperCase() + word.slice(1);
    a[i] = word;
  })
  return a.join(' ');
}
