module.exports = class ConsoleTransport
{
    constructor() {
    }

    log(message, name = null) {
        return new Promise(accept => {
            console.log(name === null ? message : `[${name}]: ${message}`);
            return accept();
        });
    }

    debug(message, name = null) {
        return new Promise(accept => {
            console.log("#### Debug ####");
            console.log(typeof message === "object" ? `${JSON.stringify(message)}` : `${message}`);
            console.log("####");
            return accept();
        });
    }

    logException(exception) {
        return new Promise(accept => {
            console.log(exception);
            return accept();
        });
    }
}
