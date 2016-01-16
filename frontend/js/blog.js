var mp3 = require('js/player');
var templates = require('js/hb-templates');
var info = require('js/info');

module.exports.makeAjaxLink = makeAjaxLink;
module.exports.applyTemplate = applyTemplate;
module.exports.updateContainer = updateContainer;

//handle click on a link
function makeAjaxLink(e) {
  var target = $(e.target).closest('tr,li,a')[0];
  if (!target)
    return;
  var container = target.getAttribute('data-spa');
  if (!container)
    return;
  e.preventDefault();

  var href = target.href || target.dataset.href;

  if (container == 'player') {
    mp3.hanldeSpaClick(target, e.target.dataset);
  } else if (container == 'main') {
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
      var templateFunction = templates[template];
      $(document.getElementById(container)).html(templateFunction(json.data));
      if (json.title) {
        document.title = json.title;
        history.pushState(json.title, json.title, url);
      }
    },
    error: function (data) {
      var error = JSON.parse(data.responseText);
      console.log(data);
      info.error.show(error.message);
    }
  });
}


function updateContainer(url, container, dontSave, body) {
  $.ajax({
    url: url,
    method: "GET",
    data: body,
    success: function (data, status) {
      $(document.getElementById(container)).html(data);
      var titleEl = $(data).filter('h1')[0];
      var title = titleEl ? titleEl.innerHTML : document.title;
      document.title = title;
      if (!dontSave)
        history.pushState(title, title, url);
    },
    error: function (data) {
      var error = JSON.parse(data.responseText);
      console.log(data);
      info.error.show(error.message);
    }
  });
}

