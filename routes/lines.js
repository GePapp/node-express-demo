var express = require("express");
var router = express.Router();
var Line = require("../models/line");
var ObjectID = require("mongodb").ObjectID;

// passport
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// csrf Protection
var csrf = require("csurf");
var csrfProtection = csrf();
router.use(csrfProtection);

// PATH PREFIX with /lines/.... by app.js middleware: app.use('/lines', linesRouter)

// ---------- show lines --------------

router.route("/").get(ensureAuthenticated, (req, res, next) => {
    Line.find(function (err, docs) {
        res.render("line/lines", {
            layout: "admin",
            lines: docs,
            csrfToken: req.csrfToken(),
        });
    });
});

// --------- add form and insert execution -------------

router
    .route("/add")
    .get(ensureAuthenticated, (req, res, next) => {
        res.render("line/line-add", {
            layout: "admin",
            csrfToken: req.csrfToken(),
        });
    })
    .post(ensureAuthenticated, (req, res) => {
        var errors = [];
        if (req.body.lineName == "") {
            errors.push({ msg: "Insert a Line" });
            res.render("line/line-add", {
                layout: "admin",
                csrfToken: req.csrfToken(),
                errors,
            });
        } else {
            // console.log(req.body.lineName)
            var line = new Line();
            line.lineName = req.body.lineName;
            line.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    res.redirect("/lines");
                }
            });
        }
    });

// ---------- update form and update execution -------------------

router
    .route("/:id")
    .get(ensureAuthenticated, (req, res) => {
        Line.findById(req.params.id, function (err, doc) {
            console.log(req.params.id);
            res.render("line/line-update", {
                layout: "admin",
                line: doc,
                csrfToken: req.csrfToken(),
            });
        });
    })
    .post(ensureAuthenticated, (req, res, next) => {
        var errors = [];
        if (req.body.lineName == "") {
            errors.push({ msg: "Insert a Line" });
            Line.findById(req.params.id, function (err, doc) {
                console.log(req.params.id);
                res.render("line/line-update", {
                    layout: "admin",
                    line: doc,
                    csrfToken: req.csrfToken(),
                    errors,
                });
            });
        } else {
            var line = {};
            line.lineName = req.body.lineName;

            Line.updateOne(
                { _id: ObjectID(req.params.id) },
                { $set: line },
                (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.redirect("/lines");
                    }
                }
            );
        }
    })

    // ------------ delete ----------------

    .delete(ensureAuthenticated, (req, res, next) => {
        console.log(req.params.id);
        Line.deleteOne({ _id: ObjectID(req.params.id) }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/lines");
        });
    });

module.exports = router;
