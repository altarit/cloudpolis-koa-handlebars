var blog = require('./blog');
var methods = require('./ajax_methods');

$(document).ready(function (e) {
  //window.app = {};
  //window.app.barPlayer = document.getElementsByClassName('bar-player')[0];
  //window.app.currentSong = null;
  //window.app.error = new blog.InfoMessage($('.info-error'));

  $(document.body).click(blog.makeAjaxLink);

  window.addEventListener('popstate', function (e) {
    blog.updateContainer(location.pathname, 'main', true);
  });
});

$(document).on('submit',function(e) {
  var m = methods[e.target.name];
  if (m) {
    m(e.target);
    return false;
  }
  else
    console.log('methods['+e.target.name+'] is not a function');
});