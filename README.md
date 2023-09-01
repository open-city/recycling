My Building Doesn't Recycle
===========================

Crowdsourcing data about which residential buildings do not have recycling in a given area. I am attempting to modify this fork to be generic, so instead of being Chicago-centric, it is possible to deploy this application for a new city looking to document recycling needs.

The app can currently be found at http://mybuildingdoesntrecycle.com

Dependencies
------------

* [Node.js](http://nodejs.org/)
* [MongoDB](http://docs.mongodb.org/manual/)
* [Memcached](http://memcached.org/)

Getting Started
---------------
To start developing, first install Docker and [Docker Compose](https://docs.docker.com/compose/install/). Then run:

```bash
docker compose -f docker-compose.dev.yml up --build
```

The `docker-compose.dev.yml` file maps the repository to the docker container, so any client-side changes will be reflected immediately. Any changes to the node server itself will require a restart of the recycling container, which can be done with `docker compose -f docker-compose.dev.yml restart recycling`.

Tests
-----
Run the tests with ```npm test```

