const User = require("../../models/User");

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
    res.render("account/profile", {
        title: "Account Management"
    });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
    User.findOne({ id: req.user.get("id") })
    .catch((err) => next(err))
    .then((user) => {
        user.save({
            name: req.body.name
        })
        .catch((err) => next(err))
        .then((user) => {
            req.flash("success", { msg: "Profile information has been updated." });
            res.redirect("/account");
        })
    });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
    req.assert("password", "Password must be at least 6 characters long").len(6);
    req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("/account");
    }

    User.findOne({ id: req.user.get("id") })
    .catch((err) => next(err))
    .then((user) => {
        user.save({
            password: req.body.password
        })
        .catch((err) => next(err))
        .then((user) => {
            req.flash("success", { msg: "Password has been changed." });
            res.redirect("/account");
        });
    });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
    User.where("id", req.user.get("id"))
        .destroy()
        .catch((err) => next(err))
        .then(() => {
            req.logout();
            req.flash("info", { msg: "Your account has been deleted." });
            res.redirect("/");
    });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
    const provider = req.params.provider;
    User.findById(req.user.get("id"), (err, user) => {
        if (err) { return next(err); }
        user[provider] = undefined;
        user.tokens = user.tokens.filter(token => token.kind !== provider);
        user.save((err) => {
            if (err) { return next(err); }
            req.flash("info", { msg: `${provider} account has been unlinked.` });
            res.redirect("/account");
        });
    });
};
