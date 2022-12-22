const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
    {
    conversationId:{
        type:mongoose.Types.ObjectId
    },
    senderId:{
        type:mongoose.Types.ObjectId
    },
    text:{
        type:String
    }
 },
{timestamps:true}
);

module.exports=mongoose.model('message',messageSchema)