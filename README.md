# Mongooseeder
by [Bideo Wego](https://github.com/BideoWego)

Easy/simple seeding for [Mongoose.js](http://mongoosejs.com) with a small CLI.


## Install

```bash
$ npm install --save mongooseeder
```


## Usage


Basic usage for Mongooseeder can be viewed by running `mongooseeder help`:

```bash
$ mongooseeder help

Mongooseeder
============

Commands:
  help      Output help information
  init      Create a seeds file if none exists
  seed      Run the current seeds file
  clean     Clean the database

```


### Commands

#### `help`
- Outputs help information

#### `init`
- Create a seeds file if none exists

#### `seed`
- Run the current seeds file

#### `clean`
- Clean the database


## Default Setup

Mongooseeder works out of the box with the following default folder/file structure.


### Mongoose Config

It is normal to have a JSON file with configuration options for different environments. By default, Mongooseeder expects this file to be an `index.json` file in the `config/` directory of your project. The format that Mongooseeder expects is as follows:

```javascript
{
  "development": {
    "database": "DATABASE_NAME_development",
    "host": "localhost"
  }
  "test": {
    "database": "DATABASE_NAME_test",
    "host": "localhost"
  },
  "production": {
    "use_env_variable": "MONGODB_URI"
  }
}
```


### Models

Mongooseeder by default will load your models by loading a `models/index.js` file. You should have a `models/` folder in your root application directory with an `index.js` file in it that exports a `models` object which contains keys for each of your models. Here's an example:

```javascript
// models/index.js

const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

// Enable logging if not testing
(process.env.NODE_ENV === 'test') ||
  mongoose.set('debug', true);


const models = {};


models.User = require('./user');
models.Post = require('./post');




module.exports = models;
```

This allows you to require your models in the order necessary to resolve your own dependencies etc...


### Seeds

Running `mongooseeder init` will create a `seeds/index.js` file with the following default code:

```javascript
// seeds/index.js

module.exports = () => {
  // Return a promise here after
  // you're done seeding
  return Promise.resolve();
};


```

In this file you have global access to your models so there's no need to require them. The only requirement is that you return a promise from the exported function. This allows Mongooseeder to know when your seeding operations have completed. Here's an example seeds file with Mongoose code to seed a few associated models:

```javascript
// seeds/index.js

module.exports = () => {
  let userAttrs = {
    name: 'Foo',
    email: 'foo@bar.com'
  };

  let postAttrs = {
    title: 'Foobar',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
  };

  return Post.create(postAttrs)
    .then(result => {
      post = result;
      return User.create(userAttrs);
    })
    .then(result => user = result)
    .then(() => {
      post.user = user;
      return post.save();
    })
    .then(() => {
      user.posts.push(post);
    });
};
```


## Configuring Mongooseeder with a `.mongooseederrc` File

If you must use a different folder structure than the default you can create a `.mongooseederrc` file in your project's root directory and configure Mongooseeder in there. Export an object with the keys set to the appropriate paths for the files Mongooseeder requires. You can use relative paths as Mongooseeder will resolve them to absolute paths under the hood:

```javascript
// .mongooseederrc

module.exports = {
  config: './new_config_directory/some_file.json',
  seeds: './new_seeds_directory/some_file.js',
  models: './new_models_directory'
};
```


### Custom Database Cleaning

Mongooseeder will clean the database (completely removing all documents from all collections) before every seed by default. If you wish to clean the database in a different manner you'll have to override the cleaning function with your own in the `.mongooseederrc` file:

```javascript
// .mongooseederrc

const mongoose = require('mongoose');
const models = require('./models');

module.exports = {
  seeds: './foobar',
  models: './fizbaz',
  clean: function() {
    // Clean database with custom
    // code here and return a promise
    return Promise.resolve();
  }
};
```



## License: MIT

Copyright 2017 Bideo Wego

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.















