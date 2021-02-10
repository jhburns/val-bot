let second = {
    name: "second",
    alias: "2",
    desc: "says the second most recently posted quote from <#465772508671508490>",
    callback: function (message) {
        message.channel.send(">>> " + quotes_text[quotes_text.length - 2]);
    }
};

module.exports = second;