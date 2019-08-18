let first = {
    name: "first",
    desc: "says the most recently posted quote from the quotes channel",
    callback: function (message, bot, { quotes_text }) {
        message.channel.send(">>> " + quotes_text[quotes_text.length - 1]);
    }
};

module.exports = first;