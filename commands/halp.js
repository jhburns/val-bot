const Command = require("../setup/command_class");

let halp = {
    name: "halp",
    alias: "h",
    desc:"gives information on commands",
    callback:function (message) {
        let help = "Commands\n\n";

        Command.all_commands.forEach(function (element) {
            if (!element.draft && element.name != null) {
                help += `**!${ element.name }** (${ element.alias }) ${ element.desc }\n`;
            }
        });

        help += "`Put a space before each subcommand`\n";

        message.channel.send(help + "");
    }
};

module.exports = halp;
