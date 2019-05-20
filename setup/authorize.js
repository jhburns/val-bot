let fs = require('fs');

function getAuthToken(bot) {
    let auth;

    if (fs.existsSync('./node_modules/api-keys/auth.json')) {
        auth = require('../node_modules/api-keys/auth.json').token;
    } else {
        require('dotenv').config();
        auth = process.env.TOKEN;
    }

    return function () {
        bot.login(auth)
    }
}


module.exports = {
    connect: getAuthToken
};