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


  describe('rc file', () => {
    const rcPath = `${ path.resolve('.') }/spec/app/.mongooseederrc`;
    const removeRc = () => fs.existsSync(rcPath) && fs.unlinkSync(rcPath);
    let mongooseeder;

    beforeEach(() => {
      mongooseeder = new Mongooseeder({
        rootDir: path.resolve('./spec/app')
      });

      delete require.cache[rcPath];

      removeRc();
    });


    afterEach(() => {
      removeRc();
    });


    it('recognizes and loads the rc file', () => {
      const data = JSON.stringify({
        seedsDir: './foobar',
        modelsDir: './fizbaz'
      });
      fs.writeFileSync(rcPath, `module.exports = ${ data };`);
      const mongooseeder = new Mongooseeder({
        rootDir: path.resolve('./spec/app')
      });
      expect(mongooseeder.seedsDir).toBe(
        path.resolve('.', `./spec/app/foobar`)
      );
      expect(mongooseeder.modelsDir).toBe(
        path.resolve('.', `./spec/app/fizbaz`)
      );
    });


    it('uses a custom clean function from rc file', done => {
      fs.writeFileSync(rcPath, `module.exports = { clean: function() {} };`);
      const mongooseeder = new Mongooseeder({
        rootDir: path.resolve('./spec/app'),
        seedsDir: './seeds',
        modelsDir: './models'
      });
      expect(typeof mongooseeder.clean).toBe("function");
      mongooseeder.clean = jasmine.createSpy('clean');
      mongooseeder.seed()
        .then(() => {
          expect(mongooseeder.clean).toHaveBeenCalled();
          done();
        });
    });
  });



});






