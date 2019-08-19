import Vue from 'vue'
import Router from 'vue-router'
import { routes, R404 } from './router'
import store from '@/store'
import { getToken, setToken, setTitle } from '@/libs/util.js'
import { authorization } from 'api/admin.js'

Vue.use(Router)

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  to.meta && setTitle(to.meta.title)
  const token = getToken()
  if (token && to.name !== 'index') {
    if (!store.state.hasGetRules) { // 没有获取路由权限
      authorization(window.sessionStorage.getItem('adminName')).then(res => {
        setToken(res.data.token) // 设置新的token
        let pageList = res.data.rules.pageList
        store.dispatch('GenerateRoutes', pageList).then(() => {
          router.addRoutes(store.state.addRoutes.concat(R404))
          next({ ...to, replace: true })
        })
      }).catch(() => {
        setToken('')
        next({ path: '/login' })
      })
    } else {
      next()
    }
  } else { // 没有token
    if (to.name === 'login' || to.name === 'index') {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})

export default router
