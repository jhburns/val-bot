let unmute = {
    name: "unmute-all",
    alias: "ua",
    desc: "unmutes everyone in your voice channel",
    draft: true,
    callback: function (message, { bot }) {
        let voiceChannel = message.member.voiceChannel;
        if (voiceChannel === undefined) {
            message.channel.send("Please join a voice channel to use this command.");
            return;
        }

        let channelDetails = bot.channels.get(voiceChannel.id);
        for (const [memberID, member] of channelDetails.members) {
            if (memberID !== "235088799074484224" && memberID !== "473280648782675978") {
                member.setMute(false);
            }
        }
    }
};

module.exports = unmute;