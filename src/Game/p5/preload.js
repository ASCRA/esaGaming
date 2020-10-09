import { Card } from "../Entities/Entity";
window.objSize = 0;
window.pera = 6;
window.clubsImg = [];
window.diamondsImg = [];
window.heartsImg = [];
window.spadesImg = [];
window.card = [];
window.prevCards = [];
window.deck = null;
window.width = window.innerWidth;
window.height = window.innerHeight;
window.tableImg = null;
window.prevCardNumber = 1;
window.nextLine = 0;
window.timer = 1;

export default function preload(s, cardsToDraw, card){
    calculateObjSize();
    loadImages(s);
    loadObjects(s, cardsToDraw, card);
}

function calculateObjSize() {
    const widescreenSizeModifier = (window.innerHeight > window.innerWidth) ? 1 : 0.75;
    window.objSize = Math.floor(Math.min(Math.floor(window.innerWidth / 20), Math.floor(window.innerHeight / 20)) * widescreenSizeModifier);
}

function loadImages(s) {
    window.deck = s.loadImage(`images/red_back.png`)
    window.tableImg = s.loadImage(`images/table.png`)
    for(let i = 0; i < 13; i++) 
    {
        window.clubsImg[i] = s.loadImage(`images/1/${i+2}C.png`)
        window.diamondsImg[i] = s.loadImage(`images/2/${i+2}D.png`)
        window.heartsImg[i] = s.loadImage(`images/3/${i+2}H.png`)
        window.spadesImg[i] = s.loadImage(`images/4/${i+2}S.png`)
    }
}

function loadObjects(s, cardsToDraw, card){
    window.prevCards.push(new Card(window.width/2 - window.objSize*8 + 0 * window.objSize*1.2, window.height/2 - window.objSize*12 + window.nextLine * window.objSize*2,s, checkSuit(card[0], card[1]), 2));

    for(let i = 1; i < cardsToDraw.length; i++)
    {
        window.prevCards.push(new Card(window.width/2 - window.objSize*8 + window.prevCardNumber * window.objSize*1.2, window.height/2 - window.objSize*12 + window.nextLine * window.objSize*2,s, checkSuit(cardsToDraw[i][0], cardsToDraw[i][1]), 2, cardsToDraw[i][2]))
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
    }
}

export function checkSuit(suit, number)
{
  if(suit === 0)
    return window.clubsImg[number]
  else if(suit === 1)
    return window.diamondsImg[number]
  else if(suit === 2)
    return window.heartsImg[number]
  else if(suit === 3)
    return window.spadesImg[number]
}