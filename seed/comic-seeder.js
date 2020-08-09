var Comic = require('../models/comic');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/node-express-demo', {useNewUrlParser: true, useUnifiedTopology: true});

var comics = [
    new Comic({
        imagePath: '',
        title: '',
        description: '',
        category: '',
        line: '',
        price: ''
    }),
    new Comic({
        imagePath: '',
        title: '',
        description: '',
        category: '',
        line: '',
        price: ''
    }),
    new Comic({
        imagePath: '',
        title: '',
        description: '',
        category: '',
        line: '',
        price: ''
    })
];

var done = 0;
for (var i = 0; i < comics.length; i++) {
    comics[i].save(function(err, result){
        done++
        if (done === comics.length) {
            exit()
        }
    });    
}

function exit(){
    mongoose.disconnect;
}