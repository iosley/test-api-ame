const express = require('express');
const bodyParser = require('body-parser');
const { AssertionError } = require('assert');
const { MongoError } = require('mongodb');
const { Error: MongooseError } = require('mongoose');

const routes = require('./src/routes');
const config = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', routes);

app.use('*', (req, res) => {
  return res.status(404).send({ message: 'Not found' });
});

app.use(function errorHandler(error, req, res, next) {
  if (error instanceof AssertionError) {
    return res.status(400).send({
      type: 'AssertionError',
      message: error.message,
    });
  }

  if (error instanceof MongoError) {
    const status = (error.message.toLowerCase().search('duplicate key') >= 0) ? 409 : 500;
    return res.status(status).send({
      type: 'MongoError',
      message: error.message,
    });
  }

  if (error instanceof MongooseError) {
    return res.status(400).send({
      type: 'MongooseError',
      message: error.message,
    });
  }

  next(error);
});

app.server = app.listen(config.app.port, () => {
  console.log(`App Listening on port ${config.app.port}`);
});

module.exports = app;
