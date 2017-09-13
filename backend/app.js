/**
 * Module dependencies.
 */
const express = require("express");
const compression = require("compression");
const session = require("express-session");
const bodyParser = require("body-parser");
const Bluebird = require("bluebird");
const morgan = require("morgan");
const errorHandler = require("errorhandler");
const lusca = require("lusca");
const dotenv = require("dotenv");
const RedisPackage = require("redis");
const RedisStore = require("connect-redis")(session);
const flash = require("express-flash");
const path = require("path");
const util = require("util");
const passport = require("passport");
const expressValidator = require("express-validator");
const sass = require("node-sass-middleware");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "public/uploads") });
const ucfirst = require("ucfirst");
const moment = require("moment");

exports.Bluebird = Bluebird;

/**
 * Load our logger
 */

const Logger = require("./AlsAID/Log/Logger")([
    new (require("./AlsAID/Log/Transports/ConsoleTransport")),
    new (require("./AlsAID/Log/Transports/FileTransport"))(
        path.join(__dirname, `storage/logs/app.${moment().unix()}.log`),
        path.join(__dirname, `storage/logs/__debug.log`)
    )
]);
exports.Logger = Logger;

/**
 * Use our global uncaught exception logger.
 */

process.on("uncaughtException", (err) => Logger.logException(err));

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
if (typeof process.env.NODE_ENV === "production") {
    Logger.log("Reading environment variables from production.");
} else {
    Logger.log("Loading .env");
    dotenv.load({
        path: ".env"
    });
}

/**
 * Initialize Redis database
 */

if (typeof process.env.REDIS_URL !== "undefined") {
    var Redis = RedisPackage.createClient();
} else {
    var Redis = RedisPackage.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        db: 0
    });
}

// We need to handle errors manually to prevent app from crashing.
Redis.on("error", err => Logger.logException(err));
Bluebird.promisifyAll(Redis);
exports.Redis = Redis;

/**
 * Configurations
 */

const knexConfig  = require("./app/config/knex");
const bookshelfConfig  = require("./app/config/bookshelf");
const passportConfig = require("./app/config/passport");
const appConfig = require("./app/config/app");
const Constants = require("./app/config/constants");
exports.Constants = Constants;

/**
 * Initialize session handler
 */

const sessionHandler = session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new RedisStore({
        client: Redis,
        prefix: "session:",
        db: 0,
        logErrors: true
    })
});

/**
 * Create Express server.
 */
const app = express();
const http = require("http").Server(app);

/**
 * Load database models.
 */
const User = require("./app/models/User");

/**
 * Express configuration and middlewares.
 */
app.set("port", process.env.PORT);
app.set("views", path.join(__dirname, "resources/views"));
app.set("view engine", "jade");
app.use(compression());
app.use(sass({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public")
}));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(sessionHandler);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    let paths = [
        "/forgot",
        "/forgot/"
    ];
    if (paths.indexOf(req.path) > -1) {
        return next();
    }
    else if (req.path.includes("auth") === true) {
        return next();
    }
    else if (req.path.includes("api/v1") === true) {
        return next();
    }
    else if (req.path.includes("reset/") === true) {
        return next();
    }
    else {
        lusca.csrf()(req, res, next);
        lusca.xframe("SAMEORIGIN");
        lusca.xssProtection(true);
    }
});
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8100");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful signin, redirect back to the intended page
    if (!req.user &&
            req.path !== "/auth/signin" &&
            req.path !== "/auth/signup" &&
            !req.path.match(/^\/auth/) &&
            !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express.static(path.join(__dirname, "public"), {
    maxAge: 31557600000
}));

/**
 * Run commands if they are specified.
 */

if (typeof process.argv[2] !== "undefined") {
    switch (ucfirst(process.argv[2])) {
        case "Migrate":
            require("./app/commands/" + ucfirst(process.argv[2]) + ".js")(knexConfig)
            .process()
            .then(() => {
                Logger.log("Command completed.")
                process.exit(0);
            })
            .catch(err => {
                Logger.log("Command failed.")
                Logger.logException(err);
                process.exit(0);
            });
            break;

        default:
            throw new Error("Invalid command.");
    }

    return;
}

/**
 * Routes
 */
require("./app/routes")(app, passport, passportConfig);

/**
 * Error Handler.
 */

app.use(errorHandler());

/**
 * Start Express
 */
app.listen(app.get("port"), () => {
    Logger.log(`Started! Server listening on port ${app.get("port")} and environment ${app.get("env")}`);
});

module.exports = app;
