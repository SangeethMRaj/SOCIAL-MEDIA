const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/user')
const adminRoute = require('./routes/admin')
const cors = require('cors')
const jwt = require('jsonwebtoken')


app.use(express.json())
app.use(cors())

dotenv.config()

mongoose.connect(process.env.DATABASE_ACCESS,()=>console.log('Database is connected'))

app.use('/images',express.static('public/images'))

app.use('/api',userRouter)
app.use('/api/admin',adminRoute)

app.listen(4000,()=>console.log("server is connected"))