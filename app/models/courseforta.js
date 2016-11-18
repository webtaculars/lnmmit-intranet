

var mongoose = require('mongoose');

module.exports = mongoose.model('Courseforta', {
    title:  {required: true, type: String},
    type: {type:String, required: true},
    pgTa : {type:String, required: true},
    ugTa : {type:String, required: true},
    description : {type:String, required: true},
    teacherId : {type:String, required: true}
});