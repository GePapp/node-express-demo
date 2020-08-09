var Category = require("../models/category");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/node-express-demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var categories = [
    new Category({
        categoryName: "Classic",
    }),
    new Category({
        categoryName: "Manga",
    }),
    new Category({
        categoryName: "Fiction",
    }),
];

var done = 0;
for (var i = 0; i < categories.length; i++) {
    categories[i].save(function (err, result) {
        done++;
        if (done === categories.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect;
}
