const Session = require("../../models/Session");
const Promise = require("bluebird");
const Logger = require("../../../app").Logger;

class MigrateSessionsTable
{
    constructor(knex) {
        this.knex = knex;
        this.tableName = "sessions";

        this.sessions = [];
    }

    run() {
        return this.knex.schema.dropTableIfExists(this.tableName)
        .then(() => {
            return this.knex.schema.createTable(this.tableName, function(table) {
                table.increments("id").primary().unsigned();
                table.integer("user_id").unsigned();
                table.integer("meta_id").unsigned();
                table.boolean("is_valid").default(0);
                table.timestamps();
            });
        })
        .then(() => {
            return Promise.map(this.sessions, session => Session.create(session)
                .then(session => Logger.log(session.get("id") + " seeded."))
            );
        });
    }
}

module.exports = (knex) => {
    return new MigrateSessionsTable(knex)
}