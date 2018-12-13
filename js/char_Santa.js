/**
 * Character Template
 */

class Santa extends Character{

    constructor(x, y, name, input, id){
        super(x, y, name, input, id);
        this.scale = 3;

        this.specialItemDelay = 20; // Frames
        this.lastSpecialDeploy = 0;
        this.specialSpeed = 5;
        this.specialDamage = 10;
        this.specialScale = 3;

        this.loadTexture("gift", "textures/santa/gift.png");
        this.loadTexture("throw", "textures/santa/santa-throw.png")
        this.loadTexture("throw_flipped", "textures/santa/santa-throw_flipped.png")
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
        ctx.globalAlpha = this.opacity;
        if(this.lastSpecialDeploy > 1){
            this.changeSprite("throw")
        } else if(this.state == "jump" || this.state == "fall"){
            this.changeSprite("falling")
        } else {
            if((Date.now()+(this.id*200))%1500 > 750) this.changeSprite("idle")
                else this.changeSprite("idle-2")
        }

        var dimensions = this.getBound();
        ctx.drawImage(this.getCurrentSprite(), this.x, this.y, dimensions.width, dimensions.height);
        
        this.lastSpecialDeploy--;
        ctx.globalAlpha = 1;
        super.drawShield(this.scale);
    }

    special(){
        if(this.lastSpecialDeploy < 1){
            this.lastSpecialDeploy = this.specialItemDelay;
            if(!this.activeDirectional){
                var direction = 1;
                if(this.flipped) direction = 3;
                game.addItem(new Item(this.x + (this.getBound().width/2), this.y - 30, this.name, direction, this.specialSpeed, this.getTexture("gift"), this.specialScale, this.specialDamage, true, "parabolic", 300, 12))
            } else {
                game.addItem(new Item(this.x + (this.getBound().width/2), this.y + 30, this.name, this.playerDirection, this.specialSpeed*.9, this.getTexture("gift"), this.specialScale, this.specialDamage, true, undefined, 300, 8))
            }
        }
    }
}