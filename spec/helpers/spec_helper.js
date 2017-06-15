const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


// Set test environment
process.env.NODE_ENV = 'test';


beforeAll((done) => {
  const mockAppDir = path.resolve('.') + '/spec/app';
  fs.mkdir(mockAppDir, err => done());
});


beforeAll((done) => {
  if (mongoose.connection.readyState) {
    done();
  } else {
    require('./../../mongodb/connect')()
      .then(() => done());
  }
});


afterEach((done) => {
  require('./../../mongodb/clean')()
    .then(() => done())
    .catch((e) => console.error(e.stack));
});




