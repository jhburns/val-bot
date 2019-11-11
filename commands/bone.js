let bone = {
    name: "bone",
    alias: "b",
    desc: "Brooklyn 99 reference.",
    callback: function (message) {
        message.channel.send({files: ["./img/b99.png"]});
        message.channel.send("BONE");
    }
};

module.exports = bone;