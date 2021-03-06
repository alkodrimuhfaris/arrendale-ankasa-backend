const getFromDB = require('../../helpers/promiseToDB')

let query = ''

module.exports = {
  createCP: async  (cpData) => {
    query = `INSERT INTO contact_person SET ?`
    return await getFromDB(query, cpData)
  },
  createPassanger: async (passangerData) => {
    query = `INSERT INTO passangers SET ?`
    return await getFromDB(query, passangerData)
  },
  getCPbyId: async (cpId) => {
    query = `SELECT * FROM contact_person WHERE id = ?`
    return await getFromDB(query, cpId)
  },
  getPassangerbyId: async (passangerId) => {
    query = `SELECT * FROM passangers WHERE id = ?`
    return await getFromDB(query, passangerId)
  }
}