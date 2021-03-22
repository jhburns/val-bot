const max = 25

const charMap = {
    'a': ':regional_indicator_a:', 'b': '🅱️', 'c': ':regional_indicator_c:', 'd': ':regional_indicator_d:', 'e': ':regional_indicator_e:',
    'f': ':regional_indicator_f:','g': ':regional_indicator_g:', 'h': ':regional_indicator_h:', 'i': ':regional_indicator_i:', 'j': ':regional_indicator_j:',
    'k': ':regional_indicator_k:', 'l': ':regional_indicator_l:', 'm': ':regional_indicator_m:', 'n': ':regional_indicator_n:', 'o': ':regional_indicator_o:',
    'p': '🅿️', 'q': ':regional_indicator_q:', 'r': ':regional_indicator_r:', 's': ':regional_indicator_s:', 't': ':regional_indicator_t:',
    'u': ':regional_indicator_u:', 'v': ':regional_indicator_v:', 'w': ':regional_indicator_w:', 'x': ':regional_indicator_x:', 'y': ':regional_indicator_y:',
    'z': ':regional_indicator_z:',

    '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',

    '!': '‼️', '?': '⁉️', ' ': '⬜',
};

function splitSafe(text) {
    const split = Array.from(text);
    const mergedEmojis = [];

    const concatLast = () => mergedEmojis[mergedEmojis.length - 1] += split.shift();

    while (split.length > 0) {
        if (split[0] === '<' && split.length >= 2 && split[1] === ':') {
            mergedEmojis.push(split.shift());
            concatLast();

            while (split.length > 0 && split[0] !== '>') {
                concatLast();
            }

            if (split.length > 0) {
                concatLast();
            }
        } else {
            mergedEmojis.push(split.shift());
        }
    }

    return mergedEmojis;
}

function mapChars(text) {
    const mapped = text.map(c => {
        const cLower = c.toLowerCase();
        if (cLower in charMap) {
           return charMap[cLower];
        } else {
           return c;
       }
    })

    return mapped.join(' ').replace(/^ +/gm, '');
}

let emojify = {
    name: "emojify",
    alias: "e",
    desc: `\`your text\` converts into emojis, max text length ${max} characters`,
    callback: function (message) {
        const parsed = message.content.split(" ");
        parsed.shift();

        console.log(parsed.toString());

        if (parsed.length === 0) {
            message.channel.send("Sorry, please provide some text after the command.");
            return;
        }

        const userText = splitSafe(parsed.join(' ').trim());

        if (userText.length > 25) {
            message.channel.send("Sorry, please provide text less than 25 characters long.");
            return;
        }

        message.channel.send(mapChars(userText));
    }
};

module.exports = emojify;