class Character{
    constructor(x, y, name, input){
        this.x = x;
        this.y = y;
        this.name = name;
        this.input = input;
        this.onGround = true;
        this.jumpDir = 0; // 0 = Not jumping, 1 = going up, 2 = going down
        this.jumpVel = 0;
        this.maxVel = 10;
        this.jumpHeight = 10;
        this.doubleJumpUsed = false;
        this.jumpSpeed = 5;
        this.movementSpeed = 10;
        this.jumpHeight = 15;
    }

    jump(){
        if(this.jumpDir > 0){
            this.doubleJumpUsed = true;
        } else this.doubleJumpUsed = false; 
        this.onGround = false;
        this.jumpDir = 1;
        this.jumpVel = -this.jumpHeight;
    }

    draw(){
        var dimensions = this.getDimensions();
        ctx.fillStyle = dimensions.color;
        ctx.fillRect(this.x, this.y, dimensions.width, dimensions.height);

        ctx.font = "20px Ubuntu";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.name + " | " + this.input.name, this.x + (dimensions.width/2), this.y - 20)
    }

    logic(stage){
        // Movements
        if(keysDown[this.input.getKey("up")] && (this.onGround || !this.doubleJumpUsed)) this.jump()
        if(keysDown[this.input.getKey("down")]) this.move(0, this.movementSpeed);
        if(keysDown[this.input.getKey("left")]) this.move(-this.movementSpeed, 0);
        if(keysDown[this.input.getKey("right")]) this.move(this.movementSpeed, 0);
        
        // Collisions
        this.onGround = false;
        for(var stagePart of stage.content){
            var collision = this.checkCollision(stagePart);

            while(collision){
                if(collision.fromBottom){
                    this.move(0, 1);
                }
                if(collision.fromLeft) this.move(-1, 0);
                if(collision.fromRight) this.move(1, 0);
                if(collision.fromTop) {
                    this.onGround = true;
                    this.doubleJumpUsed = false;
                    this.jumpDir = 0;
                    this.move(0, -1);
                }
                collision = this.checkCollision(stagePart);
            }

            if(this.checkCollision(stagePart, true).fromTop){
                this.onGround = true;
            }
        }

        if(!this.onGround){
            this.move(0, this.jumpSpeed);
        }

        // Jumping
        if(this.jumpDir == 1){
            this.move(0, this.jumpVel);
            this.jumpVel++;
            if(this.jumpVel > this.maxVel) this.jumpVel = this.maxVel;
        }
    }

    checkCollision(stagePart, extraBottom) {

        var obj1 = this.getDimensions();
        obj1.x = this.x;
        obj1.y = this.y;

        if(extraBottom){
            obj1.height+=1;
        }
    
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
                fromBottom: short == 3
            }
    
        }
        return false;
    }
    

    getDimensions(){

    }

    move(x, y){
        this.x += x;
        this.y += y;
    }
}
