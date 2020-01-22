let bone = {
    interpolated_value: "bone",
    name: null,
    alias: null,
    callback: function (message) {
        message.channel.send("**BONE**")
            .then(function () {
                message.channel.send({files: ["./img/b99.png"]});
            });
    }
};

module.exports = bone;