var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    categoryName: {type: String, required: true},
  });

  module.exports = mongoose.model('category', Schema);