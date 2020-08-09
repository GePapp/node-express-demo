var express = require("express");
var router = express.Router();
var User = require("../models/user");
var ObjectID = require("mongodb").ObjectID;
var bcrypt = require("bcryptjs");
var passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

var csrf = require("csurf");
var csrfProtection = csrf();
router.use(csrfProtection);

// PATH PREFIX with /users/.... by app.js middleware: app.use('/user', usersRouter)

// -------  show users ---------

router.route("/").get(ensureAuthenticated, (req, res, next) => {
    User.find(function (err, docs) {
        res.render("user/users", {
            layout: "admin",
            users: docs,
            csrfToken: req.csrfToken(),
        });
    });
});

// ------- signin form and execution ---------
router
    .route("/signin")
    .get((req, res, next) => {
        res.render("user/signin", {
            layout: "auth",
            csrfToken: req.csrfToken(),
        });
    })
    .post((req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/dashboard",
            failureRedirect: "/users/signin",
        })(req, res, next);
    });

// ---------- signup form and insert execution -----------
router
    .route("/signup")
    .get(ensureAuthenticated, (req, res, next) => {
        res.render("user/signup", {
            layout: "admin",
            csrfToken: req.csrfToken(),
        });
    })
    .post(ensureAuthenticated, (req, res) => {
        // save form values to reuse if validation don't match
        var { name, email, password } = req.body;
        var errors = [];
        //  validation
        if (req.body.name == "") {
            errors.push({ msg: "Insert a Name" });
        }
        if (req.body.email == "") {
            errors.push({ msg: "Insert a Email" });
        }
        if (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                req.body.email
            ) === false
        ) {
            errors.push({ msg: "Wrong Email Format" });
        }
        if (req.body.password == "") {
            errors.push({ msg: "Insert a Password" });
        }
        if (req.body.password !== req.body.confirm) {
            errors.push({ msg: "Password confirmation dont match" });
        }

        if (errors.length > 0) {
            // console.log(errors)
            res.render("user/signup", {
                layout: "admin",
                csrfToken: req.csrfToken(),
                errors,
                name,
                email,
                password,
            });
        } else {
            // check if user exists
            User.findOne({ email: email })
                //user exists
                .then((user) => {
                    if (user) {
                        errors.push({ msg: "User Exists" });
                        res.render("user/signup", {
                            layout: "admin",
                            csrfToken: req.csrfToken(),
                            errors,
                            name,
                            email,
                            password,
                        });
                    } else {
                        var user = new User();
                        var salt = bcrypt.genSaltSync(10);
                        var hashedPassword = bcrypt.hashSync(password, salt);
                        // or simply   var hashedPassword = bcrypt.hashSync(req.body.password, 10);
                        // console.log(hashedPassword);

                        (user.name = name),
                            (user.email = email),
                            (user.password = hashedPassword);
                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                req.flash(
                                    "success_msg",
                                    "You are now registered and can log in"
                                );
                                res.redirect(
                                    "/users/signin?csrfToken=" + req.csrfToken()
                                );
                            }
                        });
                    }
                });
        }
    });

// ------- delete --------

router.route("/:id").delete(ensureAuthenticated, (req, res, next) => {
    console.log(req.params.id);
    User.deleteOne({ _id: ObjectID(req.params.id) }, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/users");
    });
});

// --------  Logout ---------------

router.get("/logout", (req, res) => {
    req.logout();
    // req.flash('success_msg', 'You are logged out');
    res.redirect("/users/signin");
});

module.exports = router;
