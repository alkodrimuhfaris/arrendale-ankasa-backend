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
<<<<<<< HEAD
const exploreRouter = require('./src/routes/explore')
const bookingRouter = require('./src/routes/mybooking')
const paymentRouter = require('./src/routes/payment')
=======
const flightRouter = require('./src/routes/flight')
const detailFlightRouter = require('./src/routes/flightDetail')
const destinationListRouter = require('./src/routes/destinationList')
const faciliesRouter = require('./src/routes/facilities')
>>>>>>> e1518b1693d2da1044efcd87e372f5e22c69d392


app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/airlines', airlinesRouter)
<<<<<<< HEAD
app.use('/explore', exploreRouter)
app.use('/mybook', bookingRouter)
app.use('/payment', paymentRouter)
=======
app.use('/flight', flightRouter)
app.use('/flightdetails', detailFlightRouter)
app.use('/destination', destinationListRouter)
app.use('/facilities', faciliesRouter)
>>>>>>> e1518b1693d2da1044efcd87e372f5e22c69d392

app.listen(8080, () => {
    console.log('App Listening on port 8080')
  })

