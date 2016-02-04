function Fps() {
  this.value = 0;
  this.lastFrame = Date.now();
  this.prevIteration = 0;
}

Fps.prototype.update = function (i) {
  var now = Date.now();
  this.value = Math.floor((i - this.prevIteration) / (now - this.lastFrame) * 1000);
  this.lastFrame = now;
  this.prevIteration = i;
  return this.value;
};

Fps.prototype.name = 'Fps';

module.exports.Fps = Fps;