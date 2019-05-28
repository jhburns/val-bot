const Cryptr = require('cryptr');
let fs = require('fs');
const logger = require("../util/logger");

function getPassword() {
    let password;

    if (fs.existsSync('./node_modules/api-keys/auth.json')) {
        password = require('../node_modules/api-keys/auth.json').data_key;
    } else {
        require('dotenv').config();
        password = process.env.DATA_KEY;
    }

    return password;
}

const cryptr = new Cryptr(getPassword());

function encrypt_to_file() {
    fs.writeFile("data/fighting_phrases.enc", encrypt_data(), function(err) {
        if(err) {
            return logger.error(err);
        }

        logger.info("Successfully saved encrypted data");
    });
}

function decrypt_to_file() {
    fs.writeFile("data/fighting_phrases.json", decrypt_data(), function(err) {
        if(err) {
            return logger.error(err);
        }

        logger.info("Successfully saved decrypted data");
    });
}

if (process.argv[2] === "-e") {
    encrypt_to_file();
}

if (process.argv[2] === "-d") {
    decrypt_to_file();
}

function encrypt_data() {
    return encrypted = cryptr.encrypt(fs.readFileSync("data/fighting_phrases.json", 'utf8'));
}

function decrypt_data() {
    return decryptedString = cryptr.decrypt(fs.readFileSync("data/fighting_phrases.enc", 'utf8'));
}


module.exports = {
    saveData: encrypt_data,
    getData: decrypt_data
};