/**
 * Character Template
 */

class Santa extends Character{

    constructor(x, y, name, input){
        super(x, y, name, input);
        this.scale = 2;
        this.loadTexture("idle", "textures/santa/santa-idle.png");
        this.loadTexture("idle_flipped", "textures/santa/santa-idle_flipped.png");
        this.changeSprite("idle");
    }

    draw(){
        super.draw();
        var dimensions = this.getDimensions();
        ctx.drawImage(this.getCurrentSprite(), this.x, this.y, dimensions.width, dimensions.height);
    }

    getDimensions(){
        return {
            width: this.getCurrentSprite().width * this.scale,
            height: this.getCurrentSprite().height * this.scale
        }
    }
}