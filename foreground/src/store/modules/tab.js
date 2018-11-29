/**
 * Vuex全局状态管理
 * @param options {Array} 用于渲染tabs的数组
 */
const tab = {
  state: {
    options: [],
    activeIndex: '/index',
  },
  mutations: {
    // 添加tabs
    add_tabs (state, data) {
      let exist = false
      state.options.forEach(e => {
        if (e.name === data.name) {
          exist = true
        }
      })
      if (!exist) {
        state.options.push(data)
      }
    },
    // 删除tabs
    delete_tabs (state, route) {
      let index = 0
      for (let option of state.options) {
        if (option.route === route) {
          break
        }
        index++
      }
      state.options.splice(index, 1)
    },
    // 设置当前激活的tab
    set_active_index (state, index) {
      state.activeIndex = index
    },
  }
}
export default tab

