const mongoose = require('mongoose')

const doComment = new mongoose.Schema({
    postId:{
        type:mongoose.Types.ObjectId,
    },
    comment:[{
        time:{
            type:Date,
            default:new Date()
        },
        userId:{
            type:mongoose.Types.ObjectId
        },
        comment:{
            type:String
        }
    }],
    
},
{timestamps:true}
)

module.exports=mongoose.model('comment',doComment)