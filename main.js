const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var keysDown = new Array();

document.addEventListener("keydown", e => {
    keysDown[e.keyCode] = true;
})

document.addEventListener("keyup", e => {
    keysDown[e.keyCode] = false;
})

class Input{
    constructor(name, keys){
        this.name = name;
        /* Key order: UP, DOWN, LEFT, RIGHT, DAMAGE, SPECIAL */
        this.keys = keys;
        this.keyNames = ["up", "down", "left", "right", "damage", "special"]
    }  

    getKey(name){
        for(var i = 0; i < this.keys.length; i++){
            if(this.keyNames[i] == name){
                return this.keys[i];
            }
        }
    }
}

var stages = {
    defaultStage: {
        bgcolor: "#3d3d3d",
        content: [{
            type: "block",
            width: 600,
            height: 100,
            x: 60,
            y: 300,
            color: "white"
        },{
            type: "block",
            width: 50,
            height: 50,
            x: 300,
            y: 200,
            color: "white"
        }]
    }
}

var inputs = [
    new Input("wasd", [87, 83, 65, 68, 67, 86])
]

var game = new Game(stages.defaultStage);
    game.addPlayer(new Test(100, 100, "Player 1", inputs[0]));

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

