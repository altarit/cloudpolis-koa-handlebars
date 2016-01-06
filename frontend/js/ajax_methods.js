var blog = require('js/blog');

module.exports = {
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
        blog.updateContainer('/', 'main');
        console.log('123');
      },
      error: function (jqXHR) {
        var error = JSON.parse(jqXHR.responseText);
        $('.error', form).html(error.message);
      }
    });
    return false;
  },

  "form-search" : function(target) {
    var filter = document.forms['form-search'];
    var filterOptions = {};
    try {
      var fQuery = filter['filter-query'].value;
      if (fQuery) {
      new RegExp(fQuery);
      filterOptions.query = fQuery;
      }

      //console.log(filterOptions);
      //updateContainer('/music/search', 'searchsongresult', true, filterOptions);
      blog.applyTemplate('/music/search', 'compilationinfo', 'songlist', filterOptions);
    } catch(e) {
      console.log('Wrong regexp');
      console.log(e);
    }
  },

  "add-post-form" :function(target) {
    var $form = $(target);
    $.ajax({
      url: window.location.pathname,
      method: "POST",
      data: $form.serialize(),
      complete: function(e) {
        console.log('complete');
      },
      success: function(e) {
        console.log('success');
      },
      error: function (e) {
        var error = JSON.parse(e.responseText);
        $('.error', $form).html(error.message);
      }
    });
    return false;
  }
};