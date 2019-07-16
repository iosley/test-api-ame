const express = require('express');
const path = require('path');
const fs = require('fs');

function loadRoutes(dir) {
  return fs.readdirSync(dir)
    .filter(item => !(item === '.' || item === '..'))
    .reduce((router, item) => {
      const fullPath = path.join(dir, item);
      if (fullPath === __filename) return router;
      if (!fs.lstatSync(fullPath).isFile()) return router.use(loadRoutes(fullPath));
      if (item.slice(-3) !== '.js') return router;
      return router.use(require(fullPath));
    }, express.Router());
}

module.exports = loadRoutes(__dirname);
