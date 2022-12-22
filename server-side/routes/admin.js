const express = require('express')
const router = express.Router()
const adminController = require('../helpers/admin-controller')
const adminsignup = require('../models/adminLogin')

router.post('/adminsignup',adminController.signUp)

router.post('/login',adminController.adminLogin)

router.get('/users',adminController.viewUsers)

router.post('/block/:id',adminController.blockUser)

router.post('/unblock/:id',adminController.UnblockUser)

router.get('/viewposts',adminController.viewPost)

router.get('/reportdetails/:id',adminController.postReportDetails)

router.post('/reportpost/:id',adminController.reportPost)

router.post('/unreportpost/:id',adminController.unReportPost)

router.post('/verify/:id',adminController.verify)

module.exports=router