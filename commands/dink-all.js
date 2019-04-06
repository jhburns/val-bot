let dink_all = {
    name: "dink-all",
    desc: "posts the picture and says the thing in voice chat",
    callback: function(message) {
        let firstPromise = new Promise(function (resolve, reject) {
            voicing.oncall(message);
        });
        let secondPromise = new Promise(function (resolve, reject) {
            imaging.oncall(message);
        });
    }
};

module.exports = dink_all;