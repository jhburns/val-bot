let dink = {
    name: "dink",
    alias: "d",
    desc: "posts the best gif in the world",
    callback: function(message) {
        message.channel.send({files: ["./img/dink.gif"]});
    }
};

module.exports = dink;