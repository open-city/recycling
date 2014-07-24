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

    mv server/config/config.json.sample server/config/config.json
    psql
    postgres=# create role recycling login createdb;
    postgres=# create database recycling;
    postgres=# create database recycling_development;
    postgres=# create database recycling_test;
    postgres=# \q
    node_modules/sequelize-cli/bin/sequelize db:migrate

Running the app
---------------

node server/server.js
go to http://localhost:3000
