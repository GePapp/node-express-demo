var Line = require('../models/line');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/node-express-demo', {useNewUrlParser: true, useUnifiedTopology: true});

var lines = [
    new Line({
        lineName: 'Ten Ten'
    }),
    new Line({
        lineName: 'Asterix'
    }),
    new Line({
        lineName: 'Lucky Luke'
    })
];

var done = 0;
for (var i = 0; i < lines.length; i++) {
    lines[i].save(function(err, result){
        done++
        if (done === lines.length) {
            exit()
        }
    });    
}

function exit(){
    mongoose.disconnect;
}