let bone = {
    name: "bone",
    alias: "b",
    desc: "Brooklyn 99 reference.",
    draft: true,
    callback: function (message) {
        message.channel.send({files: ["./img/b99.png"]});
        message.channel.send("BONE");
    }
};

module.exports = bone;