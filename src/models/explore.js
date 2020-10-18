const db = require('../helpers/db')
const getFromDB = require('../helpers/promiseForSQL')

const table = 'items'
let query = ''


module.exports = {
  getTickets: async (origin, destination, departure_time, tables = 'ticket') => {
    query = `SELECT id, origin, date(departure_time) as departure_date, time(departure_time) as departure_time,
                    destination, date(arrived_time) as arrived_date, time(arrived_time) as arrived_date,
                    type_flight, class, terminal, gate
            FROM ${tables}
            LEFT JOIN (
              SELECT count(ticket_id) as transit_count, ticket_id
              FROM transit
              GROUP BY booking_details_id
            ) AS transit
            ON ${tables}.id = transit.booking_details_id
            LEFT JOIN (
              SELECT name as city_name, id
              FROM city
            ) ON ${tables}.origin = city.id OR ${tables}.destination = city.id
            LEFT JOIN (
              select 
                    ticket_id, 
                    max(case when name = 'economy' then id end) 'economy_id',
                    max(case when name = 'economy' then price end) 'economy_price',
                    max(case when name = 'economy' then seat end) 'economy_seat',
                    max(case when name = 'business' then id end) 'business_id',
                    max(case when name = 'business' then price end) 'business_price',
                    max(case when name = 'business' then seat end) 'business_seat',
                    max(case when name = 'first_class' then id end) 'first_class_id',
                    max(case when name = 'first_class' then price end) 'first_class_price',
                    max(case when name = 'first_class' then seat end) 'first_class_seat'
                from class
                group by ticket_id
            ) as class
            ON ${tables}.id = class.ticket_id
            WHERE origin = ${origin}
            AND  destination = ${destination}
            AND departure_date = ${departure_date}`
  }
}