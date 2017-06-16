const mongoose = require('mongoose');
const mongooseeder = require('./../');
const models = require('./support/models');


describe('Mongooseeder', () => {
  const mongodbUrl = 'mongodb://localhost/mongooseeder_test';
  let oldConsoleLog;

  beforeEach(() => {
    oldConsoleLog = console.log;
    console.log = () => {};
  });


  afterEach(() => {
    console.log = oldConsoleLog;
  });


  it('seeds', done => {
    const email = 'foo@bar.com';

    mongooseeder.seed({
      mongodbUrl: mongodbUrl,
      models: models,
      clean: true,
      mongoose: mongoose,
      seeds: () => {
        return models.User.create({ email });
      }
    })
      .then(() => models.User.findOne())
      .then(user => {
        expect(user.email).toBe(email);
        done();
      });
  });


  it('cleans', done => {
    const email = 'foo@bar.com';

    models.User.create({ email })
      .then(() => {
        mongooseeder.clean({
          mongodbUrl: mongodbUrl,
          models: models,
          mongoose: mongoose
        })
          .then(() => models.User.count())
          .then(count => {
            expect(count).toBe(0);
            done();
          });
      });

  });
});












