let formidable = require('formidable')
let path = require('path')
let xlsx = require('node-xlsx')
let express = require('express')

let router = express.Router()

// 连接数据库
let mysql = require('../db/database-connect.js')

router.get('/api/getTerm', (req, res, next) => {
  mysql.table('pk_term').where({ termId: 1 }).find().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/editTerm', (req, res, next) => {
  let { termName } = req.body
  mysql.table('pk_term').where({ termId: 1 }).update({ termName }).then(affactRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/addTeachTask', async (req, res, next) => {
  let { classId, data } = req.body
  let termName = null
  await mysql.table('pk_term').where({ termId: 1 }).find().then(data => {
    termName = data.termName
  }).catch(err => {
    next(err)
  })
  let arr = []
  data.forEach(item => {
    arr.push({
      classId: classId,
      termName: termName,
      coursesNum: item.coursesNum,
      teacherNum: item.teacherNum,
      weekClassHours: item.weekClassHours,
      coursesClassHours: item.coursesClassHours
    })
  })
  mysql.table('pk_teachTask').addAll(arr).then(insertId => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getTeachTask', async (req, res, next) => {
  let { current, pageSize, classId } = req.query
  let total = 0
  let totalWhere = ``
  let where = ``
  if (classId) {
    where = `and pk_teachTask.classId = ${classId}`
    totalWhere = `where pk_teachTask.classId = ${classId}`
  }

  let totalSql = `select count(*) as count from pk_teachTask ${totalWhere}`
  let sql = `select b.*,pk_teacher.teacherName
  from (select a.*,pk_courses.coursesName from (select pk_teachTask.*,pk_class.className from pk_teachTask,pk_class where pk_teachTask.classId = pk_class.classId ${where}) as a,pk_courses where a.coursesNum = pk_courses.coursesNum) as b,pk_teacher
  where b.teacherNum = pk_teacher.teacherNum
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

router.get('/api/getTeachTaskByTerm', async (req, res, next) => {
  let termName = '2017-2018-1'
  await mysql.table('pk_term').where({ termId: 1 }).find().then(data => {
    termName = data.termName
  }).catch(err => {
    next(err)
  })
  let sql = `select a.*,b.classStuNum from (select * from pk_teachTask where termName = '${termName}') as a, pk_class as b where a.classId = b.classId`
  await mysql.query(sql).then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/uploadTeachTask', (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.uploadDir = path.join(__dirname, '../', 'file_storage')
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err)
      next(err)
    }
    let info = JSON.parse(JSON.stringify(files.file || files.icon))
    mysql.table('pk_term').where({ termId: 1 }).find().then(data => {
      let termName = data.termName
      let sheets = xlsx.parse(info.path)
      let addData = []
      sheets[0].data.forEach(item => {
        addData.push({
          classId: item[0],
          coursesNum: item[2],
          teacherNum: item[4],
          termName: termName,
          weekClassHours: item[6],
          coursesClassHours: item[7]
        })
      })
      addData.splice(0, 1)
      mysql.table('pk_teachTask').addAll(addData).then(insertId => {
        res.json({
          code: 200,
          message: 'ok'
        })
      }).catch(err => {
        console.log(err)
        next(err)
      })
    }).catch(err => {
      console.log(err)
      next(err)
    })
  })
})

router.post('/api/deleteTeachTask', (req, res, next) => {
  let teachTaskId = req.body.teachTaskId
  mysql.table('pk_teachTask').where({ teachTaskId }).delete().then(affectRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    console.log(err)
    next(err)
  })
})

router.post('/api/deleteTeachTasks', (req, res, next) => {
  let teachTaskIdArr = req.body.teachTaskIdArr
  mysql.table('pk_teachTask').where({ teachTaskId: ['IN', teachTaskIdArr] }).delete().then(affactRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    console.log(err)
    next(err)
  })
})

module.exports = router