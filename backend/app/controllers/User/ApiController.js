const Log = require("../../models/Log");
const Session = require("../../models/Session");
const Meta = require("../../models/Meta");
const moment = require("moment");
const Logger = require("../../../app").Logger;
const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');

const mailer = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

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

exports.sendAsEmail = (req, res) => {
    Session.where({
        id: req.body.id
    })
    .fetch({
        withRelated: ["user", "meta", "logs"]
    })
    .then(session => {
        const mailOptions = {
            to: session.related("user").get("email") + "," + "mail@markus-kohlhase.de" + "," + process.env.ADMIN_EMAIL,
            from: `${session.related("user").get("email")} <${session.related("user").get("email")}>`,
            subject: `Log Session ${session.get("id")} | AlsAID`,
            html:
            `<html><body>
                <h3>User Information</h3>
                <p>Email: ${session.related("user").get("email")}</p>

                <h3>Meta Information</h3>
                <p>Name: ${session.related("meta").get("name")}</p>
                <p>Sex: ${session.related("meta").get("sex")}</p>
                <p>Age: ${session.related("meta").get("age")}</p>
                <p>Location: ${session.related("meta").get("location")}</p>
                <p>Address: ${session.related("meta").get("address")}</p>

                <h3>Logs (${session.related("logs").length})</h3>
                <ul>
                ${session.related("logs").map(log => "<li>" + log.get("message") + "</li>").join("")}
                </ul>
            </body></html>`
        };

        mailer.sendMail(mailOptions, (err) => {
            if (err) {
                Logger.logException(err);
                return res.status(500);
            }

            return res.status(200).json({
                id: session.get("id")
            });
        });
    })
    .catch(err => {
        Logger.logException(err);
        return res.status(500);
    });
};

exports.logCreate = (req, res) => {
    Log.create({
        message: req.body.message,
        date: moment(req.body.timestamp).format("YYYY-MM-DD HH:mm:ss"),
        session_id: req.body.id
    })
    .then(log => {
        return res.status(201).json({
            id: log.get("id")
        });
    })
    .catch(err => {
        Logger.logException(err);
        return res.status(500);
    });
};

exports.logUpdate = (req, res) => {
    Log.findOne({ id: req.body.id })
    .then(log => {
        return log.save({
            message: req.body.message
        });
    })
    .then(log => {
        return res.status(201).json({
            id: log.get("id")
        });
    })
    .catch(err => {
        Logger.logException(err);
        return res.status(500);
    });
};

exports.sessionCreate = (req, res) => {
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

exports.metaUpdate = (req, res) => {
    Meta.findOne({ id: req.body.id })
    .then(meta => {
        return meta.save({
            address: req.body.address,
            age: req.body.age,
            location: req.body.location,
            name: req.body.name,
            sex: req.body.sex
        });
    })
    .then(meta => {
        return res.status(201).json({
            id: meta.get("id")
        });
    })
    .catch(err => {
        Logger.logException(err);
        return res.status(500);
    });
};
