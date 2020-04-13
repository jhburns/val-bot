const fs = require("fs");
const aws = require('aws-sdk');
let random = require("../util/randoms");

let is_on = false;

const polly = new aws.Polly({
    signatureVersion: 'v4',
    region: 'us-west-1'
});

let dink_on = {
    name: "dink-on",
    alias: "on",
    desc: "`@user` Dinks on the given user in the voice channel the you are in",
    draft: false,
    callback: function (message, {bot}) {
        if (is_on) {
            message.channel.send("Please wait your turn, I am busy dinking someone already.");
            return;
        }
        is_on = true;

        let voiceChannel = message.member.voiceChannel;
        if (voiceChannel === undefined) {
            message.channel.send("Please join a voice channel to use this command.");
            return;
        }

        const broadcast_dink = bot.createVoiceBroadcast();
        const broadcast_say = bot.createVoiceBroadcast();

        voiceChannel
            .join()
            .then(connection => {
                setTimeout(() => {
                    connection.disconnect();
                    voiceChannel.leave();

                    is_on = false;
                }, 60000);

                let spaceDelimited = message.cleanContent.replace("@", "").split(" ");
                spaceDelimited.shift();
                let removedCommandName = spaceDelimited.join(" ");
                removedCommandName = removedCommandName.substring(0, 300);
                if (removedCommandName.trim() === "" ) {
                    removedCommandName = "nobody";
                }

                const voices = ['Ivy', 'Kimberly', 'Geraint', 'Mizuki'];
                const params = {
                    Text: `Get dinked on ${ removedCommandName } `,
                    TextType: 'text',
                    OutputFormat: 'mp3',
                    VoiceId: voices[random.intOfMax(voices.length)],
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