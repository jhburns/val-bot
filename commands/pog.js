let pog = {
    name: "allpog",
    alias: "a",
    desc: "posts every pog emoji",
    callback: function(message) {
        message.channel.send("<:dinopog:698084158387519579> <:negapog:761287466119594034> <:ancientpog:725602510328561675> " +
            "<:jellopog:743528157612605482> <:meatpog:762165676093603860> <:usapog:758618815960449035> <:ancientpog2:725822760181563466> " +
            "<:grimpog:719427604884619365> <:willpog:720125268085178388> <:kog:750246977098481716>");
    }
};

module.exports = pog;