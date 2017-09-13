const bookshelf = require('../config/bookshelf');
const BaseModel = require('bookshelf-modelbase')(bookshelf);

class Meta extends BaseModel {
    get tableName() {
        return "metas";
    }

    get hasTimestamps() {
        return false;
    }
};

module.exports = Meta;
