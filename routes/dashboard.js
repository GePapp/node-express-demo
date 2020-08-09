var express = require("express");
var router = express.Router();

// passport
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// PATH PREFIX with /dashboard/.... by app.js middleware: app.use('/user', dashboardRouter)

router.route("/").get(ensureAuthenticated, (req, res, next) => {
    res.render("dashboard/dashboard", {
        layout: "admin",
    });
});

module.exports = router;
