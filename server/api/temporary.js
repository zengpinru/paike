let express = require('express')

let router = express.Router()

// 连接数据库
let mysql = require('../db/database-connect.js')

router.post('/api/handPaike', async (req, res, next) => {
  let { teachTaskId, checkList, temporaryData } = req.body
  let arr1 = []
  checkList.forEach(item => {
    arr1.push({
      classTime: item.time,
      classId: item.classId.join(','),
      teacherNum: item.teacherNum.join(','),
      classroomId: item.classroomId.join(','),
      checkListIndex: item.index
    })
  })
  await mysql.table('pk_temporary').addAll(temporaryData).then(insertId => {
    console.log('添加成功')
  }).catch(err => {
    console.log(err)
    next(err)
  })
  await mysql.table('pk_teachTask').where({ teachTaskId }).update({ isArranged: 1 }).then(affectRows => {
    console.log('更新成功')
  }).catch(err => {
    console.log(err)
    next(err)
  })
  await mysql.table('pk_checkList').delete().then(affectRows => {
    console.log('删除成功')
    mysql.table('pk_checkList').addAll(arr1).then(insertId => {
      console.log('添加成功')
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

router.post('/api/updatePaike', async (req, res, next) => {
  let { temporaryId, checkList, updateData } = req.body
  let arr1 = []
  checkList.forEach(item => {
    arr1.push({
      classTime: item.time,
      classId: item.classId.join(','),
      teacherNum: item.teacherNum.join(','),
      classroomId: item.classroomId.join(','),
      checkListIndex: item.index
    })
  })
  await mysql.table('pk_temporary').where({ temporaryId }).update(updateData).then(affectRows => {
    console.log('更新成功!')
  }).catch(err => {
    console.log(err)
    next(err)
  })
  await mysql.table('pk_checkList').delete().then(affectRows => {
    console.log('删除成功')
    mysql.table('pk_checkList').addAll(arr1).then(insertId => {
      console.log('添加成功')
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

router.post('/api/addTemporary', async (req, res, next) => {
  let { temporaryData, checkListData } = req.body
  let arr = []
  let arr1 = []
  let teachTaskIdArr = []
  temporaryData.forEach(item => {
    teachTaskIdArr.push(item.teachTaskId)
    arr.push({
      classroomNum: item.classroomNum,
      classId: item.classId,
      coursesClassHours: item.coursesClassHours,
      coursesNum: item.coursesNum,
      teacherNum: item.teacherNum,
      termName: item.termName,
      classTime: item.time,
      weekClassHours: item.weekClassHours,
      teachTaskId: item.teachTaskId
    })
  })
  checkListData.forEach(item => {
    arr1.push({
      classTime: item.time,
      classId: item.classId.join(','),
      teacherNum: item.teacherNum.join(','),
      classroomId: item.classroomId.join(','),
      checkListIndex: item.index
    })
  })
  await mysql.table('pk_temporary').addAll(arr).then(insertId => {
    console.log('添加成功')
  }).catch(err => {
    console.log(err)
    next(err)
  })
  await mysql.table('pk_teachTask').where({ teachTaskId: ['IN', teachTaskIdArr] }).update({ isArranged: 1 }).then(affectRows => {
    console.log('更新成功')
  }).catch(err => {
    console.log(err)
    next(err)
  })
  await mysql.table('pk_checkList').delete().then(affectRows => {
    console.log('删除成功')
    mysql.table('pk_checkList').addAll(arr1).then(insertId => {
      console.log('添加成功')
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

router.get('/api/getTemporaryByClassId', (req, res, next) => {
  let classId = req.query.classId
  let sql = `select c.*,d.teacherName from (select a.*,b.coursesName from (select * from pk_temporary where classId = ${classId}) as a,pk_courses as b where a.coursesNum = b.coursesNum) as c,pk_teacher as d
  where c.teacherNum = d.teacherNum`
  mysql.query(sql).then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    console.log(err)
    next(err)
  })
})

router.get('/api/getTemporaryByTeacherNum', (req, res, next) => {
  let teacherNum = req.query.teacherNum
  let sql = `select c.*,d.className from (select a.*,b.coursesName from (select * from pk_temporary where teacherNum = ${teacherNum}) as a,pk_courses as b where a.coursesNum = b.coursesNum) as c,pk_class as d
  where c.classId = d.classId`
  mysql.query(sql).then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    console.log(err)
    next(err)
  })
})

router.get('/api/getTemporaryByClassroomNum', (req, res, next) => {
  let classroomNum = req.query.classroomNum
  let sql = `select e.*,f.teacherName from (select c.*,d.className from (select a.*,b.coursesName from (select * from pk_temporary where classroomNum = '${classroomNum}') as a,pk_courses as b where a.coursesNum = b.coursesNum) as c,pk_class as d
  where c.classId = d.classId) as e,pk_teacher as f where e.teacherNum = f.teacherNum`
  mysql.query(sql).then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    console.log(err)
    next(err)
  })
})

router.get('/api/getTemporaryByTeachTaskId', (req, res, next) => {
  let teachTaskId = req.query.teachTaskId
  mysql.table('pk_temporary').where({ teachTaskId }).select().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    console.log(err)
    next(err)
  })
})

router.get('/api/getCheckList', (req, res, next) => {
  mysql.table('pk_checkList').select().then(data =>{
    let arr = []
    if (data.length !== 0) {
      data.forEach(item => {
        let classId = []
        let classroomId = []
        if (item.classId) {
          item.classId.split(',').forEach(item => classId.push(parseInt(item)))
        }
        if (item.classroomId) {
          item.classroomId.split(',').forEach(item => classroomId.push(parseInt(item)))
        }
        arr.push({
          time: item.classTime,
          classId: classId,
          teacherNum: item.teacherNum ? item.teacherNum.split(',') : [],
          classroomId: classroomId,
          index: item.checkListIndex
        })
      })
    } else {
      let time = [
        '11', '12', '13', '14', '15',
        '21', '22', '23', '24', '25',
        '31', '32', '33', '34', '35',
        '41', '42', '43', '44', '45',
        '51', '52', '53', '54', '55'
      ]
      for (let i = 0; i < 25; i++) {
        arr.push({
          time: time[i], // 时间段
          classId: [], // 这个时间段已经有课的班级
          teacherNum: [], // 这个时间段已经有课的教师
          classroomId: [], // 这个时间段已经用掉的教室
          index: i
        })
      }
    }
    res.json({
      code: 200,
      message: 'ok',
      data: arr
    })
  }).catch(err => {
    console.log(err)
    next(err)
  })
})

router.get('/api/resetData', async (req, res, next) => {
  await mysql.table('pk_checkList').delete().then(affectRows => {
    console.log('删除成功')
  }).catch(err => {
    console.log(err)
    next(err)
  })
  await mysql.table('pk_teachTask').where({isArranged: 1}).update({ isArranged: 0 }).then(affectRows => {
    console.log('更新成功')
  }).catch(err => {
    console.log(err)
    next(err)
  })
  await mysql.table('pk_temporary').delete().then(affectRows => {
    console.log('删除成功')
    res.json({
      code: 200,
      message: 'ok'
    })
  }).catch(err => {
    console.log(err)
    next(err)
  })
})

router.get('/api/statistics', async (req, res, next) => {
  let adminNum = null
  let classNum = null
  let classroomData = null
  let coursesNum = null
  let instituteNum = null
  let majorNum = null
  let teacherNum = null
  let teachTaskData = null
  await mysql.table('pk_admin').count('adminId').then(count => {
    adminNum = count
  })
  await mysql.table('pk_class').count('classId').then(count => {
    classNum = count
  })
  await mysql.table('pk_classroom').field('classroomStatus').select().then(data => {
    classroomData = data
  })
  await mysql.table('pk_courses').count('coursesId').then(count => {
    coursesNum = count
  })
  await mysql.table('pk_institute').count('instituteId').then(count => {
    instituteNum = count
  })
  await mysql.table('pk_major').count('majorId').then(count => {
    majorNum = count
  })
  await mysql.table('pk_teacher').count('teacherId').then(count => {
    teacherNum = count
  })
  await mysql.table('pk_teachTask').field('isArranged').select().then(data => {
    teachTaskData = data
    res.json({
      code: 200,
      message: 'ok',
      data: {
        adminNum,
        classNum,
        classroomData,
        coursesNum,
        instituteNum,
        majorNum,
        teacherNum,
        teachTaskData
      }
    })
  })
})

module.exports = router
