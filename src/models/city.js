const getFromDB = require('../helpers/promiseToDB')

let query = ''

module.exports = {
  getCityCountry: async (city_id) => {
    query = `SELECT country_code, city_name
            FROM city
            WHERE id = ?`
    return await getFromDB(query, city_id)
  },
  getCityPopularDestination: async (limiter, from=Date.today().add(-30), to=Date.today()) => {
    from = from.toISOString().slice(0, 19).replace('T', ' ')
    to = to.toISOString().slice(0, 19).replace('T', ' ')
    query = `SELECT *
            FROM city
            LEFT JOIN (
              SELECT 	city_id, sum(destination_counter) as destination_counter, sum(origin_counter) as origin_counter
              FROM (
                  SELECT *
                  FROM city_activity
                  WHERE created_at BETWEEN ${from} AND ${to}
              ) AS city_activity_filter
              GROUP BY city_id
            ) as city_activity
            ON city.id = city_activity.city_id  
            ORDER BY city_activity.destination_counter  DESC
            ${limiter}`
    return await getFromDB(query)
  },
  addCityActivity: async (quantity) => {
    query = `INSERT INTO city_activity
            SET ? `
    return await getFromDB(query, quantity)
  },
  createCity: async (data=[]) => {
    query = `INSERT INTO city
            (city_name, country_code, city_picture, rating)`
    return await getFromDB(query, data)
  },
  updateCity: async (data={}) => {
    query = `UPDATE city SET ?`
    return await getFromDB(quert, data)
  }
}