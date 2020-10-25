const getFromDB = require('../../helpers/promiseToDB')

let query = ''
let newQuery = `SELECT * FROM 
(
      SELECT id, name as airlines, logo as airline_logo
      FROM airlines
  ) as airlines

LEFT JOIN
  (
      SELECT 
      id as flight_id, airlines_id, flight_code, flight_detail_id, origin, departure_date, departure_time, destination, arrived_date, arrived_time,
      luggage, in_flight_meal, wifi, transit_id, class_name, seat_count, price
      FROM
      (
          SELECT 
            id, airlines_id, flight_code, flight_detail_id, origin, departure_date, departure_time, destination, arrived_date, arrived_time,
            luggage, in_flight_meal, wifi, transit_id, class_name, seat_count, price
        FROM flight
          LEFT JOIN 
            (
                  SELECT 
                    flight_id, 
                    max(case when facility_name = 'Luggage' then true END) 'luggage',
                    max(case when facility_name = 'In-Flight Meal' then true END) 'in_flight_meal',
                    max(case when facility_name = 'Wi-Fi' then true END) 'wifi'
                    from facilities
                    group by flight_id
                ) as facilites
           ON flight.id = facilites.flight_id
          LEFT JOIN 
            (
                  SELECT id as flight_detail_id, flight_id, transit_id, class_name, seat_count, price
                  FROM flight_detail
              ) as flight_detail
          ON flight.id = flight_detail.flight_id
    ) as flight
  ) as flight
  ON airlines.id = flight.airlines_id`

let queryCounter = `
SELECT count(*) as count FROM 
(
      SELECT id, name as airlines, logo as airline_logo
      FROM airlines
  ) as airlines

LEFT JOIN
  (
      SELECT 
      id as flight_id, airlines_id, flight_code, flight_detail_id, origin, departure_date, departure_time, destination, arrived_date, arrived_time,
      luggage, in_flight_meal, wifi, transit_id, class_name, seat_count, price
      FROM
      (
          SELECT 
            id, airlines_id, flight_code, flight_detail_id, origin, departure_date, departure_time, destination, arrived_date, arrived_time,
            luggage, in_flight_meal, wifi, transit_id, class_name, seat_count, price
        FROM flight
          LEFT JOIN 
            (
                  SELECT 
                    flight_id, 
                    max(case when facility_name = 'Luggage' then true END) 'luggage',
                    max(case when facility_name = 'In-Flight Meal' then true END) 'in_flight_meal',
                    max(case when facility_name = 'Wi-Fi' then true END) 'wifi'
                    from facilities
                    group by flight_id
                ) as facilites
           ON flight.id = facilites.flight_id
          LEFT JOIN 
            (
                  SELECT id as flight_detail_id, flight_id, transit_id, class_name, seat_count, price
                  FROM flight_detail
              ) as flight_detail
          ON flight.id = flight_detail.flight_id
    ) as flight
  ) as flight
  ON airlines.id = flight.airlines_id
`

