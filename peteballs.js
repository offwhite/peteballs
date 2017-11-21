

function Game(){

  var game = this;

  // set the game variables

  game.ready = false;
  game.score = 0;
  game.level = 0;
  game.scoreRequired = [0, 2, 3, 5, 7, 9, 11,14,16,18,20,23,28,32,40,50];
  game.ballCount =     [0, 25,28,30,31,32,32,35,35,36,37,39,41,41,50,50];
  game.width = 900;
  game.height = 400;
  game.images = [];
  game.resourceCount = 0;
  game.loadedResourceCount = 0;

  game.balls = [];
  game.explosions = [];
  game.started = false;
  game.ballSprite = new BallSprite(game);
  game.explosionSprite = new ExplosionSprite(game);
  game.ballSize = 30;

  game.stepper = false;
  game.framerate = 30;

  game.over = false;
  game.levelStarted = false;
  game.bombPlaced = false;

  game.init = function(){
    // create the canvas
    game.canvas = document.createElement('canvas');
    game.canvas.width = game.width;
    game.canvas.height = game.height;
    game.canvas.id = 'peteballs-canvas';
    game.context = game.canvas.getContext("2d");

    game.loadImage('title');
    game.loadImage('game-over');
    game.loadImage('level-passed');
    game.loadImage('explosion');
    game.loadImage('ball-spritesheet');
  }

  game.click = function(e){
    if(game.over){
      game.restart();
    }
    if(!game.levelStarted){
      game.startLevel();
    }
    else if(!game.bombPlaced){
      game.placeBomb(e);
    }
  }

  game.start = function(){
    if(game.loadedResourceCount < game.resourceCount){
      setTimeout(function(){game.start()}, 100);
      return;
    }

    document.getElementById('canvas-holder').appendChild(game.canvas);
    game.canvas.addEventListener("click", game.click);

    game.renderBanner('title');
    game.step();
  }

  game.restart = function(){
    game.level = 0;
    game.score = 0;
    game.over = false;
  }

  game.step = function(){
    clearTimeout(game.stepper);

    if(game.levelStarted){
      game.detectColisions();
      game.renderFrame();
    }
    game.stepper = setTimeout(game.step, (1000 / game.framerate));
  }

  game.detectColisions = function(){
    for(var i=0; i<game.balls.length; i++){
      game.detectBallColision(game.balls[i])
    }
  }

  game.detectBallColision = function(ball){
    var colision = false;
    for(var i=0; i<game.explosions.length; i++){
      if(!colision){
        colision = game.spriteColision(ball, game.explosions[i]);
      }
    }
    if(colision){
      game.explosions[game.explosions.length] = game.explosionSprite.create(ball.position.x,ball.position.y, 100, game.explosionComplete);
      game.removeBall(ball);
    }
  }

  game.spriteColision = function(spriteA, spriteB) {
    if(spriteA.state == 'dead' || spriteB.state == 'dead'){
      return false;
    }
    var cy = spriteB.position.y
    var cx = spriteB.position.x
    var px = spriteA.position.x
    var py = spriteA.position.y
    var collisionRadius = spriteB.collisionRadius + spriteA.collisionRadius;
    var distancesquared = (px - cx) * (px - cx) + (py - cy) * (py - cy);
    return distancesquared <= collisionRadius * collisionRadius;
  }

  game.renderFrame = function(){
    game.context.clearRect(0, 0, game.width, game.height);
    for(var i=0; i<game.balls.length; i++){
      game.balls[i].step();
    }
    for(var i=0; i<game.explosions.length; i++){
      game.explosions[i].step();
    }
  }

  game.startLevel = function(){
    game.levelScore = 0;
    game.level++;

    for(var i=0; i<game.ballCount[game.level]; i++){
      game.balls[game.balls.length] = game.ballSprite.create(game.ballSize);
    }
    game.levelStarted = true;
    game.updateScore();

    var levelNotice = document.getElementById('level');
    levelNotice.innerHTML = 'Level '+game.level+' | Destroy '+game.scoreRequired[game.level]+' balls!';
  }

  game.finishLevel = function(){
    game.balls = [];
    game.explosions = [];
    game.bombPlaced = false;

    if(game.levelScore < game.scoreRequired[game.level]){
      game.over = true;
      game.renderBanner('game-over');
    }else{
      game.renderBanner('level-passed');
    }
    game.levelStarted = false;
  }

  game.placeBomb = function(e){
    game.completedExplosions = 0;
    game.bombPlaced = true;
    var canvasPos = game.canvas.getBoundingClientRect();
    var posX = e.clientX - canvasPos.left;
    var posY = e.clientY - canvasPos.top;
    game.explosions[game.explosions.length] = game.explosionSprite.create(posX,posY, 200, game.explosionComplete);
  }

  game.explosionComplete = function(sprite){
    game.completedExplosions++;
    if(game.completedExplosions == game.explosions.length){
      game.finishLevel();
    }
  }

  game.removeBall = function(sprite){
    game.levelScore++;
    game.balls.splice( game.balls.indexOf(sprite), 1 );
    game.increaseScore();
    game.updateScore();
  }

  game.increaseScore = function(){
    if(game.levelScore < game.scoreRequired[game.level]){
      var increment = 1;
    }else{
      var increment = game.level + (game.levelScore - game.scoreRequired[game.level]);
    }
    game.score = game.score + increment
  }

  game.updateScore = function(){
    var levelScore = document.getElementById('level-score');
    levelScore.innerHTML = game.levelScore+'/'+game.scoreRequired[game.level];

    var totalScore = document.getElementById('total-score');
    totalScore.innerHTML = 'Score: '+game.score;
  }

  game.loadImage = function(src){
    game.resourceCount++;
    game.images[src] = new Image();
    game.images[src].onload = function() {
        game.loadedResourceCount++;
    }
    game.images[src].src = "images/" + src + ".png";
  }

  game.renderBanner = function(imageName){
    game.context.clearRect(0, 0, game.width, game.height);
    game.context.drawImage(game.images[imageName], 0, 0);
  }

  game.init();

  return game;
}

var game = new Game();
game.start();
