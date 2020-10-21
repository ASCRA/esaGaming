import React, { useEffect } from 'react';
import game from "./Game";
import {Button, Panel, Image} from "./StyledComponents";
import { useStorageState  } from 'state-persist';
import P5Wrapper from 'react-p5-wrapper';
import {getRandomInt} from "./helpers"
import * as consts from "./constants"

function Game() {
    
    const [balance, setBalance] = useStorageState ('balance', process.env.REACT_APP_STARTING_BALANCE);
    const [playerBet, setPlayerBet] = useStorageState ('playerBet', process.env.REACT_APP_STARTING_TOTAL_BET);
    const [totalBet, setTotalBet] = useStorageState ('totalBet', process.env.REACT_APP_STARTING_PLAYER_BET);
    const [usedCards, setUsedCards] = useStorageState ('usedCards', Array(4).fill(Array(1).fill(null)));
    const [currentCard, setCurrentCard] = useStorageState ('currentCard', [Math.floor(Math.random() * Math.floor(4)), Math.floor(Math.random() * Math.floor(13))]);
    const [numberOfCards, setNumberOfCards] = useStorageState ('numberOfCards', process.env.REACT_APP_STARTING_NUMBER_OF_CARDS);
    const [cardsToDraw, setCardsToDraw] = useStorageState ('cardsToDraw', [0]);
    const [firstCard, setFirstCard] = useStorageState ('firstCard', currentCard);                                      

    useEffect(() => {
        if(!usedCards[0][1] && !usedCards[1][1] && !usedCards[2][1] && !usedCards[3][1])
        {
            let suit = currentCard[0];
            let number = currentCard[1];
            let cards = usedCards;
            cards[suit] = [...cards[suit], number];
            setUsedCards(cards);
            setNumberOfCards(1);
        }
    }, []);

    useEffect(() => {  //I left this useEffect since the useStorageState didn't work on my "usedCards" and "cardsToDraw" for some reason
        localStorage.setItem("usedCards", JSON.stringify(usedCards)); 
        localStorage.setItem("cardsToDraw", JSON.stringify(cardsToDraw));
    }, [currentCard, usedCards, cardsToDraw]);

    function changeNumber(hl) {
        if (consts.PLAYER_HAS_BET !== 0 || totalBet === 0 || consts.GAME_OVER === consts.GAME_END_ON_BALANCE_LOST)
             return 0;

        else if (!consts.GAME_OVER) {
            let suit, number;
            suit = getRandomInt(4);
            number = getRandomInt(13);
            
            let gameStatus = checkCard(suit, number);

            do
            {
                if (gameStatus === 1) {
                    if (consts.PLAYER_HAS_BET === 0)
                        consts.changePlayerHasBet(1);

                    else
                        return 0;

                    if (hl) {
                        if (number > currentCard[1]) {
                            consts.changeMessage("NICE!")
                            consts.changeSmallText("Higher")
                            setTotalBet(totalBet + playerBet);
                            let cardsDraw = cardsToDraw;
                            cardsDraw[numberOfCards] = [suit, number, consts.SMALL_CARD_TEXT];
                            setCardsToDraw(cardsDraw);
                            setCurrentCard([suit, number]);
                        }

                        else {
                            consts.changeSmallText("Lower")
                            resetGame(consts.GAME_LOST);
                            setCurrentCard([suit, number]);
                            break;
                        }
                    }

                    else {
                        if (number < currentCard[1]) {
                            setTotalBet(totalBet + playerBet);
                            consts.changeMessage("NICE!")
                            consts.changeSmallText("Lower")
                            let cardsDraw = cardsToDraw;
                            cardsDraw[numberOfCards] = [suit, number, consts.SMALL_CARD_TEXT];
                            setCardsToDraw(cardsDraw);
                            setCurrentCard([suit, number]);
                        }

                        else {
                            consts.changeSmallText("Higher")
                            resetGame(consts.GAME_LOST);
                            setCurrentCard([suit, number]);
                            break;
                        }
                    }
                    break;
                }
                else if (gameStatus === 2) {
                    resetGame(1);
                }
            }
            while (gameStatus !== 1);
        }
    }

    function checkCard(suit, number) {
        if (numberOfCards >= 52)
            return 2;

        for (let i = 1; i < usedCards[suit].length; i++) {
            if (usedCards[suit][i] === number)
                return 0;
        }
        let cards = usedCards;
        cards[suit] = [...cards[suit], number];
        setUsedCards(cards);
        setNumberOfCards(numberOfCards + 1);
        return 1;
    }

    function increaseBet(amount) {
        if (amount < balance) {
            setPlayerBet(playerBet + amount);
            setTotalBet(totalBet + amount);
            setBalance(balance - amount);
        }
    }

    function resetValues() {
        let suit = getRandomInt(4);
        let number = getRandomInt(13);
        setCardsToDraw([0]);
        setCurrentCard([suit, number]);
        setUsedCards(Array(4).fill(Array(1).fill(null)));
        setNumberOfCards(1);
        setFirstCard([suit, number]);
    }

    function resetGame(game_end) {

        resetValues();

        if (game_end === consts.RESET_GAME) {
            setPlayerBet(10);
            setTotalBet(10);
            setBalance(90);
            consts.changeGameOver(consts.GAME_END_ON_ROUND_LOST);
        }
        else if (game_end === consts.START_NEW_GAME) {
            if (consts.GAME_OVER === consts.GAME_END_ON_BALANCE_LOST)
                return 0;

            if (totalBet !== playerBet)
                setBalance(balance + totalBet - playerBet);

            setTotalBet(playerBet);
            consts.changeGameOver(consts.GAME_END_ON_ROUND_LOST);
        }
        else if (game_end === consts.GAME_LOST) {
            if (balance - playerBet >= 0) {
                setBalance(balance - playerBet);
                setTotalBet(playerBet);
                consts.changeGameOver(consts.GAME_END_ON_LAST_BET);
            }
            else if (balance - 1 >= 0) {
                setBalance(balance - balance);
                setPlayerBet(balance);
                setTotalBet(balance);
                consts.changeGameOver(consts.GAME_END_ON_LAST_BET);
            }

            else {
                setBalance(0);
                setPlayerBet(0);
                setTotalBet(0);
                consts.changeGameOver(consts.GAME_END_ON_BALANCE_LOST);
            }
        }
    }

    return (
        <div>
            <Button
                top={-2}
                left={-7.15}
                width={1}
                height={1}
                radius={100}
                onClick={() => increaseBet(10)}><Image width={1} height={1} betImg src="images/10Chip.png" /></Button>

            <Button
                top={-2}
                left={-5.55}
                width={1}
                height={1}
                radius={100}
                onClick={() => increaseBet(25)}><Image width={1} height={1} betImg src="images/25Chip.png" /></Button>

            <Button
                top={-2}
                left={-4}
                width={1}
                height={1}
                radius={100}
                onClick={() => increaseBet(50)}><Image width={1} height={1} betImg src="images/50Chip.png" /></Button>

            <Button
                top={3.5}
                left={0}
                width={1.5}
                height={1.5}
                radius={100}
                onClick={() => changeNumber(1)}><Image arrowImg width={0.7} height={1.2} src="images/arrow_up.png" /></Button>

            <Button
                top={5.5}
                left={0}
                width={1.5}
                height={1.5}
                radius={100}
                onClick={() => changeNumber(0)}><Image arrowImg width={0.7} height={1.2} src="images/arrow_down.png" /></Button>

            <Button
                top={-3.4}
                left={5.5}
                width={3}
                height={1}
                radius={5}
                onClick={() => resetGame(consts.RESET_GAME)}>Reset</Button>
            <Button
                top={-5.3}
                left={5.5}
                width={3}
                height={1}
                radius={5}
                onClick={() => resetGame(consts.START_NEW_GAME)}>New Game</Button>

            <Panel top={-6} left={-8}>
                <p style={{ margin: 0 }}>Balance: {balance}</p>
                <p style={{ marginBottom: 0 }}>Bet: {totalBet}</p>
            </Panel>

            <P5Wrapper
                sketch={game}
                currentCard={currentCard} 
                cardsToDraw={cardsToDraw}
                firstCard={firstCard}/>

        </div>
    );
}

export default Game;