process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../index');
const Planet = require('../src/models/planet');

chai.use(chaiHttp);

const dummiPlanet = { name: 'Tatooine', climate: 'arid', terrain: 'desert' };

describe('Planets', () => {
  beforeEach((done) => {
    Planet.deleteMany({}).then(() => done()).catch(done);
  });

  after((done) => {
    server.server.close();
    setTimeout(() => process.exit(0), 1E3);
    done();
  });

  describe('/GET planets', () => {
    it('Should return all planets', (done) => {
      chai.request(server)
        .get('/planets')
        .end(function (error, res) {
          if (error) return done(error);
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });

  describe('/POST planets', () => {
    it('Should not create planet with no name', (done)  => {
      const planet = { ...dummiPlanet, name: '' };
      chai.request(server)
        .post('/planets')
        .send(planet)
        .end((error, res) => {
          if (error) return done(error);
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').include('required');
          done();
        });
    });

    it('Should create a planet', (done) => {
      chai.request(server)
        .post('/planets')
        .send(dummiPlanet)
        .end((error, res) => {
          if (error) return done(error);
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.name.should.be.a('string');
          res.body.should.have.property('climate');
          res.body.climate.should.be.a('string');
          res.body.should.have.property('terrain');
          res.body.terrain.should.be.a('string');
          res.body.should.have.property('films');
          res.body.films.should.be.a('array');
          res.body.films.should.be.not.empty;
          res.body.should.have.property('filmsAmount');
          res.body.filmsAmount.should.be.a('number');
          res.body.filmsAmount.should.be.above(0);
          done();
        });
    });
  });

  describe('/GET/:id planets', () => {
    it('Should return a planet from ID', (done) => {
      const planet = new Planet(dummiPlanet);
      planet.save()
        .then(() => {
          chai.request(server)
            .get(`/planets/${planet._id}`)
            .send(planet)
            .end((error, res) => {
              if (error) return done(error);
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('_id');
              res.body.name.should.be.a('string');
              res.body.should.have.property('name');
              res.body.name.should.be.a('string');
              res.body.should.have.property('climate');
              res.body.climate.should.be.a('string');
              res.body.should.have.property('terrain');
              res.body.terrain.should.be.a('string');
              res.body.should.have.property('films');
              res.body.films.should.be.a('array');
              res.body.films.should.be.not.empty;
              res.body.should.have.property('filmsAmount');
              res.body.filmsAmount.should.be.a('number');
              res.body.filmsAmount.should.be.above(0);
              done();
            });
        })
        .catch(err => done(err));
    });
  });

  describe('/PUT/:id planets', () => {
    it('Should modify a planet from ID', (done) => {
      const planet = new Planet(dummiPlanet);
      planet.save()
        .then(() => {
          chai.request(server)
            .put(`/planets/${planet._id}`)
            .send({ name: 'new planet' })
            .end((error, res) => {
              if (error) return done(error);
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('_id');
              res.body.name.should.be.a('string');
              res.body.should.have.property('name');
              res.body.name.should.be.a('string');
              res.body.should.have.property('climate');
              res.body.climate.should.be.a('string');
              res.body.should.have.property('terrain');
              res.body.terrain.should.be.a('string');
              res.body.should.have.property('films');
              res.body.films.should.be.a('array');
              res.body.films.should.be.empty;
              res.body.should.have.property('filmsAmount');
              res.body.filmsAmount.should.be.a('number');
              res.body.filmsAmount.should.be.equal(0);
              done();
            });
        })
        .catch(err => done(err));
    });
  });

  describe('/DELETE/:id planets', () => {
    it('Should delete a planet from ID', (done) => {
      const planet = new Planet(dummiPlanet);
      planet.save()
        .then(() => {
          chai.request(server)
            .delete(`/planets/${planet._id}`)
            .end((error, res) => {
              if (error) return done(error);
              res.should.have.status(204);
              done();
            });
        })
        .catch(err => done(err));
    });
  });
});