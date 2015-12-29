$(document).ready(function (e) {
  window.app = {};
  window.app.barPlayer = document.getElementsByClassName('bar-player')[0];
  window.app.currentSong = null;
  window.app.error = new InfoMessage($('.info-error'));

  $(document.body).click(makeAjaxLink);

  window.addEventListener('popstate', function (e) {
    updateContainer(location.pathname, 'main', true);
  });
});

function makeAjaxLink(e) {
  var target = $(e.target).closest('tr,li,a')[0];
  if (!target)
    return;
  var container = target.getAttribute('data-spa');
  //console.log(container);
  if (!container)
    return;
  //container = 'main';
  e.preventDefault();

  var href = target.href || target.dataset.href;

  if (container == 'player') {
    var add = e.target.dataset.add;
    mp3.playMusic(target, add);
  } else if (container == 'main') {
    //updateContainer.apply(this, [target.href, container]);
    updateContainer(href, container);
  } else {
    var template = document.getElementById(container).getAttribute('data-template');
    applyTemplate(href, container, template);
  }
}

function applyTemplate(url, container, template, body) {
  $.ajax({
    url: url,
    method: "GET",
    data: body,
    headers: {"X-Expected-Format": "JSON"},
    success: function (json, status) {
      //$(document.getElementById(container)).html(templates[container](json.data));
      var templateFunction = Handlebars.compile(document.getElementById(template).innerHTML);
      $(document.getElementById(container)).html(templateFunction(json.data));
      if (json.title) {
        document.title = json.title;
        history.pushState(json.title, json.title, url);
      }
    },
    error: function (data) {
      var error = JSON.parse(data.responseText);
      console.log(data);
      app.error.show(error.message);
    }
  });
}


function updateContainer(url, container, dontSave, body) {
  $.ajax({
    url: url,
    method: "GET",
    data: body,
    success: function (data, status) {
      //console.log(container);
      //console.log(document.getElementById(container));
      $(document.getElementById(container)).html(data);
      var title = data.substring(6, data.indexOf('/') - 1); //cutting title from <h1>title</h1>
      document.title = title;
      if (!dontSave)
        history.pushState(title, title, url);
    },
    error: function (data) {
      var error = JSON.parse(data.responseText);
      console.log(data);
      app.error.show(error.message);
    }
  });
}


function InfoMessage(el) {
  var el = el;
  var timer = null;

  this.show = function (text) {
    if (timer)
      clearTimeout(timer);
    el.fadeIn(500);
    el.html(text);
    timer = setTimeout(function () {
      el.fadeOut(500)
    }, 3000);
  };

  this.hide = function () {
    if (timer)
      clearTimeout(timer);
    el.fadeOut(500);
  }
}