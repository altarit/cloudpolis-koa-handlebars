var blog = require('js/blog');

$(document).ready(function (e) {
  $(document.body).click(blog.makeAjaxLink);

  window.addEventListener('popstate', function (e) {
    blog.requestData(location.pathname, 'main', null, null, true);
  });
});

$(document).on('submit',function(e) {
  blog.sendForm(e.target);
  return false;
});

module.exports.blog = blog;

module.exports.scripts = {};
module.exports.scripts.chat = function() {
  require.ensure([], function (require) {
    require('js/chat').prepare();
  });
};
module.exports.scripts.hook = function() {
  require.ensure([], function (require) {
    require('js/hook').prepare();
  });
};

/*
 var comment = $('<div />')
 .append($('<a />', {
 href: 'user',
 spa: 'main'
 }).text('user'))
 .append(' right now')
 .append($('<p />').append(form.context.text.value))
 $('#comments').append(comment);
 */

/*
  "form-search": f
*/