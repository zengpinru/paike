let express = require('express')
let jwt = require('jsonwebtoken')
let jwtConf = require('../libs/jwt.conf.js')

let router = express.Router()

// 连接数据库
let mysql = require('../db/database-connect.js')

router.post('/api/login', (req, res, next) => {
  let { username, password } = req.body
  let sql = `select pk_admin.*,pk_role.roleName from pk_admin,pk_role
  where pk_admin.adminName = '${username}' and pk_admin.roleId = pk_role.roleId`
  if (username) {
    mysql.query(sql).then(data => {
      if (data.length === 0 || !password || password !== data[0].adminPwd) {
        res.json({
          code: 401,
          messsage: 'user name or password is wrong'
        })
      } else {
        res.json({
          code: 200,
          message: 'ok',
          data: {
            token: jwt.sign({ adminName: data[0].adminName }, jwtConf.secretKey, {
              expiresIn: jwtConf.expiresIn
            }),
            adminName: data[0].adminName,
            roleName: data[0].roleName
          }
        })
      }
    }).catch(err => {
      next(err)
    })
  } else {
    res.json({
      code: '401',
      messsage: 'user name is empty'
    })
  }
})

router.get('/api/authorization', async (req, res, next) => {
  const adminName = req.query.adminName
  let pagePermission = null
  let rules = {}
  let sql = `select pk_admin.*,pk_role.pagePermission from pk_admin,pk_role
  where pk_admin.adminName = '${adminName}' and pk_admin.roleId = pk_role.roleId`
  await mysql.query(sql).then(data => {
    pagePermission = data[0].pagePermission
  }).catch(err => {
    next(err)
  })
  await mysql.table('pk_pagePermission').where({ pagePermissionId: ['IN', pagePermission] }).select().then(data => {
    rules.pageList = {}
    data.forEach(item => {
      rules.pageList[item.pagePermissionRoute] = true
    })
    res.json({
      code: 200,
      message: 'ok',
      data: {
        token: jwt.sign({ adminName: adminName }, jwtConf.secretKey, {
          expiresIn: jwtConf.expiresIn
        }),
        rules
      }
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/addAdmin', (req, res, next) => {
  let adminId = req.body.adminId
  let data = {
    adminName: req.body.adminName,
    adminPwd: req.body.adminPwd,
    roleId: req.body.roleId
  }
  if (adminId) { // 编辑
    mysql.table('pk_admin').where({ adminId }).update(data).then(affectRows => {
      res.json({
        code: 200,
        message: 'ok'
      })
    }).catch(err => {
      console.log(err)
    })
  } else { // 添加
    mysql.table('pk_admin').add(data).then(insertId => {
      res.json({
        code: 200,
        message: 'ok'
      })
    }).catch(err => {
      next(err)
    })
  }
})

router.get('/api/getAdmin', (req, res, next) => {
  let sql = `select pk_admin.adminId,pk_admin.roleId,pk_admin.adminName,pk_role.roleName from pk_admin,pk_role
  where pk_admin.roleId = pk_role.roleId`
  mysql.query(sql).then(data => {
    res.json({
      code: 200,
      message: 'ok',
      data: data
    })
  }).catch(err => {
    next(err)
  })
})

router.post('/api/changePwd', (req, res, next) => {
  let { adminName, newPwd, oldPwd } = req.body
  mysql.table('pk_admin').where({ adminName: adminName,adminPwd: oldPwd }).find().then(data => {
    if (data.adminId) {
      mysql.table('pk_admin').where({ adminName }).update({ adminPwd: newPwd }).then(affectRows => {
        res.json({
          code: 200,
          message: 'ok'
        })
      }).catch(err => {
        next(err)
      })
    } else {
      res.json({
        code: 201,
        message: 'error',
      })
    }
  }).catch(err => {
    next(err) // 状态码500
  })
})

module.exports = router
