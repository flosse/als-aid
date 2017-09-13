const Log = require("../../models/Log");

exports.index = (req, res) => {
    Log.query("orderBy", "id", "desc")
    .fetchAll({
        withRelated: ["session", "session.user", "session.meta"]
    })
    .then(logs => {
        res.render("admin/log", {
            title: "Admin",
            logs: logs.models
        });
    });
};

exports.update = (req, res) => {
    Log.where("id", req.params.logID).fetch()
    .then(log => {
        if (log === null) {
            req.flash("errors", {
                msg: "Log not found."
            });
            res.redirect("back");
        }

        return log;
    })
    .then((log) => {
        res.render("admin/log-update", {
            title: "Admin",
            log: log
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
    Log.where("id", req.params.logID).fetch()
    .then(log => {
        if (log === null) {
            req.flash("errors", {
                msg: "Log not found."
            });
            res.redirect("back");
        }

        return log;
    })
    .then(log => {
        return log.save({
            message: req.body.message
        });
    })
    .then((log) => {
        req.flash("success", {
            msg: `Log number ${log.get("id")} has been updated.`
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

exports.delete = (req, res) => {
    Log.where("id", req.params.logID)
    .destroy()
    .then(() => {
        req.flash("success", {
            msg: `Log number ${req.params.logID} has been deleted.`
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
