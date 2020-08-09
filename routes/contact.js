var express = require("express");
var router = express.Router();
// use dotenv to hidde nodemailer transporters auth values
require("dotenv").config();
var nodemailer = require("nodemailer");

// csrf Protection
var csrf = require("csurf");
var csrfProtection = csrf();
router.use(csrfProtection);

router
    .route("/")
    .get((req, res, next) => {
        res.render("pages/contact", {
            layout: "layout",
            csrfToken: req.csrfToken(),
        });
    })

    .post((req, res, next) => {
        var { email, subject, message } = req.body;
        var errors = [];

        //  validation
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
        if (req.body.message == "") {
            errors.push({ msg: "Insert a Message" });
        }

        // errors, redirect back
        if (errors.length > 0) {
            res.render("pages/contact", {
                layout: "layout",
                csrfToken: req.csrfToken(),
                errors,
                email,
                subject,
                message,
            });
        }
        // no errors, send mail
        else {
            // create reusable transporter
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    // use dotenv .env variables
                    user: process.env.EMAIL, // generated ethereal user
                    pass: process.env.PASSWORD, // generated ethereal password
                },
            });

            // set mail options
            let mailOptions = {
                // should be replaced with real recipient's account
                from: email,
                to: "ufaethon@gmail.com",
                subject: subject,
                text: message,
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                } else {
                    req.flash("success_msg", "Mail was send Successfuly");
                    res.redirect("/contact?csrfToken=" + req.csrfToken());
                }
            });
        }
    });

module.exports = router;
