let random = require("../util/randoms");
const logger = require("../util/logger");


function readInTemplates() {
    let password;

    if (fs.existsSync('./node_modules/api-keys/auth.json')) {
        password = require('../node_modules/api-keys/auth.json').data_key;
    } else {
        require('dotenv').config();
        password = process.env.DATA_KEY;
    }

    logger.info(password);
}

/*
    validate
        content: the string to check over
    returns list of two names if correct form, else returns null

 */
function validate(content) {
    let args = content.split(" ");

    if (args[1] === undefined || args[2] === undefined) {
        return null;
    }

    return [args[1], args[2]];
}

/*
    getCombatDialogue
        winner: string of winner name
        loser: string of loser name
        template: template string to be evaluated with 'winner' and 'loser' as vars
 */
function getCombatDialogue(winner, loser, template) {
    return  eval("`" + template + "`"); //safe because template is forced to be a string literal
}

let fight = {
    name: "fight",
    desc: "`[name 1] [name 2]` Two members engage in a duel",
    draft: true, // Should always be true, Is only so new draft commands don't have to be created to test
    callback: function (message) {
        let names = validate(message.content);

        if (names !== null) {
            let template = "${winner} and ${loser}";
            let dialogue = random.flip() ? getCombatDialogue(names[0], names[1], template) : getCombatDialogue(names[1], names[0], template);
            message.channel.send(dialogue);
        } else {
            message.channel.send("Try `!fight` again, structure doesn't match: `!fight name1 name2`");
        }
    }
};

module.exports = fight;