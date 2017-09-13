const User = require("../../models/User");

exports.index = (req, res) => {
    User.fetchAll()
    .then(users => {
        res.render("admin/user", {
            title: "Admin",
            users: users.models
        });
    });
};

exports.block = (req, res) => {
    User.where("id", req.params.userID).fetch()
    .then(user => {
        if (user === null) {
            req.flash("errors", {
                msg: "User not found."
            });
            res.redirect("back");
        }

        return user;
    })
    .then(user => {
        return user.save({
            is_blocked: 1
        });
    })
    .then((user) => {
        req.flash("success", {
            msg: `User ${user.get("email")} has been blocked.`
        });
        res.redirect("back");
    })
    .catch(err => {
        req.flash("errors", {
            msg: "An error occured."
        });
        res.redirect("back");
    });
};

exports.unblock = (req, res) => {
    User.where("id", req.params.userID).fetch()
    .then(user => {
        if (user === null) {
            req.flash("errors", {
                msg: "User not found."
            });
            res.redirect("back");
        }

        return user;
    })
    .then(user => {
        return user.save({
            is_blocked: 0
        });
    })
    .then((user) => {
        req.flash("success", {
            msg: `User ${user.get("email")} has been unblocked.`
        });
        res.redirect("back");
    })
    .catch(err => {
        req.flash("errors", {
            msg: "An error occured."
        });
        res.redirect("back");
    });
};

exports.update = (req, res) => {
    User.where("id", req.params.userID).fetch()
    .then(user => {
        if (user === null) {
            req.flash("errors", {
                msg: "User not found."
            });
            res.redirect("back");
        }

        return user;
    })
    .then((user) => {
        res.render("admin/user-update", {
            title: "Admin",
            user: user
        });
    })
    .catch(err => {
        req.flash("errors", {
            msg: "An error occured."
        });
        res.redirect("back");
    });
};

exports.updateProcess = (req, res) => {
    User.where("id", req.params.userID).fetch()
    .then(user => {
        if (user === null) {
            req.flash("errors", {
                msg: "User not found."
            });
            res.redirect("back");
        }

        return user;
    })
    .then(user => {
        return user.save({
            name: req.body.name
        });
    })
    .then((user) => {
        req.flash("success", {
            msg: `User ${user.get("email")} has been updated.`
        });
        res.redirect("/admin/users");
    })
    .catch(err => {
        req.flash("errors", {
            msg: "An error occured."
        });
        res.redirect("back");
    });
};
