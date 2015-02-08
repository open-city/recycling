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
        callback(null, wards);
      })
    }
  ], function(err, wards){

    if (err) {
      console.error(err);
      res.status(500).end();
    }

    res.render('wards', {wards:wards})
  })
})

module.exports = router;