//Game FPS
const GAME_FPS = 1000/60; //FPS

//Screen size
const SCREEN_SIZE_W  = 256;
const SCREEN_SIZE_H  = 224;

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
let marioX          = 100<<4;
let marioY          = 100<<4;
let marioVectorX    = 0;
// let marioVectorY;
let marioAnime      =  0;
let marioSpriteNum  = 48;
let marioACount     =  0;
let marioDirection  =  0;

//Update images
function update () {

    //If "←" is pressed and the vector is not small enough
    if ( keys.Left ) {
        if ( marioAnime == 0 ) { marioACount = 0; }
        marioAnime = 1;//While walking
        marioDirection = 1;//Looking at the left side
        if ( -32 < marioVectorX ) { marioVectorX -= 1; }
        if ( 0 < marioVectorX ) { marioVectorX -= 1; } 
        if ( 8 < marioVectorX ) { marioAnime = 2; }
        
        //If "→" is pressed and the vector is not big enough
    } else if ( keys.Right ) {
        if ( marioAnime == 0 ) { marioACount = 0; }
        marioAnime = 1;//While walking
        marioDirection = 0;//Looking at the right side
        if ( marioVectorX < 32 ) { marioVectorX += 1; }
        if ( marioVectorX < 0 ) { marioVectorX += 1; }
        if ( marioVectorX < 8 ) { marioAnime = 2; }

    //If any key isn't pressed, the vector will be reset slowly
    } else {
        if ( 0 < marioVectorX ) { marioVectorX -= 1; } 
        if ( marioVectorX < 0 ) { marioVectorX += 1; }
        if ( !marioVectorX ) { marioAnime = 0; }//If the vector is 0, the character stops
    }

    marioACount++;
    if ( Math.abs(marioVectorX) == 32 ) { marioACount++; }

    //While stopping
    if ( marioAnime == 0 ) {
        marioSpriteNum = 0;

    //While walking
    } else if ( marioAnime == 1 ) {
        marioSpriteNum = 2 + ((marioACount/8) % 3);

    //When stop suddenly
    } else if ( marioAnime == 2 ) {
        marioSpriteNum = 5;
    }

    //Looking at the left side
    if ( marioDirection ) {
        marioSpriteNum += 48;
    }

    marioX += marioVectorX;
}


function drawSprite ( sNum, x, y ) {

    let spriteX = (sNum % 16) * 16;
    let spriteY = (sNum>>4) * 16;
    virtualCtx.drawImage( 
        characterImage,  
        spriteX, spriteY, 16, 32,  //Where to pick the character image up from the source
        x, y, 16, 32//Where to draw the image on the virtual context
    );    
}


//Draw characters
function draw () {
    //Background on the virtual context
    virtualCtx.fillStyle = "#66AAFF";
    virtualCtx.fillRect( 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H );

    //Character on the virtual context
    drawSprite( marioSpriteNum, marioX>>4, marioY>>4 );

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

