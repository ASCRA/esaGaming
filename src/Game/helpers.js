export function calculateObjSize() {
    const widescreenSizeModifier = (window.innerHeight > window.innerWidth) ? 1 : 0.75;
    return Math.floor(Math.min(Math.floor(window.innerWidth / 20), Math.floor(window.innerHeight / 20)) * widescreenSizeModifier);
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}