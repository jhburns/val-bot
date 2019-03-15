/*
 Sound set-up
 */
var ffmpeg = require('ffmpeg');
var googleTTS = require('google-tts-api');
var download = require('download-file');

/*
 Logging block, using winston
 Use logger.info("text"); for normal text and change .info to .error for error
 */

const winston = require('winston');

const logger = winston.createLogger({
    format:  winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

/*
 Non Discord Helpers,
 They may be used by discord, but don't need it
 */

function randomID(low, high) {
    //seems dumb, but string zero is needed for padding output
    var zero = '0';
    var padding = zero.repeat(high.toString().length);
    var num = Math.floor(Math.random() * (high - low) + low);

    return (padding+num).slice(-padding.length);
}

/*
 Command class, to make adding new commands easier
 */

class Command {
    //name should be string,
    //desc should also be a string, but longer
    // oncall should be function
    constructor(name, desc, oncall) {
        this.name = name;
        this.oncall = oncall;
        this.desc = desc;
        Command.all_commands.push(this);
    }

    // Sets up static array to hold all commands
    static init() {
        Command.all_commands = [];
    }

    // getCommands
        // return - array of all command objects
    static getCommands() {
        return Command.all_commands;
    }
}

//needs to be ran before any commands are made
Command.init();

/*
 Main Discord Block
 */
const Discord = require('discord.js');

//Private repo may not be loaded

var fs = require('fs');
if (fs.existsSync('./node_modules/api-keys/auth.json')) {
    var auth = require('./node_modules/api-keys/auth.json').token;
} else {
    require('dotenv').config();
    var auth = process.env.TOKEN;
}

const bot = new Discord.Client({});

bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - userID (' + bot.user.id + ')');
    logger.info('Run Instance ID: ' + '(' + randomID(0, 999999) + ')' + ' Up in: ' + process.uptime() + 'sec');
});

bot.on('error', (message) => {
    logger.info(message);
});

//global so the on message function can use it
var quotes_text = [];

// Second on ready is to get quotes text async
bot.on('ready', () => {
    const quotes_channel = bot.channels.find(val => val.name === 'quotes');

    if (quotes_channel != null) {
        getAllMessages(quotes_channel, quotes_text);
    } else {
        logger.info("Not quotes channel found");
    }

});

/*  getAllMessages
        channel: channel object that we want messages from
        all_messages: the array to save each message to
*/
function getAllMessages(channel, all_messages) {
    let limit = 50;
    const getPromise = value => getMessageBlock(channel, limit, value);

    const loop = async value => {
        //Uses a do while loop because first id is unknown
        do  {
            // waits for promise to be complete, so the messages can be chained together
            try {
                message_block = await getPromise(value);
            } catch(err) {
                logger.error(err);
            }

            //converts retrieved object to array
            const message_array = message_block.array();
            var count_messages = message_array.length;

            //Add each message to storage array
            message_array.forEach(function (element) {
                all_messages.unshift(element.content);
            });

            // Need to check if the entry is empty or not, having zero objects returned results in 'undefined' crash
            if (message_array[message_array.length - 1] !== undefined) {
                value = message_array[message_array.length - 1].id;
            }
        //If the amount of messages received is ever less than requested, we can assume that we're done
        } while (count_messages >= limit);

    };

    //Starts the loop with a null value so the id can be ignored in the getMessageBlock() function
    loop(null).then(function() {
        logger.info("All quotes loaded!");
    }).catch(function (err) {
       logger.error(err);
    });
}

/*
    getMessageBlock
        channel: channel object that we want messages from
        limit: positive int, with a max of 100
        start_before: can be null (to get start of messages) or id of message from where to start getting messages from
        return: promise to get a block of messages
 */
function getMessageBlock(channel, limit, start_before) {
    let options;

    if (start_before != null) {
        options = {
            limit: limit,
            before: start_before
        }
    } else {
        options = {
            limit: limit
        }
    }

    //Get a promise to receive messages from discord api
    return channel.fetchMessages(options);
}


/*
 Commands block, they do not need to be declared as an actual var
 */

