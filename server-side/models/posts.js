const mongoose = require('mongoose')

const createPost = new mongoose.Schema({
    caption:{
        type:String,
        required:true
    },
    Images:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'user'
    },
    likes:{
        type:Array
    },
    report:{
        type:Array
    },
    reportStatus:{
        type:Boolean,
        default:true
    }
},  
{timestamps:true}
)

module.exports=mongoose.model('post',createPost)