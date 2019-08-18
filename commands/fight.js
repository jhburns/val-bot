let random = require("../util/randoms");

/*
    validate
        content: the string to check over
    returns list of two names if correct form, else returns null

 */
function validate(content) {
    removedCommandName = content.slice(6);

    let args = removedCommandName.split("|");

    if (args[0] === undefined || args[1] === undefined) {
        return null;
    }

    return [args[0].trim(), args[1].trim()];
}

function wrapUnderline(text) {
    return "__" + text + "__";
}

/*
    getCombatDialogue
        winner: string of winner name
        loser: string of loser name
        template: template string to be evaluated with 'winner' and 'loser' as vars
 */
function getCombatDialogue(winner, loser, template) {
    winner = wrapUnderline(winner);
    loser = wrapUnderline(loser);

    return  eval("`" + template + "`"); //safe because template is forced to be a string literal
}

let fight = {
    name: "fight",
    desc: "`name 1 | name 2` Two members engage in a duel, names separated by: |",
    callback: function (message, bot, { fighting_words_text }) {
        let names = validate(message.content);

        if (names !== null) {
            let template = fighting_words_text[random.intOfMax(fighting_words_text.length)];
            let dialogue = random.flip() ? getCombatDialogue(names[0], names[1], template) : getCombatDialogue(names[1], names[0], template);
            message.channel.send(dialogue);
        } else {
            message.channel.send("Try `!fight` again, structure doesn't match: `!fight name 1 | name 2`");
        }
    }
};

module.exports = fight;