import axios from 'axios'
import router from '../router'
import store from '../store/store'
import iView from 'iview'

axios.defaults.baseURL = process.env.BASE_API
export function $http (params) {
  console.log(params)
  if (params.method.toLowerCase() === 'post' || params.method.toLowerCase() === 'put') {
    return axios({
      method: params.method,
      url: params.path,
      data: params.data,
      params: params.data
    })
  } else {
    return axios({
      method: params.method,
      url: params.path,
      params: params.data
    })
  }
}

// // http request 请求拦截器，有token值则配置上token值
// axios.interceptors.request.use(
//   config => {
//     if (token) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
//       config.headers.Authorization = token;
//     }
//     return config;
//   },
//   err => {
//     return Promise.reject(err);
//   });

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
  response => {
    if (!response.success) {
      var code = parseInt(response.data.data)
      switch (code) {
        case 10004:
          //清除缓存
          sessionStorage.clear()
          store.state.user.token = ''
          router.replace('/login')
          location.reload()
          iView.Message.warning('请重新登录！')
          return Promise.reject()
      }
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 无权限访问
          router.replace('401')
          break

        case 404:
          router.replace('404')
          break
      }
    }
    return Promise.reject(error.response.data)
  })

export default $http
