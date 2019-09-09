let test = {
    name: "test",
    alias: "t",
    desc: "Used only to test bot in draft mode, when not making a new command",
    draft: true, // Should always be true, Is only so new draft commands don't have to be created to test
    callback: function (message) {
        message.channel.send("Test working");
    }
};

module.exports = test;