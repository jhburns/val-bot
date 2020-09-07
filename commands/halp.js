const Command = require("../setup/command_class");

let halp = {
    name: "halp",
    alias: "h",
    desc:"gives information on commands",
    callback:function (message) {
        let help = "__Commands__\n\n";

        Command.all_commands.forEach(function (element) {
            const alias = element.alias === undefined ? "" : `(${element.alias}) `;

            if (!element.draft && element.name != null) {
                help += `**!${ element.name }** ${ alias }${ element.desc }\n`;
            }
        });

        message.channel.send(help);
    }
};

module.exports = halp;
