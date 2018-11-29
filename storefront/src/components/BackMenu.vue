<template>
  <div id="backMenu">

    <el-menu default-active="1-1"
             class="el-menu-vertical-demo"
             text-color="#fff"
             active-text-color="#a5c349"
             collapse-transition
             background-color="#424648"
             unique-opened
             @select="handleSelect"
              @open="handleOpen"
             @close="handleClose">

      <template v-for = "(item ,index) in menus">
        <el-submenu :index="index+1 + ''" :key="index">
          <template slot="title">
            <i :class="'header-icon '+ item.resIcon"></i>{{item.title}}
          </template>
          <el-menu-item-group >
            <!--<template slot="title">分组一</template>-->
            <template v-for="(child , cindex) in item.children">
              <el-menu-item :index="(index+1) + '-' + (cindex+1)" :route="child.url" :key="child.id">{{child.title}}</el-menu-item>
            </template>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>


  </div>
</template>

<script>
import { Collapse  } from 'element-ui';
import $http from '@/utils/httputils'

export default {
  data() {
    return {
      lists : [],
      menus: null,
      defaultIndex:'1'
    }
  },
  mounted: function() {
   
  },
  methods: {
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
    handleSelect(key, keyPath){

      let menukey = key.split('-')

      let thismenu = this.menus[menukey[0]-1].children[menukey[1]-1];
      let routerParams={
        menuid:thismenu.id
      }
      this.$router.push({path:thismenu.url, query:routerParams})
    },

    getMenus(){
      $http({
        method:'get',
        cache:true,
        path:'system/role/menu',
      },res=>{
        this.menus = res.data;
      },err => {
      },this);
    }
  },
  created(){
    this.getMenus();
  },
}
</script>

<style>
#backMenu{
  width:133px;
  height: 100%;
  overflow:hidden;
  background-color: #424648;
}
#backMenu .el-collapse{
  border-bottom: none;
}
#backMenu .el-collapse-item__header,
#backMenu .el-collapse-item__wrap{
  background: none;
  color:#fff;
    border-bottom: none;
}
#backMenu .el-collapse-item__content li a{
  color:#fff;
  display: block;
  text-indent: 0.4rem;
}
#backMenu .el-collapse{
  border-top: none;
}
.el-menu{
  border-right: none;
}
.header-icon{
  display: inline-block;
  width:16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 6px;
  margin-left:-6px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.icon-goods{
  background-image: url(../assets/images/backEnd/icon_goods.png);
}

.icon-sales{
  background-image: url(../assets/images/backEnd/icon_sales.png);
}
.icon-members{
  background-image: url(../assets/images/backEnd/icon_members.png);
}
.icon-counts{
  background-image: url(../assets/images/backEnd/icon_counts.png);
}
.icon-system{
  background-image: url(../assets/images/backEnd/icon_system.png);
}
</style>
