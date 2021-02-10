let banished = require("../util/banished_list");

function unBanishUser(message, user, name) {
    const i = banished.indexOf(user.id);
    if (i >=0) {
        banished.splice(i, 1);
        message.channel.send(`${ name } you have been unbanished.`);
    } else {
        message.channel.send("User isn't banished right now.");
    }
}

function banishUser(message, user, name) {
    message.channel.send(
        `${ name } you have been banished to the shadow realm. ` +
        "You are only allow to post in <#677686250148462631> for about the next 24-hours. " +
        "I will delete you messages, no hesitation."
    );

    banished.push(user.id);
}

let banish = {
    name: "unbanish",
    alias: "ub",
    desc: "`@mention_being_banished` unbanish a user, only admins can use this",
    callback: function (message) {
        let spaceDelimited = message.content.split(" ");
        spaceDelimited.shift();

        const removedCommandName = spaceDelimited.join(" ");

        if (message.member.hasPermission("ADMINISTRATOR", true, true)) {
            const user = message.mentions.users.first();
            if (user === undefined) {
                message.channel.send("Please mention the user you want to banish.");
            } else {
                unBanishUser(message, user, removedCommandName);
            }
        } else {
            message.channel.send("You really thought you could do that?");
            banishUser(message, message.author, `<@${ message.author.id }>`);
        }
    }
};

module.exports = banish;