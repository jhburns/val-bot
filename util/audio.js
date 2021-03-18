const aws = require('aws-sdk');
const fs = require("fs");
const random = require("../util/randoms");
const logger = require("../util/logger");
const uuid = require("uuid");

let is_on = false;
let connectionId = "";

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

function cleanup(connection, voiceChannel) {
    connection.disconnect();
    voiceChannel.leave();

    is_on = false;
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

    const currentId = uuid.v4();
    connectionId = currentId;

    const voice_keys = Object.keys(list);
    let voice = optional_voice == null ? voice_keys[random.intOfMax(voice_keys.length)] : optional_voice;

    content = content.substring(0, 300).trim();
    if (content=== "" ) {
        content = "nothing to say";
    }

    content = `<speak>${ content }<break time="2s"/></speak>`;

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
                    logger.error(err);
                    cleanup(connection, voiceChannel);

                    message.channel.send(`Sorry, ${message.author } couldn't parse understand you message.\n`
                        + "Try removing '<', '>', or other special characters.");
                } else if (data) {
                    if (data.AudioStream instanceof Buffer) {
                        fs.writeFile('./sounds/voice.mp3', data.AudioStream, function (err) {
                            if (err) {
                                logger.error(err);
                                cleanup(connection, voiceChannel);
                                return;
                            }

                            broadcast_say.playFile("./sounds/voice.mp3");
                            broadcast_say.once("end", () => {
                                cleanup(connection, voiceChannel);
                            });

                            connection.playBroadcast(broadcast_say, { volume: 0.7, bitrate: 24000 });
                        });
                    }

                    setTimeout(function () {
                        if (is_on && connectionId === currentId) {
                            cleanup(connection, voiceChannel);
                        }
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