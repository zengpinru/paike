# 大学排课系统

## 一、环境
1. node: v10.6.0
2. vue-cli: v3.2.1

## 二、技术栈
1. 前端：vue + iview + axios + less
2. 后端：node + express + mysql

## 三、项目目录结构
piake
* client 前端代码
  + public 公共文件夹
    - index.html 模板
  + src 代码资源文件夹
    - api 请求后端的api文件夹
    - assets 静态资源文件夹
    - components 组件文件夹
    - libs 应用程序
    - router 路由文件夹
    - store vuex文件夹
    - views 页面文件夹
      * backEnd 后台
      * frontEnd 前台
    - App.js 入口组件
    - main.js 打包的入口文件
  + vue.config.js 配置文件
* server 后端代码
  + api 前端请求的api
  + db 数据库的连接和配置
    - database-connect.js 数据连接文件
  + libs 应用程序
    - util.js 与业务逻辑无关的函数
  + app.js 入口文件
  + paike.sql 数据库文件

## 四、运行
1. 前端：(进入client文件夹)
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
2. 后端：(进入server文件夹)
``` bash
# install dependencies
npm install

# server at localhost:3000
nodemon app.js
```