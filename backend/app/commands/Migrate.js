const Command  = require('./Command');
const Promise = require("bluebird");
const Logger = require("../../app").Logger;
const Redis = require("../../app").Redis;

class Migrate extends Command
{
    constructor(knex) {
        super();
        this.knex = knex;
        this.migrations = [
            "MigrateUsersTable",
            "MigrateSessionsTable",
            "MigrateLogsTable",
            "MigrateMetasTable"
        ];
    }

    process() {
        if (process.env.NODE_ENV !== "development") {
            return Promise.reject(new Error("Migration can only run in development mode."));
        }

        super.process();

        return Redis.flushdbAsync()
        .then(() => {
            return Promise.map(this.migrations, (migrator) => {
                let migration = require('../database/migrations/' + migrator + '.js')(this.knex);
                return migration.run().then(() => Logger.log("Migrated.", migrator));
            }, {
                concurrency: 1
            })
            .then(() => Logger.log("Migration task successful.", this.constructor.name));
        })
        .catch(err => {
            console.log(err);
        });
    }
}

module.exports = (knex) => {
    return new Migrate(knex);
};
