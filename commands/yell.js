const audio = require("../util/audio");

let yell = {
    name: "yell",
    alias: "y",
    desc: "`text to say (| voice name)` yell given text in your voice channel, voice name is random unless given",
    callback: function (message, {bot}) {
        let spaceDelimited = message.cleanContent.replace("@", "").split(" ");
        spaceDelimited.shift();

        let removedCommandName = spaceDelimited.join(" ");

        let voice = null;
        const voice_keys = Object.keys(audio.list);
        if (removedCommandName.includes("|")) {
            let barDelimited = removedCommandName.split("|");
            const  trimmed = barDelimited[1].trim();
            const index = audio.includesNoCase(voice_keys, trimmed);

            if (index < 0) {
                message.channel.send("Sorry, that name is not found. Try `!voices` to list all possible voices.");
                return;
            }

            voice = voice_keys[index];
            removedCommandName = barDelimited[0];
        }

        audio.announce(message, bot, removedCommandName, voice);
    }
};

module.exports = yell;