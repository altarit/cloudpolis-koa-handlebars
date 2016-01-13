var cluster = require('cluster');

if (cluster.isMaster) {
  //var cpuCount = require('os').cpus().length;
  var cpuCount = 1;
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  return;
}

var koa = require('koa'),
  path = require('path'),
  views = require('koa-views'),
  static = require('koa-static'),
  koalogger = require('koa-logger'),
  compression = require('koa-gzip'),
  session = require('koa-generic-session'),
  mongooseStore = require('koa-session-mongoose'),
  swig = require('swig'),
  bodyParser = require('koa-bodyparser'),

  //Project modules
  config = require('config'),
  log = require('lib/log')(module),
  mongoose = require('lib/mongoose');

var Compilation = require('models/user').User;

//koa
var app = module.exports = koa();
app.use(koalogger());
app.use(compression());
app.use(bodyParser());

//cookies
app.keys = ['very secret'];
app.use(session({
  store: mongooseStore.create({
    collection: 'sessions',
    connection: mongoose.connection,
    expires: 60*60*24*14 //two weeks
  })
}));

//templates
swig.setDefaults({ loader: swig.loaders.fs(__dirname + '/views' )});
app.use(views('views', {map: {html: 'swig'}}));

app.use(function *(next) {
  var n = this.session.views || 0;
  this.session.views = ++n;
  this.locals = {};
  yield next;
});

app.use(require('middlewares/sendHttpError'));
app.use(require('middlewares/loadUser'));
app.use(require('middlewares/setParams'));
app.use(require('middlewares/logRequest'));



//routes
require('routes')(app);
app.use(static('public'));
app.use(static('bower_components'));
app.use(function*() {throw 404;});

log.debug('EquestriaJS started');
if (!module.parent) app.listen(config.port);