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
        this.x = Math.floor(Math.random()*1000)-150;
        this.y = -500;
        this.scale = Math.floor((Math.random()+1)*4)/10;
        this.width = 10 * this.scale;
        this.height = this.width;
        this.opacity = Math.random();
        this.fallSpeed = 5 + (Math.random()*3);
        this.goingLeft = false;
        this.stopped = false;
        this.lifeLeft = 200;
    }
    logic(){
        /* this.x; */
        this.lifeLeft--;
        if(this.stopped) return;
        for(item of game.stage.content){
            if(item.collision){
                if(checkCollision(item, this)){
                    this.stopped = true;
                    return;
                }
            }
        }
        if(Math.random() > .98) this.goingLeft = !this.goingLeft; // Switch direciton
        this.y+=this.fallSpeed;
        if(this.goingLeft) this.x+=.5;
            else this.x-=.5;
    }
}

var stages = {
    
    defaultStage: {
        snowflakes: [],
        snowflakeAmount: 1000,
        logic: function() {
            var flakesCreatedThisFrame = 0;
            while(this.snowflakes.length < this.snowflakeAmount && flakesCreatedThisFrame < 5){
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
            new StageItem("textures/general/platform-big.png", 60, 300, 10, true),
            new StageItem("textures/general/platform-small.png", 480, 150, 10, true),
            new StageItem("textures/general/platform-small.png", 60, 150, 10, true),
            new StageItem("textures/general/platform-small.png", 275, 0, 10, true),
            new StageItem("textures/general/tree.png", 400, 180, 10, false),
            new StageItem("textures/general/snowman.png", 230, 230, 10, false)
        ]
    }
}