const getFromDB = require('../helpers/promiseToDB')

const table = 'flight'
let query = ''

module.exports = {
  getFlightByDetail: async (flight_id) => {
    query =  `SELECT *
              FROM flight_detail
              LEFT JOIN (
                SELECT 	
                  flight.id as flight_id,
                  name as airlines_name,
                  logo as airlines_logo,
                  flight_code,
                  origin,
                  departure_date,
                  departure_time,
                  destination,
                  arrived_date,
                  arrived_time,
                  airlines.id as airlines_id
                FROM flight
                LEFT JOIN airlines
                ON flight.airlines_id = airlines.id
              ) as flight
              ON flight_detail.flight_id = flight.flight_id
              LEFT JOIN (
                SELECT 
                  flight_id, 
                  max(case when facility_name = 'Luggage' then true END) 'luggage',
                  max(case when facility_name = 'In-Flight Meal' then true END) 'in_flight_meal',
                  max(case when facility_name = 'Wi-Fi' then true END) 'wifi'
                from facilities
                group by flight_id
              ) as facilites
              ON flight_detail.flight_id = facilites.flight_id
              WHERE flight_detail.id = ?`
    return await getFromDB(query, flight_id)
  },
  updateFlightSeat: async (data) => {
    query = `UPDATE flight_detail
            SET seat_count = ?
            WHERE id = ?`
    return await getFromDB(query, data)
  },
  getSeatCount: async (data) => {
    query = `SELECT seat_count
            FROM flight_detail
            WHERE id = ?`
    return await getFromDB(query, data)
  }
}
  