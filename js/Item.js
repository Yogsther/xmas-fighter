class Item {
    constructor(x, y, origin, direction, speed, sprite, scale, damage, destroysOnImpact, path, lifeSpan, knockBack, name) {
        if (path === undefined) path = "linear"
        if (scale === undefined) scale = 1;
        if (knockBack === undefined) knockBack = 10;
        this.x = x;
        this.y = y;
        this.path = path; // Can be linear (default) or parabolic 
        this.origin = origin; // String, playername
        this.direction = direction; // 0-3, UP, RIGHT, DOWN, LEFT
        this.speed = speed; // Speed of item
        this.sprite = sprite; // Image
        this.scale = scale;
        this.damage = damage;
        this.knockBack = knockBack;
        this.destroysOnImpact = destroysOnImpact;
        this.dead = false;
        this.floatY = -100;
        this.floatX = 0;
        this.lifeSpan = lifeSpan // In frames
        this.age = 0; // Frames
        this.name = name; // Can be undefined
    }

    draw() {
        if (this.dead) return;
        var dimensions = this.getDimensions();

        var bound = this.getBound();
        if (this.sprite.src != undefined){
         draw(this.sprite, bound.x, bound.y, bound.width, bound.height)
        } else {
            return;
            draw("blue", bound.x, bound.y, bound.width, bound.height);
        }

    }

    getBound() {
        var bound = {
            x: this.x,
            y: this.y,
            width: this.sprite.width * this.scale,
            height: this.sprite.height * this.scale
        }
        if (this.path == "parabolic") {
            bound.x = this.floatX + this.x;
            bound.y = (Math.pow(this.floatY, 2) * .005) + this.y;
        }
        return bound;
    }

    hit() {
        if (this.destroysOnImpact) this.kill();
    }

    kill() {
        this.dead = true;
    }

    isDead() {
        return this.dead;
    }

    logic() {
        this.age++;
        if (this.age > this.lifeSpan) this.kill();
        if (this.dead) return;
        if (this.path == "linear") {
            if (this.direction == 0) this.y -= this.speed;
            if (this.direction == 1) this.x += this.speed;
            if (this.direction == 2) this.y += this.speed;
            if (this.direction == 3) this.x -= this.speed;
        } else if (this.path == "parabolic") {
            this.floatY += this.speed;
            if (this.direction == 1) this.floatX += this.speed;
            else this.floatX -= this.speed;
        }
    }

    getDimensions() {
        return {
            width: this.sprite.width * this.scale,
            height: this.sprite.height * this.scale
        }
    }


}