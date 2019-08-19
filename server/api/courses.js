let express = require('express')

let router = express.Router()

let util = require('../libs/util.js')

// 连接数据库
let mysql = require('../db/database-connect.js')

router.post('/api/addCourses', async (req, res, next) => {
  let data = {
    coursesName: req.body.coursesName,
    coursesClassHours: req.body.coursesClassHours,
    coursesProperty: req.body.coursesProperty
  }
  let id = 0
  await mysql.table('pk_courses').add(data).then(insertId => {
    id = insertId
  }).catch(err => {
    next(err)
  })
  await mysql.table('pk_courses').where({ coursesId: id }).update({ coursesNum: util.pad(id, 6) }).then(affectRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getCourses', async (req, res, next) => {
  let { current, pageSize, search } = req.query
  let total = 0
  let str = ``

  if (search) {
    str += ` where pk_courses.coursesNum = '${search}' or pk_courses.coursesName like '%${search}%'`
  }

  let totalSql = `select count(*) as count from pk_courses${str}`
  let sql = `select * from pk_courses${str}
  limit ${(current - 1) * pageSize}, ${pageSize}`

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

router.get('/api/getCoursesById', (req, res, next) => {
  let coursesId = req.query.coursesId
  mysql.table('pk_courses').where({ coursesId }).find().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/editCourses', (req, res, next) => {
  let data = {
    coursesClassHours: req.body.coursesClassHours,
    coursesName: req.body.coursesName,
    coursesProperty: req.body.coursesProperty
  }
  let coursesId = req.body.coursesId
  mysql.table('pk_courses').where({ coursesId }).update(data).then(affactRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

module.exports = router
