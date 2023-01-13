const mongoose = require('mongoose')
const { response } = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const signUp = require('../models/userSignUp')
const post = require('../models/posts')
const followersList= require('../models/followers');
const { find } = require('../models/userSignUp');
const ObjectId = mongoose.Types.ObjectId
const commentModal = require('../models/comment');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message')
const nodemailer = require('nodemailer')
const userHelper = require('../helpers/user-helper')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'xplore245@gmail.com', // generated ethereal user
        pass: 'fhgttmmruocmawzl', // generated ethereal password
    },
});

let otp
let Email

module.exports = {
    doSignup: async(req, res) => {
        try{
            console.log('success');
            const Email = req.body.email
            const sameEmail = await signUp.findOne({ email: Email })
            if (sameEmail) {
                res.status(200).json({msg:"User exist"})
            } else {
                req.body.password = await bcrypt.hash(req.body.password, 10)
                const signUpUser = new signUp({
                    username: req.body.username,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: req.body.password,
                    confirmpassword: req.body.password
                })
                signUpUser.save()
                .then(data => {
                })
                res.status(200).json({msg:"No user exist"})
            }
        }catch(err){
            res.status(500).json(err)
        }

    },
    userAuth:(req,res)=>{
        res.json({auth:true})
    },
    doLogin: async(req, res) => {
        try{

            const Email = req.body.email
            const Password = req.body.password
            const user = await signUp.findOne({ email: Email })
            if (user) {
                if (user.userStatus) {
                    bcrypt.compare(Password, user.password).then((result) => {
                        if (result) {
                            const id=user.id
                            const name=user.username
                            const profilePic = user.Images
                            const token = jwt.sign({id,name,profilePic}, "jwtSecret", {
                                expiresIn: '3d',
                            })
                            res.json({auth: true, token: token, user: user});        
                            
                        } else {
                            res.status(200).json({auth: false, message: "Wrong username password"}); 
                        }
                    })
                }else{
                    res.status(200).json({auth: false, message: "The user is blocked"});
                }
            } else {
                res.status(200).json({auth: false, message: "no user exists"});
            }
        }catch(err){
            res.status(500).json(err)
        }
    },
    
    forgotPassword: async(req, res) => {
        console.log('forgot');
        try{

            Email = req.body.email
           const user = await signUp.findOne({ email: Email })
           if (user) {
               res.status(200).json({msg:"ChangePassword"})
               // const newpassword = await bcrypt.hash(req.body.password, 10)
               // await signUp.updateOne({ email: Email }, { $set: { password: newpassword } })
                otp = userHelper.OTPgenerator()
               userHelper.sentOTPverificationmail(Email, otp)
               
           } else {
               res.status(200).json({msg:"noUserExist"})
           }
        }catch(err){
            res.status(500).json(err)
        }
    },
    verifyOtp:async(req,res)=>{
        try{
            const otpCheck=req.body.otp
            const Password = req.body.password
            if(otpCheck===otp){
               const user= await signUp.findOne({email:Email})
               if(user){
                const newpassword = await bcrypt.hash(req.body.password, 10)
                await signUp.updateOne({ email: Email }, { $set: { password: newpassword } })
                res.status(200).json({msg:"otp verified"})
               }else{
                res.status(200).json({msg:"Invalid email"})
               }
            }else{
                res.status(200).json({msg:"incorrect otp"})
            }

        }catch(err){
            res.status(500).json(err)
        }
    },
    
    addPost:async(req,res)=>{
        try{
            const userId=ObjectId(req.body.user)
                const addpost = new post({
                    caption: req.body.caption,
                    Images: req.file.filename,
                    userId:userId
                })
                await addpost.save()
                res.status(200).json({msg:'post added'})

        }catch(err){
            res.status(500).json(err)
        }
    },
    addProfilePicture:async(req,res)=>{
        try{
            const userId = req.body.user
            await signUp.findByIdAndUpdate({_id:userId},
                {
                    $set:{
                        Images:req.file.filename
                    }   
                }
                )
                res.status(200).json({msg:'changed profile pic'})

        }catch(err){
            res.status(500).json(err)
        }     
        const userId = ObjectId(req.body.user)

    },
    viewPost:async(req,res)=>{
        try{
            const viewpost = await post.aggregate([
                {
                    $match:{reportStatus:true}
                },
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
                        likesCount:{$size:'$likes'},
                        likes:1,
                        comment:1
                    }
                }
            ])
            res.json(viewpost)   

        }catch(err){
            res.json(err)
        }
        
    },
    viewProfilePosts:async(req,res)=>{
        try{

            const userId = req.params
            const profilePosts = await post.find({userId:ObjectId(userId)}).sort({createdAt:-1})
            res.status(200).json(profilePosts)
        }catch(err){
            res.status(500).json(err)
        }
    },
    viewProfileDetails:async(req,res)=>{
        try{
            const userId = req.params
            const profileDetails= await signUp.find({_id:ObjectId(userId)})
            res.status(200).json(profileDetails)

        }catch(err){
            res.status(500).json(err)
        }
        
    },
    updateProfile:async(req,res)=>{
        try{
            const userId = req.params
            const email= await signUp.findOne({email:req.body.email})
            const username = await signUp.findOne({username:req.body.username})

            if(email && username){

                await signUp.findByIdAndUpdate({_id:ObjectId(userId)},{
                    $set:{
                        phone:req.body.phone,
                        career:req.body.career,
                        bio:req.body.bio
                    }
                })
                res.status(200).json({msg:'updated'})
            }else{
                await signUp.findByIdAndUpdate({_id:ObjectId(userId)},{
                    $set:{
                        username:req.body.username,
                        email:req.body.email,
                        phone:req.body.phone,
                        career:req.body.career,
                        bio:req.body.bio
                    }
                })
                res.status(200).json({msg:'email updated'})
            }

        }catch(err){
            res.status(500).json(err)
        }
    },
    searchUser:async(req,res)=>{
        try{
            const id = req.params.id
            let result = await signUp.find({
                "$or":[
                    {
                        username:{$regex:id}
                    }
                ]
            })
            res.status(200).json(result)

        }catch(err){
            res.status(500).json(err)
        }
    },
    follow:async(req,res)=>{
        try{
            const {userId,friendId} = req.body
            const user = await followersList.findOne({userId:ObjectId(userId)})
            if(user){
              let result =  user.following.some((el)=>{
                    return el==friendId
                })
 
            if(result){
                await followersList.updateOne({userId:ObjectId(userId)},
                {

                    $pull:{following:ObjectId(friendId)}
                }
                )

                await followersList.updateOne({userId:ObjectId(friendId)},    
                {

                    $pull:{followers:ObjectId(userId)}
                }
                )
                // response.status=false
                res.json({msg:"Follow"})
            }else{

                const friendProfile = await followersList.findOne({userId:(friendId)})
                if(friendProfile){
                    await followersList.updateOne({userId:ObjectId(userId)},
                    {
                        $push:{following:ObjectId(friendId)}
                    }
                    )
    
                    await followersList.updateOne({userId:ObjectId(friendId)},
                    {
                        $push:{followers:ObjectId(userId)}
                    }
                    )
                }else{
                    await followersList.updateOne({userId:ObjectId(userId)},
                    {
                        $push:{following:ObjectId(friendId)}
                    }
                    )
                    
                    const followinglist = new followersList({
                        userId:ObjectId(friendId),
                        followers:[ObjectId(userId)]
                    })
                    followinglist.save()
                }
                // response.status=true
                res.json({msg:"Following"})
               
            }
            }else{
                const friend = await followersList.findOne({userId:ObjectId(friendId)})
                if(friend){
                    const followinglist = new followersList({
                        userId:ObjectId(userId),
                        following:[ObjectId(friendId)]
                    })
                    followinglist.save()

                    await followersList.updateOne({userId:ObjectId(friendId)},
                    {
                        $push:{followers:ObjectId(userId)}
                    }
                    )        
                }else{
                
               
                const followinglist = new followersList({
                    userId:ObjectId(userId),
                    following:[ObjectId(friendId)]
                })
                followinglist.save()

                const followerslist = new followersList({
                    userId:ObjectId(friendId),
                    followers:[ObjectId(userId)]
                })    
                followerslist.save()
                }
                // response.status=true
                res.status(200).json({msg:"Following"})
       
            }

        }catch(err){
            res.status(500).json(err)
        }
        
    },
    checkFollowUser:async(req,res)=>{
        try{
            const userId = req.params.userId
            friendId =req.params.friendId
            const user = await followersList.findOne({userId:ObjectId(userId)})
            if(user){
                let result =  user.following.some((el)=>{
                    return el==friendId
                })

                if(result){
                    res.json({msg:"Following"})
                }else{
                    res.json({msg:"Follow"})
                }
            }

        }catch(err){
            res.status(500).json(err)
        }
        
    },
    followingCount:async(req,res)=>{
        try{
            const userId = req.params
            const user = await followersList.findOne({userId:ObjectId(userId)})
              if(user){
  
                  const following = user.following.length
                  const followers = user.followers.length
                  const count = {following,followers}
                  res.status(200).json({count})
              } 

        }catch(err){
            res.status(500).json(err)
        }
    },
    postCount:async(req,res)=>{
        try{
            const userId = req.params
            const count = await  post.find({userId:ObjectId(userId)}).count()
            res.status(200).json({count})

        }catch(err){
            res.status(500).json(err)
        }
        
    },
    likePost:async(req,res)=>{
        try{
            const {userId,postId} = req.body
            const postImage = await post.findOne({_id:ObjectId(postId)})
            if(postImage){
                const likeExist = await post.findOne({'likes':{$exists:true, $ne: null}})
                if(likeExist){
                    let result =  postImage.likes.some((el)=>{
                        return el==userId
                    })
                    if(result){
                        await post.updateOne({_id:ObjectId(postId)},{
                            $pull:{likes:ObjectId(userId)}
                        })
                        // response.status=false
                        res.status(200).json({msg:'unlike'})
                    }else{
                        await post.updateOne({_id:ObjectId(postId)},{
                            $push:{likes:ObjectId(userId)}
                        })
                        // response.status=true
                        res.status(200).json({msg:'like'})
                    }
                }else{
                    await post.findByIdAndUpdate({_id:ObjectId(postId)},{
                        $set:{
                            likes:[ObjectId(userId)]
                        }
                    })
                    // response.status=true
                    res.status(200).json({msg:'like'})
                }
            }     

        }catch(err){
            res.status(500).json(err)
        }
    },
    showLikes:async(req,res)=>{
        try{

            const userId = req.params
            const displayPosts = await post.find({likes:{$in:ObjectId(userId)}})
            res.status(200).json(displayPosts)
        }catch(err){
            res.status(500).json(err)
        }
    },
    followers:async(req,res)=>{
        try{
            const userid = req.params
            const followerList = await followersList.aggregate([
                {
                    $match:{userId:ObjectId(userid)}
                },
                {
                    $lookup:{
                        from: 'users',
                        localField:'followers',
                        foreignField: '_id',
                        as:'list'
                    }
                },
                {
                    $unwind:'$list'
                },
                {
                    $project:{
                        list: 1
                    }
                }
            ])
            res.status(200).json(followerList)

        }catch(err){
            res.status(500).json(err)
        }
    },
    following:async(req,res)=>{
        try{
            const userid = req.params
            const followingList = await followersList.aggregate([
                {
                    $match:{userId:ObjectId(userid)}
                },
                {
                    $lookup:{
                        from: 'users',
                        localField:'following',
                        foreignField: '_id',
                        as:'list'
                    }
                },
                {
                    $unwind:'$list'
                },
                {
                    $project:{
                        list: 1
                    }
                }
                
            ])
            res.status(200).json(followingList)

        }catch(err){
            res.status(500).json(err)
        }
    },
    
    viewAllFollowing:async(req,res)=>{   
        try{
            const userId = req.params
            const following = await followersList.findOne({userId:ObjectId(userId)})
            res.status(200).json(following)
        }catch(err){
            res.status(500).json(err)
        }       

    },
    postDetails:async(req,res)=>{
        try{
            const postId = req.params
            const postDetail = await post.findOne({_id:ObjectId(postId)})
            res.send(postDetail)
        }catch(err){
            res.status(500).json(err)
        }

    },
    doComment:async(req,res)=>{
        const userid = req.body.userId 
        const postid = req.body.postId
        const comments = req.body.comment.comment
        const post = await commentModal.findOne({postId:postid})
        if(post){
            try{
                const commentDetails = {
                    comment:comments,
                    userId:ObjectId(userid)
                }
                await commentModal.updateOne({postId:ObjectId(postid)},
                {
                    $push:{comment:commentDetails}
                }
                )
                res.json({msg:"success"})
                
            }catch(err){
                res.status(500).json(err)
            }
        }else{
            try{
                const commentDetails = {
                    comment:comments,
                    userId:ObjectId(userid)
                }
                const commentSave = new commentModal({
                    postId:ObjectId(postid),
                    comment:[commentDetails]
                })
                commentSave.save()
                res.json({msg:"success"})
            }catch(err){
                res.status(500).json(err)
            }
        }

    },
    getComment:async(req,res)=>{
        try{
            const postid = req.params
            const getcomment = await commentModal.aggregate([
                {
                    $match:{postId:ObjectId(postid)}
                },
                {
                    $unwind:'$comment'
                },
                {
                    $lookup:{
                        from:'users',
                        localField:'comment.userId',
                        foreignField:'_id',
                        as:'commentList'
                    }   
                },
                {
                    $unwind:'$commentList'
                },
                {
                    $project:{
                        commentList:1,
                        comment:1,
    
                    }
                },
                {
                    $sort:{'comment.time':-1}
                }              
            ])
            console.log(getcomment);
            res.status(200).json(getcomment)

        }catch(err){
            res.status(500).json(err)
        }
    },
    deleteComment:async(req,res)=>{
        try{
            const commentId = req.body.commentId
            const postId = req.body.postId
            console.log(commentId,postId);
            await commentModal.findOneAndUpdate({postId:ObjectId(postId)},
            {
                $pull:{comment:{_id:ObjectId(commentId)}}
            })
            res.status(200).json({msg:"deleted"})
        }catch(err){
            res.status(500).json(err)
        }

    },

    doConversation:async(req,res)=>{        
        // const userid = req.body.userId
        // const friendid = req.body.friendId
        const conversation = await Conversation.findOne({ members: { $all: [ObjectId(req.body.userId), ObjectId(req.body.friendId)] } })
        console.log(conversation,'same friend');
        if(conversation === null){
            const newConversation = new Conversation({
                members:[ObjectId(req.body.userId),ObjectId(req.body.friendId)]
            })
            try{
                const savedConversation = await newConversation.save()
                res.status(200).json(savedConversation);
            }catch(err){
                res.status(500).json(err)       
            }
        }else{
            console.log('receiver exist');
            res.status(200).json({msg:"receiver exist"})
        }

    },
    checkUser:async(req,res)=>{
        try{
            const conversation = await Conversation.find({
                members:{ $in:[(ObjectId(req.params))]}
            })
            res.status(200).json(conversation)
        }catch(err){
            res.status(500).json(err)
        }
    },
    doMessage:async(req,res)=>{
        const newMessage = Message(req.body)
        try{
            const savedMessage = await newMessage.save()
            res.status(200).json(savedMessage)
        }catch(err){
            res.status(500).json(err)
        }
    },
    takeMessages:async(req,res)=>{
        try{
            const messages = await Message.find({
                conversationId:ObjectId(req.params)
            })
            res.status(200).json(messages)
        }catch(err){
            res.status(500).json(err)
        }
    },
    chatUsers:async(req,res)=>{    
        try{
            const Id = req.params
            const friendId = await signUp.findOne({_id:ObjectId(Id)})
            res.status(200).json(friendId)
        }catch(err){
            res.status(500).json(err)
        }

    },
    updateCaption:async(req,res)=>{
        const postId = req.params.id
        const captions = req.body.caption
        try{
            await post.findByIdAndUpdate({_id:ObjectId(postId)},{
                $set:{
                    caption:captions
                }
            })
            res.status(200).json({msg:"updated caption"})
        }catch(err){
            res.status(500).json(err)
        }
    },
    deletePost:async(req,res)=>{
        const postId = req.params
        try{
            await post.findByIdAndDelete(ObjectId(postId))
            res.status(200).json({msg:"deleted post"})
        }catch(err){
            res.status(500).json(err)
        }
    },
    reportPost:async(req,res)=>{
        const {reportPostId,userId} = req.body
        const condition = req.params.id
        console.log(reportPostId,userId,condition);
        try{

            const Post = await post.findOne({_id:ObjectId(reportPostId)})
            if(Post){
                const reportPost = {
                    userId:ObjectId(userId),
                    condition:condition
                }
                await post.findByIdAndUpdate({_id:ObjectId(reportPostId)},
                {
                    $push:{report:reportPost}
                }
                )
                res.json({msg:"reported"})
            }
        }catch(err){
            res.status(500).json(err)                   
        }     
    },
    applyVerfication:async(req,res)=>{
        try{ 
            console.log(req.userId);
        const userId = req.userId
            await signUp.findByIdAndUpdate({_id:ObjectId(userId)},{applyVerification:true})
            res.status(200).json({msg:"applied"}) 
        }catch(err){
            res.status(500).json(err)
        }

    }
  
}

