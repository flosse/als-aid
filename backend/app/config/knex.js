if (typeof process.env.CLEARDB_DATABASE_URL !== "undefined") {
    module.exports = require("knex")({
      client: "mysql",
      connection: process.env.CLEARDB_DATABASE_URL
    });
} else {
    module.exports = require("knex")({
      client: "sqlite3",
      connection: {
        filename: "database.sqlite"
      },
      useNullAsDefault: true
    });
}

