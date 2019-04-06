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

        voiceChannel.join().then( () => getSound(voiceChannel, broadcast) )
            .catch(function (err) {
                logger.error(err)
            });
        
        new Promise(function () {
            setTimeout(() => {
                voiceChannel.leave();
                on = false;
            }, 7000);
        });
    }
};

function getSound(voiceChannel, broadcast) {
    let to_say = "get dinked on ";
    to_say += message.content.substring(message.content.indexOf(' '), 150);

    googleTTS(to_say, 'en', 1)
        .then( () => downloadFile(url, voiceChannel, broadcast) )
        .catch(function (err) {
            logger.error(err);
        });
}



function downloadFile(url, voiceChannel, broadcast) {
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

        dispatcher.on('start', () => playFile(voiceChannel, broadcast));
    });
}

function playFile(voiceChannel, broadcast) {
    new Promise(function () {
        setTimeout(() => {
            broadcast.playFile('sounds/temptalk.mp3');
            dispatcher = connection.playBroadcast(broadcast, {volume: 0.5});
        }, 3000);
        }).err((err) => logger.err(err));
}

module.exports = dink_on;