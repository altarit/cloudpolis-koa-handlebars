var mp3 = require('js/player');
var templates = require('js/hb-templates');
var info = require('js/info');

module.exports.makeAjaxLink = makeAjaxLink;
module.exports.requestData = requestData;
module.exports.sendForm = sendForm;

//handle click on a link
function makeAjaxLink(e) {
  if (e.which !== 1)
    return;

  var target = $(e.target).closest('tr,li,a')[0];
  if (!target)
    return;

  var app = target.getAttribute('data-app');
  var container = target.getAttribute('data-spa');
  if (!container)
    return;

  e.preventDefault();
  var href = target.href || target.dataset.href;

  if (container == 'player') {
    mp3.hanldeSpaClick(target, e.target.dataset);
  } else {
    var template = document.getElementById(container).getAttribute('data-template');
    requestData(href, container, template);
  }
}

function sendRequest(target) {

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
        return applyResponse(responsedData, $form.attr('action'), $form.data('spa'), $form.data('template'));

      if (next == 'HTML')
        return applyResponse(responsedData, $form.attr('action'), $form.data('spa'));

      var redirect = $form.data('redirect');
      if (redirect)
        return requestData(redirect, 'main');
    },
    error: function (jqXHR) {
      var error = JSON.parse(jqXHR.responseText);
      $('.error', form).html(error.message);
    }
  });
}

var currentRequest = null;

//requests JSON from server
function requestData(url, container, template, body, dontSave) {
  currentRequest = $.ajax({
    url: url,
    method: "GET",
    data: body,
    headers: template ? {"X-Expected-Format": "JSON"} : null,
    beforeSend: cancelCurrentRequest,
    success: function (responsedData, status) {
      //applyData(responsedData, url, container, template);
      applyResponse(responsedData, url, container, template);
    },
    error: errorHandler
  });
}

function applyResponse(responsedData, url, container, template, dontSave) {


  return applyResponseObj({
    responsedData: responsedData,
    url: url,
    container: container,
    template: template,
    dontSave: dontSave
  });
}

function applyResponseObj(par) {
  var responsedData = par.responsedData;
  var url = par.url || window.location.pathname;
  var container = par.container;
  if (!responsedData || !url || !container)
    throw new Error('Params are empty');
  var template = par.template;
  var dontSave = par.dontSave;


  var html = null;
  if (template) {
    var templateFunction = templates[template];
    html = templateFunction(responsedData.data);
    if (responsedData.title) {
      document.title = responsedData.title;
      history.pushState(responsedData.title, responsedData.title, url);
    }
  } else {
    html = responsedData;
    var titleEl = $(html).filter('h1')[0];
    var title = titleEl ? titleEl.innerHTML : document.title;
    document.title = title;
    if (!dontSave)
      history.pushState(title, title, url);
  }
  $(document.getElementById(container)).html(html);
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