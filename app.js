var createError = require("http-errors");
var express = require("express");
var methodOverride = require("method-override");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var Handlebars = require("handlebars");
var exphbs = require("express-handlebars");
var {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
var session = require("express-session");
var flash = require("connect-flash");
var passport = require("passport");

var mongoose = require("mongoose");

// register routes.js files
var indexRouter = require("./routes/index");
var adminRouter = require("./routes/admin");
var linesRouter = require("./routes/lines");
var categoriesRouter = require("./routes/categories");
var comicsRouter = require("./routes/comics");
var usersRouter = require("./routes/users");
var dashboardRouter = require("./routes/dashboard");

// public pages
var shopRouter = require("./routes/shop");
var contactRouter = require("./routes/contact");

var app = express();

// include config/passport.js
require("./config/passport.js")(passport);

mongoose.connect("mongodb://localhost:27017/node-express-demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// view engine setup with Custom Helpers
var hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: "layout",
    extname: ".hbs",
    helpers: {
        // Custom Helper to handle select selected dynamicaly
        // https://gist.github.com/LukeChannings/6173ab951d8b1dc4602e
        select: function (value, options) {
            return options
                .fn(this)
                .split("\n")
                .map(function (v) {
                    var t = 'value="' + value + '"';
                    return !RegExp(t).test(v)
                        ? v
                        : v.replace(t, t + ' selected="selected"');
                })
                .join("\n");
        },
    },
});

app.engine(".hbs", hbs.engine);

// view engine setup without helpers
// app.engine('.hbs', exphbs({handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout: 'layout', extname: '.hbs'}));
app.set("view engine", ".hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// express-session middleware
app.use(
    session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true,
    })
);

// connect-flash middleware
app.use(flash());

// Global flash variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes middleware, path beginning with ...
app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/lines", linesRouter);
app.use("/categories", categoriesRouter);
app.use("/comics", comicsRouter);
app.use("/users", usersRouter);
app.use("/dashboard", dashboardRouter);

// public
app.use("/shop", shopRouter);
app.use("/contact", contactRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
