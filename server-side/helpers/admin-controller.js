const { response } = require('express')
const mongoose = require('mongoose')
// const { resolve } = require('path')
const adminlogin = require('../models/adminLogin')
const users = require('../models/userSignUp')
const posts = require('../models/posts')
const { post } = require('../routes/user')
const ObjectId = mongoose.Types.ObjectId


module.exports={
    signUp:(req,res)=>{
        const adminlogin = new adminsignup({
            username:req.body.username,
            password:req.body.password
        })
        adminlogin.save()
        .then(data=>{
            res.json(data)
        }).catch(err=>{
            res.json(err)
        })
    },
    adminLogin:async(req,res)=>{
        const Username = req.body.username
        const Password = req.body.password
        const admin = await adminlogin.findOne({username:Username})
        console.log(admin);
        if(admin){
            if(admin.password == Password){
                response.status=true
                res.json({msg:"login"})
            }else{
                response.status=false
                res.json({msg:"Invalid password"})
            }
        }else{
            response.status=false
            res.json({msg:"Invalid password"})
        }
        
    },
    viewUsers:async(req,res)=>{
            const userList = await users.find()
            if(userList){
                res.json(userList)
            }
    },
    blockUser:async(req,res)=>{
        const userId = req.params
        await users.findByIdAndUpdate({_id:ObjectId(userId)},{userStatus:false})
           
    },
    UnblockUser:async(req,res)=>{           
        const userId = req.params
        await users.findByIdAndUpdate({_id:ObjectId(userId)},{userStatus:true})
           
    },
    viewPost:async(req,res)=>{
        try{
        const viewpost = await posts.aggregate([
            {
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as:'userId'
                }
            },
            {
                $lookup:{
                    from:'comments',
                    localField:'_id',
                    foreignField:'postId',
                    as:'comment'
                } 
            },
            {
                $unwind:'$userId'
            },
            {
                $sort:{createdAt:-1}
            },
            {
                $project:{
                    caption:1,
                    Images:1,
                    userId:1, 
                    reportCount:{$size:'$report'},             
                    report:1 ,     
                    reportStatus:1
                }        
            }
        ])
        res.json(viewpost)               
    }catch(err){
       
    }  
},
postReportDetails:async(req,res)=>{
    console.log(req.params.id,'lllll');
    const postId = req.params.id
    try{
        const reportDetails = await posts.aggregate([
            {
                $match:{
                    _id:ObjectId(postId)
                }
            },
            {
                $unwind:'$report'
            },
            {
                $lookup:{
                    from:'users',
                    localField:'report.userId',
                    foreignField:'_id',
                    as:'reportDetails'
                }
            },
            {
                $unwind:'$reportDetails'      
            }

        ])
        res.status(200).json(reportDetails)
    }catch(err){
        res.status(500).json(err)
    }
},
reportPost:async(req,res)=>{
    try{
        const postId = req.params.id  
        await posts.findByIdAndUpdate({_id:ObjectId(postId)},{reportStatus:false})
        res.status(200).json({msg:"reported"})
    }catch(err){
        res.status(500).json(err)
    }

},
unReportPost:async(req,res)=>{
    try{
        const postId = req.params.id  
        await posts.findByIdAndUpdate({_id:ObjectId(postId)},{reportStatus:true})
        res.status(200).json({msg:"unreported"})
    }catch(err){
        res.status(500).json(err)
    }

},
verify:async(req,res)=>{
    try{
        const userId = req.params.id
        await users.findByIdAndUpdate({_id:ObjectId(userId)},{verification:true})
        res.status(200).json({msg:"unreported"})
    }catch(err){
        res.status(500).json(err)
    }
}
}