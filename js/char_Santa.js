/**
 * Character Template
 */

class Santa extends Character{

    constructor(x, y, name, input, id, lives, color){
        super(x, y, name, input, id, lives, color);
        this.scale = 3;
        this.specialItemDelay = 20; // Frames
        this.lastSpecialDeploy = 0;
        this.specialSpeed = 5;
        this.specialDamage = 10;
        this.specialScale = 3;

        this.attackCoolDown = 0; // Dont edit
        this.attackCoolDownTime = 10; // Frames
        this.attackDamage = 10;
        this.attackKnockBack = 10;

        this.loadTexture("gift_0", "textures/santa/gift_0.png");
        this.loadTexture("gift_1", "textures/santa/gift_1.png");
        this.loadTexture("gift_2", "textures/santa/gift_2.png");
        
        this.loadTexture("attack", "textures/santa/santa-attack.png")
        this.loadTexture("attack_flipped", "textures/santa/santa-attack_flipped.png")

        this.loadTexture("running_0", "textures/santa/santa-running_0.png");
        this.loadTexture("running_1", "textures/santa/santa-running_1.png");
        this.loadTexture("running_0_flipped", "textures/santa/santa-running_0_flipped.png");
        this.loadTexture("running_1_flipped", "textures/santa/santa-running_1_flipped.png");

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

    getRandomGift(){
        return this.getTexture("gift_"+Math.floor(Math.random()*3));
    }

    draw(){
        super.draw();
        ctx.globalAlpha = this.opacity;
        if(this.attackCoolDown > 5){
            this.changeSprite("attack");
        } else if(this.lastSpecialDeploy > 1){
            this.changeSprite("throw")
        } else if(this.state == "fall" || this.state == "jump"){
            this.changeSprite("falling")
        
        } else if(this.state == "move"){
            if((Date.now()+(this.id*200))%200 > 100) this.changeSprite("running_0")
                else this.changeSprite("running_1")
            
        } else {
            if((Date.now()+(this.id*200))%1500 > 750) this.changeSprite("idle")
                else this.changeSprite("idle-2")
        }

        var dimensions = this.getBound();
        draw(this.getCurrentSprite(), this.x, this.y, dimensions.width, dimensions.height);
        
        this.lastSpecialDeploy--;
        this.attackCoolDown--;
        ctx.globalAlpha = 1;
        super.drawShield(this.scale+1);
    }

    special(){
        if(this.lastSpecialDeploy < 1){
            this.lastSpecialDeploy = this.specialItemDelay;
            if(!this.activeDirectional){
                var direction = 1;
                if(this.flipped) direction = 3;
                // Standing still throw
                game.addItem(new Item(this.x + (this.getBound().width/2), this.y - 30, this.name, direction, this.specialSpeed, this.getRandomGift(), this.specialScale, this.specialDamage*2.5, true, "parabolic", 300, 12))
            } else {
                // Directional throw
                game.addItem(new Item(this.x + (this.getBound().width/2), this.y + 30, this.name, this.playerDirection, this.specialSpeed*3, this.getRandomGift(), this.specialScale, this.specialDamage, true, undefined, 300, 8))
            }
        }
    }

    attack(){
        if(this.attackCoolDown < 1){
            this.attackCoolDown = this.attackCoolDownTime;
            if(this.playerDirection == 1){
                game.addItem(new Item(this.x + 50, this.y-10, this.name, this.playerDirection, 0, {width: 20, height: 80}, 1, this.attackDamage, false, "linear", 1, this.attackKnockBack))
            }
            if(this.playerDirection == 3){
                game.addItem(new Item(this.x - 12, this.y-10, this.name, this.playerDirection, 0, {width: 20, height: 80}, 1, this.attackDamage, false, "linear", 1, this.attackKnockBack))
            }
            if(this.playerDirection == 0){
                game.addItem(new Item(this.x+8, this.y-20, this.name, this.playerDirection, 0, {width: 50, height: 70}, 1, this.attackDamage, false, "linear", 1, this.attackKnockBack))
            }
            if(this.playerDirection == 2){
                game.addItem(new Item(this.x+8, this.y+80, this.name, this.playerDirection, 0, {width: 50, height: 70}, 1, this.attackDamage, false, "linear", 1, this.attackKnockBack))
            }
        }
    }
}