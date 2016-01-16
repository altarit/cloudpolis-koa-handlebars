module.exports.error = new InfoMessage($('.info-error'));

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