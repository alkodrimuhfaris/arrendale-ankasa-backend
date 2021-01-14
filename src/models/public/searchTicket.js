const tableFlight = 'flight'
const tableFlightDetail = 'flight_detail'
const tableTransit = 'transit'
const tableAirlines = 'airlines'
const tableCity = 'city'
const getFromDB = require('../../helpers/promiseToDB')
const pagination =  require('../../helpers/pagination')
const queryGenerator = require('../../helpers/queryGenerator')

let query = ''
let newQuery = `SELECT 
                flight.id as id, 
                airlines.name as airlines_name, 
                airlines.logo AS airlines_logo,
                flight_detail.seat_count as seat_count, 
                flight_detail.class_name as class, 
                transit.name AS transit,                 
                origin,
                flight.departure_date as departure_date, 
                flight.departure_time as departure_time,
                destination, 
                flight.arrived_date as arrived_date, 
                flight.arrived_time as arrived_time, 
                flight_detail.price as price,
                flight.created_at as created_at
                FROM 
                ((flight 
                    INNER JOIN 
                    airlines 
                    ON 
                    flight.airlines_id = airlines.id) 
                    INNER JOIN 
                    flight_detail 
                    ON flight.id = flight_detail.id 
                    LEFT JOIN (
                        SELECT 
                          flight_id, 
                          max(case when facility_name = 'Luggage' then true END) 'luggage',
                          max(case when facility_name = 'In-Flight Meal' then true END) 'in_flight_meal',
                          max(case when facility_name = 'Wi-Fi' then true END) 'wifi'
                        from facilities
                        group by flight_id
                      ) as facilites
                    ON flight.id = facilites.flight_id
                    INNER JOIN 
                    transit 
                    ON 
                    flight_detail.transit_id = transit.id)`

module.exports = {
    
    getFlight: async () =>{
        query = `SELECT * 
                 FROM flight`
        
        return await getFromDB(query)
    },
    getCityCountry: async (city_id) => {
        query = `SELECT country_code, city_name
                FROM city
                WHERE id = ?`

        return await getFromDB(query, city_id)
      },
    getDetailFlightByConditions: async (id) =>{
        query = `${newQuery} 
                 WHERE ${tableFlight}.id=${id}
                 GROUP BY ${tableFlight}.id`
        
        return await getFromDB(query)
    },
    getDetailFlight: async (data=[id, '']) =>{
        console.log(data)
        console.log('disini')
        query = `${newQuery} 
                 WHERE ${data[0]} 
                 LIKE '%${data[1]}%' 
                 GROUP BY flight.${data[2]} 
                 ORDER BY flight.departure_time ${data[3]} 
                 LIMIT ${data[4]} 
                 OFFSET ${data[5]}`
        console.log('detail flight query')
        console.log(query)        
        return await getFromDB(query)
    },
    searchTime: async (data) => {
        let time1 = data[1].slice(1, 9)
        let time2 = data[1].slice(11, data[1].length-1)
        console.log(time1)
        query = `${newQuery} 
                 WHERE ${data[0]} 
                 BETWEEN 
                 '${time1}' 
                 AND 
                 '${time2}' 
                 GROUP BY 
                 flight.${data[2]}`
        console.log('search time query')
        console.log(query)
        return await getFromDB(query)
    },
    searchPrice: async (data) => {
        let price1 = data[1].slice(1, data[1].indexOf(','))
        let price2 = data[1].slice(data[1].indexOf(',') + 1, data[1].length-1)
        price1 = Number(price1)
        price2 = Number(price2)
        console.log(data[0])
        query = `${newQuery} 
                 WHERE ${data[0]}
                 BETWEEN 
                 ${price1}
                 AND ${price2}
                 GROUP BY
                 flight.${data[2]}`
        
        return await getFromDB(query)
    },
    checkDetailFlight: async (data) => {
        query = `SELECT COUNT(*)
                 as count FROM ${tableFlight}
                 WHERE name LIKE '${data}'`
        
        return await getFromDB(query)
    },
    countDetailFlight: async () => {
        query = `SELECT COUNT(*) as count
                 FROM ${tableFlight}`

        return await getFromDB(query)
    },
    getAllFlight: async (whereData = {}, reqQuery = {}) => {
        const { searchArr, date, price, orderArr, dataArr, prepStatement } = queryGenerator({ ...reqQuery, data: whereData })
    
        // query for search and limit
        const additionalQuery = [searchArr, date, price, dataArr].filter(item => item).map(item => `(${item})`).join(' AND ')
    
        // query for where (if it exist)
        const where = additionalQuery ? ' WHERE ' : ''
    
        const { limiter } = pagination.pagePrep(reqQuery)
    
        query = `SELECT *
                FROM (${newQuery}) as ticketTable
                ${where}
                ${additionalQuery}
                ORDER BY 
                    ${orderArr}
                ${limiter}`
        const results = await getFromDB(query, prepStatement)
    
        query = `SELECT count(*) as count
                FROM (${newQuery}) as ticketTable
                ${where}
                ${additionalQuery}`
        let [{count}] = await getFromDB(query, prepStatement)
    
        return { results, count }
    }
}
