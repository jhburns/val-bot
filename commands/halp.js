const Command = require("../setup/command_class");

let halp = {
    name: "halp",
    desc:"gives information on commands",
    callback:function (message) {
        let help = "`Put a ! in front of each command and a space before each subcommand`\n\n";

        Command.all_commands.forEach(function (element) {
            help += '**' + element.name + '** ' + element.desc + '\n';
        });

        message.channel.send(help + "");
    }
};

module.exports = halp;
