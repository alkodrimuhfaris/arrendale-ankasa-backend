const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../helpers/responseStandard')
const pagination = require('../helpers/pagination')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const recieptModel = require('../models/reciept')

module.exports = {
  getAllTransaction: async (req, res) => {
    const path = 'reciept'
    const {id:user_id} = req.user
    if(!user_id) {return responseStandard(res, 'Forbidden Acces!', {}, 403, false)}
    try {
      const {page,limit,limiter} = pagination.pagePrep(req.query)
      const result = await recieptModel.getAllTransaction({user_id},limiter)
      const [{count}] = await recieptModel.getAllTransactionCount({user_id}) || 0
      if (result.length) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of all transaction of user with id '+user_id, {result, pageInfo})
      }
      else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no item in the list')
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message, {}, 500, false)
    }
  },
  getTransactionById: async (req, res) => {
    const {id:user_id} = req.user
    let {id:reciept_id} = req.params
    reciept_id = Number(reciept_id)
    const path = 'reciept/'+reciept_id
    if(!user_id) {return responseStandard(res, 'Forbidden Acces!', {}, 403, false)}
    try {
      const reciept = await recieptModel.getTransactionById(user_id,reciept_id)
      const {page,limit,limiter} = pagination.pagePrep(req.query)
      const result = await recieptModel.getDetailTransaction(reciept_id,limiter)
      const [{count}] = await recieptModel.getAllTransactionCount(reciept_id) || 0
      if (result) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of all transaction of user with id '+user_id, {reciept, result, pageInfo})
      }
      else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no item in the list')
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message, {}, 500, false)
    }
  }
}