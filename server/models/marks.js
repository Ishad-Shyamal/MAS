const mongoose = require('mongoose');
const markSchema = new mongoose.Schema({
    pname:{
        type:String,
        required:true
    },
    ptype:{
        type:String,
        required:true
    },
    marks:{
        type:Number,
        required:true
    }
},{timestamps:true});
const Marksmodel = mongoose.model('marks',markSchema)
module.exports = Marksmodel