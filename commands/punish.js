let test = {
    name: "banish",
    alias: "b",
    desc: "Punish a user, only admins can use this",
    draft: true, // Should always be true, Is only so new draft commands don't have to be created to test
    callback: function (message) {
        message.channel.delete();
    }
};

module.exports = test;