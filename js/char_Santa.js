/**
 * Character Template
 */

class Santa extends Character{

    constructor(x, y, name, input){
        super(x, y, name, input);
        this.scale = 3;
        this.loadTexture("idle", "textures/santa/santa-idle.png");
        this.loadTexture("idle-2", "textures/santa/santa-idle-2.png");
        this.loadTexture("idle_flipped", "textures/santa/santa-idle_flipped.png");
        this.loadTexture("idle-2_flipped", "textures/santa/santa-idle-2_flipped.png");
        this.loadTexture("falling", "textures/santa/santa-falling.png")
        this.loadTexture("falling_flipped", "textures/santa/santa-falling_flipped.png")
        this.changeSprite("idle");
    }

    draw(){
        super.draw();
        if(this.state == "jump" || this.state == "fall"){
            this.changeSprite("falling")
        } else {
            if(Date.now()%1500 > 750) this.changeSprite("idle")
                else this.changeSprite("idle-2")
        }

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