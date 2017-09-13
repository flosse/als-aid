const Log = require("../../models/Log");
const Promise = require("bluebird");
const Logger = require("../../../app").Logger;
const moment = require("moment");

class MigrateLogsTable
{
    constructor(knex) {
        this.knex = knex;
        this.tableName = "logs";

        this.logs = [
            {
                session_id: 1,
                message: "Example log 1",
                date: moment().format("YYYY-MM-DD HH:mm:ss")
            },
            {
                session_id: 1,
                message: "Example log 2",
                date: moment().format("YYYY-MM-DD HH:mm:ss")
            }
        ];
    }

    run() {
        return this.knex.schema.dropTableIfExists(this.tableName)
        .then(() => {
            return this.knex.schema.createTable(this.tableName, function(table) {
                table.increments("id").primary();
                table.integer("session_id");
                table.string("message");
                table.datetime("date");
            });
        })
        .then(() => {
            return Promise.map(this.logs, log => Log.create(log)
                .then(log => Logger.log(log.get("message") + " seeded."))
            );
        });
    }
}

module.exports = (knex) => {
    return new MigrateLogsTable(knex)
}