function Element(x, y, w, h, name) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  //this.x1 = x + w;
  //this.y1 = y + h;
  this.name = name;
}

Element.prototype.click = function () {
  console.log('Click: ' + this.name);
};

Element.prototype.draw = function (ctx) {
  ctx.strokeRect(this.x, this.y, this.w, this.h);
};

Element.prototype.ecex = function (k) {

};

Element.prototype.inCoords = function (x, y) {
  return (x >= this.x && y >= this.y && x <= this.x + this.w && y <= this.y + this.h);
};


module.exports.Element = Element;