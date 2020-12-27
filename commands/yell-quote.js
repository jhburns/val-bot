const audio = require("../util/audio");
let random = require("../util/randoms");

let yell_quote = {
    name: "yell-quote",
    alias: "yq",
    desc: "`(voice name)` yell a random quote in your voice channel, voice name is random unless included",
    callback: function (message, {bot, quotes_text}) {
        let spaceDelimited = message.cleanContent.replace("@", "").split(" ");
        spaceDelimited.shift();

        let removedCommandName = spaceDelimited.join(" ");

        let voice = null;
        const voice_keys = Object.keys(audio.list);
        if (removedCommandName !== "") {
            const  trimmed = removedCommandName.trim();
            const index = audio.includesNoCase(voice_keys, trimmed);

            if (index < 0) {
                message.channel.send("Sorry, that name is not found. Try `!voices` to list all possible voices.");
                return;
            }

            voice = voice_keys[index];
        }

        audio.announce(message, bot, quotes_text[random.intOfMax(quotes_text.length)], voice);
    }
};

module.exports = yell_quote;