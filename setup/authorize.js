let fs = require('fs');
let logger = require("../util/logger");

function getAuthToken(bot) {
    if (fs.existsSync('./node_modules/api-keys/auth.json')) {
        let auth = require('../node_modules/api-keys/auth.json').token;

        return function () {
            bot.login(auth)
        }
    } else {
        require('dotenv').config();
        let auth = process.env.TOKEN;

        //Code has to repeated because the auth key is being closed,
        //Having a separate function moves it out of scope
        return function () {
            bot.login(auth)
        }
    }
}


module.exports = {
    connect: getAuthToken
};