class Block {
    constructor(blNum, x, y) {
        this.blockNum = blNum;
        this.originalX = x;
        this.originalY = y;
        this.x = x << 4;
        this.y = y << 4;

        this.isKillingItself = false;
        this.counter = 0;

        //Clear the behind block so a single block can look simply shake without drawing the behind block
        fieldData[ y * FIELD_SIZE_W + x ] = 367;
    }

    update() {
        if (this.isKillingItself) { return; }

        if (++this.counter == 11) {
            this.isKillingItself = true;
            //Draw the shaken block again to be seen
            fieldData[ this.originalY * FIELD_SIZE_W + this.originalX ] = this.blockNum;
            return;
        }

    }

    draw() {
        if (this.isKillingItself) { return; }

        let spriteX = (this.blockNum & 15) * 16;
        let spriteY = (this.blockNum >> 4) * 16;

        let printX = this.x - fieldObj.scrollX;
        let printY = this.y - fieldObj.scrollY;

        const animePattern = [0, 2, 4, 5, 6, 5, 4, 2, 0, -2, -1];

        printY -= animePattern[this.counter];

        virtualCtx.drawImage(
            characterImage,
            spriteX, spriteY, 16, 16,  //Where to pick the character image up from the source
            printX, printY, 16, 16//Where to draw the image on the virtual context
        );
    }
}