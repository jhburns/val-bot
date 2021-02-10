let tired = {
    name: "tired",
    alias: "t",
    desc: "posts every tired emoji 😫",
    draft: true,
    callback: function(message) {
        message.channel.send("<:tiredofthisbone:753902224756834305> <:tiredofthisshit:720125303359537224> " +
            "<:tiredofthisdean:794519413298298880> 😫");
    }
};

module.exports = tired;