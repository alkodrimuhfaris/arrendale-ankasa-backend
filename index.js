<<<<<<< HEAD
require('dotenv').config()
const express = require('express')

const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')

// module middleware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cors());
app.use(bodyParser.json())

app.use('/uploads', express.static('assets/uploads/public'))

// IMPORT ROUTES
const authRouter = require('./src/routes/auth')
const userRouter = require('./src/routes/user')


app.use('/auth', authRouter)
app.use('/user', userRouter)

app.listen(8080, () => {
    console.log('App Listening on port 8080')
=======
require('dotenv').config()
const express = require('express')

const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')

// module middleware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cors());
app.use(bodyParser.json())

app.use('/uploads', express.static('assets/uploads/public'))

// IMPORT ROUTES
const authRouter = require('./src/routes/auth')
const userRouter = require('./src/routes/user')


app.use('/auth', authRouter)
app.use('/user', userRouter)

app.listen(8080, () => {
    console.log('App Listening on port 8080')
>>>>>>> 9165feeb50354381da006e2ff4f6ade3ebbe85b5
  })