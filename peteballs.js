
function Game(){

  var game = this;

  // set the game variables
  game.width = 900;
  game.height = 400;
  game.sprites = [];

  game.init = function(){
    // create the canvas
    var canvas = document.createElement('canvas');
    canvas.width = game.width;
    canvas.height = game.height;
    canvas.id = 'peteballs-canvas';
    document.getElementById('canvas-holder').appendChild(canvas);
  }

  game.createSprite = function(){
    var sprite = {};
    sprite.position = {};
    sprite.position.x = 10;
    sprite.position.y = 10;
    sprite.direction = 10;

    game.sprites[game.sprites.length] = sprite;
  }

  game.createSprite();

  console.log(game);

  return game;
}

var game = new Game();
game.init();
