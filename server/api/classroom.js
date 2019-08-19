let express = require('express')

let router = express.Router()

// 连接数据库
let mysql = require('../db/database-connect.js')

/**
 * 添加教室
 */
router.post('/api/addClassroom', (req, res, next) => {
  let data = {
    classroomNum: req.body.classroomNum,
    classroomCapacity: req.body.classroomCapacity
  }
  mysql.table('pk_classroom').add(data).then(insertId => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

/**
 * 获取教室数据列表
 */
router.get('/api/getClassroom', (req, res, next) => {
  let current = parseInt(req.query.current) // 当前页码
  let pageSize = parseInt(req.query.pageSize) // 每页显示的条数
  let classroomArea = req.query.classroomArea
  let classroomStatus = req.query.classroomStatus
  if (classroomArea || classroomStatus) {
    let where = {}
    if (classroomStatus == '2' || classroomStatus == '') {
      where = {
        classroomNum: ['LIKE', classroomArea + '%']
      }
    } else {
      where = {
        classroomNum: ['LIKE', classroomArea + '%'],
        classroomStatus: ['=', classroomStatus]
      }
    }
    mysql.table('pk_classroom').where(where).select().then(allData => {
      mysql.table('pk_classroom').where(where).page(current, pageSize).select().then(data => {
        res.json({
          code: 200,
          message: 'ok',
          data: data,
          total: allData.length
        })
      }).catch(err => {
        next(err)
      })
    })
  } else { // 没有查询条件
    mysql.table('pk_classroom').select().then(allData => {
      mysql.table('pk_classroom').page(current, pageSize).select().then(data => {
        res.json({
          code: 200,
          message: 'ok',
          data: data,
          total: allData.length
        })
      }).catch(err => {
        next(err)
      })
    }).catch(err => {
      next(err)
    })
  }
})

router.get('/api/getAllClassroom', (req, res, next) => {
  mysql.table('pk_classroom').where({ classroomStatus: 1 }).select().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getClassroomById', (req, res, next) => {
  let classroomId = req.query.classroomId
  mysql.table('pk_classroom').where({ classroomId }).find().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/editClassroom', (req, res, next) => {
  let data = {
    classroomNum: req.body.classroomNum,
    classroomCapacity: req.body.classroomCapacity,
    classroomStatus: req.body.classroomStatus
  }
  mysql.table('pk_classroom').where({ classroomId: req.body.classroomId }).update(data).then(affectRows => {
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    next(err)
  })
})

module.exports = router
