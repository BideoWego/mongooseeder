const mongoose = require('mongoose');


module.exports = () => {

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











