const express = require('express');

const logger = require("../util/logger");

let config = require("./server_config");

let ready = require("./ready");

if (config.endpoint_port == null) {
    config.endpoint_port = 9090;
}

module.exports = function () {
    const app = express();

    app.get('/health', (req, res) => res.send("Up"));

    app.get('/ready', function(req, res) {
        if (ready.is) {
            res.send("Ready");
        } else {
            res.status(503);
            res.send("Not Ready");
        }
    });

    app.listen(config.endpoint_port, () => logger.info("Endpoints started"));

    return app;
};