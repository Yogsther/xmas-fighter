class StageItem {
    constructor(path, x, y, scale, collision) {
        this.image;
        if(scale === undefined) scale = 1;
        if (path === undefined) console.warn("No path to image")
        this.image = new Image();
        this.image.src = path;

        this.collision = collision;
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.width;
        this.height;
    }

    getBound(){

        this.width = this.image.width * this.scale
        this.height = this.image.height * this.scale;

        return {
            width: this.image.width * this.scale,
            height: this.image.height * this.scale,
            x: this.x,
            y: this.y
        }
    }
}
class Snowflake{
    constructor(){
        this.x = Math.floor(Math.random()*720);
        this.y = -450;
        this.sideSpeed = Math.floor(Math.random()*.5)+.5;
        this.scale = Math.floor((Math.random()+1)*4)/10;
        this.width = 10 * this.scale;
        this.height = this.width;
        this.opacity = Math.random();
        this.fallSpeed = 5 + (Math.random()*3);
        this.goingLeft = false;
        this.stopped = false;
        this.lifeLeft = Math.floor(Math.random()*100) + 80;
    }
    logic(){
        /* this.x; */
        this.lifeLeft--;
        if(this.stopped) return;
        for(var item of game.stage.content){
            if(item.collision){
                if(checkCollision(item, this)){
                    this.stopped = true;
                    return;
                }
            }
        }
        if(Math.random() > .98) this.goingLeft = !this.goingLeft; // Switch direciton
        this.y+=this.fallSpeed;
        if(this.goingLeft) this.x+=this.sideSpeed;
            else this.x-=this.sideSpeed;
    }
}

var stages = [
    {
        name: "Delta",
        snowflakes: [],
        snowflakeAmount: 800,
        flakesPerFrame: 5,
        logic: function() {
            var flakesCreatedThisFrame = 0;
            while(this.snowflakes.length < this.snowflakeAmount && flakesCreatedThisFrame < this.flakesPerFrame){
                this.snowflakes.push(new Snowflake());
                flakesCreatedThisFrame++;
            }

            for(var i = 0; i < this.snowflakes.length; i++){
                this.snowflakes[i].logic();
                draw("rgba(255, 255, 255, " + this.snowflakes[i].opacity + ")", this.snowflakes[i].x, this.snowflakes[i].y, this.snowflakes[i].width, this.snowflakes[i].height, false);
                if((!inFrame(this.snowflakes[i]) && this.snowflakes[i].y > 700) || this.snowflakes[i].lifeLeft < 0) this.snowflakes.splice(i, 1);
            }
        },
        bgcolor: "#9fdbdb",
        spawns: [{
            x: 100,
            y: 100
        }],
        content: [
            new StageItem("textures/general/platform-big.png", 80, 300, 10, true),
            new StageItem("textures/general/platform-small.png", 500, 150, 10, true),
            new StageItem("textures/general/platform-small.png", 80, 150, 10, true),
            new StageItem("textures/general/platform-small.png", 290, 0, 10, true),
            new StageItem("textures/general/tree.png", 400, 180, 10, false),
            new StageItem("textures/general/snowman.png", 230, 230, 10, false)
        ]
    }, {
        name: "Omega",
        textures: [],
        tick: 0,
        init: function(){
            for(i = 0; i < 461; i++){
                this.textures[i] = new Image();
                var numString = i.toString();
                while(numString.length < 3) numString = "0" + numString;
                this.textures[i].src = encodeURIComponent("textures/omega/stream/omega_#####_00" + numString + ".jpg");
            }
        },
        logic: function(){
            if(frames % 3 == 0) this.tick++;
            draw(this.textures[this.tick%this.textures.length], -530, -400, 2000, 2000, false);
        },
        spawns: [{
            x: 120,
            y: 100
        }, {
            x: 300,
            y: 100
        }],
        content: [
            new StageItem("textures/omega/underside.png", 135, 300, 10, false),
            new StageItem("textures/omega/platform-big.png", 135, 300, 10, true)
        ]
    }
]