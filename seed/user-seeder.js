var User = require("../models/user");
var bcrypt = require("bcryptjs");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/node-express-demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// create hash password
var salt = bcrypt.genSaltSync(10);
var hashedPassword = bcrypt.hashSync("test", salt);
//console.log(hashedPassword);

/* 
Seeding a initial user to be able to use Admin area,
signup only for authenticated user accessible.

Seeding data:
start Mongo server, local:
(sudo mongod in linux)
open terminal in seed folder and type:
node user-seeder.js

Initial user credentials:
name = test
email = test@test.com
password = test 
*/

var user = new User({
    name: "test10",
    email: "test10@test.com",
    password: hashedPassword,
});

user.save(function (err, result) {
    mongoose.disconnect;
});
