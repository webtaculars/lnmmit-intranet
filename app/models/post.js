var mongoose = require('mongoose');

module.exports = mongoose.model('Post', {
    name: String,
    phone: String,
    service: String,
    sendTo: String,
    address: String
});