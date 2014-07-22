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

    psql
    postgres=# create role recycling login createdb;
    postgres=# create database recycling;
    postgres=# create database recycling_development;
    postgres=# create database recycling_test;
    postgres=# \q
    node_modules/sequelize-cli/bin/sequelize db:migrate
