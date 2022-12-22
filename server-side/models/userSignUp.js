const mongoose = require('mongoose')

const signUp = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    career:{
        type:String
    },
    bio:{
        type:String
    },
    userStatus:{
        type:Boolean,
        default:true
    },
    following:{
        type:mongoose.Types.ObjectId
    },
    followers:{
        type:mongoose.Types.ObjectId
    },
    Images:{
        type:String
    },
    applyVerification:{
        type:Boolean,
        default:false
    },
    verification:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('user',signUp)

