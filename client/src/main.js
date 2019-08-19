import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入iview组件
import iView from 'iview'
import '@/assets/less/my-theme.less'

// 引入自定义的全局组件
import PkLayout from '_c/global/PkLayout.vue'

Vue.use(iView)
Vue.component('pk-layout', PkLayout)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
