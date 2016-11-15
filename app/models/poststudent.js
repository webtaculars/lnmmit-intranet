

var mongoose = require('mongoose');

module.exports = mongoose.model('Poststudent', {
    rollNo:  {required: true, type: String},
    name: String,
    email : String
});