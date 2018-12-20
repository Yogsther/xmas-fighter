/**
 * main.js for XMAS-FIGHTERS
 */

var LOG_KEYS = false;
var HIDE_PLAYERS = false;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;


const l = console.log;

var game;
var frames = 0;
var selectedStage = -1;
selectStage(true);
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
    zoomPauseTime: 400,
    /* Frames */
    zoomPause: 0
}

var mouse = {
    x: 0,
    y: 0,
    down: false,
    target: false,
    hover: false,
    index: 0,
    hoverTarget: false
}


/* Key order: UP, DOWN, LEFT, RIGHT, DAMAGE, SPECIAL, JUMP */
var inputs = {
    wasd: new Input("wasd", [87, 83, 65, 68, 86, 67, 32]),
    empty: new Input("bot", [-1, -1, -1, -1, -1, -1, -1]),
    arrow: new Input("arrow", [38, 40, 37, 39, 76, 75, -1])
}

var characters = [{
    name: "Snowman",
    class: Snowman
}, {
    name: "Santa",
    class: Santa
}]

var menuMusic = new Audio();
    menuMusic.src = "sounds/main-theme.mp3";

window.onload = () => {
    menuMusic.play();
}

loop(); // Start heart


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
        if (camera.desiredZoom > camera.zoom) camera.zoom += camera.zoomInSpeed * (Math.abs(camera.desiredZoom - camera.zoom)) * 7;
        if (camera.desiredZoom < camera.zoom) camera.zoom -= camera.zoomOutSpeed;
    }

    camera.x = getCameraCenter(camera.zoom).x;
    camera.y = getCameraCenter(camera.zoom).y;
}

function getCameraCenter(zoom) {
    //var center = getCenterFromPlayerPos();
    return {
        x: -(((canvas.width / zoom) - canvas.width) / 2),
        y: -(((canvas.height / zoom) - canvas.height) / 2)
    }
}

function getCenterFromPlayerPos() {
    var totalX = 0,
        totalY = 0;
    for (player of game.players) {
        totalX += player.x;
        totalY += player.y;
    }
    return {
        x: totalX / game.players.length - canvas.width / 2,
        y: totalY / game.players.length - canvas.width / 2
    }
}


document.addEventListener("keydown", e => {
    keysDown[e.keyCode] = true;
    for (player of game.players) {
        player.clickEvent(e.keyCode);
    }
    if (LOG_KEYS) console.log(e.keyCode);
    if (e.keyCode == 27) {
        stopGame();
        showGUI();
    }
})

document.addEventListener("keyup", e => {
    keysDown[e.keyCode] = false;
})

function selectStage(up) {
    if (up) {
        selectedStage++;
    } else {
        selectedStage--;
    }
    var stage = stages[Math.abs(selectedStage % stages.length)];
    document.getElementById("stage-img").src = "textures/general/thumbnail_" + stage.name.toLowerCase() + ".png";
    document.getElementById("stage-name").innerText = stage.name;
    document.getElementById("stage-description").innerText = stage.description;
}

function startGame() {
    hideGUI();
    game = new Game(stages[Math.abs(selectedStage % stages.length)]);
    var p1, p2;
    var balls = document.getElementsByClassName("ball");
    if (Number(balls[0].style.left.substr(0, balls[0].style.left.indexOf("p"))) > 206) p1 = Snowman;
    else p1 = Santa;

    if (Number(balls[1].style.left.substr(0, balls[1].style.left.indexOf("p"))) > 206) p2 = Snowman;
    else p2 = Santa;


    game.addPlayer(new p1(100, 100, "P1", inputs.wasd, 0, 3, "#2073f9"));
    game.addPlayer(new p2(420, 100, "P2", inputs.arrow, 1, 3, "#f92052"));

    game.running = true;
}

function stopGame() {
    game.running = false;
}

function hideGUI() {
    document.getElementById("gui").style.visibility = "hidden";
}


function showGUI() {
    document.getElementById("gui").style.visibility = "visible";
}

function loop() {
    renderCursor();
    try { // Try because game may not be initiated!
        if (!game.running) {
            draw("black", 0, 0, canvas.width, canvas.height, true);
        } else {

            logic();
            updateCamera();
            render();

        }
    } catch (e) {}

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
            if (stagePart.collision) {
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
    if (game.stage.bgcolor) draw(game.stage.bgcolor, 0, 0, canvas.width, canvas.height, true);
    game.stage.logic();

    /* Render stage */
    for (item of game.stage.content) {
        var bound = item.getBound();
        draw(item.image, bound.x, bound.y, bound.width, bound.height);
    }

    /* Render players */
    if (!HIDE_PLAYERS) {
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

function drawText(text, color, size, x, y, static, align) {
    if (!static) {
        x = (x - camera.x) * camera.zoom;
        y = (y - camera.y) * camera.zoom;
    }

    if (align) ctx.textAlign = align;

    ctx.fillStyle = color;
    ctx.font = "bold " + size + "px Roboto";
    ctx.fillText(text, x, y);
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


/* MENU */

//<div class="ball blue">P1</div>



document.addEventListener("mousedown", e => {
    mouse.down = true;
    mouse.hover = false;
    if (e.target.classList.value.indexOf("ball") !== -1) {
        mouse.target = e.target;
    }
})
document.addEventListener("mouseup", e => {
    mouse.down = false;
    mouse.target = false;
})

document.addEventListener("mousemove", e => {
    mouse.x = e.clientX - canvas.getBoundingClientRect().left
    mouse.y = e.clientY - canvas.getBoundingClientRect().top

    if (e.target.classList.value.indexOf("hover") != -1) {
        mouse.hoverTarget = e.target;
        mouse.hover = true;
    } else {
        mouse.hover = false;
    }

    if (mouse.target) {
        mouse.target.style.left = mouse.x - 45 + "px";
        mouse.target.style.top = mouse.y - 45 + "px";
    }
})

var temp = 147;
for (el of document.getElementsByClassName("ball")) {
    el.style.left = temp + "px";
    el.style.top = "205px";
    temp += 196;
}

function renderCursor() {
    if (mouse.hover) {
        var number = (Math.round(mouse.index % 26)).toString();
        if (number.length < 2) number = "0" + number;
        var style = mouse.hoverTarget.outerHTML;

        if(style.indexOf("style=") != -1) style = style.substr(style.indexOf("style=") + 7)
            else style = "";
        if (style.indexOf('cursor') != -1) style = style.substr(0, style.indexOf('cursor'));
        else style = style.substr(0, style.indexOf('"'));

        mouse.hoverTarget.setAttribute("style", style + "cursor:url('textures/cursor/frame_" + number + "_delay-0.01s.png'), auto;");

        mouse.index += .5;
        if (mouse.target) {
            mouse.target.style.left = mouse.x - 45 + "px";
            mouse.target.style.top = mouse.y - 45 + "px";
        }
    }
}