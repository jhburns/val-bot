const format = require("../util/formatter");

let upp = {
    name: "upp",
    alias: "u",
    desc: "gets how long the val has been painting for",
    callback: function (message) {
        message.channel.send('I have been painting for about ' + format.getUptime());
    }
};

module.exports = upp;