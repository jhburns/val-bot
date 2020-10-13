let ip = {
    name: "minecraft",
    alias: "ip",
    desc: "gets the minecraft server host.",
    callback: function (message) {
        message.channel.send("sadworld.bar:25592");
    }
};

module.exports = ip;