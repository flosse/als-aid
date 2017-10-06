const Log = require("../../models/Log");
const User = require("../../models/User");
const i18n = require('node-translate');

exports.index = (req, res) => {

    i18n.requireLocales({
        'en-gb': require('../../locales/en-gb'),
        'de': require('../../locales/de')
    });

    User.findOne({ id: req.user.get("id") })
    .catch((err) => next(err))
    .then((user) => {
        let language = user.get('language');
        console.log(user);
        if (language === 'en') {
            i18n.setLocale('en-gb');
        } else {
            i18n.setLocale('de');
        }
        renderLogs();

    });

    let renderLogs = function() {
    Log.query("orderBy", "id", "desc")
    .fetchAll({
        withRelated: ["session", "session.user", "session.meta"]
    })
    .then(logs => {
        console.log('wow logs are here!')
        let modelsArray = logs.models;
        let modifiedArray = modelsArray.map( (element) => {
            let message = element.get('message');
            let isDouble = message.indexOf('|') !== -1;
            let firstMessage = '';
            let secondMessage = '';
            if(!isDouble) {
                element.set('message', i18n.t(message) );
                return element;
            } else {
                let result = message.split("|");
                firstMessage = i18n.t(result[0]);
                secondMessage = i18n.t(result[1]);
                element.set('message', firstMessage+' '+secondMessage );
                return element;
            }

        });
        res.render("admin/log", {
            title: "Admin",
            logs: modifiedArray
        });
    });
  }

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
