function Element(x, y, w, h, name) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.name = name;

  this.parent = null;
  this.elements = [];
}

Element.prototype.add = function(element) {
  element.parent = this;
  this.elements.push(element);
};

Element.prototype.click = function (x, y) {
  console.log('Click: ' + this.name);
  this.elements.forEach(function(el) {
    if (el.inCoords(x, y))
      el.click(x-el.x, y - el.y);
  });
};

Element.prototype.draw = function (ctx, offsetX, offsetY) {
  if (!this.parent)
    return;
  var realX = this.x + offsetX;
  var realY = this.y + offsetY;
  ctx.strokeRect(realX, realY, this.w, this.h);
  this.elements.forEach(function(el) {
    el.draw(ctx, realX, realY);
  });
};

Element.prototype.ecex = function (k) {

};

Element.prototype.inCoords = function (x, y) {
  return (x >= this.x && y >= this.y && x <= this.x + this.w && y <= this.y + this.h);
};

//Element.prototype.name='Element';

module.exports.Element = Element;


