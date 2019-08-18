let random = require("../util/randoms");

let nani = {
    name: "何",
    desc: "quote, but in nihongo",
    callback: function (message, bot, { quotes_text }) {
        message.channel.send("```" + quotes_text[random.intOfMax(quotes_text.length)] + "```");
    }
};

module.exports = nani;