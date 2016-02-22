var cluster = require('cluster');

if (cluster.isMaster && 0) {
  var cpuCount = require('os').cpus().length;
  //var cpuCount = 1;
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  return;
}

var koa = require('koa'),
  http = require('http'),
  path = require('path'),
  statics = require('koa-static'),
  compression = require('koa-gzip'),
  session = require('koa-generic-session'),
  bodyParser = require('koa-bodyparser'),
  socketIO = require('socket.io'),
  //handlebars = require('koa-handlebars'),
  handlebars = require('lib/vinyl-koa-handlebars'),

//Project modules
  config = require('config'),
  log = require('lib/log')(module),
  sessionStore = require('lib/sessionStore');

var Compilation = require('models/user').User;

//koa
var app = module.exports = koa();
//var server = http.createServer(app.callback());
app.use(require('middlewares/logRequest'));
app.use(compression());
app.use(bodyParser());

//cookies
app.keys = ['very secret'];
app.use(session({ store: sessionStore }));

//templates
app.use(handlebars({
  cache: false,//app.env !== 'development',
  layoutsDir: 'views/_layouts',
  defaultLayout: 'page.html',
  partialsDir: 'views',
  helpers: require('views/helpers')
}));

app.use(function *(next) {
  var n = this.session.views || 0;
  this.session.views = ++n;
  this.locals = {};
  yield next;
});

app.use(require('middlewares/sendHttpError'));
app.use(require('middlewares/loadUser'));
app.use(require('middlewares/setParams'));



//routes
require('routes')(app);

var server = require('http').Server(app.callback()),
  io = require('socket.io')(server);

app.use(statics('public'));
app.use(statics('bower_components'));
app.use(function*() {throw 404;});

log.debug('EquestriaJS started');
if (!module.parent) {
  var chat = require('sockets/chat').use(io.of('/chat'));
  var hook = require('sockets/hook').use(io.of('/hook'));
  app['io.chat'] = chat;

  server.listen(3000);
}