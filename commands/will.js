let random = require("../util/randoms");

const max = 35;

let will = {
    name: "willzard",
    alias: "w",
    desc: `\`( number)\` posts long willzard, optional number should be in range 0-${ max }`,
    callback: function(message) {
        const parsed = message.content.split(" ");
        parsed.shift();

        let repeated = 0;

        if (parsed.length == 0) {
            repeated = random.intOfMax(max);
        } else {
            const userCount = parseInt(parsed[0]);
            if (!isNaN(userCount) && userCount >= 0 && userCount <= max) {
                repeated = userCount;
            } else {
                message.channel.send(`Sorry you either didn't enter a number or it wasn't in the range 0-${ max }.`);
                return;
            }
        }

        message.channel.send("<:willzard1:808952341721645056>" +
            `${ "<:willzard2:808952358205128724>".repeat(repeated) }` +
            "<:willzard3:808952372075298848>");
    }
};

module.exports = will;