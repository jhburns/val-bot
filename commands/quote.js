let random = require("../util/randoms");

let quote = {
    name: "quote",
    desc: "says a random quote from the quotes channel",
    draft: true,
    callback: function (message, bot, quotes_text) {
        message.channel.send(">>> " + quotes_text[random.intOfMax(quotes_text.length)]);
    }
};

module.exports = quote;