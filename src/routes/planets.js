const { Router } = require('express');

const Planet = require('../models/planet');

const basePath = '/planets';

function wrapAsync(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

module.exports = Router()
  .get(`${basePath}`, wrapAsync(async (req, res) => {
    const { page, offset, limit = 10, search } = req.query;
    const dbQuery = search ? { name: search } : {};
    const planets = (page || offset)
      ? await Planet.paginate(dbQuery, {page, offset, limit})
      : await Planet.find(dbQuery);
    res.send(planets);
  }))
  .get(`${basePath}/:id`, (req, res) => {
    Planet.findOne({ _id: req.params.id })
      .then(planet => res.send(planet))
      .catch(err => res.status(404).send({ message: 'Planet not found' }))
  })
  .post(`${basePath}`, wrapAsync(async (req, res, next) => {
    const planet = new Planet(req.body);
    await planet.save();
    res.status(201).send(planet);
  }))
  .put(`${basePath}/:id`, wrapAsync(async (req, res) => {
    const planet = await Planet.findOne({ _id: req.params.id });
    planet.set(req.body);
    await planet.save();
    res.send(planet);
  }))
  .delete(`${basePath}/:id`, wrapAsync(async (req, res) => {
    const planet = await Planet.findOne({ _id: req.params.id });
    await planet.remove();
    res.sendStatus(204);
  }));
