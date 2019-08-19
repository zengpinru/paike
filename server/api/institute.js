let express = require('express')

let router = express.Router()

// 连接数据库
let mysql = require('../db/database-connect.js')

router.post('/api/addInstitute', (req, res, next) => {
  let data = {
    instituteName: req.body.instituteName
  }
  mysql.table('pk_institute').add(data).then(insertId => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getInstitute', (req, res, next) => {
  mysql.table('pk_institute').select().then(data => {
    res.json({
      data: data,
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getInstituteById', (req, res, next) => {
  let instituteId = req.query.instituteId
  mysql.table('pk_institute').where({ instituteId }).find().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/editInstitute', (req, res, next) => {
  let data = {
    instituteName: req.body.instituteName
  }
  mysql.table('pk_institute').where({ instituteId: req.body.instituteId }).update(data).then(affectRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

module.exports = router
