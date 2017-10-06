const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');
const passport = require("passport");
const User = require("../models/User");
const Logger = require("../../app").Logger;
const mailer = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

exports.getCheck = (req, res) => {
    if (req.isAuthenticated() === false) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    return res.status(200).json({
        email: req.user.get("email"),
        avatar: req.user.getAvatar(),
        firstName: req.user.getFirstName(),
        lastName: req.user.getLastName(),
        photoUrl: req.user.getPhotoUrl(),
    });
};

exports.getSignin = (req, res) => {
    if (req.user) {
        return res.redirect("/");
    }

    res.render("account/signin", {
        title: "Sign in"
    });
};

exports.postSignin = (req, res, next) => {
    req.assert("email", "Email is not valid").isEmail();
    req.assert("password", "Password cannot be blank").notEmpty();
    req.sanitize("email").normalizeEmail({ remove_dots: false });

    const provider = req.body.provider;
    const type = req.body.type;
    const errors = req.validationErrors();

    debugger;
    var offset = new Date().getTimezoneOffset(); console.log('offset is '+offset);
     debugger;
        var getTimezone = require('node-timezone').getTimezone;
        console.log('node timezone = '+ getTimezone()); // "America/Los_Angeles"
        debugger;

    if (errors) {
        if (type === "mobile") {
            return res.status(401).json(errors);
        }
        req.flash("errors", errors);
        return res.redirect("/auth/signin");
    }

    passport.authenticate("local", (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            req.flash("errors", info);
            if (req.body.type === "mobile") {
                return res.status(401).json(info);
            }
            return res.redirect("/auth/signin");
        }

        if (user.isBlocked() === true) {
            req.flash("errors", { msg: "Your account is blocked." });
            if (req.body.type === "mobile") {
                return res.status(401).json({ msg: "Your account is blocked." });
            }
            return res.redirect("/auth/signin");
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", { msg: "Success! You are logged in." });
            if (req.body.type === "mobile") {
                return res.status(200).json({
                    email: user.get("email"),
                    avatar: user.getAvatar(),
                    name: user.getName(),
                    firstName: user.getFirstName(),
                    lastName: user.getLastName(),
                    id: user.getId(),
                    photoUrl: user.getPhotoUrl(),
                    isAdmin: user.isAdmin(),
                });
            }
            return res.redirect(req.session.returnTo || "/");
        });

    })(req, res, next);
};

exports.signout = (req, res) => {
    req.logout();

    if (req.body.type === "mobile") {
        return res.status(200);
    }

    return res.redirect("/");
};

exports.getSignup = (req, res) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("account/signup", {
        title: "Create Account"
    });
};

exports.postSignup = (req, res, next) => {
    req.assert("email", "Email is not valid").isEmail();
    req.assert("password", "Password must be at least 4 characters long").len(4);
    req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);
    req.sanitize("email").normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        if (req.body.type === "mobile") {
            return res.status(401).json(errors);
        }

        req.flash("errors", errors);
        return res.redirect("/auth/signup");
    }

    User.where({
        email: req.body.email
    })
    .fetch()
    .then(user => {
        if (user) {
            if (req.body.type === "mobile") {
                return res.status(401).json({ msg: "Account with that email address already exists." });
            }
            req.flash("errors", { msg: "Account with that email address already exists." });
            return res.redirect("/auth/signup");
        }

        User.create({
            email: req.body.email,
            password: req.body.password,
            provider: "self",
            name: req.body.name || "John Doe"
        })
        .then((user) => {
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                if (req.body.type === "mobile") {
                    return res.status(200).json({
                        email: user.get("email"),
                        avatar: user.getAvatar()
                    });
                }
                res.redirect("/");
            });
        })
        .catch(err => {
            Logger.logException(err);
            return next(err);
        });
    })
    .catch(err => {
        Logger.logException(err);
        return next(err);
    });
};

exports.getReset = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }

    User
    .findOne({ password_reset_token: req.params.token })
    .then((user) => {
        if (!user) {
            req.flash("errors", { msg: "Password reset token is invalid or has expired." });
            return res.redirect("/forgot");
        }

        res.render("account/reset", {
            title: "Password Reset"
        });
    })
    .catch((err) => next(err))
};

exports.postReset = (req, res, next) => {
    req.assert("password", "Password must be at least 6 characters long.").len(6);
    req.assert("confirm", "Passwords must match.").equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }

    async.waterfall([
        function (done) {
            User
                .findOne({ password_reset_token: req.params.token })
                .catch((err) => next(err))
                .then((user) => {
                    done(null, req.params.token, user);
                });
        },
        function (token, user, done) {
            if (!user) {
                req.flash("errors", { msg: "Password reset token is invalid or has expired." });
                return res.redirect("back");
            }
            user.save({
                password: req.body.password,
                password_reset_token: null
            })
            .catch((err) => next(err))
            .then((user) => {
                req.logIn(user, (err) => {
                    done(err, user);
                });
            });
        },
        function (user, done) {
            const mailOptions = {
                to: user.get("email"),
                from: process.env.ADMIN_EMAIL,
                subject: "Your alsaid password has been changed",
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.get("email")} has just been changed.\n`
            };
            mailer.sendMail(mailOptions, (err) => {
                req.flash("success", { msg: "Success! Your password has been changed." });
                done(err);
            });
        }
    ], (err) => {
        if (err) { return next(err); }
        res.redirect("/");
    });
};

exports.getForgot = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }

    res.render("account/forgot", {
        title: "Forgot Password"
    });
};

exports.postForgot = (req, res, next) => {
    req.assert("email", "Please enter a valid email address.").isEmail();
    req.sanitize("email").normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        if (req.body.type === "mobile") {
            return res.status(400).json({
                message: "Email does not seem correct."
            });
        }

        req.flash("errors", errors);
        return res.redirect("/forgot");
    }

    async.waterfall([
        function (done) {
            crypto.randomBytes(16, (err, buf) => {
                const token = buf.toString("hex");
                done(err, token);
            });
        },
        function (token, done) {
            User.where({
                email: req.body.email
            })
            .fetch()
            .then(user => {
                if (user) {
                    return done(null, token, user);
                }

                if (req.body.type === "mobile") {
                    return res.status(404).json({
                        message: "Account with that email address does not exist."
                    });
                }

                req.flash("errors", { msg: "Account with that email address does not exist." });
                return res.redirect("/forgot");
            })
            .catch((err) => {
                if (req.body.type === "mobile") {
                    return res.status(404).json({
                        message: "Account with that email address does not exist."
                    });
                }

                req.flash("errors", { msg: "Account with that email address does not exist." });
                return res.redirect("/forgot");
            });
        },
        function (token, user, done) {
            user.save({
                password_reset_token: token
            })
            .catch((err) => done(err))
            .then((user) => {
                done(null, token, user);
            });
        },
        function (token, user, done) {
            const mailOptions = {
                to: user.get("email"),
                from: process.env.ADMIN_EMAIL,
                subject: "Reset your password on alsaid",
                text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
                    Please click on the following link, or paste this into your browser to complete the process:\n\n
                    http://${req.headers.host}/reset/${token}\n\n
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            mailer.sendMail(mailOptions, (err) => {
                if (req.body.type !== "mobile") {
                    req.flash("info", { msg: `An e-mail has been sent to ${user.get("email")} with further instructions.` });
                }
                done(err);
            });
        }
    ], (err) => {
        if (err) {
            return next(err);
        }

        if (req.body.type === "mobile") {
            return res.status(200).json({
                success: true
            });
        }

        res.redirect("/forgot");
    });
};
