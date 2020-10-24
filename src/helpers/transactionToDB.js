const db = require('./db')
const getFromDB = require('./promiseForTransaction')


module.exports = async (res, arr, requires='create') => {
  return new Promise ((resolve, reject) => {
    db.beginTransaction(async function(err) {
      if (err) return reject(err)
      if  (!arr.length) {
        let err={message: 'Array is empty!'}
        return reject(err)
      }
      let result = []
      let setResult = {}
      for await (let [i, el] of arr) {
        try {
          (i>0) && el[1].map(value => {
            value.push(result[0].insertId)
            return value
          })
          setResult = await getFromDB(el[0], el[1])
          result.push(setResult)
        }
        catch (err) {
         return reject(err)
       }
      }
      db.commit(function(err) {
        if (err) {
          reject(err)
          return db.rollback(function() {
          })
        } resolve(result)
      })
    })
  })
}