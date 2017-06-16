"use strict";

const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';


mongoose.Promise = require('bluebird');

// ----------------------------------------
// Private
// ----------------------------------------

const rcFilename = '.mongooseederrc';


const globalize = (models) => {
  Object.keys(models).forEach((modelName) => {
    global[modelName] = mongoose.model(modelName);
  });
};


const log = (...args) => {
  console.log(...args);
};


const clean = () => {
  // Get all collections
  let collections = mongoose
    .connection
    .collections;

  // Get collection names
  let collectionKeys = Object.keys(collections);

  // Store promises
  let promises = [];

  // For each collection
  collectionKeys.forEach((key) => {

    // Remove all documents
    const promise = collections[key].remove();
    promises.push(promise);
  });

  return Promise.all(promises);
};


const connect = (config) => {
  if (mongoose.connection.readyState) {
    return Promise.resolve();
  }

  var envUrl = process.env[config.use_env_variable];
  var localUrl = `mongodb://${ config.host }/${ config.database }`;
  var mongoUrl =  envUrl ? envUrl : localUrl;
  return mongoose.connect(mongoUrl);
};


const seedsFileContent = `

module.exports = () => {
  // Return a promise here after
  // you're done seeding
  return Promise.resolve();
};

`;


const helpMessage = `
Mongooseeder
============

Commands:
  help      Output help information
  init      Create a seeds file if none exists
  seed      Run the current seeds file
  clean     Clean the database

`;


// ----------------------------------------
// Public
// ----------------------------------------

class Mongooseeder {
  constructor(options={}) {
    this.argv = require('yargs').argv;

    this.root = options.root ?
      path.resolve(options.root) :
      process.env.PWD;

    const rcPath = `${ this.root }/${ rcFilename}`;
    if (fs.existsSync(rcPath)) {
      options = require(rcPath);
      this.customCleaner = options.clean;
    }

    const configPath = path.resolve(
      this.root,
      options.config || './config'
    );
    this.config = require(configPath)[env];

    this.seeds = path.resolve(
      this.root,
      options.seeds || './seeds'
    );

    this.models = path.resolve(
      this.root,
      options.models || './models'
    );

    if (this.argv.debug) {
      console.info(this);
    }
  }


  help() {
    log(helpMessage);
  }


  init() {
    log('Initializing Mongooseeder...');
    if (!fs.existsSync(this.seeds)) {
      log('Creating seeds file...');
      fs.mkdirSync(this.seeds);
      fs.writeFileSync(
        `${ this.seeds }/index.js`,
        seedsFileContent
      );
    } else {
      log('Seeds file already exists');
    }
    log('Done.');
  }


  seed() {
    // Clean
    return this._connect()
      .then(() => this.clean())

    // Load models
      .then(() => log('Loading models...'))
      .then(() => require(this.models))
      .then(models => globalize(models))

    // Seed
      .then(() => log('Seeding...'))
      .then(() => require(this.seeds)())

    // Done
      .then(() => log('Done.'))
      .catch(err => console.error(err));
  }


  cli() {
    const args = process.argv;
    const command = args[2];

    if (!command) {
      this.help();
      return;
    }

    if (this._isValidCommand(command)) {
      const result = this[command]();
      if (result && result.then) {
        result.then(() => process.exit());
      }
    } else {
      log(`MongooseederError: '${ command }' is not a valid command`);
    }
  }


  clean() {
    return this._connect()
      .then(() => log('Cleaning database...'))
      .then(() => {
        return (this.customCleaner && this.customCleaner())
          || clean()
      })
      .then(() => log('Clean!'))
      .catch(err => console.error(err));
  }


  _isValidCommand(command) {
    return [
      'init',
      'help',
      'seed',
      'clean'
    ].includes(command);
  }


  _connect() {
    return connect(this.config);
  }
}




module.exports = Mongooseeder;










