"use strict";

const Bluebird = require("bluebird");

class Logger {

    constructor(transports) {
        this.transports = [];
        transports.forEach(transport => this.transports.push(transport));

        this.transports.forEach(transport => {
            transport.log(`${transport.constructor.name} is loaded.`, this.constructor.name);
        });
    }

    log(message, name = null) {
        return Bluebird.map(this.transports, transport => transport.log(message, name));
    }

    debug(message, name = null) {
        return Bluebird.map(this.transports, transport => transport.debug(message, name));
    }

    logException(exception) {
        return Bluebird.map(this.transports, transport => transport.logException(exception));
    }
}

module.exports = (transports) => {
    return new Logger(transports);
};