var fs = require("fs");

module.exports = class FileTransport
{
    constructor(path, debugPath) {
        this.stream = fs.createWriteStream(path);
        this.debugStream = fs.createWriteStream(debugPath);
    }

    log(message, name = null) {
        return new Promise(accept => {
            this.stream.write(name === null ? `${message}\n` : `[${name}]: ${message}\n`);
            return accept();
        });
    }

    debug(message, name = null) {
        return new Promise(accept => {
            this.debugStream.write(typeof message === "object" ? `${JSON.stringify(message)}\n` : `${message}\n`);
            return accept();
        });
    }

    logException(message) {
        return new Promise(accept => {
            this.stream.write("Exception\n");
            Object.keys(message).forEach(key => {
                this.stream.write(`${key}: ${message[key]}\n`);
            });
            return accept();
        });
    }
}
