const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../helpers/response')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))