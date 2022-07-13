import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import router from './common/router'
import './plugins/element.js'

Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
