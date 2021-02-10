let dink = {
    interpolated_value: "dink",
    name: null,
    alias: null,
    callback: function(message) {
        message.channel.send({files: ["./img/dink.gif"]});
    }
};

module.exports = dink;