let ip = {
    name: "ip",
    alias: "i",
    desc: "Get the current minecraft IP address",
    callback: function (message) {
        message.channel.send("51.255.15.215:25592");
    }
};

module.exports = ip;