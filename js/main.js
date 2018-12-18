/**
 * main.js for XMAS-FIGHTERS
 */

var LOG_KEYS = false;
var HIDE_PLAYERS = false;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;


var game;
var frames = 0;
var keysDown = new Array();
var camera = {
    zoom: 1,
    desiredZoom: .5,
    maxZoom: 1.8,
    minZoom: .5,
    padding: .8,
    zoomInSpeed: .001,
    zoomOutSpeed: .015,
    x: 0,
    y: 0,
    zoomPauseTime: 400, /* Frames */
    zoomPause: 0
}

function updateCamera() {
    var testZoom = camera.maxZoom;
    var center = getCenterFromPlayerPos();
    for (player of game.players) {
        var bounds = player.getBound();
        while (!inFrame(bounds.x, bounds.y, bounds.width, bounds.height, testZoom, getCameraCenter(testZoom).x, getCameraCenter(testZoom).y) && testZoom > camera.minZoom) {
            testZoom -= .05;
        }
    }
    testZoom *= camera.padding;
    camera.desiredZoom = testZoom;

    if (Math.abs(camera.desiredZoom - camera.zoom) >= camera.zoomOutSpeed) {
        if (camera.desiredZoom > camera.zoom) camera.zoom += camera.zoomInSpeed * (Math.abs(camera.desiredZoom-camera.zoom)) * 7;
        if (camera.desiredZoom < camera.zoom) camera.zoom -= camera.zoomOutSpeed;
    }

    camera.x = getCameraCenter(camera.zoom).x;
    camera.y = getCameraCenter(camera.zoom).y;
}

function getCameraCenter(zoom){
    //var center = getCenterFromPlayerPos();
    return {
        x: -(((canvas.width  / zoom) - canvas.width) / 2) ,
        y: -(((canvas.height / zoom) - canvas.height) / 2)
    }
}

function getCenterFromPlayerPos(){
    var totalX = 0, totalY = 0;
    for(player of game.players){
        totalX+=player.x;
        totalY+=player.y;
    }
    return {
        x: totalX / game.players.length - canvas.width/2,
        y: totalY / game.players.length - canvas.width/2
    }
}


document.addEventListener("keydown", e => {
    keysDown[e.keyCode] = true;
    for (player of game.players) {
        player.clickEvent(e.keyCode);
    }
    if (LOG_KEYS) console.log(e.keyCode);
})

document.addEventListener("keyup", e => {
    keysDown[e.keyCode] = false;
})

/* Key order: UP, DOWN, LEFT, RIGHT, DAMAGE, SPECIAL, JUMP */
var inputs = {
    wasd: new Input("wasd", [87, 83, 65, 68, 86, 67, 32]),
    empty: new Input("bot", [-1, -1, -1, -1, -1, -1, -1]),
    keys: new Input("keys", [38, 40, 37, 39, 76, 75, -1])
}

var selectedStage = 0;

var characters = [
    {
        name: "Snowman",
        class: Snowman
    }, {
        name: "Santa",
        class: Santa
    }
]

function selectStage(id){
    selectedStage = id;
}

function startGame() {
    game = new Game(stages[selectedStage]);
    game.addPlayer(new Snowman(100, 100, "P1", inputs.wasd, 0));
    game.addPlayer(new Santa(420, 100, "Bot", inputs.keys, 1));
    
    game.running = true;
    loop();
}

function stopGame(){
    game.running = false;
}

function hideGUI(){
    document.getElementById("gui").style.visibility = "hidden";
}

function loop() {
    if (!game.running) {
        draw("black", 0, 0, canvas.width, canvas.height);
        return;
    }

    logic();
    updateCamera();
    render();

    requestAnimationFrame(loop);
}

function logic() {

    for (player of game.players) {
        player.logic(game.stage);
    }

    var bounds = game.players[0].getBound();
    inFrame(bounds.x, bounds.y, bounds.width, bounds.height)

    for (i = 0; i < game.items.length; i++) {
        item = game.items[i];
        for (stagePart of game.stage.content) {
            if(stagePart.collision){
                if (checkCollision(stagePart, item.getBound())) {
                    item.kill();
                }
            }
        }

        for (player of game.players) {
            if (checkCollision(item.getBound(), player.getBound())) {
                if (player.name != item.origin) {
                    player.damage(item.damage, item.knockBack, item.direction)
                    item.kill();
                }
            }
        }
        item.logic();
        if (item.isDead()) game.items.splice(i, 1);
    }

   
}

function render() {
    if(game.stage.bgcolor) draw(game.stage.bgcolor, 0, 0, canvas.width, canvas.height, true);
    game.stage.logic();

    /* Render stage */
    for (item of game.stage.content) {
        var bound = item.getBound();
        draw(item.image, bound.x, bound.y, bound.width, bound.height);
    }

    /* Render players */
    if(!HIDE_PLAYERS){
        for (character of game.players) {
            character.draw();
        }
    }
    
    // Render items
    for (item of game.items) {
        item.draw();
    }

    frames++;
}



/**
 * Everything that is drawn in the game should be drawn through this function!
 * 
 * @param {Image or string} sprite 
 * @param {int} x 
 * @param {int} y 
 * @param {int} width 
 * @param {int} height 
 * @param {boolean} static static does not move or zoom with camera. Not required - default: false!
 */
function draw(sprite, x, y, width, height, static) {
    if (!static) {
        x = (x - camera.x) * camera.zoom;
        y = (y - camera.y) * camera.zoom;
        width *= camera.zoom;
        height *= camera.zoom;
    }
    if (typeof sprite == "string") {
        // fillRect, with color
        ctx.fillStyle = sprite;
        ctx.fillRect(x, y, width, height);
    } else {
        // Draw the image
        ctx.drawImage(sprite, x, y, width, height);
    }
}

function inFrame(x, y, width, height, zoom, camx, camy) {

    if (zoom === undefined) zoom = camera.zoom;

    x = (x - camx) * zoom;
    y = (y - camy) * zoom;
    width *= zoom;
    height *= zoom;

    if (x + width < canvas.width &&
        y + height < canvas.height &&
        x > 0 && y > 0) return true;
    return false;
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