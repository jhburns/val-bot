const Command = require("../setup/command_class");

let halp = {
    name: "halp",
    alias: "h",
    desc:"gives information on commands",
    callback:function (message) {
        let help = "__Commands__\n\n";

        Command.all_commands.forEach(function (element) {
            if (!element.draft && element.name != null) {
                help += `**!${ element.name }** (${ element.alias }) ${ element.desc }\n`;
            }
        });

        message.channel.send(help
            + "\nBoth the `!yell` and `!dink-on` commands support "
            + "pronunciation tags like this:```I <emphasis level=\"strong\">really like</emphasis> hats```"
            + "See: <https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html>");
    }
};

module.exports = halp;
