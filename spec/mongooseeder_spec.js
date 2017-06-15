const mongoose = require('mongoose');
const Mongooseeder = require('./../');
const fs = require('fs');
const path = require('path');


describe('Mongooseeder', () => {
  let oldConsoleLog;


  beforeEach(() => {
    oldConsoleLog = console.log;
    console.log = () => {};
  });


  afterEach(() => {
    console.log = oldConsoleLog;
  });


  it('initializes', (done) => {
    const seedsFileContent = [
    ,
    ,
    'module.exports = () => {',
    '  // Return a promise here after',
    '  // you\'re done seeding',
    '  return Promise.resolve();',
    '};',
    ,
    ,
    ].join('\n');

    const rootDir = `${ path.resolve('.') }/spec/app/`;
    const seedsDir = `${ path.resolve('.') }/spec/app/seeds/`;
    const seedsFile = `${ path.resolve('.') }/spec/app/seeds/index.js`;

    const mongooseeder = new Mongooseeder({
      rootDir: `${ path.resolve('.') }/spec/app/`
    });

    fs.rmdir(`${ path.resolve('.') }/spec/app/seeds/`, err => {
      mongooseeder.init();
      expect(fs.readFileSync(seedsFile, 'utf8')).toBe(seedsFileContent);
      done();
    });

  });


  it('seeds', (done) => {
    const oldPwd = process.env.PWD;
    process.env.PWD = path.resolve('./app');

    const mongooseeder = new Mongooseeder();

    mongooseeder.seed()
      .then(() => User.findOne())
      .then(user => {
        expect(user).not.toBe(undefined);
        expect(user).not.toBe(null);
      })
      .then(() => Post.findOne())
      .then(post => {
        expect(post).not.toBe(undefined);
        expect(post).not.toBe(null);
        done();
        process.env.PWD = oldPwd;
      });
  });


  it('outputs a help message', () => {
    const mongooseeder = new Mongooseeder();
    console.log = jasmine.createSpy('log');
    mongooseeder.help();
    expect(console.log).toHaveBeenCalledWith([
      ,
      'Mongooseeder',
      '============',
      ,
      'Commands:',
      '  help      Output help information',
      '  init      Create a seeds file if none exists',
      '  seed      Run the current seeds file',
      ,
      ,
    ].join('\n'));
  });


  it('calls the correct method when passed via CLI', () => {
    const mongooseeder = new Mongooseeder();
    const methods = ['help', 'init', 'seed'];
    methods.forEach(method => {
      process.argv = [,,method];
      mongooseeder[method] = jasmine.createSpy(method);
      mongooseeder.cli();
      expect(mongooseeder[method]).toHaveBeenCalled();
    });
  });
});






