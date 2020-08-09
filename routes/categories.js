var express = require("express");
var router = express.Router();
var Category = require("../models/category");
var ObjectID = require("mongodb").ObjectID;

// passport
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// csrf Protection
var csrf = require("csurf");
var csrfProtection = csrf();
router.use(csrfProtection);

// PATH PREFIX with /categories/.... by app.js middleware: app.use('/categories', categoriesRouter)

// ------- show lines -------------

router.route("/").get(ensureAuthenticated, (req, res, next) => {
    Category.find(function (err, docs) {
        res.render("category/categories", {
            layout: "admin",
            categories: docs,
            csrfToken: req.csrfToken(),
        });
    });
});

// ------- add form and insert execution ------------

router
    .route("/add")
    .get(ensureAuthenticated, (req, res, next) => {
        res.render("category/category-add", {
            layout: "admin",
            csrfToken: req.csrfToken(),
        });
    })
    .post(ensureAuthenticated, (req, res) => {
        var errors = [];
        if (req.body.categoryName == "") {
            errors.push({ msg: "Insert a Category" });
            res.render("category/category-add", {
                layout: "admin",
                csrfToken: req.csrfToken(),
                errors,
            });
        } else {
            // console.log(req.body.lineName)
            var category = new Category();
            category.categoryName = req.body.categoryName;
            category.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    res.redirect("/categories");
                }
            });
        }
    });

// ------- update form and update executtion ------------

router
    .route("/:id")
    .get(ensureAuthenticated, (req, res) => {
        Category.findById(req.params.id, function (err, doc) {
            console.log(req.params.id);
            res.render("category/category-update", {
                layout: "admin",
                csrfToken: req.csrfToken(),
                category: doc,
            });
        });
    })
    .post(ensureAuthenticated, (req, res, next) => {
        var errors = [];
        if (req.body.categoryName == "") {
            errors.push({ msg: "Insert a Category" });
            Category.findById(req.params.id, function (err, doc) {
                console.log(req.params.id);
                res.render("category/category-update", {
                    layout: "admin",
                    csrfToken: req.csrfToken(),
                    category: doc,
                    errors,
                });
            });
        } else {
            var category = {};
            category.categoryName = req.body.categoryName;

            Category.updateOne(
                { _id: ObjectID(req.params.id) },
                { $set: category },
                (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.redirect("/categories");
                    }
                }
            );
        }
    })

    // ---------- delete ------------

    .delete(ensureAuthenticated, (req, res, next) => {
        // console.log(req.params.id);
        Category.deleteOne({ _id: ObjectID(req.params.id) }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/categories");
        });
    });

module.exports = router;
