let quote = {
    name: "quote",
    desc: "says a random quote from the quotes channel",
    callback: function (message) {
        message.channel.send("```" + quotes_text[random.quoteIndex(quotes_text.length)] + "```");
    }
};

module.exports = quote;