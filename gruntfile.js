module.exports = function(grunt) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  grunt.loadNpmTasks('grunt-mongo-migrations');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    migrations: {
      path: __dirname + '/migrations',
      template: grunt.file.read( __dirname + "/migrations/_template.js"),
      mongo: process.env.MONGOLAB_URI || 'mongodb://localhost/recycling_' + process.env.NODE_ENV,
      ext: 'js'
    }
  });
}
