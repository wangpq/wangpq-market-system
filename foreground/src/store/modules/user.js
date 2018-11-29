import $http from '@/utils/httputils'
import sysApi from '@/apis/apis'

const user = {
  state: {
    user: JSON.parse(sessionStorage.getItem('user')),
    token: sessionStorage.getItem('token')
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },
  actions: {
    login ({commit}, loginForm) {
      return new Promise((resolve, reject) => {
        $http({
          path: sysApi.systemUser.login,
          method: 'get',
          data: loginForm
        }).then(response => {
          const res = response.data
          if (res.success) {
            let token = 'token'
            sessionStorage.setItem('user', JSON.stringify(res.data))
            sessionStorage.setItem('token', token)
            commit('SET_TOKEN', token)
            commit('SET_USER', res.data)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    //退出登录
    logOut ({commit}) {
      return new Promise((resolve, reject) => {
        $http({
          path: sysApi.systemUser.logout,
          method: 'put',
          data: {}
        }).then(response => {
          commit('SET_TOKEN', '')
          commit('SET_USER', '')
          sessionStorage.clear()
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
