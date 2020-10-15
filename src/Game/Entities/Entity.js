  import {calculateObjSize} from "../helpers"
  import * as consts from "../constants"

  let objSize = calculateObjSize();
  
  export class Card{
    constructor(x, y, p5, img, action, text) {
      this.pos = p5.createVector(x, y);
      this.velocity = p5.createVector(0, 0);
      this.rotation = 0;
      this.img = img;
      this.sizeMod = 1;
      this.scale = p5.createVector(2.5, 3.5);
      this.shouldBeRemoved = false;
      this.p5 = p5;
      this.action = action;
      this.hasMoved = false;
      this.text = text;
      this.timer = 1;
    }

    update() {
      if(this.timer <= 0)
        this.handleMovement();

      if(this.timer > 0)
        this.timer-=2/this.p5.frameRate();
    }
  
    handleMovement() {
      if(this.action === 1)  //Action reffering to moving cards on the table from right to left when revealed
      {
        this.pos.x-=objSize/6; 
        if(this.pos.x <= window.innerWidth/2)
        {
          this.hasMoved = true;
          if(consts.PLAYER_HAS_BET === 2)  //Only when the object has moved we can set the PLAYER_HAS_BET variable back to 0
            consts.changePlayerHasBet(0);
          this.action = 0;
        }
      }
      if(this.action === 2) //Action reffering to previous cards that pop out and shrink to be shown above the table
      {
        if(this.sizeMod>=0.4) //calling "if" on every redraw of the object and shrinking it every time by 0.05 until it reaches the size of 0.4 of this.sizeMod
        this.sizeMod-=0.05;
      }
    }
  
    render() {
      if (!this.img) return;
  
      const size = objSize * this.sizeMod;

      this.p5.push();
        this.p5.translate(this.pos.x, this.pos.y);
        this.p5.rotate(this.rotation);
        this.p5.scale(this.scale.x, this.scale.y);
        this.p5.image(this.img, -size / 2, -size / 2, size, size);
        if(this.action === 1 && this.timer !== 0)
        {
          this.p5.textSize(objSize/6);
          this.p5.fill(255,255,255);
          this.p5.text(this.text, -size/2 + objSize/4, -size / 2 - objSize/8);
        }
        if(this.action === 2)
        {
        this.p5.textSize(objSize/8);
        this.p5.fill(255,255,255);
        this.p5.text(this.text, -size/2, -size / 2 - objSize/20);
        }
      this.p5.pop();
    }
  }