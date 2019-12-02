let bone = {
    interpolated_value: "bone",
    name: null,
    alias: null,
    desc: "Responds to anything that is not \"bone\"less",
    callback: function (message) {
        message.channel.send({files: ["./img/b99.png"]});
        message.channel.send("**BONE**");
    }
};

module.exports = bone;