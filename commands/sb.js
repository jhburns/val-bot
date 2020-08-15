let sb = {
    interpolated_value: "shitbone",
    name: null,
    alias: null,
    callback: function (message) {
        message.channel.send({files: ["./img/sb.png"]});
    }
};

module.exports = sb;