module.exports = {
    
    searchTicket: async (data, limiter) => {
        let {
            origin = 0,
            destination = 0, 
            departure_time = [null, null, null, null],
            departure_date = '',
            arrived_time = [null, null, null, null],
            arrived_date = '',
            transit = [null, null, null],
            facility = [],
            airlines_name = [],
            class_name = '',
            price = [0, 10000]
          } 
            = data 
        
        console.log(price[0])
        console.log(price[1])

        let betweenTime = ["00:00", "06:00", "12:00", "18:00", "24:00"]

        let facilityArr = ['luggage', 'in_flight_meal', 'wifi']
        
        let originAndDestination = ``
        let date = ``
        let departureTime = ``
        let arrivedTime = ``
        let transitId = ``
        let facilityQuery = ``
        let airline = ``
        let className = ``
        let ticketPrice = ``

        if (Number(origin) && Number(destination)){
          originAndDestination = `( origin = ${Number(origin)} AND destination = ${destination})`
        } else if (Number(origin) && !Number(destination)){
          originAndDestination = `( origin = ${Number(origin)})`
        } else if (!Number(origin) && Number(destination)) {
          originAndDestination = `( destination = ${Number(destination)})`
        }

        if (departure_date && arrived_date){
          date = `( departure_date = "${departure_date}" AND arrived_date = "${arrived_date}")`
        } else if (departure_date){
          originAndDestination = `( departure_date = "${departure_date}")`
        } else if (arrived_date) {
          originAndDestination = `( arrived_date = "${arrived_date}")`
        }

        departureTime = [...Array(4)].map((item,i) => {
          return item = `departure_time BETWEEN "${betweenTime[i]}" AND "${betweenTime[i+1]}"`
        }).filter((_item, i) => departure_time[i])
        departureTime = departureTime.length ? `(${departureTime.join(' OR ')})` : ``

        arrivedTime = [...Array(4)].map((item,i) => {
          return item = `arrived_time BETWEEN "${betweenTime[i]}" AND "${betweenTime[i+1]}"`
        }).filter((_item, i) => arrived_time[i] )
        arrivedTime = arrivedTime.length ? `(${arrivedTime.join(' OR ')}) ` : ``

        transitId = [...Array(3)].map((item,i) => {
          return item = `transit_id = ${i}`
        }).filter((_item, i) => transit[i] )
        transitId = transitId.length ? `(${transitId.join(' OR ')}) ` : ``

        facilityQuery = [...Array(3)].map((item, i) => {
          return item = `${facilityArr[i]} = 1`
        }).filter((_item, i) => facility[i])
        facilityQuery = facilityQuery.length ? `(${facilityQuery.join(' AND ')}) ` : ``

        airline = !airlines_name.length ? '' : airlines_name.map(item => {
          return item = `airlines = "${item}"`
        })
        airline = airline.length ? `(${airline.join(' OR ')}) ` : ``

        className = class_name ? `(class_name = "${class_name}")` : ''

        ticketPrice = `(price BETWEEN ${price[0]} AND ${price[1]})`

        let secondQuery = [
          originAndDestination,
          date,
          departureTime,
          arrivedTime,
          transitId,
          facilityQuery,
          airline,
          className,
          ticketPrice,
        ]

        
        secondQuery = secondQuery.filter(item => item)
        
        let where = secondQuery.length ? ` WHERE ` : ``

        secondQuery = secondQuery.join(` AND `)
        
        query = `${newQuery} 
                
                ${where}
                
                ${secondQuery}
                
                ${limiter}`
        
        console.log(query)
        
        return await getFromDB(query)
    },
    searchTicketCount: async (data) => {
      let {
        origin = 0,
        destination = 0, 
        departure_time = [null, null, null, null],
        departure_date = '',
        arrived_time = [null, null, null, null],
        arrived_date = '',
        transit = [null, null, null],
        facility = [],
        airlines_name = [],
        class_name = '',
        price = [0, 10000]
      } 
        = data 
      
      let betweenTime = ["00:00", "06:00", "12:00", "18:00", "24:00"]

      let facilityArr = ['luggage', 'in_flight_meal', 'wifi']
      
      let originAndDestination = ``
      let date = ``
      let departureTime = ``
      let arrivedTime = ``
      let transitId = ``
      let facilityQuery = ``
      let airline = ``
      let className = ``
      let ticketPrice = ``

      if (Number(origin) && Number(destination)){
        originAndDestination = `( origin = ${Number(origin)} AND destination = ${destination})`
      } else if (Number(origin) && !Number(destination)){
        originAndDestination = `( origin = ${Number(origin)})`
      } else if (!Number(origin) && Number(destination)) {
        originAndDestination = `( destination = ${Number(destination)})`
      }

      if (departure_date && arrived_date){
        date = `( departure_date = "${departure_date}" AND arrived_date = "${arrived_date}")`
      } else if (departure_date){
        originAndDestination = `( departure_date = "${departure_date}")`
      } else if (arrived_date) {
        originAndDestination = `( arrived_date = "${arrived_date}")`
      }

      departureTime = [...Array(4)].map((item,i) => {
        return item = `departure_time BETWEEN "${betweenTime[i]}" AND "${betweenTime[i+1]}"`
      }).filter((_item, i) => departure_time[i])
      departureTime = departureTime.length ? `(${departureTime.join(' OR ')})` : ``

      arrivedTime = [...Array(4)].map((item,i) => {
        return item = `arrived_time BETWEEN "${betweenTime[i]}" AND "${betweenTime[i+1]}"`
      }).filter((_item, i) => arrived_time[i] )
      arrivedTime = arrivedTime.length ? `(${arrivedTime.join(' OR ')}) ` : ``

      transitId = [...Array(3)].map((item,i) => {
        return item = `transit_id = ${i}`
      }).filter((_item, i) => transit[i] )
      transitId = transitId.length ? `(${transitId.join(' OR ')}) ` : ``

      facilityQuery = [...Array(3)].map((item, i) => {
        return item = `${facilityArr[i]} = 1`
      }).filter((_item, i) => facility[i])
      facilityQuery = facilityQuery.length ? `(${facilityQuery.join(' AND ')}) ` : ``

      airline = !airlines_name.length ? '' : airlines_name.map(item => {
        return item = `airlines = "${item}"`
      })
      airline = airline.length ? `(${airline.join(' OR ')}) ` : ``

      className = class_name ? `(class_name = "${class_name}")` : ''

      ticketPrice = `(price BETWEEN ${price[0]} AND ${price[1]})`

      let secondQuery = [
        originAndDestination,
        date,
        departureTime,
        arrivedTime,
        transitId,
        facilityQuery,
        airline,
        className,
        ticketPrice,
      ]

      
      secondQuery = secondQuery.filter(item => item)
      
      let where = secondQuery.length ? ` WHERE ` : ``

      secondQuery = secondQuery.join(` AND `)
      
      query = `${queryCounter} 
              ${where}
              ${secondQuery}
              `
      console.log(query)

      return await getFromDB(query)
    },
    searchTicketById: async (flight_detail_id) => {
        query = `${newQuery}
                 WHERE flight_detail_id = ${flight_detail_id}`
        return await getFromDB(query)
    }
}
