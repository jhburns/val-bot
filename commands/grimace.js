let grimace = {
    interpolated_value: "grim",
    name: null,
    alias: null,
    callback: function (message) {
        message.channel.send({files: ["./img/grim.gif"]});
    }
};

module.exports = grimace;