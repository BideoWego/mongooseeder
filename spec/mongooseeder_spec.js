const mongoose = require('mongoose');
const mongooseeder = require('./../');
const models = require('./support/models');


describe('Mongooseeder', () => {
  const mongodbUrl = 'mongodb://localhost/mongooseeder_test';
  let oldConsoleLog;
  let oldMongooseDisconnect;
  let User;

  beforeEach(() => {
    oldMongooseDisconnect = mongoose.disconnect;
    mongoose.disconnect = () => {};

    oldConsoleLog = console.log;
    console.log = () => {};

    User = mongoose.model('User');
  });


  afterEach(() => {
    mongoose.disconnect = oldMongooseDisconnect;
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
        return User.create({ email });
      }
    })
      .then(() => User.findOne())
      .then(user => {
        expect(user.email).toBe(email);
        done();
      });
  });


  it('cleans', done => {
    const email = 'foo@bar.com';

    User.create({ email })
      .then(() => {
        mongooseeder.clean({
          mongodbUrl: mongodbUrl,
          models: models,
          mongoose: mongoose
        })
          .then(() => User.count())
          .then(count => {
            expect(count).toBe(0);
            done();
          });
      });

  });
});












