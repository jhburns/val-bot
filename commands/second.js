let second = {
    name: "second",
    alias: "2",
    desc: "grimaceposting",
    callback: function (message) {
        message.channel.send({files: ["./img/grim.gif"]});
    }
};

module.exports = second;