<template>
    <div>
        <div class="notice">
            <div class="n-left">
                <Icon size="26" type="md-apps" @click="$parent.toggleMenu"/>
            </div>
            <!--<div class="n-left">-->
                <!--<Icon size="26" type="md-apps" @click="$parent.toggleClick"/>-->
            <!--</div>-->
            <div class="n-right">
                <Badge dot>
                    <Icon type="ios-mail-outline" size="26"></Icon>
                </Badge>
                <Badge dot>
                    <Icon type="ios-notifications-outline" size="26"></Icon>
                </Badge>
                <div class="logout" @click="logout">
                    <Icon size="20" type="md-log-out"></Icon>
                    <label>退出</label>
                </div>
            </div>
        </div>
        <div class="tab">
            <Tabs type="card" class="tabs" v-model="activeIndex"
                  @on-click="tabClick"
                  @on-tab-remove="tabRemove">

                <template v-for="menu in options">
                    <TabPane :key="menu.name" v-if="menu.name === '首页'" :label="menu.name"
                             :name="menu.route"></TabPane>
                    <TabPane :key="menu.name" v-else closable :label="menu.name" :name="menu.route"></TabPane>
                </template>
            </Tabs>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Top',
    data () {
      return ({})
    },
    computed: {
      options () {
        return this.$store.state.tab.options
      },
      activeIndex: {
        get () {
          return this.$store.state.tab.activeIndex
        },
        set (val) {
          this.$store.commit('set_active_index', val)
        }
      }
    },
    methods: {
      // tab切换时，动态的切换路由
      tabClick (tab) {
        let path = this.activeIndex
        this.$router.push({path: path})
      },

      tabRemove (targetName) {
        // 首页不可删除
        if (targetName == '/') {
          return
        }
        // let len = this.$parent.$children.length
        // this.$parent.$children[len-1].$destroy()

        var $this = this;
        this.$parent.$children.forEach((e, index) => {
          let route = e.$el.getAttribute("route");
          if (route === targetName) {
            e.$destroy()
          }
        })

        this.$store.commit('delete_tabs', targetName)
        if (this.activeIndex !== targetName) {
          // 设置当前激活的路由
          if (this.options && this.options.length >= 1) {
            this.$store.commit('set_active_index', this.options[this.options.length - 1].route)
            this.$router.push({path: this.activeIndex})
          } else {
            this.$router.push({path: '/'})
          }
        }
      },
      logout () {
        this.$parent.$children[0].logout()
      },
    },
    watch: {
      '$route' (to) {
        let flag = false
        for (let option of this.options) {
          if (option.name === to.name) {
            flag = true
            this.$store.commit('set_active_index', to.path)
            break
          }
        }
        if (!flag) {
          this.$store.commit('add_tabs', {route: to.path, name: to.name})
          this.$store.commit('set_active_index', to.path)
        }
      }
    },
  }
</script>

<style scoped>

</style>
