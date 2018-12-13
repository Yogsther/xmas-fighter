class Character {
    constructor(x, y, name, input, id, lives) {
        this.lives = lives;
        this.id = id;
        this.x = x;
        this.y = y;
        this.alive = true;
        this.invincibilityTime = 100; // Frames
        this.activeDirectional = false;
        this.opacity = 1;
        this.playerDirection = 1; // 0=UP, 1=RIGHT, 2=DOWN, 3=LEFT
        this.name = name;
        this.state = "idle"; // Can be: idle, jump, fall, move...
        this.input = input;
        this.onGround = true;
        this.jumpDir = 0; // 0 = Not jumping, 1 = jumping
        this.jumpVel = 0;
        this.maxVel = 1;
        this.doubleJumpUsed = false;
        this.amountOfJumps = 2; // Extra jumps, 1 == double jump, standard.
        this.jumpsLeft = this.amountOfJumps
        this.jumpSpeed = 6;
        this.movementSpeed = 5;
        this.jumpHeight = 20;
        this.textures = {};
        this.jumpDelay = 10; // Frames
        this.leftUntilNextJump = 0;
        this.currentSprite;
        this.flipped = false;
        this.hasFlippedTextures = true;
        this.shieldActive = false;
        this.maxShieldHP = 100;
        this.shieldHP = this.maxShieldHP;
        this.shieldChargePerFrame = .5;
        this.shieldDepletionPerFrame = 1;
        this.shieldDelayAfterFullDepletion = 420; // Frames until shield can be used again - cooldown
        this.shieldPause = 0;
        this.shieldInitialCost = 10; // HP
        this.playerMovementDisabled = false;
        this.moved = false;

        this.maxMomentum = 8;
        this.momentum = 0;
        this.momentumIncrease = 3;
        this.groundMomentumIncrease = 4;
        this.airMomentumIncrease = .7;
        this.groundFriction = 4;
        this.airFriction = .1;
        this.maxHealth = 120;
        this.health = 120;

        this.loadTexture("shield", "textures/santa/shield.png");
    }

    isInvincible(){
        return this.invincibilityTime > 0;
    }

    giveInvincibility(time /* frames */){
        this.invincibilityTime += time;
    }


    loadTexture(name, path) {
        var tempImg = new Image();
        tempImg.src = path;
        this.textures[name] = tempImg;
    }

    getTexture(name) {
        for (var texture in this.textures) {
            if (texture == name) return this.textures[name];
        }
    }

    changeSprite(name) {
        this.currentSprite = name;
    }

    getCurrentSprite() {
        if (this.hasFlippedTextures && this.flipped) {
            return this.getTexture(this.currentSprite + "_flipped")
        }
        return this.textures[this.currentSprite];
    }

    jump() {
        if (this.jumpsLeft < 1 || this.leftUntilNextJump > 0) return;
        this.jumpsLeft--;
        this.leftUntilNextJump = this.jumpDelay;
        this.onGround = false;
        this.jumpDir = 1;
        this.jumpVel = -this.jumpHeight;
    }

    resetJump() {
        //this.jumpDir = 0;
        if (this.jumpDir < 2) return;
        this.jumpsLeft = this.amountOfJumps;
        this.onGround = true;
        this.changeState("idle");
        this.jumpDir = 0;
    }

    attack() {
        console.warn("No attack implemented!");
    }

    special() {
        console.warn("No special implemented!");
    }

    damage(amount, knockBack, direction){
        this.resetJump();
        if(this.isInvincible()) return;
        var amountToDeal = amount;
        if(this.shieldActive){
            amountToDeal -= this.shieldHP;
            this.shieldHP -= amount;
            if(this.shieldHP < 0){
                this.shieldHP = 0;
            }
        } else if(knockBack){
            if(direction == 1){
                this.momentum += knockBack;
                this.jump();
            } else if(direction == 3) {
                this.momentum -= knockBack;
                this.jump();
            } else {
                this.jump();
            }
        }
        if(amountToDeal > 0) this.health -= amountToDeal;
        if(this.health < 1) this.kill();   
    }

    kill(){
        this.alive = false;
        this.lives--;
        var spawn = game.stage.spawns[Math.floor(Math.random()*game.stage.spawns.length)]

        this.health = this.maxHealth;
        this.x = spawn.x;
        this.y = spawn.y;

    }

    draw() {
        var dimensions = this.getBound();

        // TODO
        /* ctx.font = "12px Ubuntu";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.x + (dimensions.width / 2)  + camera.x, this.y - 30 + camera.y) */
     
        var healthBarWidth = 80;
        var healthBarHeight = 9;
        draw("#131313", this.x + ((dimensions.width/2) - healthBarWidth/2), this.y - 20, healthBarWidth, healthBarHeight);
        draw("#6dff70", this.x + ((dimensions.width/2) - healthBarWidth/2), this.y - 20, healthBarWidth / (this.maxHealth/this.health), healthBarHeight)
    }

    

    drawShield(scale) {
        if (scale === undefined) scale = 1;
        var shield = this.getTexture("shield");
        var dimensions = this.getBound();

        if (this.shieldActive) draw(shield, (this.x + ((dimensions.width / 2))) - (((shield.width / 2) * scale) * (this.shieldHP / 100)), this.y + (((dimensions.height / 2))) - (((shield.height / 2) * scale) * (this.shieldHP / 100)), (shield.width * scale) * (this.shieldHP / 100), (shield.height * scale) * (this.shieldHP / 100))
    }

    activateShield() {
        if (this.shieldPause > 0) return;
        if (!this.shieldActive) this.shieldHP -= this.shieldInitialCost;
        this.shieldActive = true;
        this.playerMovementDisabled = true;
    }

    deactivateShield() {
        this.shieldActive = false;
        this.playerMovementDisabled = false;
    }

    shieldLogic() {
        // Runs each frame
        if (this.shieldActive) {
            if (this.shieldHP > 1) {
                // Deplete shield
                this.shieldHP -= this.shieldDepletionPerFrame;

            } else {
                this.shieldPause = this.shieldDelayAfterFullDepletion;
                this.deactivateShield();
            }
        }
        // Recharge shield
        if (this.shieldHP < this.maxShieldHP) this.shieldHP += this.shieldChargePerFrame;
        // Deplete shiled pause
        this.shieldPause--;
    }

    // Runs on each keydown
    clickEvent(code) {
        if (this.input.getKey("special") == code) {
            this.special();
        }
        if(this.input.getKey("damage") == code){
            this.attack();
        }
    }

    logic(stage) {

        if(this.y > 1000) this.kill();

        // Movements
        this.shieldLogic();
        this.moved = false;
        if(this.isInvincible()){
            this.opacity = Math.sin(Date.now()/90)+1.5;
        } else {
            this.opacity = 1;
        }
        this.activeDirectional = false;
        if (keysDown[this.input.getKey("down")]) {
            this.activateShield();
            this.activeDirectional = true;
            this.playerDirection = 2;
        } else this.deactivateShield();

        if (!this.playerMovementDisabled) {

            if ((keysDown[this.input.getKey("up")] || keysDown[this.input.getKey("jump")]) && this.jumpsLeft > 0) {
                this.jump();
                this.playerDirection = 0;
                this.activeDirectional = true;
            }

            if (keysDown[this.input.getKey("left")]) {
                //this.move(-this.movementSpeed, 0);
                this.momentum -= this.momentumIncrease;
                if (this.momentum < -this.maxMomentum) this.momentum = -this.maxMomentum;

                this.moved = true;
                this.flipped = true;
                this.activeDirectional = true;
                this.playerDirection = 3;
            }
            if (keysDown[this.input.getKey("right")]) {
                //this.move(this.movementSpeed, 0);
                this.momentum += this.momentumIncrease;
                if (this.momentum > this.maxMomentum) this.momentum = this.maxMomentum;

                this.moved = true;
                this.activeDirectional = true;
                this.flipped = false;
                this.playerDirection = 1;
            }
        }

        var friction;
        if (this.state == "idle") friction = this.groundFriction;
        else friction = this.airFriction;

        if (this.moved) {
            this.changeState("move");

        } else {

            this.changeState("idle");

            if (Math.abs(this.momentum - friction) < (friction)) {
                this.momentum = 0;
            }
            if (this.momentum > 0) this.momentum -= friction;
            if (this.momentum < 0) this.momentum += friction;

        }

        // Collisions
        this.onGround = false;
        for (var stagePart of stage.content) {
            if(stagePart.collision){
                var collision = this.checkCollision(stagePart);

                while (collision) {
                    if (collision.fromBottom) this.move(0, 1);
                    if (collision.fromLeft) this.move(-1, 0);
                    if (collision.fromRight) this.move(1, 0);
                    if (collision.fromTop) {
                        this.move(0, -1);
                    }
                    collision = this.checkCollision(stagePart);
                }
    
                if (this.checkCollision(stagePart, 1).fromTop) {
                    this.resetJump();
                }
            }
            
        }

        // Item collisions
        this.onGround

        this.leftUntilNextJump--;
        this.invincibilityTime--;

        if (!this.onGround) {
            this.move(0, this.jumpSpeed);
        } else {
            this.resetJump();
        }

        // Jumping
        if (this.jumpDir > 0) {
            this.move(0, this.jumpVel);
            this.jumpVel++;
            if (this.jumpVel > 0) this.jumpDir = 2; // Going down
            if (this.jumpVel < 0) this.changeState("jump")
            else this.changeState("fall");
            if (this.jumpVel > this.maxVel) this.jumpVel = this.maxVel;
        }

        if (this.momentum !== 0) {
            this.move(this.momentum, 0);
        }
    }

    changeState(newState) {
        this.state = newState
        if (this.state == "jump" || this.state == "fall") this.momentumIncrease = this.airMomentumIncrease;
        else this.momentumIncrease = this.groundMomentumIncrease;
    }

    checkCollision(stagePart, extraBottom) {
        if (extraBottom === undefined) extraBottom = 0;
        var obj1 = this.getBound();
        obj1.x = this.x;
        obj1.y = this.y + extraBottom;


        var obj2 = stagePart;

        if (obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.height + obj1.y > obj2.y) {

            /* Collision has happened, calculate further */

            var info = {
                fromLeft: false,
                fromRight: false,
                fromTop: false,
                fromBottom: false
            }

            var values = new Array();

            /* From left value */
            values[0] = ((obj1.x + obj1.width - obj2.x)) /* * obj1.width; / Possible addition */
            /* From right value */
            values[1] = (obj2.x + obj2.width - obj1.x);
            /* From top values */
            values[2] = (obj1.y + obj1.height - obj2.y);
            /* From bottom value */
            values[3] = obj2.height + obj2.y - obj1.y;

            /**
             * Get the shortest distance from values, the shortest one will be the direction of overlap.
             */
            var short = 0;
            for (let i = 0; i < values.length; i++) {
                if (values[i] < values[short]) short = i;
            }

            return {
                fromLeft: short == 0,
                fromRight: short == 1,
                fromTop: short == 2,
                fromBottom: short == 3,
                distanceFromTop: values[2]
            }

        }
        return false;
    }
    getBound(){
        return {
            width: this.getCurrentSprite().width * this.scale,
            height: this.getCurrentSprite().height * this.scale,
            x: this.x,
            y: this.y
        }
    }

    move(x, y) {
        this.x += x;
        this.y += y;
        this.moved = true;
    }
}