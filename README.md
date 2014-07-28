Requirements
============

node (http://nodejs.org/)
postgres (http://www.postgresql.org/)


Getting Started
===============

Install dependencies
--------------------

npm install

Setup Database
--------------

    cp config/config.json.sample config/config.json
    psql
    postgres=# create role recycling login createdb;
    postgres=# create database recycling;
    postgres=# create database recycling_development;
    postgres=# create database recycling_test;
    postgres=# \q
    node_modules/sequelize-cli/bin/sequelize db:migrate

Setup Environment Vars
----------------------

    # Get an existing developer to give you the appropriate values
    cp config/envvars.js.sample config/envvars.js


Running the app
---------------

node server/server.js
go to http://localhost:3000
