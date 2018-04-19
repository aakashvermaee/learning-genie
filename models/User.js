const mongoose=require('mongoose');
var UserSchema = new mongoose.Schema({
    email :{
        required: true,
        type: String,
        required: true,
        minlength:1,
        unique: true,
        trim: true
    },
    token:{
        type:String,
        required:true
    },
    team :{
        required: true,
        type: String,
        required: true,
        minlength:1,
        trim: true
    }
}) 

var User=mongoose.model('Users',UserSchema);
module.exports={User}