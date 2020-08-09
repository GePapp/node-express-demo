var express = require("express");
var router = express.Router();
var Comic = require("../models/comic");
var ObjectID = require("mongodb").ObjectID;

// csrf Protection
var csrf = require("csurf");
var csrfProtection = csrf();
router.use(csrfProtection);

// https://docs.mongodb.com/manual/reference/operator/aggregation/match/

router.route("/").get((req, res, next) => {
    // get limit (if is't set to a const value) & page parameters from url sended from pagination links prev & next and set type to Int (parseInt)
    if (!req.query.page) {
        var page = 1;
        page = parseInt(page);
    } else {
        var page = parseInt(req.query.page);
    }
    var aggregateQuery = Comic.aggregate();

    // ---- link line from shopNav is set  ----------
    if (req.query.line) {
        aggregateQuery.match({ line: req.query.line });
        Comic.aggregatePaginate(aggregateQuery, { page, limit: 4 }, function (
            err,
            docs
        ) {
            var docLength = docs.docs.length;
            // console.log(docLength);
            var docsShunks = [];
            var chunkSize = 2;
            for (var i = 0; i < docLength; i += chunkSize) {
                docsShunks.push(docs.docs.slice(i, i + chunkSize));
            }
            // delete docs.docs and replace it with docsShunks
            delete docs.docs;
            docs.docs = docsShunks;
            // console.log(docs);
            res.render("pages/shop", {
                layout: "shop",
                comics: docs,
                csrfToken: req.csrfToken(),
                line: req.query.line,
            });
        });
    }
    // ---- search input is set ( Form method is set to GET) ----------
    else if (req.query.search) {
        // empty search input
        if (req.query.search == "undefined" || req.query.search === null) {
            Comic.aggregatePaginate(
                aggregateQuery,
                { page, limit: 4 },
                function (err, docs) {
                    var docLength = docs.docs.length;
                    // console.log(docLength);
                    var docsShunks = [];
                    var chunkSize = 2;
                    for (var i = 0; i < docLength; i += chunkSize) {
                        docsShunks.push(docs.docs.slice(i, i + chunkSize));
                    }
                    // delete docs.docs and replace it with docsShunks
                    delete docs.docs;
                    docs.docs = docsShunks;
                    // console.log(docs);
                    res.render("pages/shop", {
                        layout: "shop",
                        comics: docs,
                        csrfToken: req.csrfToken(),
                    });
                }
            );
        }
        //  search input not empty
        else {
            console.log(req.query.search);
            aggregateQuery.match({
                $or: [
                    { title: { $regex: ".*" + req.query.search + ".*" } },
                    {
                        description: {
                            $regex: ".*" + req.query.search + ".*",
                        },
                    },
                    { line: { $regex: ".*" + req.query.search + ".*" } },
                ],
            });
            Comic.aggregatePaginate(
                aggregateQuery,
                { page, limit: 4 },
                function (err, docs) {
                    var docLength = docs.docs.length;
                    // console.log(docLength);
                    var docsShunks = [];
                    var chunkSize = 2;
                    for (var i = 0; i < docLength; i += chunkSize) {
                        docsShunks.push(docs.docs.slice(i, i + chunkSize));
                    }
                    // delete docs.docs and replace it with docsShunks
                    delete docs.docs;
                    docs.docs = docsShunks;
                    // console.log(docs);
                    res.render("pages/shop", {
                        layout: "shop",
                        comics: docs,
                        csrfToken: req.csrfToken(),
                        search: req.query.search,
                    });
                }
            );
        }
    }
    // ---- link select all from shopNav OR nothing is set  ----------
    else {
        Comic.aggregatePaginate(aggregateQuery, { page, limit: 4 }, function (
            err,
            docs
        ) {
            var docLength = docs.docs.length;
            // console.log(docLength);
            var docsShunks = [];
            var chunkSize = 2;
            for (var i = 0; i < docLength; i += chunkSize) {
                docsShunks.push(docs.docs.slice(i, i + chunkSize));
            }
            // delete docs.docs and replace it with docsShunks
            delete docs.docs;
            docs.docs = docsShunks;
            // console.log(docs);
            res.render("pages/shop", {
                layout: "shop",
                comics: docs,
                csrfToken: req.csrfToken(),
            });
        });
    }
});

// ----------  show comic  --------
router.route("/:id").get((req, res, next) => {
    console.log(req.query.page);
    console.log(req.params.id);
    Comic.findById(req.params.id, (err, doc) => {
        res.render("pages/shop-show", {
            layout: "shop",
            comic: doc,
            page: req.query.page,
            line: req.query.line,
            search: req.query.search,
        });
    });
});

module.exports = router;
