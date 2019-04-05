/*
 Sound set-up
 */
let ffmpeg = require('ffmpeg');
let googleTTS = require('google-tts-api');
let download = require('download-file');

/*
  Custom utilities
 */
const logger = require("./util/logger");
const random = require("./util/randoms");
const format = require("./util/formatter");

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

const bot = new Discord.Client({});

bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - userID (' + bot.user.id + ')');
    logger.info('Run Instance ID: ' + '(' + random.ID(0, 999999) + ')' + ' Up in: ' + process.uptime() + 'sec');
});

bot.on('error', (message) => {
    logger.info(message);
});

//global so the on message function can use it
let quotes_text = [];

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
 Commands block, they do not need to be declared as an actual let
 */

bot.on('message', async message => {
    let text = message.content;

    if (text.substring(0, 1) == '!') {
        let args = text.substring(1).split(' ');
        let cmd = args[0];

        Command.all_commands.find(function(element) {
            if (element.name === cmd) {
                element.oncall(message);
            }
        });
    }

    if (message.channel.name === 'quotes') {
        quotes_text.push(message.content);
    }
});

/*
 Command block, for all the ! commands
 Does not need to be set to a letiable
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
    let help = "`Put a ! in front of each command and a space before each subcommand`\n\n";

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
    message.channel.send("```" + quotes_text[ random.quoteIndex(quotes_text.length) ] + "```");
});

new Command(
"first",
"says the most recently posted quote from the quotes channel",
function (message) {
    message.channel.send("```" + quotes_text[quotes_text.length - 1] + "```");
});

let imaging = new Command(
"dink",
"posts the best gif in the world",
function (message) {
    message.channel.send({files: ["./img/dink.gif"]});
});

let on = false;
let voicing = new Command(
"dink-on",
"a command to lay ruin to your enemies",
function (message) {
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

    voiceChannel.join().then(connection =>{
        let to_say = "get dinked on ";
        to_say += message.content.substring(message.content.indexOf(' '), 150);

        googleTTS(to_say, 'en', 1)
            .then(function (url) {
                let options = {
                    directory: "./sounds/",
                    filename: "temptalk.mp3"
                };

                download(url, options, function(err){
                    if (err) {
                        logger.error(err);
                    }

                    broadcast.playFile('sounds/diiiink.mp3');
                    let dispatcher = connection.playBroadcast(broadcast, {volume: 0.4});

                    dispatcher.on('start', function () {
                        let firstPromise = new Promise(function (resolve, reject) {

                            setTimeout(() => {
                                broadcast.playFile('sounds/temptalk.mp3');
                                dispatcher = connection.playBroadcast(broadcast, {volume: 0.5});
                            }, 3000);
                        });

                        let secondPromise = new Promise(function (resolve, reject) {
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
    let firstPromise = new Promise(function (resolve, reject) {
        voicing.oncall(message);
    });
    let secondPromise = new Promise(function (resolve, reject) {
        imaging.oncall(message);
    });
});

new Command(
"upp",
"gets how long the val has been painting for",
function (message) {
    message.channel.send('I have been painting for about ' + format.getUptime());
});

// Needs to be after rest of setup
let auth = require("./setup/authorize");
let login = auth.connect(bot);
login();

var fork = require('child_process').fork;
var ping = fork("./webserver/pingself.js", { detached: true });
