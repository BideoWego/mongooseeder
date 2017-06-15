const path = require('path');
const mongoose = require('mongoose');
const clean = require('./mongodb/clean');
const connect = require('./mongodb/connect');
const fs = require('fs');


mongoose.Promise = require('bluebird');


const globalize = (models) => {
  Object.keys(models).forEach((modelName) => {
    global[modelName] = mongoose.model(modelName);
  });
};


const log = (...args) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...args);
  }
};

const seedsFileContent = `

module.exports = () => {
  // Return a promise here after
  // you're done seeding
  return Promise.resolve();
};

`;


class Mongooseeder {
  constructor(options={}) {
    this.rootDir = options.rootDir ?
      path.resolve(options.rootDir) :
      process.env.PWD;
    this.seedsDir = path.resolve(
      this.rootDir,
      options.seedsDir || './seeds'
    );
    this.modelsDir = path.resolve(
      this.rootDir,
      options.modelsDir || './models'
    );
  }

  init() {
    log('Initializing Mongooseeder...');
    if (!fs.existsSync(this.seedsDir)) {
      log('Creating seeds file...');
      fs.mkdirSync(this.seedsDir);
      fs.writeFileSync(
        `${ this.seedsDir }/index.js`,
        seedsFileContent
      );
    }
    log('Done.');
  }

  seed() {
    // Clean
    return connect()
      .then(() => log('Cleaning database...'))
      .then(() => clean())

    // Load models
      .then(() => log('Loading models...'))
      .then(() => require(this.modelsDir))
      .then(models => globalize(models))

    // Seed
      .then(() => log('Seeding...'))
      .then(() => require(this.seedsDir)())

    // Done
      .then(() => log('Done.'));
  }
}




module.exports = Mongooseeder;










