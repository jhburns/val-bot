/*
 Sound set-up
 */
let googleTTS = require('google-tts-api');
let download = require('download-file');

const logger = require("../util/logger");

let on = false;

let dink_on = {
    name: "dink-on",
    desc: "a command to lay ruin to your enemies",
    callback: function(message, bot) {
        if (on) {
            message.channel.send("Please wait your turn, dink is busy right now");
            return;
        }
        on = true;

        //If not in a call, prompt
        let voiceChannel = message.member.voiceChannel;
        if (voiceChannel === undefined) {
            message.channel.send("Please enter a channel to hear dis");
            return;
        }
        const broadcast = bot.createVoiceBroadcast();

        voiceChannel.join().then(connection => {
            let to_say = "get dinked on ";
            to_say += message.content.substring(message.content.indexOf(' '), 150);

            googleTTS(to_say, 'en', 1)
                .then(function (url) {
                    let options = {
                        directory: "./sounds/",
                        filename: "temptalk.mp3"
                    };

                    download(url, options, function (err) {
                        if (err) {
                            logger.error(err);
                        }

                        broadcast.playFile('sounds/diiiink.mp3');
                        let dispatcher = connection.playBroadcast(broadcast, {volume: 0.4});

                        dispatcher.on('start', function () {
                            new Promise(function (resolve, reject) {

                                setTimeout(() => {
                                    broadcast.playFile('sounds/temptalk.mp3');
                                    dispatcher = connection.playBroadcast(broadcast, {volume: 0.5});
                                }, 3000);
                            });

                            new Promise(function (resolve, reject) {
                                setTimeout(() => {
                                    voiceChannel.leave();
                                    on = false;
                                }, 7000);
                            });

                        });
                    });
                })
                .catch(function (err) {
                    logger.error(err);
                });

        }).catch(function (err) {
            logger.error(err)
        });
    }
};


module.exports = dink_on;