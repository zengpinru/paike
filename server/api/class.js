let express = require('express')

let router = express.Router()

// 连接数据库
let mysql = require('../db/database-connect.js')

router.post('/api/addClass', async (req, res, next) => {
  let data = {
    instituteId: req.body.instituteId,
    majorId: req.body.majorId,
    classYear: req.body.classYear,
    classStuNum: req.body.classStuNum
  }
  let index = 0
  let majorName = ''
  await mysql.table('pk_class').where({
    majorId: data.majorId,
    classYear: data.classYear
  }).select().then(res => {
    index = res.length
  }).catch(err => {
    next(err)
  })
  await mysql.table('pk_major').where({ majorId: data.majorId }).find().then(res => {
    majorName = res.majorName
  }).catch(err => {
    next(err)
  })
  // 拼接班级名称
  data.className = data.classYear.toString() + '级' + majorName + (index + 1).toString() + '班'
  await mysql.table('pk_class').add(data).then(insertId => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getClass', async (req, res, next) => {
  let { current, pageSize, instituteId, majorId, classYear } = req.query

  let str = ``
  if (instituteId || majorId || classYear) {
    str = `and (`
    if (instituteId) {
      str += `pk_class.instituteId = ${instituteId} and `
    }
    if (majorId) {
      str += `pk_class.majorId = ${majorId} and `
    }
    if (classYear) {
      str += `pk_class.classYear = ${classYear}`
    }
    str += `)`
    str = str.replace('and )', ')')
  }

  let total = 0
  let totalSql = `select count(*) as count from pk_class,pk_institute
  where pk_class.instituteId = pk_institute.instituteId ${str}`
  let sql = `select pk_class.*,pk_institute.instituteName from pk_class,pk_institute
  where pk_class.instituteId = pk_institute.instituteId ${str}
  limit ${(current - 1) * pageSize},${pageSize}`

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

router.get('/api/getClassById', (req, res, next) => {
  let classId = req.query.classId
  mysql.table('pk_class').where({ classId }).find().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getClassYearByInstituteId', (req, res, next) => {
  let instituteId = req.query.instituteId
  mysql.table('pk_class').distinct('classYear').where({ instituteId }).select().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getClassForTeachTask', (req, res, next) => {
  let { instituteId, classYear } = req.query
  let where = {
    instituteId,
    classYear
  }
  mysql.table('pk_class').field(['classId', 'className']).where(where).select().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/editClass', async (req, res, next) => {
  let { instituteId, majorId, classId, classStuNum, classYear, isChangeClassName } = req.body
  let data = {
    instituteId,
    majorId,
    classStuNum,
    classYear
  }
  if (isChangeClassName) {
    let index = 0
    let majorName = ''
    await mysql.table('pk_class').where({
      majorId: majorId,
      classYear: classYear
    }).select().then(res => {
      index = res.length
    }).catch(err => {
      next(err)
    })
    await mysql.table('pk_major').where({ majorId }).find().then(res => {
      majorName = res.majorName
    }).catch(err => {
      next(err)
    })
    // 拼接班级名称
    data.className = data.classYear.toString() + '级' + majorName + (index + 1).toString() + '班'
  }
  await mysql.table('pk_class').where({ classId }).update(data).then(affectRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

module.exports = router
