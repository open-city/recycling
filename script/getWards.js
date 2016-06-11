const util = require('util');
const fs = require('fs');
const path = require('path');

const request = require('request');
const _ = require('async');

var dataDir = path.resolve(__dirname, '..', 'migrations/data/wards/');

var API = {
  base: 'http://ocd.datamade.us',
  orgId: 'ocd-organization/ef168607-9135-4177-ad8e-c1f7a4806c3a',
  geomUrl: function (resource) {
    return util.format('%s/boundaries/chicago-wards-2015/%s/',
                       this.base,
                       resource);
  },
  getUrl: function (resource) {
    return util.format('%s/%s', API.base, resource);
  }
};


function getPeopleUrls() {
  let peopleUrls = [];
  request
    .get(API.getUrl(API.orgId), function (err, response, body) {
      if (err) { throw err; }
      JSON.parse(body).memberships.map((membership) => {
        peopleUrls.push(API.getUrl(membership.person.id));
      });
    })
    .on('complete', () => {
      let peopleSet = new Set();
      peopleUrls = peopleUrls.filter((url) => {
        if (!peopleSet.has(url)) {
          peopleSet.add(url);
          return true;
        } else {
          return false;
        }
      });
      getPersonData(peopleUrls);
    });
}

function getPersonData(peopleUrls) {
  _.map(peopleUrls, (url, cb) => {
    request.get(url, function (err, response, body) {
      if (err) { return cb(err); }
      let person = JSON.parse(body);
      let memberships = person.memberships.filter(function (membership, index, coll) {
        return membership.post !== null && membership.organization.id === API.orgId && membership.end_date === '';
      });
      if (memberships.length > 1) {
        cb(new Error('Oh no! what membership do we pick?!?'));
      }
      let post = memberships.length > 0 ? memberships[0].post:{};
      cb(null, {person: person, post: post});
    });
  }, (err, results) => {
    console.log(`Collected ${results.length} people results`);
    getAllCentroidData(results);
  });
}

function getAllCentroidData(data) {
  _.map(data, getCentroidData, (err, results) => {
    results = results.filter((data) => {
      return data !== false;
    });
    console.log(`Got cetroids for ${results.length} wards`);
    getAllShapeData(results);
  });
}

function getCentroidData(ward, cb) {
  if (!ward.post.label) {
    return cb(null, false);
  }
  let url = API.geomUrl(slugify(ward.post.label));
  request.get(url, function (err, response, body) {
    if (err) { return cb(err); }
    let geo = JSON.parse(body);
    ward.centroid = geo.centroid;
    ward.shapeUrl = geo.related.simple_shape_url;
    return cb(null, ward);
  });
}

function getAllShapeData(data) {
  _.map(data, getShapeData, (err, results) => {
    results = results.filter((data) => {
      return data !== false;
    });
    console.log(`Got shapes for ${results.length} wards`);
    getCleanWards(results);
  });
}

function getShapeData(ward, cb) {
  let url = API.getUrl(ward.shapeUrl);
  request.get(url, function (err, response, body) {
    if (err) { return cb(err); }
    ward.simple_shape =JSON.parse(body);
    return cb(null, ward);
  });
}

function getCleanWards(data) {
  _.map(data, cleanWardDocument, (err, results) => {
    console.log(`Got ${results.length} clean wards`);
    makeWardFiles(results);
  });
}

function cleanWardDocument(ward, cb) {
  let newWard = {};
  newWard.alderman = {};
  newWard.alderman.name = reverseWords(ward.person.name);
  ward.person.contact_details.map((contact) => {
    newWard.alderman[contact.type] = contact.value;
  });
  newWard.number = pluckNumber(ward.post.label);
  newWard.geometry = ward.simple_shape;
  newWard.centroid = ward.centroid;
  return cb(null, newWard);
}

function makeWardFiles(wardDocs) {
  _.map(wardDocs, makeWardFile, (err, results) => {
    console.log(err);
    console.log(`Wrote ${results.length} files to disk`);
  })
}

function makeWardFile(ward, cb) {
  let absPath = `${dataDir}/ward${ward.number}.json`
  let data = JSON.stringify(ward);
  fs.writeFile(absPath, data, (err) => {
    if (err) {
      console.log(err);
      return cb(err);
    }
    return cb(null, absPath);
  });
}

function reverseWords(str) {
  // transform: Smith, John -> John Smith
  return str.split(', ').reverse().join(' ');
}

function slugify(str) {
  return str.replace(' ', '-').toLowerCase();
}

function pluckNumber(str) {
  return +str.match(/\d+/)[0];
}

function main(args) {
  if (args[2] !== 'run') {
    console.log([
      'Download, parse and clean ward data from the Data Made API.',
      'Usage: node script/getWards.js run'
    ].join('\n'));
  } else {
    getPeopleUrls();
  }
}

main(process.argv);
