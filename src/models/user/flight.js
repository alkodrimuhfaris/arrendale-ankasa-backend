const table = 'flight'
const getFromDB = require('../../helpers/promiseToDB')
let query = ''

module.exports = {
    getCity: async (cityId, tables='city') => {
        query = `SELECT *
                FROM ${tables}
                WHERE id = ?`
        return await getFromDB(query, cityId)
      },
      getFlightSearch: async (data, tables = 'flight') => {
        let {origin, 
          destination,
          departure_date,
          limiter,
          className,
          departTmeArr=[null,null,null,null],
          arrivedTimeArr=[null,null,null,null],
          facilites = {},
          airlines = [],
          lowestPrice = 0,
          highestPrice = 1000000,
          transit = []
       } = data
      
        let betweenTime = ['00:00:00',
                          '06:00:00',
                          '12:00:00',
                          '18:00:00',
                          '24:00:00']
        
        let departBetween = [...Array(4)].map((item,i) => {
          return item = ` departure_time BETWEEN ${betweenTime[i]} AND ${betweenTime[i+1]} `
        }).filter((_item, i) => i === departTmeArr[i] )
        departBetween = departBetween.length ? ` AND ( ${departBetween.join(' OR ')} ) ` : ' '
    
        let arrivedBetween = [...Array(4)].map((item,i) => {
          return item = `arrived_time BETWEEN ${betweenTime[i]} AND ${betweenTime[i+1]}`
        }).filter((_item, i) => i === arrivedTimeArr[i] )
        arrivedBetween = arrivedBetween.length ? ` AND ( ${arrivedBetween.join(' OR ')} ) ` : ' '
    
        let facilitiesArr = Object.keys(facilites).length ? Object.keys(facilites).map(i => {return i=' ? '}).join(' AND ') : ' '
    
        facilites = Object.keys(facilities).length ? ` AND (${facilitiesArr}) ` : ' '
    
        airlines = airlines.length ? ` AND (${airlines.map(i => {return i = ` airlines_id = ${i} `}).join(' OR ')} ) ` : ' '
    
        transit = transit.length ? ` AND (${transit.map(i => i = i>1 ? ` transit > ${i} ` : ` transit = ${i} ` ).join(' OR ')}) ` : ' '
    
        query = `SELECT *
                FROM (
                  SELECT id, airlines_id, origin, date(departure_time) as departure_date, time(departure_time) as departure_time, destination, date(arrived_time) as arrived_date, time(arrived_time) as arrived_time
                  FROM ${tables}
                ) as ${tables}
                LEFT JOIN (
                  SELECT flight_id, class, seat_count, price
                  FROM flight_detail               
                ) AS flight_detail
                ON ${tables}.id = flight_detail.flight_id
                LEFT JOIN (
                  select 
                    flight_id, 
                    max(case when facility_name = 'Luggage' then true end) 'luggage',
                    max(case when facility_name = 'In-Flight Meal' then true end) 'inFlightMeal',
                    max(case when facility_name = 'Wi-Fi' then true end) 'wiFi'
                  FROM facilities
                  group by flight_id
                ) AS facilities
                ON ${tables}.id = facilities.flight_id
                LEFT JOIN (
                  SELECT
                    flight_id, count(flight_id) as transitNumber
                  FROM transit
                  GROUP BY flight_id
                ) AS transit
                ON ${tables}.id = transit.flight_id
                WHERE (
                  origin = ?
                  OR destination = ?
                  OR departure_date = ? )
                AND class = ?
                AND (price between ${lowestPrice} AND ${highestPrice})
                ${facilities}
                ${airlines}
                ${departBetween}
                ${arrivedBetween}
                ${transit}
                ${limiter}
                `
        return await getFromDB(query, [origin, destination, departure_date, className])
      },
      getFlightCount: async (data, tables='flight') => {
        let {origin, 
          destination,
          departure_date,
          limiter,
          className,
          departTmeArr=[null,null,null,null],
          arrivedTimeArr=[null,null,null,null],
          facilites = {},
          airlines = [],
          lowestPrice = 0,
          highestPrice = 1000000,
          transit = []
        } = data
      
        let betweenTime = ['00:00:00',
                          '06:00:00',
                          '12:00:00',
                          '18:00:00',
                          '24:00:00']
        
        let departBetween = [...Array(4)].map((item,i) => {
          return item = ` departure_time BETWEEN ${betweenTime[i]} AND ${betweenTime[i+1]} `
        }).filter((_item, i) => i === departTmeArr[i] )
        departBetween = departBetween.length ? ` AND ( ${departBetween.join(' OR ')} ) ` : ' '
    
        let arrivedBetween = [...Array(4)].map((item,i) => {
          return item = `arrived_time BETWEEN ${betweenTime[i]} AND ${betweenTime[i+1]}`
        }).filter((_item, i) => i === arrivedTimeArr[i] )
        arrivedBetween = arrivedBetween.length ? ` AND ( ${arrivedBetween.join(' OR ')} ) ` : ' '
    
        let facilitiesArr = Object.keys(facilites).length ? Object.keys(facilites).map(i => {return i=' ? '}).join(' AND ') : ' '
    
        facilites = Object.keys(facilities).length ? ` AND (${facilitiesArr}) ` : ' '
    
        airlines = airlines.length ? ` AND (${airlines.map(i => {return i = ` airlines_id = ${i} `}).join(' OR ')} ) ` : ' '
    
        transit = transit.length ? ` AND (${transit.map(i => i = i>1 ? ` transit > ${i} ` : ` transit = ${i} ` ).join(' OR ')}) ` : ' '
    
        query = `SELECT COUNT(id) as count
                FROM (
                  SELECT id, airlines_id, origin, date(departure_time) as departure_date, time(departure_time) as departure_time, destination, date(arrived_time) as arrived_date, time(arrived_time) as arrived_time
                  FROM ${tables}
                ) as ${tables}
                LEFT JOIN (
                  SELECT flight_id, class, seat_count, price
                  FROM flight_detail               
                ) AS flight_detail
                ON ${tables}.id = flight_detail.flight_id
                LEFT JOIN (
                  select 
                    flight_id, 
                    max(case when facility_name = 'Luggage' then true end) 'luggage',
                    max(case when facility_name = 'In-Flight Meal' then true end) 'inFlightMeal',
                    max(case when facility_name = 'Wi-Fi' then true end) 'wiFi'
                  FROM facilities
                  group by flight_id
                ) AS facilities
                ON ${tables}.id = facilities.flight_id
                LEFT JOIN (
                  SELECT
                    flight_id, count(flight_id) as transitNumber
                  FROM transit
                  GROUP BY flight_id
                ) AS transit
                ON ${tables}.id = transit.flight_id
                WHERE (
                  origin = ?
                  OR destination = ?
                  OR departure_date = ? )
                AND class = ?
                AND (price between ${lowestPrice} AND ${highestPrice})
                ${facilities}
                ${airlines}
                ${departBetween}
                ${arrivedBetween}
                ${transit}
                `
        return await getFromDB(query, [origin, destination, departure_date, className])
      },
      createFlight: async (flight, flightDetail) => {
        query = [ ['INSERT INTO flight SET ?', flight], 
                  ['INSERT INTO flight_detail (class, seat_count, price, flight_id) VALUES ?', flightDetail]]
        return await transactionToDB(query)
      },
      getFlightDetail: async (data) => {
        query = `SELECT *
                FROM flight_detail
                WHERE ?`
        return await getFromDB(query, data)
      },
      getFlightByDetail: async (data) => {
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
                  WHERE flight_detail.id = ?`
        return await getFromDB(query, data)
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
      },
    getFlightByConditions: async (data, tables=table) =>{
        query = `SELECT 
                 * FROM 
                 ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)
    },
    getFlight: async (tables=table) =>{
        query = `SELECT * 
                 FROM ${tables}`
        
        return await getFromDB(query)
    },
    createFlight: async (data={}, tables=table) => {
        query = `INSERT 
                 INTO ${tables} 
                 SET ?`
        
        return await getFromDB(query, data)
    },
    countFlight: async (data, tables=table) => {
        query = `SELECT 
                 COUNT(*) 
                 AS count 
                 FROM ${tables} 
                 WHERE 
                 departure_time = '${data}'`
                 
        return await getFromDB(query)
    },
    updateFlight: async (data={}, id, tables=table) => {
        query = `UPDATE 
                 ${tables} 
                 SET ? 
                 WHERE id=${id}`

        return await getFromDB(query, data)                
    },
    deleteFlight: async (data, tables=table) => {
        query = `DELETE 
                 FROM ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)                                 
    }
}