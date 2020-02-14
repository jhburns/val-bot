let first = {
    name: "first",
    alias: "1",
    desc: "says the most recently posted quote from <#465772508671508490>",
    callback: function (message, bot, { quotes_text }) {
        message.channel.send(">>> " + quotes_text[quotes_text.length - 1]);
    }
};

module.exports = first;