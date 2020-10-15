export let RESET_GAME = 0;
export let START_NEW_GAME = 1;
export let GAME_LOST = 2;

export let GAME_END_ON_ROUND_LOST = 1;
export let GAME_END_ON_LAST_BET = 2;
export let GAME_END_ON_BALANCE_LOST = 3;

export let PLAYER_HAS_BET = 0;
export let GAME_OVER = 0;
export let SMALL_CARD_TEXT = "";
export let MESSAGE = "";

export function changePlayerHasBet(n){
    PLAYER_HAS_BET = n;
}

export function changeGameOver(n){
    GAME_OVER = n;
}

export function changeSmallText(text){
    SMALL_CARD_TEXT = text;
}

export function changeMessage(text){
    MESSAGE = text;
}

