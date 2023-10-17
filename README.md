My Building Doesn't Recycle
===========================

Crowdsourcing data about which residential buildings do not have recycling in a given area. I am attempting to modify this fork to be generic, so instead of being Chicago-centric, it is possible to deploy this application for a new city looking to document recycling needs.

The app can currently be found at http://recycling.samacohen.com

Dependencies
------------

* [Node.js](http://nodejs.org/)
* [MongoDB](http://docs.mongodb.org/manual/)
* [Memcached](http://memcached.org/)

Running Your Own Instance
--------------------------------
If you'd like to run your own instance for your city, you can fork this repository and change the [configs](./config/) to make sense for your city. You can then push up a new branch, and trigger a GitHub Actions build for the branch. Then, if you also modify the [docker-compose.yml](./docker-compose.yml) file to point to your branch name, you can start the instance by simply running `docker compose up` once you've copied the compose file down. See the [denver](https://github.com/samc1213/recycling/tree/denver) branch for an example.

The server runs on port 3000 by default, so visit [http://localhost:3000](http://localhost:3000) in your browser to view it.

Getting Started With Development
--------------------------------
To start developing, first install Docker and [Docker Compose](https://docs.docker.com/compose/install/). Then run:

```bash
docker compose -f docker-compose.dev.yml up --build
```

The `docker-compose.dev.yml` file maps the repository to the docker container, so any client-side changes will be reflected immediately. Any changes to the node server itself will require a restart of the recycling container, which can be done with `docker compose -f docker-compose.dev.yml restart recycling`.

To clean all the data from the mongoDB database, you can run `docker compose -f docker-compose.dev.yml down -v`

Tests
-----
Run the tests with ```npm test```

