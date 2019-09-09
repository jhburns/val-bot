let random = require("../util/randoms");

let quote = {
    name: "quote",
    alias: "q",
    desc: "says a random quote from the quotes channel",
    callback: function (message, bot, { quotes_text }) {
        message.channel.send(">>> " + quotes_text[random.intOfMax(quotes_text.length)]);
    }
};

module.exports = quote;