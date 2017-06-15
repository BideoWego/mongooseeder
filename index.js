const path = require('path');
const mongoose = require('mongoose');
const clean = require('./mongodb/clean');
const connect = require('./mongodb/connect');
const fs = require('fs');


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

`;


// ----------------------------------------
// Public
// ----------------------------------------

class Mongooseeder {
  constructor(options={}) {
    this.rootDir = options.rootDir ?
      path.resolve(options.rootDir) :
      process.env.PWD;

    const rcPath = `${ this.rootDir }/${ rcFilename}`;
    if (fs.existsSync(rcPath)) {
      options = require(rcPath);
    }

    this.seedsDir = path.resolve(
      this.rootDir,
      options.seedsDir || './seeds'
    );

    this.modelsDir = path.resolve(
      this.rootDir,
      options.modelsDir || './models'
    );
  }


  help() {
    log(helpMessage);
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
    } else {
      log('Seeds file already exists');
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


  cli() {
    const args = process.argv;
    const command = args[2];

    if (!command) {
      this.help();
      return;
    }

    if (this._isValidCommand(command)) {
      this[command]();
    } else {
      log(`MongooseederError: '${ command }' is not a valid command`);
    }
  }


  _isValidCommand(command) {
    return [
      'init',
      'help',
      'seed'
    ].includes(command);
  }
}




module.exports = Mongooseeder;










