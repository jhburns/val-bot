let pog = {
    name: "all-pog",
    alias: "a",
    desc: "posts every pog emoji <:dinopog:698084158387519579>",
    draft: true,
    callback: function(message) {
        const ancient = Math.random() < 0.5 ? "<:ancientpog:725602510328561675>" : "<:ancientpog2:725822760181563466>";

        message.channel.send(`<:dinopog:698084158387519579><:freesmileypog:764598680941756446> ${ ancient }` +
            "<:jellopog:743528157612605482><:meatpog:762165676093603860>" +
            "<:grimpog:764993124355276821><:willpog:788302055621263371><:kog:779225989423038504>" +
            "<:bidenpog:779228608220758026><:brocchamp:793707611254030366><:fishpog:808945843772194816>" +
            "<:kannapog:451609224976531456><:rog:830270508318720021><:ayasepog:835753584624664617>" +
            "<:omegarinipog:864377161769812008><:rinipog:864375524687347753>");
    }
};

module.exports = pog;