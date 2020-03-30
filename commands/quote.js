let random = require("../util/randoms");

let quote = {
    name: "quote",
    alias: "qu",
    desc: "says a random quote from <#465772508671508490>",
    callback: function (message, { quotes_text }) {
        message.channel.send(">>> " + quotes_text[random.intOfMax(quotes_text.length)]);
    }
};

module.exports = quote;