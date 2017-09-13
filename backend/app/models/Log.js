const bookshelf = require('../config/bookshelf');
const BaseModel = require('bookshelf-modelbase')(bookshelf);
const Session = require("./Session");
const moment = require("moment");

class Log extends BaseModel {
    get tableName() {
        return "logs";
    }

    get hasTimestamps() {
        return false;
    }

    session() {
        return this.belongsTo(Session);
    }

    getDate() {
        return moment(this.get("date")).format("MMM DD, YYYY - HH:mm:ss")
    }
};

module.exports = Log;
