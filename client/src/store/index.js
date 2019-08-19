import Vue from 'vue'
import Vuex from 'vuex'
import { routesMap, routes } from '@/router/router'

/**
 * 根据后端返回的页面路由规则生成最终的路由列表
 * @param {Array} routesMap 全部路由
 * @param {Object} page 用户可以访问的路由页面
 */
const getAccessRoutesList = (routesMap, pageList) => {
  return routesMap.filter(item => {
    if (pageList[item.name]) {
      return true
    } else {
      return false
    }
  })
}

const state = {
  hasGetRules: false,
  routes: [],
  addRoutes: [],
  menuData: {}
}

const mutations = {
  SET_ROUTERS: (state, accessedRouters) => {
    state.addRoutes = accessedRouters
    state.routes = accessedRouters.concat(routes)
    state.hasGetRules = true
    // 设置要显示的菜单栏
    state.addRoutes.forEach(item => {
      let arr = item.name.split('-')
      let name = arr[0]
      if (!arr[1].includes('edit')) {
        if (state.menuData[name]) {
          state.menuData[name].push(item)
        } else {
          state.menuData[name] = []
          state.menuData[name].push(item)
        }
      }
    })
  }
}

const actions = {
  GenerateRoutes ({ commit }, pageList) {
    return new Promise(resolve => {
      let accessedRouters = []
      if (window.sessionStorage.getItem('adminName') === 'admin') {
        accessedRouters = routesMap
      } else {
        accessedRouters = getAccessRoutesList(routesMap, pageList)
      }
      commit('SET_ROUTERS', accessedRouters)
      resolve()
    })
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions
})
