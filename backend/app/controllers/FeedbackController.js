const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');

const mailer = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

exports.getFeedback = (req, res) => {
    res.render('feedback', {
        title: 'Feedback'
    });
};

/**
 * POST /feedback
 * Send a feedback form via Nodemailer.
 */
exports.postFeedback = (req, res) => {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('message', 'Message cannot be blank').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/feedback');
    }

    const mailOptions = {
        to: process.env.ADMIN_EMAIL,
        from: `${req.body.name} <${req.body.email}>`,
        subject: "Feedback | AlsAID",
        text: req.body.message
    };

    mailer.sendMail(mailOptions, (err) => {
        if (err) {
            req.flash("errors", { msg: err.message });
            return res.redirect("/feedback");
        }
        req.flash("success", { msg: "Feedback has been sent successfully!" });
        res.redirect("/feedback");
    });
};
