var koa = require('koa'),
  path = require('path'),
  views = require('koa-views'),
  config = require('config'),
  static = require('koa-static');


var app = koa();
app.use(views(config.template.path, config.template.options));
app.use(static('public'));


require('routes')(app);



app.listen(config.port);