bot.on('message', async message => {
    var text = message.content;

    if (text.substring(0, 1) == '!') {
        var args = text.substring(1).split(' ');
        var cmd = args[0];

        Command.all_commands.find(function(element) {
            if (element.name === cmd) {
                element.oncall(message);
            }
        });

    } else if (text.indexOf("and") >= 4 && text.indexOf("and") <= text.length - 7 && text.length <= 30 && text.substring(0, 1) != '`') {
        message.channel.send('```' + text + ' and PAINTING!```');
    }

    if (message.channel.name === 'quotes') {
        quotes_text.push(message.content);
    }
});

/*
 Command block, for all the ! commands
 Does not need to be set to a variable
 */

new Command(
"painting",
"check if bot is currently up",
function (message) {
    message.channel.send("Busy playing Pixel Painter! ᶠʳᵉᵉ ᵐᵉᵉ");
});

new Command(
"halp",
"gives information on commands",
function (message) {
    var help = "`Put a ! in front of each command and a space before each subcommand`\n\n";

    // TODO rewrite using getCommands() method
    Command.all_commands.forEach(function (element) {
        help += '**' + element.name + '** ' + element.desc + '\n';
    });

    if (help === "") {
        logger.error("Message cannot be blank");
    }
    message.channel.send(help + "");
});

new Command(
"quote",
"says a random quote from the quotes channel",
function (message) {
    message.channel.send("```" + quotes_text[Math.floor(Math.random() * quotes_text.length)] + "```");
});

new Command(
"first",
"says the most recently posted quote from the quotes channel",
function (message) {
    message.channel.send("```" + quotes_text[quotes_text.length - 1] + "```");
});

var imaging = new Command(
"dink",
"posts the best gif in the world",
function (message) {
    message.channel.send({files: ["./img/dink.gif"]});
});

var on = false
var voicing = new Command(
"dink-on",
"a command to lay ruin to your enemies",
function (message) {
    if (on) {
        message.channel.send("Please wait your turn, dink is busy right now");
        return;
    }
    on = true;

    //If not in a call, prompt
    var voiceChannel = message.member.voiceChannel;
    if (voiceChannel === undefined) {
        message.channel.send("Please enter a channel to hear dis");
        return;
    }
    const broadcast = bot.createVoiceBroadcast();

    voiceChannel.join().then(connection =>{
        var to_say = "get dinked on ";
        to_say += message.content.substring(message.content.indexOf(' '), 150);

        googleTTS(to_say, 'en', 1)
            .then(function (url) {
                var options = {
                    directory: "./sounds/",
                    filename: "temptalk.mp3"
                };

                download(url, options, function(err){
                    if (err) {
                        logger.error(err);
                    }

                    broadcast.playFile('sounds/diiiink.mp3');
                    var dispatcher = connection.playBroadcast(broadcast, {volume: 0.4});

                    dispatcher.on('start', function () {
                        var firstPromise = new Promise(function (resolve, reject) {

                            setTimeout(() => {
                                broadcast.playFile('sounds/temptalk.mp3');
                                dispatcher = connection.playBroadcast(broadcast, {volume: 0.5});
                            }, 3000);
                        });

                        var secondPromise = new Promise(function (resolve, reject) {
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
});

new Command(
"dink-all",
"posts the picture and says the thing in voice chat",
function (message) {
    var firstPromise = new Promise(function (resolve, reject) {
        voicing.oncall(message);
    });
    var firstPromise = new Promise(function (resolve, reject) {
        imaging.oncall(message);
    });
});

new Command(
"upp",
"gets how long the val has been painting for",
function (message) {
    message.channel.send('I have been painting for about ' + getUptime());
});

function getUptime() {
    var up = process.uptime();
    var units = 'seconds';

    if (up > 60) {
        up /= 60;
        units = "minutes";
    }
    if (up > 60) {
        up /= 60;
        units = "hours";
    }
    if (up > 24 && units == "hours") {
        up /= 24;
        units = "days";
    }

    return '**' + Math.floor(up) + " " + units + '**';
}

/*
 Needs to ping itself to no get shut down
 */
const http = require('http');
const express = require('express');
const app = express();

app.listen(8080);
setInterval(() => {
    http.get(`http://hyper-date.glitch.me/`);
    // Interval needs to be less than 5min
}, 180000);

// Needs to be last so other methods are pre-loaded
bot.login(auth);