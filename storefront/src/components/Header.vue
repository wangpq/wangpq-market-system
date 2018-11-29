<template>
  <div id="header">
    <ul class="nav item">
      <li><router-link to="/frontend">收银</router-link></li>
      <li><router-link to="/backend">后台</router-link></li>
    </ul>
    <div class="item">{{userInfo.chainName}}({{userInfo.nickname?userInfo.nickname:userInfo.name}})</div>
    <div class="item user">
      <div class="text">今日销售：{{salesCount}}单</div>
      <div class="item">
        <el-dropdown trigger="click">
          <div class="el-dropdown-link user-select">
            <div class="img">
              <div class="c">
                <img src="../assets/images/img_user_radius.png" />
              </div>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><div @click="onDropdownItemClick" index="0">修改密码</div> </el-dropdown-item>
            <el-dropdown-item><div @click="onDropdownItemClick" index="1">退出</div> </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/apiList'

import Vue from 'vue';

import {Dropdown,DropdownItem,DropdownMenu} from 'element-ui';
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);


export default {
  name: 'Header',
  data (){
    return {
      // 今日销售单数
      //salesCount :"",
      // 今日挂单数
      //upsideCount :""
      userInfo:null
    }
  },
  methods: {
    onDropdownItemClick (event){
      if (event) {
        let index=event.target.getAttribute("index");
        if(index==="0"){
          this.$router.push({ path: "/modifypass" });
        }else{
          this.$ajax
            .put(api.queryLoginout)
            .then( (response) =>{
              this.onLoginOutSuccess(response.data);
            })
            .catch( (error)=> {
              this.onLoginOutError(error);
            });
        }
      }
    },
    onLoginOutSuccess(response){
      if(response.success){
        this.commonLoginOutAction();
      }else{
        this.commonLoginOutAction();
      }
    },
    onLoginOutError(error){
      this.commonLoginOutAction();
    },
    commonLoginOutAction(){
      localStorage.clear();
      // 清空收银页面的商品列表
      this.$store.dispatch('emptyProductList');
      this.$router.push({ path: "/login" });
    },
    // 获取今日销售单数
    queryHeaderAjax(){
      // 将ajax写在action（updateTodaySalesCount）中，当消费者产生新的消费单后，才能自动更新头部数据
      this.$store.dispatch('updateTodaySalesCount');
    }
  },
  created(){
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.queryHeaderAjax();
  },
  computed : {
    // 今日销售单数
    salesCount(){
      return this.$store.state.product.todaySalesCount;
    }
  }
}
</script>

<style scoped>
#header{
  display:flex;
  flex-direction: row;
  height:66px;
  background-color:#424648;
  position: relative;
  z-index:1000;
}

#header>.item:nth-child(2) {
  flex :1;
  color:#fff;
  font-size:24px;
  line-height:66px;
  text-align:center;
}
#header>.item:last-child {
  color:#fff;
  text-align:right;
  padding-right:10px;
}
#header .nav{
  padding-left:22px;
}
#header .nav li{
  display: inline-block;
  height:100%;
}
#header .nav li a {
  color: #aac849;
  display: inline-block;
  padding:0 36px;
  text-align:center;
  font-size:18px;
  line-height:64px;
  height:100%;
}
#header .user{
  display:flex;
}
#header .user>.text{
  line-height:66px;
  height:66px;
  padding-right:10px;
  font-size:16px;
}
#header .user>.item{
  height:100%;
  flex :1;
  display: -webkit-flex;
  display: flex;
}
#header .user>.item .user-select{
  height:100%;
}
#header .user>.item .user-select>.img{
  display: flex;
  flex-direction: row;
  height:100%;
}
#header .user>.item .user-select>.img>.c{
  -webkit-align-self: center;
  -moz-align-self: center;
  -o-align-self: center;
  -ms-align-self: center;
  align-self: center;
}
#header .user>.item .user-select>.img>.c>img{
  height:44px;
  width:44px;
  display:block;
  cursor:pointer;
}

#header .router-link-exact-active.router-link-active{
  font-weight:normal;
  border-top:3px solid #aac849;
  color:#aac849;
  background-color:#f2f2f2;
}
.el-dropdown-menu__item{
  text-align: right;
}

</style>
