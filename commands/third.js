let third = {
    name: "third",
    alias: "3",
    desc: "says the third most recently posted quote from <#465772508671508490>",
    callback: function (message, { quotes_text }) {
        message.channel.send(">>> " + quotes_text[quotes_text.length - 3]);
    }
};

module.exports = third;