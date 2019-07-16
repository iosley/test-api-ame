const mongoose = require('mongoose');

const { database: { uri, options = {} } } = require('../../config');

module.exports = mongoose.createConnection(uri, options);
