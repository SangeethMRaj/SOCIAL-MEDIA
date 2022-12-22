const mongoose = require('mongoose')


const createFollowers = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
    },
    following:{
        type:Array
    },
    followers:{
        type:Array,
        ref:'user'
    }
})

module.exports=mongoose.model('follower',createFollowers)