//Store the field data
let fieldData = [
    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,//1
    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,//2
    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,//3
    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,//4
    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,//5
    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,//6
    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,//7
    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,//8
    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,//9
    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,//10
    0,0,0,0,  0,0,0,0,  0,1,1,0,  0,0,0,0,//11
    0,0,0,0,  0,0,0,0,  0,1,1,0,  0,0,0,0,//12
    1,1,1,1,  1,1,1,1,  1,1,1,1,  1,1,1,1,//13, the ground
    1,1,1,1,  1,1,1,1,  1,1,1,1,  1,1,1,1,//14, the ground
];


class Field {
    constructor () {}

    //Update the field
    update () {}

    //Draw a single block
    drawBlock ( block, x, y ) {
        drawSprite( 25*16, x, y ); 
    }

    //Draw the field
    draw () {
        for ( let y = 0; y < MAP_SIZE_H; y++ ) {
            for ( let x = 0; x < MAP_SIZE_W; x++ ) {
                let block  = fieldData[ y * FIELD_SIZE_W + x ];

                //The coordinate of each block (each block has 16 * 16 pixel) 
                let printX    = x * 16;
                let printY    = y * 16;

                //If it's 0, then no block
                //When it's NOT 0, draw a block
                if ( block ) { this.drawBlock( block, printX, printY ); }
            }
        }

    }

}