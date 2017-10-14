
// peteballs.js

function createGame(){

  var game = this;

  // set the game variables
  game.width = 900;
  game.height = 400;

  game.start = function(){
    // create the canvas
    var canvas = document.createElement('canvas');
    canvas.width = game.width
    canvas.height = game.height
    canvas.id = 'peteballs-canvas'
    document.getElementById('canvas-holder').appendChild(canvas)
  }

  return game;
}

var game = new createGame();
game.start();


//===================
