let banished = require("../util/banished_list");

function banishUser(message, user, name) {
    message.channel.send(
        `${ name } you have been banished to the shadow realm. ` +
        "You are only allow to post in <#677686250148462631> for about the next 24-hours. " +
        "I will delete your messages, no hesitation."
    );

    banished.push(user.id);
}

let banish = {
    name: "banish",
    alias: "b",
    desc: "`@mention_being_banished` banish a user, only admins can use this",
    callback: function (message) {
        let spaceDelimited = message.content.split(" ");
        spaceDelimited.shift();

        const removedCommandName = spaceDelimited.join(" ");

        if (message.member.hasPermission("ADMINISTRATOR", true, true)) {
            const user = message.mentions.users.first();
            if (user === undefined) {
                message.channel.send("Please mention the user you want to banish.");
            } else if (user.id === "165599453716283392") {
                message.channel.send("I cannot banish my creator.");
                banishUser(message, message.author, `<@${ message.author.id }>`);
            } else {
                banishUser(message, user, removedCommandName);
            }
        } else {
            message.channel.send("You really thought you could do that?");
            banishUser(message, message.author, `<@${ message.author.id }>`);
        }
    }
};

module.exports = banish;