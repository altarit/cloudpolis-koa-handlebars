webpackJsonp_name_([2],{

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(33).Game;
	var Element = __webpack_require__(34).Element;
	var Menu = __webpack_require__(35).Menu;
	var Fps = __webpack_require__(36).Fps;
	
	
	var fps = new Fps();
	var game = new Game();
	
	//var chat = io.connect(window.location.origin+'/hook');
	var cv;
	var vars = {
	  w: 0,
	  h: 0
	};
	var ctx;
	var loop;
	var frame = 0;
	
	
	function prepare() {
	  if (!cv) {
	    cv = document.createElement('canvas');
	    setTimeout(march, 0);
	    cv.addEventListener('mousedown', canvasClick);
	  }
	  document.getElementById('hook-canvas-container').appendChild(cv);
	  repaint();
	  console.log('Context prepared');
	}
	
	function canvasClick(e) {
	  var rect = cv.getBoundingClientRect();
	  game.click(Math.floor(e.x - rect.left)+1, Math.floor(e.y - rect.top)+1);
	  e.preventDefault();
	}
	
	function repaint() {
	  //cv = document.getElementById('hook-cv');
	  var parentSize = cv.parentNode.getBoundingClientRect();
	  cv.width = vars.w = parentSize.width;
	  var pageHeight = document.documentElement.clientHeight - 200;
	  cv.height = vars.h =  vars.w < pageHeight ? vars.w : pageHeight;
	
	
	  ctx = cv.getContext('2d');
	  ctx.fillStyle = "#F0F0F0";
	  ctx.fillRect(0, 0, vars.w, vars.h);
	  game.resize(vars.w, vars.h);
	}
	
	window.onresize = repaint;
	
	
	
	function march() {
	  frame++;
	  cv.width = cv.width;
	  if (!(frame % 100)) fps.update(frame);
	  draw();
	  window.requestAnimationFrame(march);
	}
	
	function draw() {
	  ctx.fillText(''+fps.value, vars.w-20, vars.h-10, 20);
	  game.draw(ctx);
	}
	
	
	
	
	var mainMenuList = [
	  { title: 'Play online',
	    click: function() {
	      //game.activate('Searching online game');
	    }
	  },
	  { title: 'Play vs AI',
	    click: function() {
	    }
	  },
	  { title: 'Create lobbi',
	    click: function() {
	      game.activate('Creating lobbi');
	    }
	  },
	  { title: 'Join lobbi',
	    click: function () {
	      game.activate('Joining lobbi');
	    }
	  },
	  { title: 'Settings',
	    click: function () {
	      game.activate('Settings');
	    }
	  }
	];
	
	var settingMenuList = [
	  { title: 'Audio',
	    click: function() {
	      //game.activate('Searching online game');
	    }
	  },
	  { title: 'Video',
	    click: function() {
	    }
	  },
	  { title: 'Game',
	    click: function() {
	    }
	  },
	  { title: 'Back',
	    click: function () {
	      game.activate('Main menu');
	    }
	  }
	];
	
	
	var mainMenu = new Menu('Main menu', mainMenuList);
	game.add('Main menu', mainMenu);
	
	var settingMenu = new Menu('Settings', settingMenuList);
	game.add('Settings', settingMenu);
	
	/*var box1 = new Element(40, 200, 200, 50, 'box1');
	 var box2 = new Element(30, 200, 20, 140, 'box2');
	 var mainMenu = new Menu(10, 10, 200, 600, 'Main menu');
	 game.add(box1);
	 game.add(box2);
	 game.add(mainMenu);
	 var innerBox = new Element(10, 10, 180, 60, 'Play');
	
	
	 */
	
	
	console.log("hook.js loaded");
	module.exports.prepare = prepare;

/***/ },

/***/ 33:
/***/ function(module, exports) {

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

/***/ },

/***/ 34:
/***/ function(module, exports) {

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
	
	


/***/ },

/***/ 35:
/***/ function(module, exports, __webpack_require__) {

	var Element = __webpack_require__(34).Element;
	
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
	
	


/***/ },

/***/ 36:
/***/ function(module, exports) {

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

/***/ }

});
//# sourceMappingURL=2.2.js.map