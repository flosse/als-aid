const Session = require("../../models/Session");
const Meta = require("../../models/Meta");
const Logger = require("../../../app").Logger;

exports.index = (req, res) => {
    Session.where({
        user_id: req.user.get("id")
    })
    .fetchAll({
        withRelated: ["meta", "logs"]
    })
    .then(sessions => {
        return res.status(200).json({
            sessions: sessions
        });
    })
    .catch(err => {
        Logger.logException(err);
        return res.status(500);
    });
};


exports.create = (req, res) => {
    Meta.create({

    })
    .then(meta => {
        return Session.create({
            user_id: req.user.get("id"),
            meta_id: meta.get("id")
        });
    })
    .then(session => {
        return res.status(201).json({
            id: session.get("id")
        });
    })
    .catch(err => {
        Logger.logException(err);
        return res.status(500);
    });
};
