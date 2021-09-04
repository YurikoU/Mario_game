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

//Scaled images are smoothed on the real context
ctx.mozimageSmoothingEnabled    = false;
ctx.webkitimageSmoothingEnabled = false;
ctx.msimageSmoothingEnabled     = false;
ctx.imageSmoothingEnabled       = false;

//Maintain the main frame
let frameCount = 0;
let startTime;

let characterImage    = new Image();
characterImage.src    = "sprite.png";
characterImage.onload = draw;

//Store if the keys are pressed
let keys = {};

//Mario's coordinate
let marioX = 100;
let marioY = 100;
let marioVectorX = 0;
let marioVectorY;

//Update images
function update () {

    //If "←" is pressed and the vector is not small enough
    if ( keys.Left ) {
        if ( -2 < marioVectorX ) { 
            marioVectorX -= .1;
        }
    
    //If "→" is pressed and the vector is not big enough
    } else if ( keys.Right ) {
        if ( marioVectorX < 2 ) { 
            marioVectorX += .1;
        }

    //If any key isn't pressed, the vector will be reset slowly
    } else {
        if ( 0 < marioVectorX ) { marioVectorX -= .1; } 
        if ( marioVectorX < 0 ) { marioVectorX += .1; }
    }

    marioX += marioVectorX;
}

//Draw characters
function draw () {
    //Background on the virtual context
    virtualCtx.fillStyle = "#66AAFF";
    virtualCtx.fillRect( 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H );

    //Character on the virtual context
    virtualCtx.drawImage( 
        characterImage,  
        0,0,16,32,  //Where to pick the character image up from the source
        marioX,marioY,16,32//Where to draw the image on the virtual context
    );

    //Debug information on the virtual context
    virtualCtx.font = "24px 'Impact'";
    virtualCtx.fillStyle = "#FFFFFF";
    virtualCtx.fillText( "FRAME: " + frameCount, 10, 10 );

    //Scale and transfer the virtual canvas to the real context
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


//Once a key is pressed
document.onkeydown = function ( e ) {
    if ( e.code == 'ArrowLeft' ) { keys.Left = true; }
    if ( e.code == 'ArrowRight' ) { keys.Right = true; }
    // if ( e.code == 'ArrowUp' ) {
    //     keys.Up = true;
    // }
    // if ( e.code == 'ArrowDown' ) {
    //     keys.Down = true;
    // }
}


//Once a pressed key is released
document.onkeyup = function ( e ) {
    if ( e.code == 'ArrowLeft' ) { keys.Left = false; }
    if ( e.code == 'ArrowRight' ) { keys.Right = false; }
    // if ( e.code == 'ArrowUp' ) {
    //     keys.Up = false;
    // }
    // if ( e.code == 'ArrowDown' ) {
    //     keys.Down = false;
    // }
}

