"use strict";

const Logger = require("../../app").Logger;

module.exports = class Command {

    process() {
        Logger.log("Processing...", this.constructor.name);
    }
}
