function leftPadRandomInt(low, high) {
    //seems dumb, but string zero is needed for padding output
    let zero = '0';
    let padding = zero.repeat(high.toString().length);
    let num = Math.floor(Math.random() * (high - low) + low);

    return (padding+num).slice(-padding.length);
}

function randomRangeToMax(max) {
    return Math.floor(Math.random() * max);
}

function randomBoolean() {
    return Math.random() >= 0.5;
}

module.exports = {
    ID: leftPadRandomInt,
    intOfMax: randomRangeToMax,
    flip: randomBoolean
};