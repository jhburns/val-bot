let random = require('../util/randoms');

/*
    validate
        content: the string to check over
    returns list of two names if correct form, else returns null
 */
function validate(content) {
    let spaceDelimited = content.split(" ");
    spaceDelimited.shift();

    let removedCommandName = spaceDelimited.join(" ");

    let args = removedCommandName.split("|");

    if (args[0] === undefined || args[1] === undefined) {
        return null;
    }

    return args.map((arg) => arg.trim());
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

/*
    eliminate
        names: string array of each of the player's names
        returns object of players left, and the winner and loser
*/
function eliminate(names) {
    let players = names.slice(0); // Clone array
    let loser_index = random.intOfMax(players.length);
    let loser = players[loser_index];
    players.splice(loser_index, 1);

    return {
        players,
        winner: players[random.intOfMax(players.length)],
        loser,
    }
}

function getRounds(players, fighting_words_text) {
    let fullDialogue = "";
    let victor = "";

    while (players.length > 1) {
        let players_left = eliminate(players);

        fullDialogue += getCombatDialogue(players_left.winner, players_left.loser, fighting_words_text[random.intOfMax(fighting_words_text.length)]);
        fullDialogue += "\n\n";

        victor = players_left.winner;
        players = players_left.players;
    }

    fullDialogue += `The victor is **${ victor }!**`;

    return fullDialogue;
}

let fight = {
    name: "fight",
    alias: "f",
    desc: "`name 1 | name 2 (| name 3)` Two or more things engage in a duel, names separated by: `|`. Add more templates in <#612712686412890112>.",
    callback: function (message, { fighting_words_text }) {
        let names = validate(message.content);

        if (names !== null) {
            message.channel.send(getRounds(names, fighting_words_text));
        } else {
            message.channel.send("Try `!fight` again, structure doesn't match: `!fight name 1 | name 2`");
        }
    }
};

module.exports = fight;