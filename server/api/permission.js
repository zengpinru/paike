let express = require('express')

let router = express.Router()

// 连接数据库
let mysql = require('../db/database-connect.js')

router.get('/api/getPermissionRules', (req, res, next) => {
  res.json({
    code: 200,
    message: 'ok',
    data: {
      adminName: req.username,
      rules: {
        pageList: {
          'admin-list': true,
          'permission-role': true,
          'permission-route': true,
          'classroom-add': true,
          'classroom-list': true,
          'classroom-edit': true,
          'institute-add': true,
          'institute-list': true,
          'institute-edit': true,
          'major-add': true,
          'major-list': true,
          'major-edit': true,
          'teacher-add': true,
          'teacher-list': true,
          'teacher-edit': true,
          'class-add': true,
          'class-list': true,
          'class-edit': true,
          'courses-add': true,
          'courses-list': true,
          'courses-edit': true,
          'teachTask-add': true,
          'teachTask-list': true,
          'teachTask-setTerm': true
        },
        actionList: {
          'edit-button': true
        }
      }
    }
  })
})

router.post('/api/addPagePermission', (req, res, next) => {
  let pagePermissionId = req.body.pagePermissionId
  let data = {
    pagePermissionParentId: req.body.pagePermissionParentId,
    pagePermissionName: req.body.pagePermissionName,
    pagePermissionRoute: req.body.pagePermissionRoute
  }
  if (pagePermissionId) { // 编辑
    mysql.table('pk_pagePermission').where({ pagePermissionId }).update(data).then(affectRows => {
      res.json({
        code: 200,
        message: 'ok'
      })
    }).catch(err => {
      next(err)
    })
  } else { // 添加
    mysql.table('pk_pagePermission').add(data).then(insertId => {
      res.json({
        code: 200,
        message: 'ok'
      })
    }).catch(err => {
      next(err)
    })
  }
})

/**
 * 获取顶级页面权限
 */
router.get('/api/getPagePermission', (req, res, next) => {
  mysql.table('pk_pagePermission').select().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getPagePermissionById', (req, res, next) => {
  let { pagePermissionId } = req.query
  mysql.table('pk_pagePermission').where({ pagePermissionId }).find().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/addRole', (req, res, next) => {
  let roleId = req.body.roleId
  let data = {
    roleName: req.body.roleName,
    pagePermission: req.body.pagePermission
  }
  if (roleId) { // 分配权限
    mysql.table('pk_role').where({ roleId }).update(data).then(affectRows => {
      res.json({
        code: 200,
        message: 'ok'
      })
    }).catch(err => {
      next(err)
    })
  } else { // 添加
    mysql.table('pk_role').add(data).then(insertId => {
      res.json({
        code: 200,
        message: 'ok'
      })
    }).catch(err => {
      next(err)
    })
  }
})

router.get('/api/getRole', (req, res, next) => {
  mysql.table('pk_role').select().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.get('/api/getRolePermission', async (req, res, next) => {
  let roleId = req.query.roleId
  let pagePermission = ''
  await mysql.table('pk_role').where({ roleId }).find().then(data => {
    pagePermission = data.pagePermission
  }).catch(err => {
    next(err)
  })
  await mysql.table('pk_pagePermission').where({ pagePermissionId: ['IN', pagePermission] }).select().then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

module.exports = router
