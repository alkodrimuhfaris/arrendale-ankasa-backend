const responseStandard = require('../../helpers/responseStandard')
const joi = require('joi')

const topUp = require('../../models/admin/topUp')
const userModel = require('../../models/user/user')

module.exports= {
  topUpBalance: async (req, res) => {
    //ganti jadi req.user nanti
    let {id:user_id, role_id} = req.user
    console.log(role_id)
    if(role_id !== 1){return responseStandard(res, 'Access Forbidden!', {}, 500, false)}
    
    const schemaPayment = joi.object({
      nominal: joi.number().required(),
      email: joi.string().email().required()
    })
    let { value: data, err } = schemaPayment.validate(req.body)
    console.log(data)
    if (err) {return responseStandard(res, err.message, {error: error.message}, 400, false)}
    let {nominal, email} = data
    console.log(nominal)
    try{
      let result = await userModel.getDetailProfile({email})
      if(!result.length) {return responseStandard(res, 'Email is invalid!', {}, 400, false)}
      let [{id,balance}] = result
      balance = balance + nominal
      
      let makeTopUp = await topUp.topUpBalance(balance, id)

      if (makeTopUp.affectedRows) {
        return responseStandard(res, 'Top Up succesfull!', {balance})
      } else {
        return responseStandard(res, 'Top Up failed!', {}, 400, false)
      }
    }catch(err){
      console.log(err)
      return responseStandard(res, 'Internal Server Error', {}, 500, false)
    }
  }
}