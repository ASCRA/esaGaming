import React, { useEffect, useState } from 'react';
import game from "./Game"
import {Button, Panel, Image} from "./StyledComponents"
import P5Wrapper from 'react-p5-wrapper';
window.playerHasBet = 0;
window.gameOver = 0;
window.smallCardText = "";
window.message = "";

function Game() {
    const [balance, setBalance] = useState(90);
    const [playerBet, setPlayerBet] = useState(10);
    const [totalBet, setTotalBet] = useState(10);

    const [usedCards, setUsedCards] = useState(JSON.parse(localStorage.getItem("usedCards")) ? 
                                               JSON.parse(localStorage.getItem("usedCards")) : 
                                               Array(4).fill(Array(1).fill(null)));

    const [currentCard, setCurrentCard] = useState(JSON.parse(localStorage.getItem("currentCard")) ? 
                                                   JSON.parse(localStorage.getItem("currentCard")) : 
                                                   [Math.floor(Math.random() * Math.floor(4)), Math.floor(Math.random() * Math.floor(13))]);
    
    const [numberOfCards, setNumberOfCards] = useState(JSON.parse(localStorage.getItem("numberOfCards")) ? 
                                                       JSON.parse(localStorage.getItem("numberOfCards")) : 0);

    const [cardsToDraw, setCardsToDraw] = useState(JSON.parse(localStorage.getItem("cardsToDraw")) ? 
                                                   JSON.parse(localStorage.getItem("cardsToDraw")) : [0]);

    const [firstCard, setFirstCard] = useState(JSON.parse(localStorage.getItem("firstCard")) ? 
                                               JSON.parse(localStorage.getItem("firstCard")) : currentCard);                                           
    
    let RESET_GAME = 0;
    let START_NEW_GAME = 1;
    let GAME_LOST = 2;

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
        setPlayerBet(JSON.parse(localStorage.getItem("playerBet")));
        setTotalBet(JSON.parse(localStorage.getItem("totalBet")));
        setBalance(JSON.parse(localStorage.getItem("balance")));
    }, []);

    useEffect(() => {
        localStorage.setItem("playerBet", JSON.stringify(playerBet));
        localStorage.setItem("totalBet", JSON.stringify(totalBet));
        localStorage.setItem("balance", JSON.stringify(balance));
    }, [totalBet, playerBet, balance]);

    useEffect(() => {
        localStorage.setItem("usedCards", JSON.stringify(usedCards));
        localStorage.setItem("numberOfCards", JSON.stringify(numberOfCards));
        localStorage.setItem("cardsToDraw", JSON.stringify(cardsToDraw));
        localStorage.setItem("currentCard", JSON.stringify(currentCard));
        localStorage.setItem("firstCard", JSON.stringify(firstCard));
    }, [usedCards, numberOfCards, cardsToDraw, currentCard, firstCard]);

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function changeNumber(hl) {

        if (window.playerHasBet !== 0 || totalBet === 0 || window.gameOver === 3)
            return 0;

        else if (!window.gameOver) {
            while (1) {
                let suit, number;

                suit = getRandomInt(4);
                number = getRandomInt(13);

                let gameStatus = checkCard(suit, number);

                if (gameStatus === 1) {
                    if (window.playerHasBet === 0)
                        window.playerHasBet = 1;

                    else
                        return 0;

                    console.log(currentCard, suit, number)
                    if (hl) {
                        
                        if (number > currentCard[1]) {

                            window.smallCardText = "Higher";
                            window.message = "NICE!";
                            setTotalBet(totalBet + playerBet);
                            let cardsDraw = cardsToDraw;
                            cardsDraw[numberOfCards] = [suit, number, window.smallCardText];
                            setCardsToDraw(cardsDraw);
                            setCurrentCard([suit, number]);
                        }

                        else {
                            window.smallCardText = "Lower";
                            resetGame(GAME_LOST);
                            setCurrentCard([suit, number]);
                            break;
                        }
                    }

                    else {
                        if (number < currentCard[1]) {
                            setTotalBet(totalBet + playerBet);
                            window.smallCardText = "Lower";
                            window.message = "NICE!";
                            let cardsDraw = cardsToDraw;
                            cardsDraw[numberOfCards] = [suit, number, window.smallCardText];
                            setCardsToDraw(cardsDraw);
                            setCurrentCard([suit, number]);
                        }

                        else {
                            window.smallCardText = "Higher";
                            resetGame(GAME_LOST);
                            setCurrentCard([suit, number]);
                            break;
                        }
                    }
                    
                    localStorage.setItem("totalBet", JSON.stringify(totalBet));
                    break;
                }
                else if (gameStatus === 2) {
                    resetGame(1);
                }
            }
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

        if (game_end === RESET_GAME) {
            setPlayerBet(10);
            setTotalBet(10);
            setBalance(90);
            window.gameOver = 1;
        }
        else if (game_end === START_NEW_GAME) {
            if (window.gameOver === 3)
                return 0;

            if (totalBet !== playerBet)
                setBalance(balance + totalBet - playerBet);

            setTotalBet(playerBet);
            window.gameOver = 1;
        }
        else if (game_end === GAME_LOST) {
            if (balance - playerBet >= 0) {
                setBalance(balance - playerBet);
                setTotalBet(playerBet);
                window.gameOver = 2;
            }
            else if (balance - 1 >= 0) {
                setBalance(balance - balance);
                setPlayerBet(balance);
                setTotalBet(balance);
                window.gameOver = 2;
            }

            else {
                setBalance(0);
                setPlayerBet(0);
                setTotalBet(0);
                window.gameOver = 3;
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
                onClick={() => resetGame(RESET_GAME)}>Reset</Button>
            <Button
                top={-5.3}
                left={5.5}
                width={3}
                height={1}
                radius={5}
                onClick={() => resetGame(START_NEW_GAME)}>New Game</Button>

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