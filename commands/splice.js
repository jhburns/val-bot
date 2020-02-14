let random = require("../util/randoms");

let splice = {
    name: "splice",
    alias: "s",
    desc: "mashes two quotes together, star it to have val-bot ",
    callback: function (message, bot, { quotes_text }) {
        const first_quote = quotes_text[random.intOfMax(quotes_text.length)].split(" ");
        const second_quote = quotes_text[random.intOfMax(quotes_text.length)].split(" ");

        const first_half = first_quote.slice(0, first_quote.length / 2).join(" ");
        const second_half = second_quote.slice(second_quote.length / 2, second_quote.length).join(" ");

        const body = `>>> ${ first_half } ${ second_half }`;

        message.channel.send(body)
            .then((new_message) => {
               new_message
                   .react('⭐')
                   .then(() => {
                       const filter = (reaction, user) => {
                           return reaction.emoji.name === '⭐' && !user.bot;
                       };

                       new_message.awaitReactions(filter, { max: 1, time: 999999 })
                           .then((collector) => {
                               if (collector.size > 0 ) {
                                   bot.channels.get("677726820438769674").send(body);
                               }
                           })
                   })
            });
    }
};

module.exports = splice;