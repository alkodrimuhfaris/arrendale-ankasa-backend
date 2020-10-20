const tableDetailFlight = 'flight'
const tableClass = 'class'
const tableTransit = 'transit'
const tableAirlines = 'airlines'
const getFromDB = require('../helpers/promiseToDB')

let query = ''
let newQuery = `SELECT ${tableDetailFlight}.id, 
                        ${tableAirlines}.name,
                        ${tableAirlines}.logo AS airlines_logo,
                        ${tableClass}.total_seat, 
                        ${tableClass}.name AS class, 
                        ${tableDetailFlight}.origin, 
                        ${tableDetailFlight}.destination, 
                        ${tableTransit}.name AS transit, 
                        ${tableDetailFlight}.departure_date, 
                        ${tableDetailFlight}.departure_time, 
                        ${tableDetailFlight}.arrived_time, 
                        ${tableClass}.price 
                FROM ((${tableDetailFlight} 
                    INNER JOIN airlines 
                        ON ${tableDetailFlight}.airline_id = airlines.id)
                    INNER JOIN class 
                        ON ${tableDetailFlight}.class_id = ${tableClass}.id 
                    INNER JOIN facilities 
                        ON ${tableClass}.id = facilities.class_id 
                    INNER JOIN ${tableTransit} 
                        ON ${tableDetailFlight}.transit_id = transit.id)`

module.exports = {
    
    getDetailFlightByConditions: async (id) =>{
        query = `${newQuery} 
                 WHERE ${tableDetailFlight}.id=${id}
                 GROUP BY ${tableDetailFlight}.id`
        
        return await getFromDB(query)
    },
    getDetailFlight: async (data=[id, '']) =>{
        console.log('disini')
        query = `${newQuery} 
                 WHERE ${data[0]} 
                 LIKE '%${data[1]}%' 
                 GROUP BY flight.${data[2]} 
                 ORDER BY flight.departure_date ${data[3]} 
                 LIMIT ${data[4]} 
                 OFFSET ${data[5]}`
        
        return await getFromDB(query)
    },
    searchTime: async (data) => {
        let time1 = data[1].slice(1, 6)
        let time2 = data[1].slice(8, data[1].length-1)

        query = `${newQuery} 
                 WHERE ${data[0]} 
                 BETWEEN 
                 '${time1}' 
                 AND 
                 '${time2}' 
                 GROUP BY 
                 flight.${data[2]}`
        
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
                 as count FROM ${tableDetailFlight}
                 WHERE name LIKE '${data}'`
        
        return await getFromDB(query)
    },
    countDetailFlight: async () => {
        query = `SELECT COUNT(*) as count
                 FROM ${tableDetailFlight}`

        return await getFromDB(query)
    }
}
