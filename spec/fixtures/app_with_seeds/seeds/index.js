

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






