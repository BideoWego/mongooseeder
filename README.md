# Mongooseeder
by [Bideo Wego](https://github.com/BideoWego)
View [Mongooseeder on NPM](https://www.npmjs.com/package/mongooseeder).


Simple Mongoose seeding. Mongooseeder wraps the process of connecting to MongoDB through Mongoose, cleaning old data, and seeding new data. It provides a straightforward interface to minimize the code necessary for seeding.


## Installation

```bash
$ npm install --save mongooseeder
```


## Usage

Mongooseeder wraps several basic operations

1. Connection to MongoDB via `mongoose`
1. Cleaning the database of old data
1. Seeding the database

**Note** Mongooseeder requires that an instance of `mongoose` be provided. This is because the same instance of `mongoose` must be used when connecting and seeding. So when calling the `.seed()` or `.clean()` methods you'll need to provide a reference to your `mongoose` instance.


### Connecting

Mongooseeder supports connecting via providing a full URL to a MongoDB database and also providing individual `host` and `database` parameters:

```javascript

// Connecting with URL
mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  //...
});

// Connecting with host and database name
mongooseeder.seed({
  database: 'your_database_name_here',
  host: 'localhost',
  //...
});
```


### Seeding

Seeding can be done by calling `.seed()` and providing the following parameters:

1. `mongodbUrl` or `host` and `database`: `String`, MongoDB connection parameters
1. `models`: `Object`, each key is the model name and the value is the model class object
    - Example: `{ User: User }`
1. `clean`: `Boolean`, if `true`, all provided models in the `models` parameter will have all documents removed from their collections.
1. `mongoose`: The `mongoose` instance you require in your seeds file
1. `seeds`: `Function`, the function to be called when seeding. **Must return a promise.**

`Mongooseeder.seed()` returns a promise.

```javascript
const mongoose = require('mongoose');
const mongooseeder = require('mongooseeder');
const models = require('./path/to/models');

const mongodbUrl = 'mongodb://localhost/your_db';

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: () => {

    // Run your seeds here
    // Example:
    return models.User.create({ email });
  }
});
```


### Cleaning

Mongooseeder provides a `.clean()` method for convenience if you wish to separate the cleaning process from the seeding process. Cleaning can be done by calling `.clean()` and providing the following parameters:

1. `mongodbUrl` or `host` and `database`: `String`, MongoDB connection parameters
1. `models`: `Object`, each key is the model name and the value is the model class object
    - Example: `{ User: User }`
1. `mongoose`: The `mongoose` instance you require in your seeds file

`Mongooseeder.clean()` returns a promise.

```javascript
const mongoose = require('mongoose');
const mongooseeder = require('mongooseeder');
const models = require('./path/to/models');

const mongodbUrl = 'mongodb://localhost/your_db';

mongooseeder.clean({
  mongodbUrl: mongodbUrl,
  models: models,
  mongoose: mongoose
});
```


### Creating an NPM Command

It can be useful to create an NPM script in your `package.json` to run seeds and create a file specifically for the seeding process. Then you can run your seeds file with the same command across multiple projects provided the same NPM script is set.

```javascript
// package.json

{
  //...
  "scripts": {
    //...
    "seed": "node seeds",
    "seeds": "node seeds"
  },
  //...
}
```

#### Run Seeds with NPM

```bash
$ npm run seeds
```


## License: MIT

Copyright 2017 Bideo Wego

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.















