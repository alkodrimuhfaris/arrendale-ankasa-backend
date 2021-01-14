const stringify = require('./stringifyObj')
const qs = require('qs')
const {
    APP_URL
} = process.env

module.exports = {
  // paging: (count = 0, page = 1, limit = 10, tables, req) => {
  //   let pages = 1
  //   if (limit === '-'){
  //     page=1
  //   } else {
  //     limit = (Number(limit) && limit > 0) ? Number(limit) : 5
  //     page = (Number(page) && page > 0) ? Number(page) : 1
  //     pages = Math.ceil(count / limit) || 1
  //   }
  //   let nextLink = null
  //   let prefLink = null
  //   if (page < pages) {
  //     nextLink = APP_URL+tables+'?'+stringify({ ...req.query, ...{ page: page + 1 } })
  //   }
  //   if (page > 1) {
  //     prefLink = APP_URL+tables+'?'+stringify({ ...req.query, ...{ page: page - 1 } })
  //   }
  //   const pageInfo = {
  //     count: count,
  //     pages: pages,
  //     currentPage: page,
  //     dataPerPage: limit,
  //     nextLink: nextLink,
  //     prefLink: prefLink
  //   }
  //   return (
  //     pageInfo
  //   )
  // },
  // pagePrep: (req) => {
  //   let { page=1, limit=5 } = req
  //   let offset = 0
  //   let limiter = ''
  //   if (limit === '-') {
  //     page = 1
  //     limit = 'showing all data'
  //   } else {
  //     Number(limit) && limit > 0 ? limit = Number(limit) : limit = 5
  //     Number(page) && page > 0 ? page = Number(page) : page = 1
  //     offset = (page - 1) * limit
  //     limiter = `LIMIT ${offset}, ${limit}`
  //   }
  //   return ({
  //     page: page,
  //     limit: limit,
  //     offset: offset,
  //     limiter: limiter
  //   })
  // },
  paging: (count = 0, page = 1, limit = 5, tables, req) => {
    let pages = 1
    if (limit === '-') {
      page = 1
    } else {
      Number(limit) && (limit > 0) ? limit = Number(limit) : limit = 5
      Number(page) && (page > 0) ? page = Number(page) : page = 1
      pages = Math.ceil(count / limit) || 1
    }
    let nextLink = null
    let prefLink = null
    if (page < pages) {
      nextLink = process.env.APP_URL + tables + '?' + stringify({ ...req.query, ...{ page: page + 1 } })
    }
    if (page > 1) {
      prefLink = process.env.APP_URL + tables + '?' + stringify({ ...req.query, ...{ page: page - 1 } })
    }
    const pageInfo = {
      count: count,
      pages: pages,
      currentPage: page,
      dataPerPage: limit,
      nextLink: nextLink,
      prefLink: prefLink
    }
    return (
      pageInfo
    )
  },
  pagePrep: (req) => {
    let { page = 1, limit = 5 } = req
    let offset = 0
    let limiter = ''
    if (limit === '-') {
      page = 1
    } else {
      Number(limit) && limit > 0 ? limit = Number(limit) : limit = 5
      Number(page) && page > 0 ? page = Number(page) : page = 1
      offset = (page - 1) * limit
      limiter = `LIMIT ${offset}, ${limit}`
    }
    return ({
      page: page,
      limit: limit,
      offset: offset,
      limiter: limiter
    })
  },
  pagination: (req, totalData) => {
    let { page = 1, limit = 10 } = req.query
    limit = parseInt(limit)
    page = parseInt(page)
    if (page < 1) {
      page = 1
    }
    if (limit < 1 || limit > 100) {
      limit = 5
    }
    const totalPage = Math.ceil(totalData / limit)
    console.log(totalPage)
  
    const path = req.originalUrl.slice(1).split('?')[0]
    const prev = qs.stringify({ ...req.query, ...{ page: page - 1 }})
    const next = qs.stringify({ ...req.query, ...{ page: page + 1 }})
    console.log(path)
    const prevLink = page > 1 ? `${APP_URL}${path}?${prev}` : null
    const nextLink = page < totalPage ? `${APP_URL}${path}?${next}` : null
  
    const offset = (page - 1) * limit
    return {
      offset,
      pageInfo: {
        currentPage: page,
        totalPage,
        totalData,
        limitData: limit,
        prevLink,
        nextLink
      }
    }
  }
}



