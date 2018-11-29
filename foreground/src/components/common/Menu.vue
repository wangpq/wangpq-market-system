<template>
    <div id="sysMenuId">
      <div class="wrap">
        <div class="tr">
          <div class="layout-logo-left">
            <span v-if="spanLeft >= 4">
              <img src="../../assets/logo.png" alt="">
            </span>
          </div>
          <div class="layout-user-info">
              <Dropdown class="right" trigger="click" @on-click="handleUserDropdown">
                  <!--<img src="../../assets/images/header.jpg" alt="avatar">-->
                  <img :src="apis.EXTRA.fileLoadUrl+getUser.header">
                  <br/>
                  <a href="javascript:void(0)">
                      {{getUser.name}}
                      <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                      <DropdownItem name="info">个人信息</DropdownItem>
                      <DropdownItem name="header">上传头像</DropdownItem>
                      <DropdownItem name="cpwd">修改密码</DropdownItem>
                      <DropdownItem name="logout">安全退出</DropdownItem>
                  </DropdownMenu>
              </Dropdown>
          </div>
        </div>

 
        <div class="tr">
          <Menu id="sysMenu"
            :active-name="activeMenu"
            theme="light"
            width="auto"
            @on-open-change="menuFold"
            @on-select="handleSelect"
            :open-names="[menuList[0].id]"
            accordion>
            <template v-for="item in menuList">
                <SideMenuItem
                        v-if="item.children&&item.children.length!==0"
                        :parent-item="item"
                        :iconSize="iconSize"
                        :key="item.id">
                </SideMenuItem>
                <menu-item v-else
                          :name="item.url+'$$'+item.id"
                          :key="item.id">
                    <Icon class="menu-icon" :type="item.resIcon" :size="15"/>
                    <span class="menu-text">{{ item.title }}</span>
                </menu-item>
            </template>
          </Menu>

        </div>


      </div>

        <ChangePwd :initOption="initChangePwd"></ChangePwd>
        <UserInfo :initOption="initUserInfo"></UserInfo>
        <uploadHeader :initOption="initHeaderInfo"></uploadHeader>
     


    </div>
</template>
<script>
  import SideMenuItem from '@/components/common/SideMenuItem'
  import ChangePwd from '@/components/common/ChangePwd'
  import UserInfo from '@/components/common/UserInfo'
  import uploadHeader from '@/components/common/uploadHeader'

  export default {
    props: {
      iconSize: {
        required: true,
        type: Number
      },
      spanLeft: {
        required: true,
        type: Number
      },
      sid: {
        type: String,
        default: ''
      },
    },
    data () {
      return {
        initChangePwd: {
          visible: false,
        },
        initUserInfo: {
          visible: false,
        },
        initHeaderInfo: {
          visible: false,
        }
      }
    },
    name: 'sysMenu',
    mounted () {
      this.$nextTick(() => {
        this.getMenus()
      })
      // 刷新时以当前路由做为tab加入tabs
      // if (this.$route.path !== '/' && this.$route.path !== '/index') {
      //   this.$store.commit('add_tabs', {route: '/index', name: '首页'})
      //   this.$store.commit('add_tabs', {route: this.$route.path, name: this.$route.name})
      //   this.$store.commit('set_active_index', this.$route.path)
      // } else {
      //   this.$store.commit('add_tabs', {route: '/index', name: '首页'})
      //   this.$store.commit('set_active_index', '/index')
      // }

      this.$store.commit('add_tabs', {route: '/index', name: '首页'})
      this.$store.commit('set_active_index', '/index')
      this.$router.push('/')

    },
    computed: {
      activeMenu () {
        return this.$route.path
      },
      menuList () {
        return this.$store.state.app.menus
      },
      getUser () {
        return this.$store.state.user.user
      }
    },
    methods: {
      getMenus () {
        this.$store.dispatch('getMenus', this.$store.state.user.user.roleId).then(() => {
        }).catch(err => {
          this.$Message.error(err.message)
        })
      },
      logout () {
        this.$Modal.confirm({
          title: '注销',
          content: '确定退出系统？',
          onOk: () => {
            this.$store.dispatch('logOut').then(() => {
              this.$Message.success('安全退出!')
              this.$router.replace('/login')
              location.reload()
            }).catch(err => {
              this.$Message.error(err.message)
            })
          }
        })
      },

      changePwd () {
        this.initChangePwd.visible = true
      },

      info () {
        this.initUserInfo.visible = true
      },

      uploadHeader () {
        this.initHeaderInfo.visible = true
      },

      menuFold(){
        this.$parent.unfoldLeftMenu()
      },

      handleSelect (name) {
        var names = name.split('$$');
        if (names.length < 2) {
          return;
        }
        //获取权限按钮
        this.$store.dispatch('getBtnAuthData', names[1]).then(() => {
          //跳转路由
          this.$router.push({path: names[0], query: {menuId: names[1]}})
        }).catch(err => {
          this.$Message.error(err.message)
        })
      },
      handleUserDropdown (name) {
        switch (name) {
          case 'logout':
            this.logout()
            break
          case 'cpwd':
            this.changePwd()
            break
          case 'header':
            this.uploadHeader()
            break
          case 'info':
            this.info()
            break
        }
      }
    },
    components: {
      SideMenuItem,
      ChangePwd,
      UserInfo,
      uploadHeader,
    }
  }
</script>
<style lang="scss">
.ivu-menu-item {
    border-right: none;
}

.right {
    .ivu-select-dropdown {
    }
    .ivu-dropdown-menu {
        min-width: 120px;
    }
    .ivu-dropdown-item:hover {
        background-color: #e5e5e5;
    }

}

.layout-left {
  .ivu-menu {
    z-index: 800;
  }
}

.ivu-menu-item-selected {
  background-color: #DBDBDB;
}
#sysMenuId{
  height:100%;
  >.wrap{
  height:100%;
    display:flex;
    flex-direction:column;
    .tr{
      &:last-child{
        flex :1;
        overflow-x:hidden;
        overflow-y:auto;
      }
    }
  }
}
</style>
