import $http from '@/utils/httputils'
import sysApi from '@/apis/apis'
import iView from 'iview'

const app = {
  state: {
    menus: JSON.parse(sessionStorage.getItem('APP_MENUS')) || [],
    menusBtn: JSON.parse(sessionStorage.getItem('MENUS_BTN')) || {},
    test: 'test'
  },
  mutations: {
    SET_TEST: (state, test) => {
      state.test = test
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_MENUS_BTN: (state, obj) => {
      state.menusBtn[obj.key] = obj.value
      sessionStorage.setItem('MENUS_BTN', JSON.stringify(state.menusBtn))
    }
  },
  actions: {
    getMenus ({commit}, sid) {
      if (app.state.menus.length > 0) {
        return new Promise((resolve, reject) => {resolve();reject()})
      }
      return new Promise((resolve, reject) => {
        $http({
          path: sysApi.systemRole.rolemenus,
          method: 'get',
          data: {
            roleId: sid
          }
        }).then(response => {
          const res = response.data
          if (res.success) {
            sessionStorage.setItem('APP_MENUS', JSON.stringify(res.data))
            commit('SET_MENUS', res.data)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getBtnAuthData ({commit}, menuId) {
      if (app.state.menusBtn[menuId] != null) {
        return new Promise((resolve, reject) => { resolve()})
      }
      return new Promise((resolve, reject) => {
        $http({
          path: sysApi.resource.btnres,
          method: 'get',
          data: {menuId: menuId},
        }).then(response => {
          let res = response.data
          if (res.success) {
            var obj = {}
            obj.key = menuId
            obj.value = res.data
            commit('SET_MENUS_BTN', obj)
          } else {
            iView.Message.error('获取权限按钮失败，请刷新重试！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default app
