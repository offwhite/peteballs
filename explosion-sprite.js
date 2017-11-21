

function ExplosionSprite(game){

  var creator = this;

  creator.create = function(x, y, size, callback){
    var sprite = {}
    sprite.completedCallback = callback;
    sprite.rotation = 0;
    sprite.position = {
      x: x,
      y: y
    };

    sprite.size = size;
    sprite.collisionRadius = 0;
    sprite.maxCollisionRadius = (size / 2) * 0.7
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
        game.images["explosion"],
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

      // game.context.beginPath();
      // game.context.arc(sprite.position.x, sprite.position.y, sprite.collisionRadius, 0, 2 * Math.PI, false);
      // game.context.fillStyle = '#000000';
      // game.context.fill();
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
      sprite.updateCollisionRadius();

      sprite.render();
    }

    sprite.updateCollisionRadius = function(){
      var numFramesToMaxSize = (sprite.image.numCols * sprite.image.numRows) / 2;
      var increment = sprite.maxCollisionRadius / numFramesToMaxSize
      if(sprite.image.currentFrame < numFramesToMaxSize){
        sprite.collisionRadius = sprite.collisionRadius + increment;
      }else{
        sprite.collisionRadius = sprite.collisionRadius - increment;
      }

      sprite.collisionRadius = sprite.collisionRadius < 0 ? 0 : sprite.collisionRadius;
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

  return creator;
}
