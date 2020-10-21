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
const airlinesRouter = require('./src/routes/airlines')
const exploreRouter = require('./src/routes/explore')
const bookingRouter = require('./src/routes/mybooking')
const paymentRouter = require('./src/routes/payment')


app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/airlines', airlinesRouter)
app.use('/explore', exploreRouter)
app.use('/mybook', bookingRouter)
app.use('/payment', paymentRouter)

app.listen(8080, () => {
    console.log('App Listening on port 8080')
  })

