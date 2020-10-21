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
const adminRouter = require('./src/routes/admin')
const airlinesRouter = require('./src/routes/airlines')
const exploreRouter = require('./src/routes/explore')
const bookingRouter = require('./src/routes/mybooking')
const paymentRouter = require('./src/routes/payment')
const flightRouter = require('./src/routes/flight')
const destinationListRouter = require('./src/routes/destinationList')
const faciliesRouter = require('./src/routes/facilities')
// const classFlightRouter = require('./src/routes/classFlight')
const transitRouter = require('./src/routes/transit')
const detailFlightRouter = require('./src/routes/detailFlight')
const resetPasswordRouter = require('./src/routes/forgotPassword')

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/airlines', airlinesRouter)
app.use('/explore', exploreRouter)
app.use('/mybook', bookingRouter)
app.use('/payment', paymentRouter)
app.use('/flight', flightRouter)
app.use('/flightdetails', detailFlightRouter)
app.use('/destination', destinationListRouter)
// app.use('/facilities', faciliesRouter)
// app.use('/class', classFlightRouter)
app.use('/transit', transitRouter)
app.use('/resetpassword', resetPasswordRouter)


app.listen(8000, () => {
    console.log('App Listening on port 8080')
  })
