var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoticeSchema =new Schema({
    date: {type:String, required: true},
    title: {type:String, required: true},
    postedBy: {type: String, ref: 'User'},
    attention: {type: String, required: true},
    link: {type: String, required: true},

});


module.exports = mongoose.model('Notice',NoticeSchema);