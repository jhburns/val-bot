let painting = {
    name: "painting",
    alias: "pain",
    desc: "check if bot is currently up",
    callback: function (message) {
        message.channel.send("Busy playing Pixel Painter! ᶠʳᵉᵉ ᵐᵉᵉ");
    }
};

module.exports = painting;