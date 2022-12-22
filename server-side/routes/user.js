const express = require('express')
const router = express.Router()
const userController = require('../helpers/user-controller')
const signUp = require('../models/userSignUp')
const verifyJWT = require('../helpers/verify-token')
const upload = require('../helpers/multer-controller')
const conversation = require('../models/Conversation')
const message = require('../models/Message')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const createpost = require('../models/posts')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

router.post('/signup',userController.doSignup)

router.get('/isUserAuth', verifyJWT , userController.userAuth)

router.post('/login',userController.doLogin)

router.post('/forgotpassword',userController.forgotPassword)

router.post('/otp',userController.verifyOtp)

router.post('/addpost',verifyJWT,upload.single('Images'),userController.addPost)

router.post('/addprofilepic',verifyJWT,upload.single('Images'),userController.addProfilePicture)

router.get('/viewpost',verifyJWT,userController.viewPost)

router.get('/viewprofilepost/:id',verifyJWT,userController.viewProfilePosts)

router.get('/viewprofiledetails/:id',verifyJWT,userController.viewProfileDetails)

router.post('/editprofile/:id',verifyJWT,userController.updateProfile)

router.get('/searchuser/:id',verifyJWT,userController.searchUser)

router.post('/follow',verifyJWT,userController.follow) 

router.get('/statusfollow/:userId/:friendId',verifyJWT,userController.checkFollowUser)

router.get('/followingcount/:id',verifyJWT,userController.followingCount)

router.get('/postcount/:id',verifyJWT,userController.postCount)
 
router.post('/likepost',verifyJWT,userController.likePost)
 
router.get('/showlike/:id',userController.showLikes)

router.get('/followerslist/:id',verifyJWT,userController.followers)

router.get('/followinglist/:id',verifyJWT,userController.following)
    
router.get('/viewallfollowing/:id',verifyJWT,userController.viewAllFollowing)

router.get('/postdetails/:id',verifyJWT,userController.postDetails)

router.post('/comment',verifyJWT,userController.doComment)

router.get('/getcomment/:id',verifyJWT,userController.getComment) 

router.post('/deletecomment',verifyJWT,userController.deleteComment)

router.post('/conversation',verifyJWT,userController.doConversation)

router.get('/conversation/:id',verifyJWT,userController.checkUser)

router.post('/message',verifyJWT,userController.doMessage)

router.get('/message/:id',verifyJWT,userController.takeMessages)

router.get('/chatusers/:id',verifyJWT,userController.chatUsers)

router.post('/editcaption/:id',verifyJWT,userController.updateCaption)

router.delete('/deletepost/:id',verifyJWT,userController.deletePost)

router.post('/report/:id',verifyJWT,userController.reportPost)

router.post('/applyverification',verifyJWT,userController.applyVerfication)

module.exports = router                              