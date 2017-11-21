

function ExplosionSprite(game){

  var creator = this;
  creator.images = [];
  creator.loadedResourceCount = 0;

  creator.init = function(){
    creator.loadImage('explosion');
  }

  creator.loadImage = function(src){
    creator.images[src] = new Image();
    creator.images[src].onload = function() {
        creator.loadedResourceCount++;
    }
    creator.images[src].src = "images/" + src + ".png";
  }

  creator.create = function(x, y, size, callback){
    var sprite = {}
    sprite.completedCallback = callback;
    sprite.rotation = 0;
    sprite.position = {
      x: x,
      y: y
    };

    sprite.size = size;
    sprite.radius = 0;
    sprite.state = 'alive';

    sprite.image = {
      frameWidth: 256,
      frameHeight: 256,
      numCols: 8,
      numRows: 6,
      curCol: 0,
      curRow: 0,
      currentFrame: 0,
      animtaionComplete: false
    };

    sprite.render = function(){
      game.context.save();
      game.context.translate(sprite.position.x, sprite.position.y);
      game.context.rotate(creator.toRadians(sprite.baseRotation));

      game.context.drawImage(
        creator.images["explosion"],
        sprite.image.curCol * sprite.image.frameWidth,
        sprite.image.curRow * sprite.image.frameHeight,
        sprite.image.frameWidth,
        sprite.image.frameHeight,
        0 - (sprite.size / 2),
        0 - (sprite.size / 2),
        sprite.size,
        sprite.size
      );

      game.context.restore();
    }

    sprite.step = function(){
      if(sprite.image.animationComplete){
        return
      }
      // update sprite frame
      sprite.image.curCol++;
      sprite.image.currentFrame++;
      if(sprite.image.curCol >= sprite.image.numCols){
        sprite.image.curCol = 0;
        sprite.image.curRow++;
      }
      if(sprite.image.curRow >= sprite.image.numRows){
        //sprite.image.curRow = 0;
        sprite.image.currentFrame = 0;
        sprite.animationComplete();
      }
      sprite.updateRadius();

      sprite.render();
    }

    sprite.updateRadius = function(){
      var framesToFull = 32
      var increment = sprite.size / framesToFull;
      if(sprite.currentFrame < 32){
        sprite.radius = sprite.radius + increment;
      }else{
        sprite.radius = sprite.radius - increment;
      }

      sprite.radius = sprite.radius < 0 ? 0 : sprite.radius;
    }

    sprite.animationComplete = function(){
      sprite.image.animationComplete = true;
      sprite.state = 'dead';
      sprite.completedCallback(sprite);
    }


    return sprite;
  }

  creator.toRadians = function(angle){
    return angle * (Math.PI / 180);
  }

  creator.init();

  return creator;
}
