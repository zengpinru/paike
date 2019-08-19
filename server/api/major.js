let express = require('express')

let router = express.Router()

// 连接数据库
let mysql = require('../db/database-connect.js')

router.post('/api/addMajor', (req, res, next) => {
  let data = {
    instituteId: req.body.instituteId,
    majorName: req.body.majorName
  }
  mysql.table('pk_major').add(data).then(insertId => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getMajor', async (req, res, next) => {
  let { instituteId, current, pageSize } = req.query
  let sql = ``
  let totalSql = ``
  let total = 0
  if (instituteId) {
    sql = `
    select pk_major.majorId,pk_major.majorName,pk_institute.instituteName from pk_major,pk_institute
    where pk_major.instituteId = pk_institute.instituteId and pk_major.instituteId = ${instituteId}
    limit ${(current - 1) * pageSize},${pageSize}
    `
    totalSql = `select count(*) as count from pk_major where pk_major.instituteId = ${instituteId}`
  } else {
    sql = `
    select pk_major.majorId,pk_major.majorName,pk_institute.instituteName from pk_major,pk_institute
    where pk_major.instituteId = pk_institute.instituteId
    limit ${(current - 1) * pageSize},${pageSize}
    `
    totalSql = `select count(*) as count from pk_major`
  }
  await mysql.query(totalSql).then(data => {
    total = data[0].count
  }).catch(err => {
    next(err)
  })
  await mysql.query(sql).then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data,
      total: total
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getMajorNoWhere', (req, res, next) => {
  mysql.table('pk_major').select().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getMajorById', (req, res, next) => {
  let majorId = req.query.majorId
  mysql.table('pk_major').where({ majorId }).find().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/editMajor', (req, res, next) => {
  let data = {
    instituteId: req.body.instituteId,
    majorName: req.body.majorName
  }
  mysql.table('pk_major').where({ majorId: req.body.majorId }).update(data).then(affectRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

module.exports = router
