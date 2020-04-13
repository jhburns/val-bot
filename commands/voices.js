const  voices = require("../util/voices");

function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

let test = {
    name: "voices",
    alias: "v",
    desc: "List all of the possible voice names.",
    callback: function (message) {
        let content = "Voices\n\n";
        let sorted = sortObject(voices);


        for (const [ key, value ] of Object.entries(sorted)) {
            content += `**${ key }** ${ value }\n`;
        }

        message.channel.send(content);
    }
};

module.exports = test;