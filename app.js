var koa = require('koa'),
  path = require('path'),
  views = require('koa-views'),
  static = require('koa-static'),
  koalogger = require('koa-logger'),
  compression = require('koa-gzip'),
  session = require('koa-generic-session'),
  mongooseStore = require('koa-session-mongoose'),
  swig = require('swig'),

  //Project modules
  config = require('config'),
  log = require('lib/log')(module),
  mongoose = require('lib/mongoose');

//koa
var app = koa();
app.use(koalogger());
app.use(compression());

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
swig.setDefaults({ loader: swig.loaders.fs(__dirname + '/views' ), varControls: ['[[', ']]']});
app.use(views('views', {map: {html: 'swig'}}));

app.use(require('middlewares/sendHttpError'));
app.use(require('middlewares/loadUser'));
app.use(require('middlewares/setParams'));
app.use(require('middlewares/logRequest'));

/*app.use(function *() {
  var n = this.session.views || 0;
  this.session.views = ++n;
  this.body = n + ' views';
});*/


//routes
require('routes')(app);
app.use(static('public'));
app.use(static('bower_components'));
app.use(static('D:/Documents/Music/MAv16/Artists/'));
app.use(function*() {throw 404;});

log.debug('EquestriaJS started');
app.listen(config.port);