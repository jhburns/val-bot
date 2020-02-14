let random = require("../util/randoms");

let splice = {
    name: "splice",
    alias: "s",
    desc: "mashes two quotes together",
    draft: true,
    callback: function (message, bot, { quotes_text }) {
        const first_quote = quotes_text[random.intOfMax(quotes_text.length)].split(" ");
        const second_quote = quotes_text[random.intOfMax(quotes_text.length)].split(" ");

        const first_half = first_quote.slice(0, first_quote.length / 2).join(" ");
        const second_half = second_quote.slice(second_quote.length / 2, second_quote.length).join(" ");

        message.channel.send(">>> " + first_half + " " + second_half);
    }
};

module.exports = splice;