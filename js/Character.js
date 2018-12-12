class Character{
    constructor(x, y, name, input){
        this.x = x;
        this.y = y;
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
        this.jumpHeight = 18;
        this.textures = {};
        this.jumpDelay = 10; // Frames
        this.leftUntilNextJump = 0;
        this.currentSprite;
        this.flipped = false;
        this.hasFlippedTextures = true;

        this.moved = false;
    }

    loadTexture(name, path){
        var tempImg = new Image();
            tempImg.src = path;
        this.textures[name] = tempImg;
    }

    getTexture(name){
        for(var texture in this.textures){
            if(texture == name) return this.textures[name];
        }
    }

    changeSprite(name){
        this.currentSprite = name;
    }

    getCurrentSprite(){
        if(this.hasFlippedTextures && this.flipped){
            return this.getTexture(this.currentSprite + "_flipped")
        }
        return this.textures[this.currentSprite];
    }

    jump(){
        if(this.jumpsLeft < 1 || this.leftUntilNextJump > 0) return;
        this.jumpsLeft--;
        this.leftUntilNextJump = this.jumpDelay;
        this.onGround = false;
        this.jumpDir = 1;
        this.jumpVel = -this.jumpHeight;
    }

    resetJump(){
        //this.jumpDir = 0;
        if(this.jumpDir < 2) return; 
        this.jumpsLeft = this.amountOfJumps;
        this.onGround = true;
        this.state = "idle";
        this.jumpDir = 0;
    }

    draw(){
        var dimensions = this.getDimensions();

        ctx.font = "12px Ubuntu";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.name + " | " + this.input.name, this.x + (dimensions.width/2), this.y - 20)
    }



    logic(stage){
        // Movements
        this.moved = false;
        if((keysDown[this.input.getKey("up")] || keysDown[this.input.getKey("jump")]) && this.jumpsLeft > 0) this.jump()
        if(keysDown[this.input.getKey("down")]) this.move(0, this.movementSpeed);
        if(keysDown[this.input.getKey("left")]){
            this.move(-this.movementSpeed, 0);
            this.flipped = true;
        }
        if(keysDown[this.input.getKey("right")]){
            this.move(this.movementSpeed, 0);
            this.flipped = false;
        }

        if(this.moved){
            this.state = "move";
        } else {
            this.state = "idle";
        }
        
        // Collisions
        this.onGround = false;
        for(var stagePart of stage.content){
            var collision = this.checkCollision(stagePart);

            while(collision){
                if(collision.fromBottom) this.move(0, 1);
                if(collision.fromLeft) this.move(-1, 0);
                if(collision.fromRight) this.move(1, 0);
                if(collision.fromTop) {
                    /* this.resetJump(); */
                    this.move(0, -1);
                }
                collision = this.checkCollision(stagePart);
            }

            if(this.checkCollision(stagePart, 1).fromTop){
                this.resetJump();
            }
        }

        this.leftUntilNextJump--;

        if(!this.onGround){
            this.move(0, this.jumpSpeed);
        } else {
            this.resetJump();
        }

        // Jumping
        if(this.jumpDir > 0){
            this.move(0, this.jumpVel);
            this.jumpVel++;
            if(this.jumpVel > 0) this.jumpDir = 2; // Going down
            if(this.jumpVel < 0) this.state = "jump"
                else this.state = "fall";
            if(this.jumpVel > this.maxVel) this.jumpVel = this.maxVel;
         } 
    }

    checkCollision(stagePart, extraBottom) {
        if(extraBottom === undefined) extraBottom = 0;
        var obj1 = this.getDimensions();
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
    

    getDimensions(){

    }

    move(x, y){
        this.x += x;
        this.y += y;
        this.moved = true;
    }
}
