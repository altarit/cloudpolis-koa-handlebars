var Element = require('js/hook/element').Element;

Menu.rowHeight = 40;
Menu.left = 20;

function Menu(name, menuList) {
  this.name = name;
  this.list = menuList;
  this.parent = null;
  this.rowHeight = Menu.rowHeight;
}

Menu.prototype.resize = function (w, h) {
  var startY = Math.floor((h - this.list.length * this.rowHeight)/2);
  var self = this;
  for(var i=0, len = this.list.length; i<len; i++) {
    var el = this.list[i];
    el.left = Menu.left;
    el.top = startY + i * self.rowHeight;
  };
};


Menu.prototype.add = function() { throw new Error('Doesn\'t support'); };


Menu.prototype.click = function (x, y) {
  //console.log('Click: ' + this.name);
  for(var i=0, len = this.list.length; i<len; i++) {
    var el = this.list[i];
    if (y > el.top - this.rowHeight/2 && y<el.top + this.rowHeight/2) {
      console.log(el.title);
      el.click();
    }
  };
};

Menu.prototype.draw = function (ctx) {
  if (!this.parent)
    console.log(this.name + ' has no parent');

  this.list.forEach(function(el) {
    ctx.fillText(el.title, el.left, el.top);
  });
};

Menu.prototype.ecex = function (k) {

};


//Element.prototype.name='Element';



Menu.prototype.__proto__ = Element.prototype;

module.exports.Menu = Menu;


