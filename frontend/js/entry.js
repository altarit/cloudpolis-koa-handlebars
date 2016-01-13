var blog = require('js/blog');
var methods = require('js/ajax_methods');

$(document).ready(function (e) {
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