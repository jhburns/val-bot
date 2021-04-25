let banished = require("../util/banished_list");

let cancheck = {
    name: "cancheck",
    alias: "cc",
    desc: "Check who is currently cancelled",
    draft: true,
    callback: function (message) {
        let cancelled = banished.map((u) => `<@${u}>`).join(", ");
        if (banished.length === 0) {
            cancelled = "nobody";
        }
        message.channel.send(`Currently cancelled: ${cancelled}.`);
    }
};

module.exports = cancheck;