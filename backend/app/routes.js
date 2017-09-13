const HomeController = require("./controllers/HomeController");
const AuthController = require("./controllers/AuthController");
const FeedbackController = require("./controllers/FeedbackController");
const TestController = require("./controllers/TestController");

const Admin = {
    DashboardController: require("./controllers/Admin/DashboardController"),
    SessionController: require("./controllers/Admin/SessionController"),
    UserController: require("./controllers/Admin/UserController"),
    LogController: require("./controllers/Admin/LogController")
};

const User = {
    ApiController: require("./controllers/User/ApiController"),
    AccountController: require("./controllers/User/AccountController"),
};

module.exports = (app, passport, passportConfig) => {

    app.use("/admin", [passportConfig.isAuthenticated, passportConfig.isAdmin], (req, res, next) => {

        app.get("/admin", Admin.DashboardController.index);

        app.get("/admin/users", Admin.UserController.index);
        app.get("/admin/users/:userID/block", Admin.UserController.block);
        app.get("/admin/users/:userID/unblock", Admin.UserController.unblock);
        app.get("/admin/users/:userID/update", Admin.UserController.update);
        app.post("/admin/users/:userID/update", Admin.UserController.updateProcess);

        app.get("/admin/sessions", Admin.SessionController.index);
        app.get("/admin/sessions/:sessionID/view", Admin.SessionController.view);
        app.get("/admin/sessions/:sessionID/delete", Admin.SessionController.delete);
        app.get("/admin/sessions/:sessionID/update", Admin.SessionController.update);
        app.post("/admin/sessions/:sessionID/update", Admin.SessionController.updateProcess);

        app.get("/admin/logs", Admin.LogController.index);
        app.get("/admin/logs/:logID/update", Admin.LogController.update);
        app.post("/admin/logs/:logID/update", Admin.LogController.updateProcess);
        app.get("/admin/logs/:logID/delete", Admin.LogController.delete);

        next();
    });

    app.use("/api/v1", (req, res, next) => {

        app.get("/api/v1/session", User.ApiController.index);
        app.post("/api/v1/session/create", User.ApiController.sessionCreate);
        app.post("/api/v1/session/send-as-email", User.ApiController.sendAsEmail);

        app.post("/api/v1/log/create", User.ApiController.logCreate);
        app.post("/api/v1/log/:logID/update", User.ApiController.logUpdate);

        app.post("/api/v1/meta/:metaID/update", User.ApiController.metaUpdate);

        next();
    });

    app.get("/", HomeController.index);
    app.get("/auth/check", AuthController.getCheck);
    app.get("/auth/signin", AuthController.getSignin);
    app.post("/auth/signin", AuthController.postSignin);
    app.get("/auth/signout", AuthController.signout);
    app.get("/forgot", AuthController.getForgot);
    app.post("/forgot", AuthController.postForgot);
    app.get("/reset/:token", AuthController.getReset);
    app.post("/reset/:token", AuthController.postReset);
    app.get("/auth/signup", AuthController.getSignup);
    app.post("/auth/signup", AuthController.postSignup);

    app.get("/feedback", FeedbackController.getFeedback);
    app.post("/feedback", FeedbackController.postFeedback);

    app.get("/account", passportConfig.isAuthenticated, User.AccountController.getAccount);
    app.post("/account/profile", passportConfig.isAuthenticated, User.AccountController.postUpdateProfile);
    app.post("/account/password", passportConfig.isAuthenticated, User.AccountController.postUpdatePassword);
    app.post("/account/delete", passportConfig.isAuthenticated, User.AccountController.postDeleteAccount);
    app.get("/account/unlink/:provider", passportConfig.isAuthenticated, User.AccountController.getOauthUnlink);

    app.get("/test", TestController.test);

};
