import setup from "./p5/setup.js"
import preload from "./p5/preload.js"
import draw from "./p5/draw.js"

export default function game(s) {
    let currentCard;
    let firstCard;
    let cardsToDraw;

    s.preload = () =>{
        preload(s, cardsToDraw, firstCard);
    }
  
    s.setup = () => {
        setup(s, currentCard);
    }
  
    s.draw = () => {
        draw(s, currentCard);
    }

    s.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
        currentCard = newProps.currentCard;
        firstCard = newProps.firstCard;
        cardsToDraw = newProps.cardsToDraw;
      }
    
  };
