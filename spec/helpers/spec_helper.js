const mongoose = require('mongoose');


// Set test environment
process.env.NODE_ENV = 'test';


beforeEach((done) => {
  if (mongoose.connection.readyState) {
    done();
  } else {
    mongoose.connect('mongodb://localhost/mongooseeder_test')
      .then(() => done());
  }
});


afterEach((done) => {
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

  Promise.all(promises)
    .then(() => done())
    .catch((e) => console.error(e.stack));
});




