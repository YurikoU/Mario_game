const ANIME_STAND = 1;
const ANIME_WALK  = 2;
const ANIME_BREAK = 4;
const ANIME_JUMP  = 8;
const GRAVITY     = 4;
const MAX_SPEED   = 32;


class Mario {
    constructor ( x, y ) {
        this.x          = x<<4;
        this.y          = y<<4;
        this.vx         = 0;
        this.vy         = 0;
        this.animeNum   = 0;
        this.spriteNum  = 0;
        this.animeCount = 0;
        this.direction  = 0;
        this.jump       = 0;
    }

    //Check where the character lands
    checkFloor () {
        //If the character is jumping upward, don't check
        if ( this.vy <= 0 ) { return; }

        let lx = ( (this.x+this.vx) >>4);
        let ly = ( (this.y+this.vy) >>4);

        //If the character land at least the either the right side or the left side of the ground
        if ( fieldObj.isBlock(lx+1, ly+31)  ||  fieldObj.isBlock(lx+14, ly+31) ) {
            if ( this.animeNum == ANIME_JUMP ) { this.animeNum = ANIME_WALK; }
            this.jump = 0;
            this.vy   = 0;
            this.y    = (ly-1)<<4;
        }
    }


    //Check if the character touches the wall
    checkWall () {
        let lx = ( (this.x+this.vx) >>4);
        let ly = ( (this.y+this.vy) >>4);

        //If the character dumps the wall on the right side
        if (fieldObj.isBlock(lx+15, ly+9 )  ||
            fieldObj.isBlock(lx+15, ly+15)  || 
            fieldObj.isBlock(lx+15, ly+24)) {
            this.vx = 0;
            this.x -= 8;

        //If the character dumps the wall on the left side
        } else if (fieldObj.isBlock(lx, ly+9 )  ||
                fieldObj.isBlock(lx, ly+15)  || 
                fieldObj.isBlock(lx, ly+24)) {
            this.vx = 0;
            this.x += 8;            
        }
    }

    //Check if the character touches the ceiling
    checkCeiling () {
        //If the character is NOT jumping upward, don't check
        if ( 0 <= this.vy ) { return; }

        let lx = ( (this.x+this.vx) >>4);
        let ly = ( (this.y+this.vy) >>4);

        //If the character land at least the either the right side or the left side of the ground
        if ( fieldObj.isBlock(lx+8, ly+5) ) {
            this.jump = 15;
            this.vy   = 0;
        }
    }


    //Details to jump
    updateJump () {
        //Vertical movement
        if ( keys.Up ) {
            //Jump up only when the character doesn't jump
            if ( this.jump == 0 ) {
                this.animeNum = ANIME_JUMP;
                this.jump     = 1;
            } 
            if ( this.jump < 15 ) { this.vy = -( 64 - this.jump * 2 ); }
        }

        if ( this.jump ) { this.jump++; }
    };

    //Details of the updateWalk() function
    //1: to the left, 0: to the right
    updateWalkSub ( dir ) {
        //While jumping
        //Speed up till the maximum speed
        if ( dir == 0  &&  this.vx <  MAX_SPEED ) { this.vx++; }//To the right side
        if ( dir == 1  &&  this.vx > -MAX_SPEED ) { this.vx--; }//To the left side

        //While NOT jumping, then start walking
        if ( !this.jump ) {
            //Reset the counter
            if ( this.animeNum == ANIME_STAND ) { this.animeCount = 0; }

            //Start the walking animation
            this.animeNum = ANIME_WALK; //While walking

            //Set the walking direction
            this.direction = dir;//Looking at the left side
            this.direction = dir;//Looking at the left side

            //Break if the opposite direction key is pressed
            if ( dir == 0  &&  this.vx < 0 ) { this.vx++; }//To the right side
            if ( dir == 1  &&  this.vx > 0 ) { this.vx--; }//To the left side

            //Set the breaking animation
            if ( (dir==0 && this.vx<-8)  ||  (dir==1 && 8<this.vx) ) { this.animeNum = ANIME_BREAK; }
        }

    };

    //Details to walk
    updateWalk () {
        //Horizontal movement
        //If "←" is pressed and the vector is not small enough
        if ( keys.Left ) {
            this.updateWalkSub( 1 );

            //If "→" is pressed and the vector is not big enough
        } else if ( keys.Right ) {
            this.updateWalkSub( 0 );

        //If "←" or "→" isn't pressed, the vector will be reset slowly
        } else {
            if ( !this.jump ) {
                if ( 0 < this.vx ) { this.vx -= 1; } 
                if ( this.vx < 0 ) { this.vx += 1; }
                if ( !this.vx ) { this.animeNum = ANIME_STAND; }//If the vector is 0, the character stops
            }
        }
    };

    //Details to update images
    updateAnime () {
        //Determine the proper sprite
        switch ( this.animeNum ) {
            case ANIME_STAND://While standing
                this.spriteNum = 0;
                break;
            case ANIME_WALK://While walking
                this.spriteNum = 2 + ( this.animeCount / 6 ) % 3;
                break;
            case ANIME_BREAK://breaking
                this.spriteNum = 5;
                break;
            case ANIME_JUMP://While jumping
                this.spriteNum = 6;
                break;
        }

        if ( this.direction ) { this.spriteNum += 48; }//Looking at the left side
    };


    //Update by every frame
    update () {          
        //Counter for animation
        this.animeCount++;
        if ( Math.abs(this.vx) == MAX_SPEED ) { this.animeCount++; }

        //Perform necessary functions
        this.updateJump();
        this.updateWalk();
        this.updateAnime();

        //Add gravity
        if ( this.vy < 64 ) { this.vy += GRAVITY; }

        //Check if the character touch the wall
        this.checkWall();

        //Check where the character lands
        this.checkFloor();

        //Check if the character touches the ceiling
        this.checkCeiling();

        //Update to the expected coordinate
        this.x += this.vx;
        this.y += this.vy;

        //Land the ground
        // if ( (160<<4) < this.y ) {
        //     if ( this.animeNum == ANIME_JUMP ) { this.animeNum = ANIME_WALK; }
        //     this.jump = 0;
        //     this.vy   = 0;
        //     this.y    = 160<<4;
        // }
    } 

    //Draw by every frame
    draw () {
        //The character won't move with the ground if it's scrolled 
        let printX = (this.x>>4) - fieldObj.scrollX;
        let printY = (this.y>>4) - fieldObj.scrollY;
        drawSprite( this.spriteNum, printX, printY );
    }
}