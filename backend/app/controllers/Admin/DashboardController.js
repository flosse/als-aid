const User = require("../../models/User");
const Log = require("../../models/Log");

exports.index = (req, res) => {
    Log.query().countDistinct("session_id as uniqueEntries")
    .then(response => {
        res.render("admin/dashboard", {
            title: "Dashboard",
            uniqueEntries: response[0].uniqueEntries
        });
    });
};
