let shot = {
    interpolated_value: "shit",
    name: null,
    alias: null,
    callback: function (message) {
        message.channel.send({files: ["./img/shadow.png"]});
    }
};

module.exports = shot;