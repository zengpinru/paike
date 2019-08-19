/**
 * 服务端入口
 */

let express = require('express')
let bodyParser = require('body-parser')
let jwt = require('jsonwebtoken')
let jwtConf = require('./libs/jwt.conf.js')

// 引入api
let adminApi = require('./api/admin.js')
let classroomApi = require('./api/classroom.js')
let instituteApi = require('./api/institute.js')
let majorApi = require('./api/major.js')
let teacherApi = require('./api/teacher.js')
let classApi = require('./api/class.js')
let coursesApi = require('./api/courses.js')
let teachTaskApi = require('./api/teachTask.js')
let permissionApi = require('./api/permission.js')
let temporaryApi = require('./api/temporary.js')

let app = express()

// 载入中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 所有的请求都要进行jwt验证
app.all('*', (req, res, next) => {
  let path = req.path
  if (path === '/api/login') {
    next()
  } else {
    const token = req.headers.authorization
    if (!token) { // 没有token
      res.json({
        code: 401,
        message: 'there is no token'
      })
    } else {
      jwt.verify(token, jwtConf.secretKey, (err, decode) => {
        if (err) {
          res.json({ // 有token但token过期了
            code: 401,
            message: 'token error'
          })
        } else { // 有token并且不过期
          next()
        }
      })
    }
  }
})

// 配置路由，api接口
app.use(adminApi)
app.use(classroomApi)
app.use(instituteApi)
app.use(majorApi)
app.use(teacherApi)
app.use(classApi)
app.use(coursesApi)
app.use(teachTaskApi)
app.use(permissionApi)
app.use(temporaryApi)

// 404
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'request not found'
  })
})

// 错误请求的请求
app.use((err, req, res, next) => {
  res.status(500).json({
    code: 500,
    message: err.message
  })
})

// 监听端口，启动服务器
app.listen(3000, () => {
  console.log('Server is running at port 3000 ......')
})
