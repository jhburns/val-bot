let pog = {
    name: "all-pog",
    alias: "a",
    desc: "posts every pog emoji <:dinopog:698084158387519579>",
    callback: function(message) {
        const ancient = Math.random() < 0.5 ? "<:ancientpog:725602510328561675>" : "<:ancientpog2:725822760181563466>";

        message.channel.send(`<:dinopog:698084158387519579> <:freesmileypog:764598680941756446> ${ ancient } ` +
            "<:jellopog:743528157612605482> <:meatpog:762165676093603860> " +
            "<:grimpog:764993124355276821> <:willpog:764611841912995881> <:kog:762459118057160745>");
    }
};

module.exports = pog;