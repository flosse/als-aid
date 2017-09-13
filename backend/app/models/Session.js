const bookshelf = require('../config/bookshelf');
const BaseModel = require('bookshelf-modelbase')(bookshelf);
const moment = require("moment");

const User = require("./User");
const Meta = require("./Meta");

class Session extends BaseModel {
    get tableName() {
        return "sessions";
    }

    get hasTimestamps() {
        return true;
    }

    user() {
        return this.belongsTo(User);
    }

    meta() {
        return this.belongsTo(Meta);
    }

    logs() {
        var log = require("./Log");
        return this.hasMany(log);
    }
};

module.exports = Session;
