  export class Card{
    constructor(x, y, s, img, action, text) {
      this.pos = s.createVector(x, y);
      this.velocity = s.createVector(0, 0);
      this.rotation = 0;
      this.img = img;
      this.sizeMod = 1;
      this.scale = s.createVector(2.5, 3.5);
      this.shouldBeRemoved = false;
      this.s = s;
      this.action = action;
      this.hasMoved = false;
      this.text = text;
      this.timer = 1;
    }

    update() {
      if(this.timer <= 0)
        this.handleMovement();

      if(this.timer > 0)
      this.timer-=2/this.s.frameRate();
    }
  
    handleMovement() {
      if(this.action == 1)
      {
        this.pos.x-=5; 
        if(this.pos.x <= window.width/2)
        {
          this.hasMoved = true;
          if(window.playerHasBet === 2)
            window.playerHasBet = 0;
          this.action = 0;
        }
      }
      if(this.action == 2)
      {
        if(this.sizeMod>=0.4)
        this.sizeMod-=0.05;
      }
    }
  
    render() {
      if (!this.img) return;
  
      const size = window.objSize * this.sizeMod;
  
      this.s.push();
        this.s.translate(this.pos.x, this.pos.y);
        this.s.rotate(this.rotation);
        this.s.scale(this.scale.x, this.scale.y);
        this.s.image(this.img, -size / 2, -size / 2, size, size);
        if(this.action == 1 && this.timer != 0)
        {
          this.s.textSize(window.objSize/6);
          this.s.fill(255,255,255);
          this.s.text(this.text, -size/2 + window.objSize/4, -size / 2 - window.objSize/8);
        }
        if(this.action == 2)
        {
        this.s.textSize(window.objSize/8);
        this.s.fill(255,255,255);
        this.s.text(this.text, -size/2, -size / 2 - window.objSize/20);
        }
      this.s.pop();
    }
  }