var methods = (function () {
  return {
    //posts/-id/library.ejs
    "comment-form": function (target) {
      var form = $(target);
      $('.error', form).html('');
      //$(":submit", form).button("loading");
      $.ajax({
        url: window.location.pathname,
        method: "POST",
        data: form.serialize(),
        complete: function () {
          //$(":submit", form).button("reset");
        },
        success: function () {
          //form.html("Отправлено").addClass('alert-success');
          //console.log(form);
          var comment = $('<div />')
            .append($('<a />', {
              href: 'user',
              spa: 'main'
            }).text('user'))
            .append(' right now')
            .append($('<p />').append(form.context.text.value))
          $('#comments').append(comment);
        },
        error: function (jqXHR) {
          var error = JSON.parse(jqXHR.responseText);
          $('.error', form).html(error.message);
        }
      });
      return false;
    },

    //login/library.ejs
    "login-form" : function (target) {
      var form = $(target);

      $('.error', form).html('');
      //$(":submit", form).button("loading");

      $.ajax({
        url: "/login",
        method: "POST",
        data: form.serialize(),
        complete: function () {
          //$(":submit", form).button("reset");
        },
        success: function () {
          form.html("Вы вошли в сайт").addClass('alert-success');
          //window.location.href = "/";
          updateContainer('/', 'main');
        },
        error: function (jqXHR) {
          var error = JSON.parse(jqXHR.responseText);
          $('.error', form).html(error.message);
        }
      });
      return false;
    }
  }
})();

$(document).on('submit',function(e) {
  var m = methods[e.target.name];
  if (m) {
    m(e.target);
    return false;
  }
  else
    console.log('methods['+e.target.name+'] is not a function');
});