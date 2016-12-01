

var mongoose = require('mongoose');

module.exports = mongoose.model('applicationforta', {
    name:  {required: true, type: String},
    rollNo: {type:String, required: true},
    courseId: {type:String, required: true},
    status : {type:Number, required: true},
    ugOrPg : {type:String, required: true},
    cpi : {type:String, required: true},
    grade : {type:String, required: true},
    teacherId: {type: String, required: true}
});