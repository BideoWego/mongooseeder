const mongoose = require('mongoose');
const models = require('./../app/models');
const User = mongoose.model('User');
const Post = mongoose.model('Post');


describe('Testing', () => {
  let userAttrs;
  let postAttrs;

  beforeEach(() => {
    userAttrs = {
      name: 'Foo',
      email: 'foo@bar.com'
    };
    postAttrs = {
      title: 'Foobar',
      body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
    };
  });


  it('can create a user', done => {
    User.create(userAttrs)
      .then(user => {
        expect(user).not.toBe(undefined);
        expect(user).not.toBe(null);
        done();
      });
  });


  it('cleans db while testing', done => {
    User.create(userAttrs)
      .then(() => User.count())
      .then(count => {
        expect(count).toBe(1);
        done();
      });
  });


  it('can associate two models', done => {
    let post;
    let user;
    Post.create(postAttrs)
      .then(result => {
        post = result;
        return User.create(userAttrs);
      })
      .then(result => user = result)
      .then(result => {
        post.user = user;
        return post.save();
      })
      .then(() => {
        user.posts.push(post);
        expect(user.posts.length).toBe(1);
        expect(
          user.posts[0].equals(post.id)
        ).toBe(true);
        expect(
          post.user._id.equals(user.id)
        ).toBe(true);
        done();
      });
  });
});






















