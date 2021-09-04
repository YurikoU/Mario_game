//Screen size
const SCREEN_SIZE_W = 256;
const SCREEN_SIZE_H = 224;

//Canvas settings
let canvas = document.getElementById("canvas");
let ctx    = canvas.getContext("2d");

ctx.width  = SCREEN_SIZE_W;
ctx.height = SCREEN_SIZE_H;

let frameCount = 0;

let characterImage    = new Image();
characterImage.src    = "sprite.png";
characterImage.onload = draw;

//Update images
function update () {}

//Draw characters
function draw () {
    ctx.fillStyle = "#66AAFF";
    ctx.fillRect(0,0,SCREEN_SIZE_W, SCREEN_SIZE_H);
    ctx.drawImage( characterImage, 16,0,16,32, 100,10,64,128 );

    ctx.font = "24px 'Impact'";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText( "FRAME: " + frameCount, 10, 10 );
}


//Start game loop
window.onload = function () {
    mainLoop();
}

function mainLoop () {
    frameCount++;
    update();
    draw();

    //Call mainLoop() again once the browser needs to be reloaded
    requestAnimationFrame( mainLoop );
}