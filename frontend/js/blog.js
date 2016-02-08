var mp3 = require('js/player');
var templates = require('js/hb-templates');
var info = require('js/info');

module.exports.makeAjaxLink = makeAjaxLink;
module.exports.requestData = requestData;
module.exports.requestHTML = requestHTML;
module.exports.sendForm = sendForm;

//handle click on a link
function makeAjaxLink(e) {
  if (e.which !== 1)
    return;
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
    requestHTML(href, container);
  } else {
    var template = document.getElementById(container).getAttribute('data-template');
    requestData(href, container, template);
  }
}

function sendForm(form) {
  var $form = $(form);
  var next = $form.data('next');
  /*var formHelper = $form.data('formHelper');
  if (formHelper)
    return window.formHelpers[formHelper](form);*/

  $('.error', $form).html('');
  //$(":submit", form).button("loading");

  var action = $form.attr('action') || window.location.pathname;
  $.ajax({
    url: action,
    method: $form.attr('method') || "POST",
    data: $form.serialize(),
    headers: next == 'JSON' ? {"X-Expected-Format": "JSON"} : null,
    complete: function () {
      //$(":submit", form).button("reset");
    },
    success: function (responsedData) {
      //form.html("Сохранено").addClass('alert-success');

      if (next == 'JSON')
        return applyData(responsedData, $form.attr('action'), $form.data('spa'), $form.data('template'));

      if (next == 'HTML')
        return applyHTML(responsedData, $form.attr('action'), $form.data('spa'), false);

      var redirect = $form.data('redirect');
      if (redirect)
        return requestHTML(redirect, 'main');
    },
    error: function (jqXHR) {
      var error = JSON.parse(jqXHR.responseText);
      $('.error', form).html(error.message);
    }
  });
}

var currentRequest = null;

//requests JSON from server
function requestData(url, container, template, body) {
  currentRequest = $.ajax({
    url: url,
    method: "GET",
    data: body,
    headers: {"X-Expected-Format": "JSON"},
    beforeSend: cancelCurrentRequest,
    success: function (responsedData, status) {
      applyData(responsedData, url, container, template);
    },
    error: errorHandler
  });
}

function applyData(responsedData, url, container, template) {
  var templateFunction = templates[template];
  $(document.getElementById(container)).html(templateFunction(responsedData.data));
  if (responsedData.title) {
    document.title = responsedData.title;
    history.pushState(responsedData.title, responsedData.title, url);
  }
}

//requests partial HTML from server
function requestHTML(url, container, dontSave, body) {
  currentRequest = $.ajax({
    url: url,
    method: "GET",
    data: body,
    beforeSend: cancelCurrentRequest,
    success: function (responsedData, status) {
      applyHTML(responsedData, url, container, dontSave);
      return false;
    },
    error: errorHandler
  });
}

function applyHTML(responsedData, url, container, dontSave) {
  $(document.getElementById(container)).html(responsedData);
  var titleEl = $(responsedData).filter('h1')[0];
  var title = titleEl ? titleEl.innerHTML : document.title;
  document.title = title;
  if (!dontSave)
    history.pushState(title, title, url);
}


function cancelCurrentRequest() {
  if (currentRequest != null) {
    currentRequest.abort();
  }
}

function errorHandler (data) {
  if (data.responseText) {
    var error = JSON.parse(data.responseText);
    info.error.show(error.message);
  } else {
    console.log(data);
  }
}