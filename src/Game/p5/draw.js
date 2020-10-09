import { Card } from "../Entities/Entity";
import {checkSuit} from "./preload.js"
export default function draw(s, card) {
    s.background(0);

    const size = window.objSize*6;

    s.push()
      s.translate(window.width/2, window.height/2);
      s.scale(3, 2.5);
      s.image(window.tableImg, -size/2, -size/2, size, size);
    s.pop()
    
    if(window.playerHasBet === 1)
    {
        window.card[1] = new Card(window.width/2 + window.objSize*3,window.height/2,s, checkSuit(card[0], card[1]), 1, window.message);
        window.prevCards.push(new Card(window.width/2 - window.objSize*8 + window.prevCardNumber * window.objSize*1.2, window.height/2 - window.objSize*12 + window.nextLine * window.objSize*2,s, checkSuit(card[0], card[1]), 2, window.smallCardText))
        window.prevCardNumber++;

        if(window.prevCardNumber > 13)
        {
          window.prevCardNumber = 0;
          if(window.nextLine == 1)
          {
            window.nextLine+=10;
          }
          else
          {
            window.nextLine++;
          }
        }
        window.playerHasBet = 2;
    }
    if(window.card[1])
    {
      if(window.card[1].hasMoved)
        changeCards();
    }

    if(window.gameOver == 1)
    {
      resetCards(s, card);
        window.gameOver = 0;
    }

    if(window.gameOver == 2)
    {
      resetCards(s, card);
      spawnText(s, "BAD LUCK!");

      if(window.timer > 0)
        window.timer -= 2/s.frameRate();
      
      if(window.timer <= 0)
      {
        window.gameOver = 0;
        window.timer = 1;
      }
    }

    if(window.gameOver == 3)
    {
      resetCards(s, card);
      spawnText(s, "GAME OVER!");

      if(window.timer > 0)
        window.timer -= 2/s.frameRate();
      
      if(window.timer <= 0)
        window.timer = 1;
    }

    if(window.prevCards[0])
    {
      for(let i = 0; i < window.prevCards.length; i++)
      {
        window.prevCards[i].update();
        window.prevCards[i].render();
      }
    }

    window.card[0].render();
    window.card[0].update();

    window.deck.render();
    window.deck.update();

    if(window.card[1])
    {
      window.card[1].render();
      window.card[1].update();
    }
}

function spawnText(s, text){
    s.push();
      s.translate(window.width/2 - window.objSize*5, window.height/2 - window.objSize*6);
      s.textSize(window.objSize);
      s.stroke(0);
      s.strokeWeight(5);
      s.fill(255,255,255);
      s.text(text, window.objSize*2, window.objSize*2);
    s.pop();
}

function changeCards(){
  window.card[0] = window.card[1];
  window.card[1] = null;
}

function resetCards(s, card){
  if(window.gameOver == 2)
    {
      window.card[1] = new Card(window.width/2 + window.objSize*3, window.height/2, s, checkSuit(card[0], card[1]),1);
      window.card[1].timer = 0;
    }

  if(window.gameOver == 1)
    window.card[0] = new Card(window.width/2,window.height/2, s, checkSuit(card[0], card[1]));
  
  window.prevCards = [new Card(window.width/2 - window.objSize*8 + 0 * window.objSize*1.2, window.height/2 - window.objSize*12 + window.nextLine * window.objSize*2,s, checkSuit(card[0], card[1]), 2)];
  window.playerHasBet = 0;
  window.prevCardNumber = 1;
  window.nextLine = 0;
}


