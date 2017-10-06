const Log = require("../../models/Log");
const Promise = require("bluebird");
const Logger = require("../../../app").Logger;

class MigrateMetasTable
{
    constructor(knex) {
        this.knex = knex;
        this.tableName = "metas";
    }

    run() {
        return this.knex.schema.dropTableIfExists(this.tableName)
        .then(() => {
            return this.knex.schema.createTable(this.tableName, function(table) {
                table.increments("id").primary();
                table.string("name").nullable();
                table.string("sex").nullable();
                table.integer("age").nullable();
                table.string("location").nullable();
                table.string("address").nullable();
            });
        });
    }
}

module.exports = (knex) => {
    return new MigrateMetasTable(knex)
}
