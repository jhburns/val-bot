/*
 Needed so the bot pings itself, so it doesn't get shut down
 */
const http = require('http');
const express = require('express');
const app = express();


let config = require("./server_config");

if (config.port == null) {
    config.port = 8080;
}

if (config.url == null) {
    config.url = "http://cyclic-narwhal.glitch.me/";
}

app.listen(config.port);

setInterval(() => {
    http.get(config.url);
    // Interval needs to be less than 5min

}, 1800);