let express = require('express')

let router = express.Router()

let util = require('../libs/util.js')

// 连接数据库
let mysql = require('../db/database-connect.js')

router.post('/api/addTeacher', async (req, res, next) => {
  let data = {
    instituteId: req.body.instituteId,
    teacherName: req.body.teacherName
  }
  let id = 0
  await mysql.table('pk_teacher').add(data).then(insertId => {
    id = insertId
  }).catch(err => {
    next(err)
  })
  await mysql.table('pk_teacher').where({ teacherId: id }).update({ teacherNum: util.pad(id, 5) }).then(affectRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getTeacher', async (req, res, next) => {
  let { current, pageSize, search } = req.query
  let total = 0
  let sql = ``
  let totalSql = ``
  if (search) {
    sql = `select pk_teacher.*,pk_institute.instituteName from pk_teacher,pk_institute
    where pk_teacher.instituteId = pk_institute.instituteId
    and (pk_teacher.teacherNum like '${search}' or pk_teacher.teacherName like '%${search}%' or pk_institute.instituteName like '%${search}%')  
    limit ${(current - 1) * pageSize},${pageSize}`
    totalSql = `select count(*) as count from pk_teacher,pk_institute
    where pk_teacher.instituteId = pk_institute.instituteId
    and (pk_teacher.teacherNum like '${search}' or pk_teacher.teacherName like '%${search}%' or pk_institute.instituteName like '%${search}%')`
  } else {
    sql = `select pk_teacher.*,pk_institute.instituteName from pk_teacher,pk_institute
    where pk_teacher.instituteId = pk_institute.instituteId
    limit ${(current - 1) * pageSize},${pageSize}`
    totalSql = `select count(*) as count from pk_teacher`
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

router.get('/api/getTeacherById', (req, res, next) => {
  let teacherId = req.query.teacherId
  mysql.table('pk_teacher').where({ teacherId }).find().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getTeacherByInstituteId', (req, res, next) => {
  let instituteId = req.query.instituteId
  mysql.table('pk_teacher').where({ instituteId }).select().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/editTeacher', (req, res, next) => {
  let data = {
    instituteId: req.body.instituteId,
    teacherName: req.body.teacherName
  }
  mysql.table('pk_teacher').where({ teacherId: req.body.teacherId }).update(data).then(affectRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

module.exports = router
