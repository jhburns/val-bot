let ip = {
    name: "ip",
    alias: "i",
    desc: "Get the current minecraft IP address",
    draft: true, // Should always be true, Is only so new draft commands don't have to be created to test
    callback: function (message) {
        message.channel.send("51.255.15.215:25592");
    }
};

module.exports = ip;