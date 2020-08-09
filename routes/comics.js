var express = require("express");
var router = express.Router();
var Line = require("../models/line");
var Category = require("../models/category");
var Comic = require("../models/comic");
var ObjectID = require("mongodb").ObjectID;
var fs = require("fs");

// passport
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// csrf Protection
var csrf = require("csurf");
var csrfProtection = csrf();
router.use(csrfProtection);

// multer
var multer = require("multer");
// var path = require('path');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/pages");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

var fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpe" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/gif"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
    fileFilter: fileFilter,
});

// end multer

// PATH PREFIX with /comics/.... by app.js middleware: app.use('/comics', comicRouter)

// ------ show comics -------------

router.route("/").get(ensureAuthenticated, (req, res, next) => {
    // get limit (if is't set to a const value) & page parameters from url sended from pagination links prev & next and set type to Int (parseInt)
    if (!req.query.page) {
        var page = 1;
        page = parseInt(page);
    } else {
        var page = parseInt(req.query.page);
    }
    // var limit = parseInt(req.query.limit)
    // set a const value to limit

    var aggregateQuery = Comic.aggregate();

    Comic.aggregatePaginate(
        aggregateQuery,
        { page: page, limit: 2 },
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(result);
                res.render("comic/comics", {
                    layout: "admin",
                    comics: result,
                    csrfToken: req.csrfToken(),
                });
            }
        }
    );
});

// ------- add form and add execution ----------
router
    .route("/add")
    .get(ensureAuthenticated, (req, res, next) => {
        Category.find((err, categories) => {
            Line.find((err, lines) => {
                // console.log(categories)
                // console.log(lines)

                res.render("comic/comic-add", {
                    layout: "admin",
                    csrfToken: req.csrfToken(),
                    categories: categories,
                    lines: lines,
                });
            });
        });
    })
    .post(ensureAuthenticated, upload.single("imagePath"), (req, res) => {
        // save form values to reuse if validation don't match
        var { title, description, category, line, price } = req.body;
        // NOTE:  you can't set a file input value, safety reasons
        var errors = [];
        // validation
        if (
            req.body.title == "" ||
            req.body.description == "" ||
            !req.file ||
            !req.body.category ||
            !req.body.line ||
            req.body.price == ""
        ) {
            // first delete uloaded image
            // console.log(req.file));
            if (req.file) {
                fs.unlink(
                    "./public/images/pages/" + req.file.filename,
                    (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    }
                );
            }
            if (req.body.title == "") {
                errors.push({ msg: "Title is required" });
            }
            if (req.body.description == "") {
                errors.push({ msg: "Description is required" });
            }
            if (!req.file) {
                errors.push({ msg: "Choose a Image" });
            }
            if (!req.body.category) {
                errors.push({ msg: "Category is required" });
            }
            if (!req.body.line) {
                errors.push({ msg: "Line is required" });
            }
            if (req.body.price == "") {
                errors.push({ msg: "Price is required" });
            }

            Category.find((err, categories) => {
                Line.find((err, lines) => {
                    // console.log(categories)
                    // console.log(lines)

                    res.render("comic/comic-add", {
                        layout: "admin",
                        errors,
                        title,
                        description,
                        category,
                        line,
                        price,
                        categories: categories,
                        lines: lines,
                        csrfToken: req.csrfToken(),
                    });
                });
            });

            //console.log(errors);
        }

        // execute
        else {
            // console.log(req.body.lineName)
            var comic = new Comic();
            // console.log(req.file);
            comic.imagePath = req.file.filename;
            comic.title = req.body.title;
            comic.description = req.body.description;
            comic.category = req.body.category;
            comic.line = req.body.line;
            comic.price = req.body.price;
            // console.log(comic);
            comic.save((err) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    res.redirect("/comics");
                }
            });
        }
    });

// ------ update form and update execution ----------

router
    .route("/:id")
    .get(ensureAuthenticated, (req, res) => {
        Comic.findById(req.params.id, (err, doc) => {
            Category.find((err, categories) => {
                Line.find((err, lines) => {
                    res.render("comic/comic-update", {
                        layout: "admin",
                        csrfToken: req.csrfToken(),
                        comic: doc,
                        categories: categories,
                        lines: lines,
                    });
                });
            });
        });
    })
    .post(ensureAuthenticated, upload.single("imagePath"), (req, res) => {
        var errors = [];
        // validation
        if (
            req.body.title == "" ||
            req.body.description == "" ||
            req.body.price == ""
        ) {
            if (req.body.title == "") {
                errors.push({ msg: "Title is required" });
            }
            if (req.body.description == "") {
                errors.push({ msg: "Description is required" });
            }
            if (req.body.price == "") {
                errors.push({ msg: "Price is required" });
            }

            Comic.findById(req.params.id, (err, doc) => {
                Category.find((err, categories) => {
                    Line.find((err, lines) => {
                        res.render("comic/comic-update", {
                            layout: "admin",
                            csrfToken: req.csrfToken(),
                            comic: doc,
                            categories: categories,
                            lines: lines,
                            errors,
                        });
                    });
                });
            });
        } else {
            // execute update
            var comic = {};
            // if image was changed
            if (req.file) {
                comic.imagePath = req.file.filename;
                comic.title = req.body.title;
                comic.description = req.body.description;
                comic.category = req.body.category;
                comic.line = req.body.line;
                comic.price = req.body.price;
                var oldImagePath = req.body.oldImagePath;
                // console.log(oldImagePath);
                // delete old image
                fs.unlink("./public/images/pages/" + oldImagePath, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });

                // if image was't changed
            } else {
                comic.title = req.body.title;
                comic.description = req.body.description;
                comic.category = req.body.category;
                comic.line = req.body.line;
                comic.price = req.body.price;
            }
            // console.log(comic);
            Comic.updateOne(
                { _id: ObjectID(req.params.id) },
                { $set: comic },
                (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.redirect("/comics");
                    }
                }
            );
        }
    })

    // ------- delete comic ------------

    .delete(ensureAuthenticated, (req, res, next) => {
        // first find image and delete image
        Comic.findById(req.params.id, (err, doc) => {
            var image = doc.imagePath;
            fs.unlink("./public/images/pages/" + image, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            Comic.deleteOne({ _id: ObjectID(req.params.id) }, (err) => {
                if (err) {
                    console.log(err);
                }
                res.redirect("/comics");
            });
        });
    });

module.exports = router;
