const Session = require("../../models/Session");
const Meta = require("../../models/Meta");

exports.index = (req, res) => {
    Session.query("orderBy", "id", "desc")
    .fetchAll({
        withRelated: ["user", "meta", "logs"]
    })
    .then(sessions => {
        res.render("admin/session", {
            title: "Sessions",
            sessions: sessions.models
        });
    });
};

exports.view = (req, res) => {
    Session.where({
        id: req.params.sessionID
    })
    .fetch({
        withRelated: ["user", "meta", "logs"]
    })
    .then(session => {
        res.render("admin/session-single", {
            title: "Sessions",
            session: session
        });
    });
};

exports.update = (req, res) => {
    Session.where("id", req.params.sessionID)
    .fetch({
        withRelated: ["user", "meta"]
    })
    .then(session => {
        if (session === null) {
            req.flash("errors", {
                msg: "Session not found."
            });
            res.redirect("back");
        }

        return session;
    })
    .then((session) => {
        res.render("admin/meta-update", {
            title: "Admin",
            meta: session.related("meta")
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
    Meta.where({
        id: req.params.sessionID
    })
    .fetch()
    .then(meta => {
        if (meta === null) {
            req.flash("errors", {
                msg: "Meta not found."
            });
            res.redirect("back");
        }

        return meta;
    })
    .then(meta => {
        return meta.save({
            name: req.body.name,
            sex: req.body.sex,
            age: req.body.age,
            location: req.body.location,
            address: req.body.address
        });
    })
    .then((meta) => {
        req.flash("success", {
            msg: `Meta number ${meta.get("id")} has been updated.`
        });
        res.redirect("back");
    })
    .catch(err => {
        console.log(err);
        req.flash("errors", {
            msg: "An error occured."
        });
        res.redirect("back");
    });
};

exports.delete = (req, res) => {
    Session.where("id", req.params.sessionID)
    .destroy()
    .then(() => {
        req.flash("success", {
            msg: `Session has been deleted.`
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
