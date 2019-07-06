let spider = {
    name: "cool",
    desc: "Prints a coolio spider",
    draft: true,
    callback: function (message) {
        message.channel.send("/// (🕶️ _____ 🕶️ ) \\\\\\\\");
    }
};

module.exports = spider;