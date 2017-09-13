const User = require("../../models/User");
const Promise = require("bluebird");
const Logger = require("../../../app").Logger;

class MigrateUsersTable
{
    constructor(knex) {
        this.knex = knex;
        this.tableName = "users";
        this.password = "asdasdasd";

        this.users = [
            {
                email: "admin@test.com",
                password: this.password,
                name: "Administrator",
                is_admin: 1
            },
            {
                email: "anil@test.com",
                password: this.password,
                name: "Anıl ÜNAL"
            }
        ];
    }

    run() {
        return this.knex.schema.dropTableIfExists(this.tableName)
        .then(() => {
            return this.knex.schema.createTable(this.tableName, function(table) {
                table.increments("id").primary();
                table.string("email");
                table.string("password");
                table.string("name").nullable().default(null);
                table.string("password_reset_token").nullable();
                table.boolean("is_admin").default(0);
                table.boolean("is_blocked").default(0);
                table.string("provider").default("self");
                table.timestamps();
            });
        })
        .then(() => {
            return Promise.map(this.users, user => User.create(user)
                .then(user => Logger.log(user.get("email") + " seeded."))
            );
        });
    }
}

module.exports = (knex) => {
    return new MigrateUsersTable(knex)
}