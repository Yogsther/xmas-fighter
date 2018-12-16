/**
 * Character Template
 */

class Snowman extends Character {

    constructor(x, y, name, input, id, lives) {
        super(x, y, name, input, id, lives);
        this.scale = 3;
        this.specialItemDelay = 20; // Frames
        this.lastSpecialDeploy = 0;
        this.specialSpeed = 5;
        this.specialDamage = 10;
        this.specialScale = 3;

        this.attackCoolDown = 0; // Dont edit
        this.attackCoolDownTime = 10; // Frames
        this.snowballDamage = 4;
        this.attackKnockBack = 10;
        this.attackDamage = 10;

        // Snowrock, speical flag snowball
        this.flagActive = false;
        this.flagX;
        this.flagY;
        this.flagScale = 3;


        this.loadTexture("attack", "textures/snowman/snowman-throw.png")
        this.loadTexture("attack_flipped", "textures/snowman/snowman-throw_flipped.png")
        this.loadTexture("flag", "textures/snowman/flag.png")
        this.loadTexture("snowball", "textures/snowman/snowball.png")
        this.loadTexture("snowrock", "textures/snowman/snowrock.png")

        this.loadTexture("throw", "textures/snowman/snowman-throw.png")
        this.loadTexture("throw_flipped", "textures/snowman/snowman-throw_flipped.png")
        this.loadTexture("idle", "textures/snowman/snowman-idle.png");
        this.loadTexture("idle-2", "textures/snowman/snowman-idle-2.png");
        this.loadTexture("idle_flipped", "textures/snowman/snowman-idle_flipped.png");
        this.loadTexture("idle-2_flipped", "textures/snowman/snowman-idle-2_flipped.png");
        this.loadTexture("falling", "textures/snowman/snowman-falling.png")
        this.loadTexture("falling_flipped", "textures/snowman/snowman-falling_flipped.png")
        this.changeSprite("idle");
        this.loadTexture("shield", "textures/snowman/shield.png")
    }

    draw() {
        super.draw();
        if(this.flagActive){
            if(!this.snowrockActive()){
                this.flagActive = false;
            }
        }
        ctx.globalAlpha = this.opacity;
        if (this.attackCoolDown > 5) {
            this.changeSprite("attack");
        } else if (this.lastSpecialDeploy > 1) {
            this.changeSprite("throw")
        } else if (this.state == "fall" || this.state == "jump") {
            this.changeSprite("falling")

        } else {
            if ((Date.now() + (this.id * 200)) % 1500 > 750) this.changeSprite("idle")
            else this.changeSprite("idle-2")
        }

        var dimensions = this.getBound();
        draw(this.getCurrentSprite(), this.x, this.y, dimensions.width, dimensions.height);

        this.lastSpecialDeploy--;
        this.attackCoolDown--;
        ctx.globalAlpha = 1;
        super.drawShield(this.scale + 1);

        if(this.flagActive) draw(this.getTexture("flag"), this.flagX, this.flagY, this.getTexture("flag").width*this.flagScale, this.getTexture("flag").height*this.flagScale);
    }


    snowrockActive(){
        for(item of game.items){
            if(item.name == "snowrock") return true;
        }
        return false;
    }

    special() {
        if (!this.activeDirectional && !this.flagActive && this.state == "idle") {
            // Place flag      
            var rockScale = 5;
            var rockSpeed = 10;
            
            this.flagActive = true;
            this.flagX = this.x + (this.getBound().width / 2) - ((this.getTexture("snowrock").width*rockScale)/2);
            this.flagY = this.y + this.getBound().height - this.getTexture("flag").height * this.flagScale;
            
        game.addItem(new Item(this.x + (this.getBound().width / 2) - ((this.getTexture("snowrock").width*rockScale)/2), -500, this.name, 2, rockSpeed, this.getTexture("snowrock"), 5, 50, true, "linear", 1500, 30, "snowrock"))
        } else if(this.activeDirectional) {
            // Snowballs
            game.addItem(new Item(this.x + (this.getBound().width / 2), this.y + 30, this.name, this.playerDirection, this.specialSpeed * 3, this.getTexture("snowball"), this.specialScale, this.snowballDamage, true, undefined, 300, 8))
        }
    }

    attack() {
        if (this.attackCoolDown < 1) {
            this.attackCoolDown = this.attackCoolDownTime;
            if (this.playerDirection == 1) {
                game.addItem(new Item(this.x + 50, this.y - 10, this.name, this.playerDirection, 0, {
                    width: 20,
                    height: 80
                }, 1, this.attackDamage, false, "linear", 1, this.attackKnockBack))
            }
            if (this.playerDirection == 3) {
                game.addItem(new Item(this.x - 12, this.y - 10, this.name, this.playerDirection, 0, {
                    width: 20,
                    height: 80
                }, 1, this.attackDamage, false, "linear", 1, this.attackKnockBack))
            }
            if (this.playerDirection == 0) {
                game.addItem(new Item(this.x + 8, this.y - 20, this.name, this.playerDirection, 0, {
                    width: 50,
                    height: 70
                }, 1, this.attackDamage, false, "linear", 1, this.attackKnockBack))
            }
            if (this.playerDirection == 2) {
                game.addItem(new Item(this.x + 8, this.y + 80, this.name, this.playerDirection, 0, {
                    width: 50,
                    height: 70
                }, 1, this.attackDamage, false, "linear", 1, this.attackKnockBack))
            }
        }
    }
}