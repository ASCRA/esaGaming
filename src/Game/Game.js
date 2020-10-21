import { Card } from "./Entities/Entity";
import {calculateObjSize} from "./helpers"
import * as consts from "./constants"

let currentCard;
let firstCard;
let cardsToDraw;
let objSize = 0;
let clubsImg = [];
let diamondsImg = [];
let heartsImg = [];
let spadesImg = [];
let card = [];
let prevCards = [];
let deck = null;
let width = window.innerWidth;
let height = window.innerHeight;
let tableImg = null;
let prevCardNumber = 1;
let nextLine = 0;
let timer = 1;

export default function game(p5) {  //p5 is used as a constant to reference p5 and all of it's functions 
                                    //(this has not been the case before with p5 but all the recent articles about the implementation show this as the only way it works)
    p5.preload = () => {
        objSize = calculateObjSize();
        loadImages(p5);
        loadObjects(p5, cardsToDraw, currentCard);
    }
  
    p5.setup = () => {
        p5.createCanvas(width, height);
        card[0] = new Card(width/2, height/2, p5, checkSuit(currentCard[0], currentCard[1]));
        deck = new Card(width/2 + objSize*3, height/2, p5, deck);
    }
  
    p5.draw = () => {
        p5.background(0);
        drawTable(p5);

        if(consts.PLAYER_HAS_BET === 1)
        {
            card[1] = new Card(width/2 + objSize*3, height/2, p5, checkSuit(currentCard[0], currentCard[1]), 1, consts.MESSAGE);
            prevCards.push(new Card(width/2 - objSize*8 + prevCardNumber * objSize*1.2, height/2 - objSize*12 + nextLine * objSize*2, p5, checkSuit(currentCard[0], currentCard[1]), 2, consts.SMALL_CARD_TEXT))
            prevCardNumber++;

            if(prevCardNumber > 13)
            {
            prevCardNumber = 0;
            if(nextLine === 1)
            {
                nextLine+=10;
            }
            else
            {
                nextLine++;
            }
            }
            consts.changePlayerHasBet(2); //we set this value to "2" since we don't want to allow the redraw of the first "if" statement in the "Game.js" file
        }

        if(card[1])
        {
          if(card[1].hasMoved)
              changeCards();
        }

        if(consts.GAME_OVER === consts.GAME_END_ON_ROUND_LOST)
        {
          resetCards(p5);
          consts.changeGameOver(0);
        }

        if(consts.GAME_OVER === consts.GAME_END_ON_LAST_BET)
        {
          resetCards(p5);
          spawnText(p5, "BAD LUCK!");

          if(timer > 0)
              timer -= 2/p5.frameRate();
          
          if(timer <= 0)
          {
            consts.changeGameOver(0);
              timer = 1;
          }
        }

        if(consts.GAME_OVER === consts.GAME_END_ON_BALANCE_LOST)
        {
          resetCards(p5);
          spawnText(p5, "GAME OVER!");

          if(timer > 0)
              timer -= 2/p5.frameRate();
          
          if(timer <= 0)
              {
                consts.changeGameOver(0);
                timer = 1;
              }
        }

        if(prevCards[0])
        {
          for(let i = 0; i < prevCards.length; i++)
          {
            prevCards[i].update();
            prevCards[i].render();
          }
        }
        
        card[0].render();
        card[0].update();

        deck.render();
        deck.update();

        if(card[1])
        {
          card[1].render();
          card[1].update();
        }
    }

    p5.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
        currentCard = newProps.currentCard;
        firstCard = newProps.firstCard;
        cardsToDraw = newProps.cardsToDraw;
    }
  };

function loadImages(p5) {
    deck = p5.loadImage(`images/red_back.png`)
    tableImg = p5.loadImage(`images/table.png`)
    for(let i = 0; i < 13; i++) 
    {
        clubsImg[i] = p5.loadImage(`images/1/${i+2}C.png`)
        diamondsImg[i] = p5.loadImage(`images/2/${i+2}D.png`)
        heartsImg[i] = p5.loadImage(`images/3/${i+2}H.png`)
        spadesImg[i] = p5.loadImage(`images/4/${i+2}S.png`)
    }
}

function loadObjects(p5){
    prevCards.push(new Card(width/2 - objSize*8 + 0 * objSize*1.2, height/2 - objSize*12 + nextLine * objSize*2, p5, checkSuit(firstCard[0], firstCard[1]), 2));

    for(let i = 1; i < cardsToDraw.length; i++)
    {
        prevCards.push(new Card(width/2 - objSize*8 + prevCardNumber * objSize*1.2, height/2 - objSize*12 + nextLine * objSize*2, p5, checkSuit(cardsToDraw[i][0], cardsToDraw[i][1]), 2, cardsToDraw[i][2]))
        prevCardNumber++;
        if(prevCardNumber > 13)
        {
          prevCardNumber = 0;
          if(nextLine === 1)
          {
            nextLine+=10;
          }
          else
          {
            nextLine++;
          }
        }
    }
}

function changeCards(){
    card[0] = card[1];
    card[1] = null;
  }
  
  function resetCards(p5){
    if(consts.GAME_OVER === consts.GAME_END_ON_LAST_BET)
      {
        card[1] = new Card(width/2 + objSize*3, height/2, p5, checkSuit(currentCard[0], currentCard[1]),1);
        card[1].timer = 0;
      }
  
    if(consts.GAME_OVER === consts.GAME_END_ON_ROUND_LOST)
      card[0] = new Card(width/2,height/2, p5, checkSuit(currentCard[0], currentCard[1]));
    
    prevCards = [new Card(width/2 - objSize*8 + 0 * objSize*1.2, height/2 - objSize*12 + nextLine * objSize*2, p5, checkSuit(currentCard[0], currentCard[1]), 2)];
    consts.changePlayerHasBet(0);
    prevCardNumber = 1;
    nextLine = 0;
  }

function spawnText(p5, text){
    p5.push();
      p5.translate(width/2 - objSize*5, height/2 - objSize*6);
      p5.textSize(objSize);
      p5.stroke(0);
      p5.strokeWeight(5);
      p5.fill(255,255,255);
      p5.text(text, objSize*2, objSize*2);
    p5.pop();
}

function checkSuit(suit, number)
{
  if(suit === 0)
    return clubsImg[number]
  else if(suit === 1)
    return diamondsImg[number]
  else if(suit === 2)
    return heartsImg[number]
  else if(suit === 3)
    return spadesImg[number]
}

function drawTable(p5){
  const size = objSize*6;

  p5.push()
    p5.translate(width/2, height/2);
    p5.scale(3, 2.5);
    p5.image(tableImg, -size/2, -size/2, size, size);
  p5.pop()
}


