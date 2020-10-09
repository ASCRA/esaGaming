import {Card} from "../Entities/Entity.js"

export default function setup(s, card) {
    s.createCanvas( window.innerWidth, window.innerHeight);
    init(s, card);
  }

  function init(s, card){
    console.log(checkSuit(card[0], card[1]))
    window.card[0] = new Card(window.width/2,window.height/2,s, checkSuit(card[0], card[1]));
    window.deck = new Card(window.width/2 + window.objSize*3,window.height/2,s,window.deck);
  }

  function checkSuit(suit, number)
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