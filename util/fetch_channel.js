const logger = require('./logger');
let ready = require("../webserver/ready");

function findChannel(bot, name, global_store) {
    const channel = bot.channels.find(val => val.name === name);

    if (channel != null) {
        getAllMessages(channel, name, global_store);
    } else {
        logger.error(`No ${ name } channel found`);
        return [];
    }
}

function getAllMessages(channel, name, global_store) {
    let limit = 100;
    const getPromise = value => getMessageBlock(channel, limit, value);

    let count_messages;

    const loop = async value => {
        //Uses a do while loop because first id is unknown
        do  {
            let message_block;

            // waits for promise to be complete, so the messages can be chained together
            try {
                message_block = await getPromise(value);
            } catch(err) {
                logger.error(err);
            }

            //converts retrieved object to array
            const message_array = message_block.array();
            count_messages = message_array.length;

            //Add each message to storage array
            message_array.forEach(function (element) {
                global_store.unshift(element.content);
            });

            // Need to check if the entry is empty or not, having zero objects returned results in 'undefined' crash
            if (message_array[message_array.length - 1] !== undefined) {
                value = message_array[message_array.length - 1].id;
            }
            //If the amount of messages received is ever less than requested, we can assume that we're done
        } while (count_messages >= limit);
    };

    //Starts the loop with a null value so the id can be ignored in the getMessageBlock() function
    loop(null).then(function() {
        logger.info(`All of ${ name } channel's messages loaded in: ${ process.uptime() } sec`);

        ready.is = true;
    }).catch(function (err) {
        logger.error(err);
    });
}

function getMessageBlock(channel, limit, start_before) {
    let options;

    if (start_before != null) {
        options = {
            limit: limit,
            before: start_before
        }
    } else {
        options = {
            limit: limit
        }
    }

    //Get a promise to receive messages from discord api
    return channel.fetchMessages(options);
}

module.exports = findChannel;
