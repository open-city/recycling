var express = require('express')
  , async = require('async')
  , cache = require('memjs').Client.create()
  , mongoose = require('mongoose')
  , router = express.Router()
  , Ward = require('../models/Ward')
  ;

router.get('/wards', function(req, res){
  res.locals.navActive.wards = 'active';
  res.locals.bodyClass = 'wards';


  async.waterfall([

    function(callback){
      cache.get('wards.all', function(err, cached){
        if (err) console.error(err);
        cached = cached ? JSON.parse(cached.toString()) : false;
        callback(null, cached);
      });
    },

    function(cached, callback) {
      if (cached) {
        callback(null, cached);
        return;
      }

      Ward.find().populate('locations').sort({number:'asc'}).exec(function(err, wards){
        if (err) {
          console.error(err);
          res.status(500).end();
        }

        cache.set('wards.all', JSON.stringify(wards), null, 3600);
        return callback(null, wards);
      })
    }
  ], function(err, wards){

    if (err) {
      console.error(err);
      res.status(500).end();
    }

    res.render('wards/index', {wards:wards})
  })
})



router.get('/wards/:id', function(req, res){
  res.locals.navActive.wards = 'active';
  res.locals.bodyClass = 'wards single';
  var wardId = req.params.id;
  var cacheIdx = 'wards.' + wardId;

  async.waterfall([

    function(callback){
      cache.get(cacheIdx, function(err, cached){
        if (err) console.error(err);
        cached = cached ? JSON.parse(cached.toString()) : false;
        callback(null, cached);
      });
    },

    function(cached, callback) {
      if (cached) {
        callback(null, cached);
        return;
      }

      Ward.findOne({number:wardId}).populate('locations').exec(function(err, ward){
        if (err) {
          console.error(err);
          res.status(500).end();
        }

        ward.locations.sort(sortAddresses);

        cache.set(cacheIdx, JSON.stringify(ward), null, 3600);
        callback(null, ward);
      })
    }
  ], function(err, ward){

    if (err) {
      console.error(err);
      res.status(500).end();
    }
    res.render('wards/show', {ward:ward});

  })
})



function sortAddresses(a, b) {
  addressA = parseAddress(a);
  addressB = parseAddress(b);
  
  if (addressA.street < addressB.street)
    return -1;

  if (addressA.street > addressB.street)
    return 1;


  if (addressA.direction < addressB.direction)
    return -1;

  if (addressA.direction > addressB.direction)
    return 1;


  if (addressA.number < addressB.number)
    return -1;

  if (addressA.number > addressB.number)
    return 1;

  return 0;
}

function parseAddress(loc) {
  var address = loc.address.trim();
  var parts = address.split(' ', 3);
  return {
    number: parseInt(parts[0],10),
    direction: parts[1],
    street: parts[2]
  }
}

module.exports = router;
