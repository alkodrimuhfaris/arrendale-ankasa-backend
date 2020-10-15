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

// IMPORT ROUTES
const authRouter = require('./src/routes/user')

app.use('/auth', authRouter)


app.listen(8080, () => {
    console.log('App Listening on port 8080')
  })