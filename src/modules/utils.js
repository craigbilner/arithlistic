'use strict';

const seedrandom = require('seedrandom');

module.exports.randomNumber = (seed, min, max) => ({
  seed: seed + 1,
  value: Math.floor(seedrandom(seed.toString())() * (max - min)) + min,
});
