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

// ADMIN ROUTES
const authAdmin = require('./src/routes/admin/auth')
const airlinesRouter = require('./src/routes/admin/airlines')
const flightRouter = require('./src/routes/admin/flight')
const manageCityRouter = require('./src/routes/admin/manageCity')
const facilityRouter = require('./src/routes/admin/facilities')
const transitRouter = require('./src/routes/admin/transit')
const topUpRouter = require('./src/routes/admin/topUp')



// USER ROUTES
const authUser = require('./src/routes/user/auth')
const bookingRouter = require('./src/routes/user/mybooking')
const recieptRouter = require('./src/routes/user/reciept')
const ticketRouter = require('./src/routes/user/ticket')
const paymentRouter = require('./src/routes/user/payment')
const resetPasswordRouter = require('./src/routes/user/forgotPassword')


// PUBLIC ROUTES
const exploreRouter = require('./src/routes/public/explore')
const searchTicketRouter = require('./src/routes/public/searchTicket')
// const cityRouter = require('./src/routes/public/city')


// const resetPasswordRouter = require('./src/routes/forgotPassword')

// ADMIN
app.use('/auth/admin', authAdmin)
app.use('/manage/airlines', airlinesRouter)
app.use('/manage/flight', flightRouter)
app.use('/manage/city', manageCityRouter)
app.use('/manage/facility', facilityRouter)
app.use('/manage/transit', transitRouter)
app.use('/manage/topup', topUpRouter)

// USER 
app.use('/auth/user', authUser)
app.use('/resetpassword', resetPasswordRouter)
app.use('/user/reciept', recieptRouter)
app.use('/user/ticket', ticketRouter)
app.use('/mybook', bookingRouter)
app.use('/payment', paymentRouter)


// PUBLIC
app.use('/explore', exploreRouter)
app.use('/searchticket', searchTicketRouter)
// app.use('city', cityRouter)


// app.use('/user', userRouter)
// app.use('/admin', adminRouter)
// app.use('/flightdetails', detailFlightRouter)
// app.use('/destination', destinationListRouter)
// // app.use('/class', classFlightRouter)
// app.use('/resetpassword', resetPasswordRouter)


// PUBLIC


app.listen(8000, () => {
    console.log('App Listening on port 8000')
  })
