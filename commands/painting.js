let painting = {
    name: "painting",
    desc: "check if bot is currently up",
    callback: function (message) {
        message.channel.send("Busy playing Pixel Painter! ᶠʳᵉᵉ ᵐᵉᵉ");
    }
};

module.exports = painting;