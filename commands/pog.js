let pog = {
    name: "allpog",
    alias: "a",
    desc: "posts every pog emoji",
    callback: function(message) {
        const ancient = Math.random() < 0.5 ? "<:ancientpog:725602510328561675>" : "<:ancientpog2:725822760181563466>";

        message.channel.send(`<:dinopog:698084158387519579> <:negapog:761287466119594034> ${ ancient } ` +
            "<:jellopog:743528157612605482> <:meatpog:762165676093603860> <:usapog:758618815960449035>  " +
            "<:grimpog:719427604884619365> <:willpog:720125268085178388> <:kog:762459118057160745>");
    }
};

module.exports = pog;