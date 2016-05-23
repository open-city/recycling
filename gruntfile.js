'use strict';

module.exports = function (grunt) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    migrations: {
      path: __dirname + '/migrations',
      template: grunt.file.read( __dirname + "/migrations/_template.js"),
      mongo: process.env.MONGOLAB_URI || 'mongodb://localhost/recycling_' + process.env.NODE_ENV,
      ext: 'js'
    },
    develop: {
      server: {
        file: 'server.js'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [
          'test/unit/**/*.js',
          'test/integration/**/*.js'
        ]
      }
    },
    watch: {
      options: {
        nospawn: true,
      },
      js: {
        files: [
          'server.js',
          'routes/**/*.js',
          'models/**/*.js',
          'public/js/**/*.js',
          'config/*.js'
        ],
        tasks: ['develop']
      },
      css: {
        files: [
          'public/css/*.css'
        ],
      },
      views: {
        files: [
          'views/*.ejs',
          'views/**/*.ejs'
        ],
      }
    }
  });

  grunt.config.requires('watch.js.files');
  let files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['check', 'develop', 'watch']);

  grunt.registerTask('check', 'See what\'s up in the local environment', function () {
    if (!process.env.PORT) {
      grunt.log.write('No port variable found, check environment variables');
    }
  });
};
