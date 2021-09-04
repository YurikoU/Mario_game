//Game FPS
const GAME_FPS = 1000/60; //FPS

//Screen size
const SCREEN_SIZE_W = 256;
const SCREEN_SIZE_H = 224;

//Canvas settings (on HTML)
let canvas           = document.getElementById("can");
let ctx              = canvas.getContext("2d");

//Virtual canvas settings (on JavaScript)
let virtualCanvas    = document.createElement("canvas");
let virtualCtx       = virtualCanvas.getContext("2d");

canvas.width         = SCREEN_SIZE_W * 2; 
canvas.height        = SCREEN_SIZE_H * 2;

virtualCanvas.width  = SCREEN_SIZE_W;
virtualCanvas.height = SCREEN_SIZE_H;

//Scaled images are smoothed on the virtual context
virtualCtx.mozimageSmoothingEnabled    = false;
virtualCtx.webkitimageSmoothingEnabled = false;
virtualCtx.msimageSmoothingEnabled     = false;
virtualCtx.imageSmoothingEnabled       = false;

//Maintain the main frame
let frameCount = 0;
let startTime;

let characterImage    = new Image();
characterImage.src    = "sprite.png";
characterImage.onload = draw;

//Update images
function update () {}

//Draw characters
function draw () {
    //Draw the character images on the virtual context
    virtualCtx.fillStyle = "#66AAFF";
    virtualCtx.fillRect( 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H );
    virtualCtx.drawImage( 
        characterImage,  
        0,0,16,32,  //Where to pick the character image up from the source
        50,50,16,32//Where to draw the image on the virtual context
    );

    virtualCtx.font = "24px 'Impact'";
    virtualCtx.fillStyle = "#FFFFFF";
    virtualCtx.fillText( "FRAME: " + frameCount, 10, 10 );

    //Scale and draw the virtual canvas on the real context
    ctx.drawImage( 
        virtualCanvas,
        0,0,SCREEN_SIZE_W,SCREEN_SIZE_H, //Coordinate of the virtual canvas on JavaScript
        0,0,SCREEN_SIZE_W*2,SCREEN_SIZE_H*2//Coordinate of the real context on HTML
    );
}


//Start game loop
window.onload = function () {
    startTime = performance.now();//Get the time elapsed once the browser is loaded (milliseconds)
    mainLoop();
}


function mainLoop () {
    let nowTime  = performance.now();//Get the time elapsed again (milliseconds)
    let nowFrame = ( nowTime - startTime ) / GAME_FPS;

    //If the real frame count is equal or less than frameCount, NOT perform the functions
    if ( frameCount < nowFrame ) {
        let count = 0;
        while ( frameCount < nowFrame ) {
            frameCount++;
            update();//Update process
            if ( ++count >= 4 ) { break; }//If it's over 4 frames, exit the if() loop
        }
        draw();//Draw process
    }

    //Call mainLoop() again once the browser needs to be reloaded
    requestAnimationFrame( mainLoop );
}