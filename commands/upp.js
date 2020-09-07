const format = require("../util/formatter");

let upp = {
    name: "upp",
    desc: "gets how long the val has been painting for",
    callback: function (message) {
        message.channel.send('I have been busy playing Pixel Painter for about: ' + format.getUptime() + " ᶠʳᵉᵉ ᵐᵉᵉ" );
    }
};

module.exports = upp;