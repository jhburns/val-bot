let painting = {
    name: "draft",
    desc: "should only work in drafting mode",
    draft: true,
    callback: function (message) {
        message.channel.send("should only work in drafting mode");
    }
};

module.exports = painting;