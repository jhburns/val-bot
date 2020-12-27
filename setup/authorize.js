let fs = require('fs');
const aws = require("aws-sdk");

function getAuthToken(bot) {
    let auth;

    if (fs.existsSync('./node_modules/api-keys/auth.json')) {
        auth = require('../node_modules/api-keys/auth.json').token;
        aws.config.loadFromPath("./node_modules/api-keys/auth.json");
    } else if (fs.existsSync('.env')){
        require('dotenv').config();
        auth = process.env.TOKEN;

        aws.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    } else {
        auth = process.env.TOKEN;
    }

    return function () {
        bot.login(auth);
    }
}


module.exports = {
    connect: getAuthToken
};