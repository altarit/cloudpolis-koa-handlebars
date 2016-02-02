function Game() {
  this.condition = 'menu';
  this.elements = [];
}



Game.prototype.add = function(element) {
  this.elements.push(element);
};

Game.prototype.click = function(x, y) {
  console.log(x+' '+y);
  this.elements.forEach(function(el) {
    if (el.inCoords(x, y))
      el.click();
  });
};

Game.prototype.draw = function(ctx) {
  this.elements.forEach(function(el) {
    el.draw(ctx);
  });
};




console.log('Game loaded');

module.exports.Game = Game;