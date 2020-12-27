const audio = require("../util/audio");

function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

let voices = {
    name: "voices",
    alias: "v",
    desc: "list all of the possible voice names for use in the '!yell' command",
    callback: function (message) {
        let content = "__Voices__\n\n";
        let sorted = sortObject(audio.list);

        for (const [ key, value ] of Object.entries(sorted)) {
            content += `**${ key }** ${ value }\n`;
        }

        message.channel.send(content);
    }
};

module.exports = voices;