const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false; 

var keysDown = new Array();

const LOG_KEYS = false;

document.addEventListener("keydown", e => {
    keysDown[e.keyCode] = true;
    if(LOG_KEYS) console.log(e.keyCode);
})

document.addEventListener("keyup", e => {
    keysDown[e.keyCode] = false;
})

var inputs = [
    new Input("wasd", [87, 83, 65, 68, 67, 86, 32])
]

var game = new Game(stages.defaultStage);
    game.addPlayer(new Santa(100, 100, "Player 1", inputs[0]));


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
}

