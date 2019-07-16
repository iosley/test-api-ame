const { Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const axios = require('axios');

const mongo = require('../services/mongodb');

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      get: value => value,
      /* Capitalize every word */
      set: value => value.trim().split(/\s/)
        .map(v => `${v.charAt(0).toUpperCase()}${v.slice(1).toLowerCase()}`)
        .join(' '),
    },
    climate: {
      type: String,
      required: true,
      trim: true,
    },
    terrain: {
      type: String,
      required: true,
      trim: true,
    },
    films: {
      type: [String],
      default: [],
    },
    filmsAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

schema.pre('save', true, async function(next, done) {
  this.films = [];
  this.filmsAmount = 0;
  next();
  const url = `https://swapi.co/api/planets/?search=${this.name}`;
  const { results: [planet] } = await axios.get(url).then(({ data }) => data);
  if (planet) {
    const films = await Promise.all(
      planet.films.map(filmUrl => axios.get(filmUrl).then(({ data }) => data))
    );
    this.films = films.map(({ title }) => title);
    this.filmsAmount = films.length;
  }
  done();
});

schema.plugin(mongoosePaginate);

module.exports = mongo.model('planets', schema);
