var Game = require('js/hook/game').Game;
var Element = require('js/hook/element').Element;
var Menu = require('js/hook/menu').Menu;
var Fps = require('js/hook/fps').Fps;


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