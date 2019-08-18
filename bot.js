/*
  Custom utilities
 */
const logger = require("./util/logger");
const random = require("./util/randoms");
const fetchChannel = require('./util/fetch_channel');

let Command = require("./setup/command_class");
const fs = require('fs');
const path = require('path');


/*
  Argument Block
 */
const args = require('args');
args
    .option("draft", "Only allow commands with the 'draft' flag set to true to responded to. Dynamically remap an existing command with 'realName->remapName'", "");
const flags = args.parse(process.argv);

/*
  Parses the draft arguments for a command remapping
 */
function remapDraft(remapping) {
    let values = remapping.split("->");

    if (values[0] === '' || values[1] === '') {
        return null;
    }

    return [values[0], values[1]];
}

const remap = remapDraft(flags.draft);

/*
 Discord Client
 */
const Discord = require('discord.js');
const bot = new Discord.Client({});

bot.on('ready', () => {
    logger.info('Connected');
    logger.info(bot.user.username + ' - userID (' + bot.user.id + ')');
    logger.info('Run Instance ID: ' + '(' + random.ID(0, 999999) + ')' + ' Up in: ' + process.uptime() + 'sec');
    logger.info('Running in: ' + (flags.draft ? 'draft' : 'production') + ' mode');
});

bot.on('error', (message) => {
    logger.info(message);
});

//global so the on message function can use it
let quotes_text = [];
let fighting_words_text = [];

// Second on ready is to get quotes text async
bot.on('ready', () => {
    fetchChannel(bot, 'quotes', quotes_text);
    fetchChannel(bot, 'fighting-words', fighting_words_text);
});

fs.readdirSync(path.join(__dirname, "commands")).forEach(file => {
    const currentCmd = require("./commands/" + file);
    new Command(currentCmd.name, currentCmd.desc, currentCmd.callback, currentCmd.draft);
});

/*
 Commands block, how messages are handled
 */

bot.on('message', async message => {
    let text = message.content;

    if (text.substring(0, 1) === '!') {
        let args = text.substring(1).split(' ');
        let cmd_name = args[0];
        let is_remapped = false;

        if (remap !== null && cmd_name === remap[1]) {
            cmd_name = remap[0];
            is_remapped = true;

            logger.info("Remapping command '!" + remap[0] + "' to '!" + remap[1] + "' temporarily");
        }

        let current_cmd = Command.all_commands.find(function(element) {
            return element.name === cmd_name;
        });

        // Ignore commands that don't exist/can't be found
        if (current_cmd === undefined) {
            if (is_remapped) {
                logger.error("Remapping is not found, '!" + remap[0] + "' is not an existing command.");
            }

            return;
        }

        if (is_remapped) {
            current_cmd.draft = true;
        }

        if (current_cmd.draft ^ !(flags.draft !== "")) {
            current_cmd.oncall(message, bot, { quotes_text, fighting_words_text });
        } else if (flags.draft === "") {
            logger.info('"!' + cmd_name + '"' + " command ignored due to running in production mode.");
        } else {
            logger.info('"!' + cmd_name + '"' + " command ignored due to running in draft mode.");
        }
    }

    if (message.channel.name === 'quotes') {
        quotes_text.push(message.content);
    }

    if (message.channel.name === 'fighting-words') {
        fighting_words_text.push(message.content);
    }
});

// Needs to be after rest of setup
let auth = require("./setup/authorize");
let login = auth.connect(bot);
login();


/*
  Non-Bot process that can be in a child process
  Uncomment to have ping itself to stay awake
*/
/*
let fork = require('child_process').fork;

let ping = fork(path.join(__dirname, "webserver/pingself.js"));

process.on('exit', function () {
    ping.kill();
});
*/

let endpoints = require("./webserver/endpoints");
endpoints();

