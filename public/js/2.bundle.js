webpackJsonpentry([2],{

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;var Game = __webpack_require__(33).Game;
	var Element = __webpack_require__(34).Element;
	
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	  console.log("hook.js loaded");
	  var chat = io.connect(window.location.origin+'/hook');
	  var cv;
	  var ctx;
	  var w, h;
	  var loop;
	  var i = 0;
	
	  var game = new Game();
	  var box1 = new Element(40, 200, 200, 50, 'box1');
	  var box2 = new Element(30, 200, 20, 140, 'box1');
	  game.add(box1);
	  game.add(box2);
	
	
	  function prepare() {
	    if (!cv) {
	      cv = document.createElement('canvas');
	      setTimeout(march, 0);
	      setTimeout(fpsMetr, 1000);
	      cv.addEventListener('mousedown', canvasClick);
	    }
	    document.getElementById('hook-canvas-container').appendChild(cv);
	    repaint();
	    console.log('Context prepared');
	  }
	
	  function canvasClick(e) {
	    var rect = cv.getBoundingClientRect();
	    game.click(Math.floor(e.x - rect.left)+1, Math.floor(e.y - rect.top)+1);
	
	  }
	
	  function repaint() {
	    //cv = document.getElementById('hook-cv');
	    var parentSize = cv.parentNode.getBoundingClientRect();
	    cv.width = w = parentSize.width;
	    var pageHeight = document.documentElement.clientHeight - 200;
	    cv.height = h =  w < pageHeight ? w : pageHeight;
	    ctx = cv.getContext('2d');
	    ctx.fillStyle = "#F0F0F0";
	    ctx.fillRect(0, 0, w, h);
	  }
	
	  window.onresize = repaint;
	
	  var lastFrameCnt = 0;
	  var lastFrameTime = Date.now();
	  function fpsMetr() {
	    var now = Date.now();
	    console.log(Math.floor((i - lastFrameCnt) / (now - lastFrameTime) * 1000));
	    lastFrameCnt = i;
	    lastFrameTime = now;
	    setTimeout(fpsMetr, 1000);
	  }
	
	  var lastX = 0, lastY = 0;
	  function march() {
	    i++;
	    cv.width = cv.width;
	    draw();
	    setTimeout(march, 0);
	  }
	
	  function draw() {
	    //ctx.fillStyle = "#999999";
	    //ctx.fillRect(0, 0, w, h);
	
	
	    box1.x = 300 + Math.floor(100*Math.sin(i/100));
	    box1.y = 300 + Math.floor(100*Math.cos(i/100));
	
	
	
	    box2.x = 100 + Math.floor(140*Math.sin(i/100+7));
	    box2.y = 200 + Math.floor(100*Math.cos(i/100));
	    game.draw(ctx);
	    //console.log(box1.x);
	
	    /*cv.width = w;
	    lastX = rX;
	    lastY = rY;
	    var rX = Math.floor(Math.random() * w);
	    var rY = Math.floor(Math.random() * h);
	    ctx.moveTo(lastX, lastY);
	    ctx.lineTo(rX, rY);
	    ctx.lineTo(rX-50, rY);
	    ctx.lineTo(rX, rY-50);
	    ctx.lineTo(rX-50, rY-50);
	    ctx.stroke();*/
	  }
	
	
	
	
	  chat.on('news', function (text) {
	    printMessage('Server', text);
	  });
	
	  chat.on('join', function (username) {
	
	  });
	
	  chat.on('leave', function (username) {
	
	  });
	
	  chat.on('message', function (sender, text) {
	    printMessage(sender, text);
	  });
	
	  function eventSendButtonClick() {
	    var text = input.value;
	    chat.emit('message', text, function() {
	      console.log(text);
	      printMessage('You', text);
	    });
	    input.value = "";
	  }
	
	  function printMessage(username, text) {
	    /*var row = document.createElement('div');
	    row.innerHTML = '<b>'+username+'</b>: ' + text;
	    messageLog.appendChild(row);*/
	    console.log('<b>'+username+'</b>: ' + text);
	  }
	
	  return {
	    prepare: prepare
	  };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },

/***/ 33:
/***/ function(module, exports) {

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

/***/ },

/***/ 34:
/***/ function(module, exports) {

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

/***/ }

});
//# sourceMappingURL=2.bundle.js.map