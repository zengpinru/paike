/**
 * 管理员表模型
 */

// 连接数据库
let mysql = require('../db/database-connect.js')

exports.query = () => {
  return new Promise((resolve, reject) => {
    mysql.table('pk_admin').select().then(data => {
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}
