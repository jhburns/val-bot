const aws = require('aws-sdk');
const fs = require("fs");
const random = require("../util/randoms");
const logger = require("../util/logger");

let is_on = false;

const list = {
    'Ivy': 'US/Female',
    'Kimberly': 'US/Female',
    'Geraint': 'Welsh/Male',
    'Mizuki': 'Japanese/Female',
    'Kendra': 'US/Female',
    'Matthew': 'US/Male',
    'Joey': 'US/Male',
    'Takumi': 'Japanese/Male',
    'Nicole': 'Australian/Female',
    'Amy': 'British/Female',
};

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

function announce(message, bot, content, optional_voice) {
    if (is_on) {
        message.channel.send("Please wait your turn, I am busy in a voice chat already.");
        return;
    }

    let voiceChannel = message.member.voiceChannel;
    if (voiceChannel === undefined) {
        message.channel.send("Please join a voice channel to use this command.");
        return;
    }

    const voice_keys = Object.keys(list);
    let voice = optional_voice == null ? voice_keys[random.intOfMax(voice_keys.length)] : optional_voice;

    content = content.substring(0, 300).trim();
    if (content=== "" ) {
        content = "nothing to say";
    }

    content = `<speak>${ content }<break time="0.5s"/></speak>`;

    const broadcast_say = bot.createVoiceBroadcast();
    is_on = true;

    voiceChannel
        .join()
        .then(connection => {
            const params = {
                Text: content,
                TextType: 'ssml',
                OutputFormat: 'mp3',
                VoiceId: voice,
            };

            polly.synthesizeSpeech(params, (err, data) => {
                if (err) {
                    console.log(err);
                    connection.disconnect();
                    voiceChannel.leave();

                    is_on = false;
                    message.channel.send(`Sorry, ${message.author } couldn't parse understand you message.\n`
                        + "Try removing '<', '>', or other special characters.");
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

                                is_on = false;
                            });
                        });
                    }

                    setTimeout(function () {
                        is_on = false;

                        connection.disconnect();
                        voiceChannel.leave();
                    }, 45000);
                }
            });
        })
        .catch(err => logger.error(err));
}

module.exports = {
    list,
    announce,
    includesNoCase,
};