let third = {
    name: "third",
    alias: "3",
    desc: "says the third most recently posted quote from the quotes channel",
    callback: function (message, bot, { quotes_text }) {
        message.channel.send(">>> " + quotes_text[quotes_text.length - 3]);
    }
};

module.exports = third;