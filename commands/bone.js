let bone = {
    name: "bone",
    alias: "b",
    desc: "Brooklyn 99 reference.",
    draft: true,
    callback: function (message) {
        message.channel.send("BONE");
    }
};

module.exports = bone;