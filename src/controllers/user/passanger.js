const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../../helpers/responseStandard')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const cpAndPassangerModel = require('../../models/user/cpAndPassanger')

module.exports= {
  getPassangerById: async (req, res) => {
    //ganti jadi req.user nanti
    let {id:user_id} = req.query
    let {passangerId} = req.query
    passangerId = Number(passangerId)
    try{
      if(!user_id){return responseStandard(res, 'Access Forbidden!', {}, 500, false)}
      let passangerData = await cpAndPassangerModel.getPassangerbyId(passangerId)
      if (passangerData.length) {
        [passangerData] = passangerData
        return responseStandard(res, 'Get passanger Successfully', {passanger: passangerData}, 500, false)
      } else {
        return responseStandard(res, 'There is no item in the list', {}, 400, false)
      }
    }catch(err){
      return responseStandard(res, 'Internal Server Error', {}, 500, false)
    }
  }
}