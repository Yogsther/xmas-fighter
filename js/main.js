const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false; 

var keysDown = new Array();

const LOG_KEYS = false;

document.addEventListener("keydown", e => {
    keysDown[e.keyCode] = true;
    for(player of game.players){
        player.clickEvent(e.keyCode);
    }
    if(LOG_KEYS) console.log(e.keyCode);
})

document.addEventListener("keyup", e => {
    keysDown[e.keyCode] = false;
})

var inputs = [
    new Input("wasd", [87, 83, 65, 68, 67, 76, 32]),
    new Input("bot", [-1, -1, -1, -1, -1, -1, -1])
]

var game = new Game(stages.defaultStage);
    game.addPlayer(new Santa(100, 100, "BALLS DEEP", inputs[0], 0));
    game.addPlayer(new Santa(420, 100, "Bot", inputs[1], 1));



startGame();

function startGame(){
    game.running = true;    
    loop();
}

function loop(){
    if(!game.running){
        console.log("Game ended.")
        return;
    }

    logic();
    render();
 
    requestAnimationFrame(loop);
}

function logic(){
    for(player of game.players){
        player.logic(game.stage);
    }
    for(i = 0; i < game.items.length; i++){
        item = game.items[i];
        for(stagePart of game.stage.content){
            if(checkCollision(stagePart, item.getBound())){
                item.kill();
            }
        }

        for(player of game.players){
            if(checkCollision(item.getBound(), player.getBound())){
                if(player.name != item.origin){
                    player.damage(item.damage, item.knockBack, item.direction)
                    item.kill();
                }
            }
        }
        item.logic();
        if(item.isDead()) game.items.splice(i, 1);
    }
}

function render() {
    /* Render stage */
    ctx.fillStyle = game.stage.bgcolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(item of game.stage.content){
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x, item.y, item.width, item.height);
    }

    /* Render players */
    for(character of game.players){
        character.draw();
    }    

    for(item of game.items){
        item.draw();
    }
}



function checkCollision(obj1, obj2) {


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