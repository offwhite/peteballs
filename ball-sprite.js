function BallSprite(game){

  var creator = this;
  creator.images = [];
  creator.loadedResourceCount = 0;

  creator.init = function(){
    creator.loadImage('ball-spritesheet');
  }

  creator.loadImage = function(src){
    creator.images[src] = new Image();
    creator.images[src].onload = function() {
        creator.loadedResourceCount++;
    }
    creator.images[src].src = "images/" + src + ".png";
  }

  creator.create = function(size){
    var sprite = {};
    sprite.position = {
      x: creator.random(game.width),
      y: creator.random(game.height)
    }
    sprite.rotation = creator.random(360);
    sprite.rotationSpeed = creator.random(40) - 20;
    sprite.direction = creator.random(360);

    sprite.size = size
    sprite.radius = size;
    sprite.speed = 6;
    sprite.state = 'alive';

    sprite.totalFrames = 15;
    sprite.frame = creator.random(sprite.totalFrames);
    sprite.imgWidth = 100;
    sprite.imgHeight = 100;

    sprite.render = function(){
      game.context.save();
      game.context.translate(sprite.position.x, sprite.position.y);
      game.context.rotate(creator.toRadians(sprite.rotation));

      game.context.drawImage(
        creator.images["ball-spritesheet"],
        sprite.frame * sprite.imgWidth,
        0,
        sprite.imgWidth,
        sprite.imgWidth,
        0 - (sprite.size / 2),
        0 - (sprite.size / 2),
        sprite.size,
        sprite.size
      );

      game.context.restore();
    }

    sprite.step = function(){
      // update position
      sprite.position.x  = sprite.position.x - Math.cos(creator.toRadians(sprite.direction)) * sprite.speed;
      sprite.position.y = sprite.position.y + Math.sin(creator.toRadians(sprite.direction)) * sprite.speed;

      // ensure sprite is within bounds
      if(sprite.position.x < 0 || sprite.position.x > game.width){
        sprite.direction = 180 - sprite.direction;
      }

      if(sprite.position.y < 0 || sprite.position.y > game.height){
        sprite.direction = 360 - sprite.direction;
      }

      // update sprite frame
      sprite.frame++;
      if(sprite.frame >= sprite.totalFrames){
        sprite.frame = 0;
      }

      // update rotation angle
      sprite.rotation = sprite.rotation + sprite.rotationSpeed;
      sprite.render();
    }

    return sprite;
  }

  creator.toRadians = function(angle){
    return angle * (Math.PI / 180);
  }

  creator.random = function(max){
    return Math.floor((Math.random() * max));
  }

  creator.init();
}
