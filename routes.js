var Router = require('koa-router');
var router = new Router();
var checkAuth = require('middlewares/checkAuth');

module.exports = function(app) {

  router.get('/', require('./views/index.js').index);

  //Auth
  router.get('/login', require('./views/auth').init);
  router.post('/login', require('./views/auth').auth);
  router.post('/logout', require('./views/auth').logout);

  //Users
  router.get('/users', require('./views/users').init);
  router.get('/users/:id', require('./views/users').detail);
  router.post('/users/:id', require('./views/users').update);

  //Posts
  router.get('/posts', require('./views/posts').init);
  router.get('/posts/create', require('./views/posts').addpost);
  router.post('/posts/create', checkAuth, require('./views/posts').create);
  router.get('/posts/:id', require('./views/posts').detail);
  router.post('/posts/:id', checkAuth, require('./views/posts/').comment);

  //Music
  router.get('/music', require('./views/music').init);
  router.get('/music/library', require('./views/music').library);
  router.get('/music/library/:compilation', require('./views/music').library);
  router.get('/music/artists', require('./views/music').artists);
  router.get('/music/artists/:id', require('./views/music').songs);
  router.get('/music/search', require('./views/music').search);

  //Admin
  router.get('/admin', checkAuth, require('./views').inprogress);
  router.get('/admin/access', checkAuth, require('./views').inprogress);

  app.use(router.middleware());
};
