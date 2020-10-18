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
const flightRouter = require('./src/routes/flight')
const detailFlightRouter = require('./src/routes/flightDetail')
const destinationListRouter = require('./src/routes/destinationList')
const faciliesRouter = require('./src/routes/facilities')


app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/airlines', airlinesRouter)
app.use('/flight', flightRouter)
app.use('/flightdetails', detailFlightRouter)
app.use('/destination', destinationListRouter)
app.use('/facilities', faciliesRouter)

app.listen(8080, () => {
    console.log('App Listening on port 8080')
  })