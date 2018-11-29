// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '../plugins/common/css/comm.css'
import axios from 'axios'
import sysApi from './apis/apis'
import util from './utils/Utils'
import store from './store/store'
import VueEcharts from 'vue-echarts/components/ECharts'
import $ from 'jquery'
import '../plugins/ztree/js/jquery.ztree.core.min.js'
import '../plugins/ztree/js/jquery.ztree.excheck.min.js'

Vue.use(iView)
Vue.use(util)
Vue.use(sysApi)
Vue.prototype.$ajax = axios
Vue.config.productionTip = false
Vue.prototype.apis = sysApi
axios.defaults.withCredentials = true

window.eventBus = new Vue()

Vue.component('charts', VueEcharts)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  template: '<App/>'
})
