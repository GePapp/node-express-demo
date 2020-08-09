var mongoose = require('mongoose');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

var Schema = new mongoose.Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    line: {type: String, required: true},
    price: {type: Number, required: true}
  });

  Schema.plugin(aggregatePaginate);

  module.exports = mongoose.model('comic', Schema);