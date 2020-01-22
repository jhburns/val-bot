let bone = {
    interpolated_value: "bone",
    name: null,
    alias: null,
    callback: function (message) {
        message.channel.send({files: ["./img/b99.png"]})
            .then(function () {
                message.channel.send("**BONE**")
            });
    }
};

module.exports = bone;