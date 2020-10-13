const fs = require("fs");
const aws = require('aws-sdk');
const random = require("../util/randoms");
const voices = require("../util/voices");
const logger = require("../util/logger");

const polly = new aws.Polly({
    signatureVersion: 'v4',
    region: 'us-west-1'
});

function includesNoCase(array, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].toLowerCase() === value.toLowerCase()) {
            return i;
        }
    }

    return -1;
}

let dink_on = {
    name: "yell",
    alias: "y",
    desc: "`text to say (| voice name)` yell given text in voice channel the you are in, without a name specified it picks one at random",
    callback: function (message, {bot}) {
        if (voices.is_on) {
            message.channel.send("Please wait your turn, I am busy in a voice chat already.");
            return;
        }

        let voiceChannel = message.member.voiceChannel;
        if (voiceChannel === undefined) {
            message.channel.send("Please join a voice channel to use this command.");
            return;
        }

        let spaceDelimited = message.cleanContent.replace("@", "").split(" ");
        spaceDelimited.shift();

        let removedCommandName = spaceDelimited.join(" ");

        let voice = "";
        const voice_keys = Object.keys(voices.list);
        if (removedCommandName.includes("|")) {
            let barDelimited = removedCommandName.split("|");
            const  trimmed = barDelimited[1].trim();
            const index = includesNoCase(voice_keys, trimmed);

            if (index < 0) {
                message.channel.send("Sorry, that name is not found. Try `!voices` to learn all possible voices.");
                return;
            }

            voice = voice_keys[index];
            removedCommandName = barDelimited[0];
        } else {
            voice = voice_keys[random.intOfMax(voice_keys.length)];
        }

        removedCommandName = removedCommandName.substring(0, 1000);
        if (removedCommandName.trim() === "" ) {
            removedCommandName = "nothing to say";
        }
        removedCommandName = `<speak>${ removedCommandName }<break time="1s"/></speak>`;

        const broadcast_say = bot.createVoiceBroadcast();
        voices.is_on = true;

        voiceChannel
            .join()
            .then(connection => {
                const params = {
                    Text: removedCommandName,
                    TextType: 'ssml',
                    OutputFormat: 'mp3',
                    VoiceId: voice,
                };

                polly.synthesizeSpeech(params, (err, data) => {
                    if (err) {
                        connection.disconnect();
                        voiceChannel.leave();

                        voices.is_on = false;
                        message.channel.send(`Sorry, ${message.author } couldn't parse your message.\n`
                            + "Try and fix your SSML: https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html .");
                    } else if (data) {
                        if (data.AudioStream instanceof Buffer) {
                            fs.writeFile('./sounds/voice.mp3', data.AudioStream, function (err) {
                                if (err) {
                                    logger.error(err);
                                    return;
                                }

                                const say_sound = fs.createReadStream("./sounds/voice.mp3");
                                broadcast_say.playStream(say_sound);
                                connection.playBroadcast(broadcast_say, { volume: 0.7 });

                                broadcast_say.once("end", () => {
                                    connection.disconnect();
                                    voiceChannel.leave();

                                    voices.is_on = false;
                                });
                            });
                        }
                    }
                });
            })
            .catch(err => logger.error(err));
    }
};

module.exports = dink_on;