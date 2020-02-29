let random = require("../util/randoms");

const Grammarbot = require('grammarbot');

const grammar_bot = new Grammarbot({
    'api_key' : process.env.GRAMMAR_BOT_KEY,
    'language': 'en-US',
    'base_uri': 'api.grammarbot.io',
});

function improveGrammar(text, callback) {
    grammar_bot.check(text, function(error, result) {
        if (!error) {
            for (const m of result.matches) {
                if (["PHRASE_REPETITION", "NON3PRS_VERB", "I_A", "A_MY", "CONFUSION_RULE"].includes(m.rule.id)) {
                    text = replaceGrammar(text, m);
                }
            }
        }

        callback(text);
    });
}

function replaceGrammar(text, match) {
    const first_part = text.slice(0, match.offset);
    const second_part = text.slice(match.offset + match.length, text.length + 1);

    return `${ first_part }${ match.replacements[0].value }${ second_part }`;
}

function improveText(text, callback) {
    const  no_linebreaks = text.replace(/\n/g, ' ');
    const stripped = no_linebreaks.replace(/\s+/g, ' ');
    const no_quotes = stripped.replace(/"/g, '').replace(/“/g, '').replace(/”/g, '');
    const trimmed = no_quotes.trim();
    const  wrapped_quotes = `>>> "${trimmed}"`;

    /*
    improveGrammar(wrapped_quotes, (fixed_grammar) => {
        callback(fixed_grammar);
    });
    */

    callback(wrapped_quotes);
}

let splice = {
    name: "splice",
    alias: "s",
    desc: "mashes two quotes together, star it to have val-bot preserve it in <#677726820438769674>",
    callback: function (message, bot, { quotes_text }) {
        const first_quote = quotes_text[random.intOfMax(quotes_text.length)].split(" ");
        const second_quote = quotes_text[random.intOfMax(quotes_text.length)].split(" ");

        const first_half = first_quote.slice(0, first_quote.length / 2).join(" ");
        const second_half = second_quote.slice(second_quote.length / 2, second_quote.length).join(" ");

        improveText(`${ first_half } ${ second_half }`, (improved) => {
            message.channel.send(improved)
                .then((new_message) => {
                    new_message
                        .react('⭐')
                        .then(() => {
                            const filter = (reaction, user) => {
                                return reaction.emoji.name === '⭐' && !user.bot;
                            };

                            new_message.awaitReactions(filter, { max: 1, time: 999999 })
                                .then((collector) => {
                                    if (collector.size > 0 ) {
                                        bot.channels.get("677726820438769674").send(improved);
                                    }
                                })
                        })
                });
        });
    }
};

module.exports = splice;