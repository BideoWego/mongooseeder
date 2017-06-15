const mongoose = require('mongoose');
const Mongooseeder = require('./../');
const fs = require('fs');
const path = require('path');


describe('Mongooseeder', () => {
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
});






