let eightball = require('8ball');

let ball = {
    name: "8ball",
    alias: "8",
    desc: "tells the secrets of the universe",
    callback: function (message) {
        message.channel.send("🎱 " + eightball());
    }
};

module.exports = ball;