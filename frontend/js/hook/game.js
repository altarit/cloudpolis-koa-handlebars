function Game() {
  this.condition = 'menu';
  this.forms = {};
  this.active = null;
  this.width = 0;
  this.height = 0;
}

Game.prototype.resize = function(w, h) {
  this.active.resize(w, h);
  this.width = w;
  this.height = h;
};

Game.prototype.add = function(name, form) {
  form.parent = this;
  this.forms[name] = form;
  if (!this.active)
    this.active = form;
  this.active.resize(this.width, this.height);
};

Game.prototype.activate = function(name) {
  var form = this.forms[name];
  if (!form) throw new Error('Form ' + name  + ' not found');
  this.active = form;
  this.active.resize(this.width, this.height);
};

Game.prototype.click = function(x, y) {
  this.active.click(x, y);
};

Game.prototype.draw = function(ctx) {
  this.active.draw(ctx);
};

/*Game.prototype.click = function(x, y) {
  console.log(x+' '+y);
  this.elements.forEach(function(el) {
    if (el.inCoords(x, y))
      el.click(x-el.x, y - el.y);
  });
};

Game.prototype.draw = function(ctx) {
  this.elements.forEach(function(el) {
    el.draw(ctx, 0, 0);
  });
};*/




console.log('game.js loaded');
module.exports.Game = Game;