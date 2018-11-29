// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './assets/css/reset.css'
import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/element_ui_index.css'
import _global  from '@/utils/global'

import 'lib-flexible'

import store from './store'

import Toast from './packages/toast'
import Dialog from './packages/dialog'

Vue.use(Toast);
Vue.use(Dialog);

import FastClick from 'fastclick'

FastClick.attach(document.body);

Vue.use(ElementUI)
Vue.prototype.$ajax = axios
Vue.prototype.$global = _global;
axios.defaults.withCredentials = true

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
})
