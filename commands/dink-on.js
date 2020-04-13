const fs = require("fs");
const aws = require('aws-sdk');
const random = require("../util/randoms");
const voices = require("../util/voices");

let is_on = false;

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
    name: "dink-on",
    alias: "on",
    desc: "`text to say (| voice name)` Dinks on the given user in the voice channel the you are in.",
    draft: false,
    callback: function (message, {bot}) {
        if (is_on) {
            message.channel.send("Please wait your turn, I am busy dinking someone already.");
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
        const voice_keys = Object.keys(voices);
        let barDelimited = removedCommandName.split("|");
        if (barDelimited.length > 1) {
            const  trimmed = barDelimited[1].trim();
            const index = includesNoCase(voice_keys, trimmed);
            if (index < 0) {
                message.channel.send("Sorry, that name is not found. Try `!voices` to learn all possible voices.");
                return;
            }

            voice = voice_keys[index];
            removedCommandName = barDelimited[0];
        } else {
            voice = voice_keys[random.intOfMax(voices.length)];
        }

        removedCommandName = removedCommandName.substring(0, 300);
        if (removedCommandName.trim() === "" ) {
            removedCommandName = "nobody";
        }

        const broadcast_dink = bot.createVoiceBroadcast();
        const broadcast_say = bot.createVoiceBroadcast();

        is_on = true;

        voiceChannel
            .join()
            .then(connection => {
                setTimeout(() => {
                    connection.disconnect();
                    voiceChannel.leave();

                    is_on = false;
                }, 60000);

                const params = {
                    Text: `Get dinked on ${ removedCommandName } `,
                    TextType: 'text',
                    OutputFormat: 'mp3',
                    VoiceId: voice,
                };

                polly.synthesizeSpeech(params, (err, data) => {
                    if (err) {
                        console.log(err.code)
                    } else if (data) {
                        if (data.AudioStream instanceof Buffer) {
                            fs.writeFile('./sounds/voice.mp3', data.AudioStream, function (err) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }

                                const dink_sound = fs.createReadStream("./sounds/diiink.mp3");
                                broadcast_dink.playStream(dink_sound);
                                connection.playBroadcast(broadcast_dink, { volume: 1.0 });

                                broadcast_dink.once("end", () => {
                                    const say_sound = fs.createReadStream("./sounds/voice.mp3");
                                    broadcast_say.playStream(say_sound);
                                    connection.playBroadcast(broadcast_say, { volume: 0.7  });

                                    broadcast_say.once("end", () => {
                                        connection.disconnect();
                                        voiceChannel.leave();

                                        is_on = false;
                                    });
                                });
                            });
                        }
                    }
                });

            })
            .catch(err => console.log(err));
    }
};

module.exports = dink_on;