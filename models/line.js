var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    lineName: {type: String, required: true},
  });

  module.exports = mongoose.model('line', Schema);