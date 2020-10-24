require('dotenv').config()
const express = require('express')
const app = express()
const {v4:uuidv4} = require('uuid')

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
const flightDetailRouter = require('./src/routes/admin/detailFlight')
const manageCityRouter = require('./src/routes/admin/manageCity')
const facilityRouter = require('./src/routes/admin/facilities')
const transitRouter = require('./src/routes/admin/transit')
const topUpRouter = require('./src/routes/admin/topUp')
const manageUserRouter = require('./src/routes/admin/manageUser')



// USER ROUTES
const authUser = require('./src/routes/user/auth')
const bookingRouter = require('./src/routes/user/mybooking')
const recieptRouter = require('./src/routes/user/reciept')
const ticketRouter = require('./src/routes/user/ticket')
const paymentRouter = require('./src/routes/user/payment')
const resetPasswordRouter = require('./src/routes/user/forgotPassword')
const searchTicketRouter = require('./src/routes/public/searchTicket')
const userRouter = require('./src/routes/user/user')


// PUBLIC ROUTES
const exploreRouter = require('./src/routes/public/explore')
const cityRouter = require('./src/routes/public/city')


// const resetPasswordRouter = require('./src/routes/forgotPassword')

// ADMIN
app.use('/auth/admin', authAdmin)
app.use('/manage/airlines', airlinesRouter)
app.use('/manage/flight', flightRouter)
app.use('/manage/city', manageCityRouter)
app.use('/manage/facility', facilityRouter)
app.use('/manage/transit', transitRouter)
app.use('/manage/topup', topUpRouter)
app.use('/manage/user', manageUserRouter)
app.use('/manage/flight/detail', flightDetailRouter)

// USER 
app.use('/auth/user', authUser)
app.use('/resetpassword', resetPasswordRouter)
app.use('/user/reciept', recieptRouter)
app.use('/user/ticket', ticketRouter)
app.use('/mybook', bookingRouter)
app.use('/payment', paymentRouter)
app.use('/user', userRouter)


// PUBLIC
app.use('/explore', exploreRouter)
app.use('/searchticket', searchTicketRouter)
app.use('/city', cityRouter)

app.use('/uploads', express.static('./assets/uploads'))
app.use('/public', express.static('./assets/public'))


// app.use('/user', userRouter)
// app.use('/admin', adminRouter)
// app.use('/flightdetails', detailFlightRouter)
// app.use('/destination', destinationListRouter)
// // app.use('/class', classFlightRouter)
// app.use('/resetpassword', resetPasswordRouter)




app.listen(8000, () => {
    console.log('App Listening on port 8000')
  })
