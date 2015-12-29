var Router = require('koa-router');
var router = new Router();
var checkAuth = require('middlewares/checkAuth');

module.exports = function(app) {
  router.get('/', require('controllers/index.js').index);
  router.get('/posts', checkAuth, function*() { this.body = 'Posts'; });






  app.use(router.middleware());
};
