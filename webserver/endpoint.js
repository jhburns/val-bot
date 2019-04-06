const express = require('express');
const app = express();

const logger = require("../util/logger");

let config = require("./server_config");

if (config.health_port == null) {
    config.health_port = 9090;
}

app.get('/health', (req, res) => res.send("Up"));

app.listen(config.health_port, () => logger.info("Health endpoint started"));