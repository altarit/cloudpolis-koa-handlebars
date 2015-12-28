var Router = require('koa-router');
var router = new Router();

module.exports = function(app) {
  router.get('/', require('controllers/index.js').index);
  //router.get('/posts', function*() { this.body = 'Posts'; });






  app.use(router.middleware());
};
