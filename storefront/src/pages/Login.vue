<template>
  <div class="login-page">
      <header class="header">
        <div class="brand">
          <img src="../assets/images/login/login_txt.png" alt="中铁如家前台管理系统">
        </div>
      </header>
      <section class="content">
        <aside>
          <div class="layer">
            <img src="../assets/images/login/login_img.png" alt="中铁如家前台管理系统图片">
          </div>
        </aside>
        <article>
          <div class="layer">
            <div class="login-box">
              <div class="head"><img src="../assets/images/login/login_logo.png" alt="登录页面图标"></div>
              <div class="body">
                <div class="p">
                  <div class="input-box">
                    <label for="userName">用户名：</label>
                    <input ref="loginUser" type="text" v-model="name" @keyup="loginUserChange"/>
                  </div>
                </div>
                <div class="p">
                  <div class="input-box">
                    <label for="userName">密&nbsp;&nbsp;&nbsp;码：</label>
                    <input ref="loginPass" type="password" v-model="pwd" @keyup="loginPassChange" @keyup.enter="onBtnLoginClick"/>
                  </div>
                </div>
                <div class="p">
                  <el-button type="success" :loading="isLoading" round @click="onBtnLoginClick">{{loginState}}</el-button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
  </div>
</template>

<script>
import api from '@/api/apiList'
import {trim} from '@/utils/utils'
import $http from '@/utils/httputils'

export default {
  data (){
    return {
      name : "",
      pwd : "",
      loginState : '登录',
      isDisabled: true,
      isLoading : false
    }
  },
  methods : {
    loginUserChange(evt){
      if(this.name.length>0 && this.pwd.length>0){
        this.isDisabled=false;
      }else{
        this.isDisabled=true;
      }
    },
    loginPassChange(evt){
      if(this.name.length>0 && this.pwd.length>0){
        this.isDisabled=false;
      }else{
        this.isDisabled=true;
      }
    },
    /**
     * 简单验证
     */
    verifyNamePass(){
      if(trim(this.name)==""){
        this.$toast('请输入用户名！');
        return false;
      }
      if(trim(this.pwd)==""){
        this.$toast('请输入密码！');
        return false;
      }
      if(trim(this.name).length<4){
        this.$toast('请输入正确的用户名！');
        return false;
      }
      if(trim(this.pwd).length<6){
        this.$toast('请输入正确的密码！');
        return false;
      }
      return true;
    },
    onBtnLoginClick(){
      // 先验证
      if(!this.verifyNamePass()){
         return false;
      }

      this.isLoading=true;
      this.loginState="正在登录...";
      $http({
        method:'get',
        path:'chain/user/login',
        data:{ name : this.name.trim(),
          pwd : this.pwd.trim() }
      },(res)=>{
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        this.$router.push("/frontend");
        // this.onSuccess(res);
      },(err)=>{
        this.name="";
        this.pwd ="";
        this.isLoading=false;
        this.loginState="登录";
      },this);


      // this.$ajax.get(api.queryLogin, {
      //   params: {
      //     name : this.name.trim(),
      //     pwd : this.pwd.trim()
      //   }
      // })
      // .then( (response) =>{
      //   this.onSuccess(response.data);
      // })
      // .catch( (error)=> {
      //   this.onSuccess(error);
      // });
    },
    onSuccess : function(response){
      this.isLoading=false;
      this.loginState="登录";
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      this.$router.push("/frontend");

      // if(response.success){
      //   let res=response.data;
      //   localStorage.setItem('userInfo', JSON.stringify(res));
      //   // 门店店员名字
      //   localStorage.setItem("userName",res.name);
      //   // 门店店员id
      //   localStorage.setItem("userId",res.id);
      //   // 门店店员编码
      //   localStorage.setItem("userCode",res.code);
      //   this.$router.push("/frontend");
      // }else{
      //   this.$toast(response.message);
      //   this.name="";
      //   this.pwd ="";
      //   this.isLoading=false;
      //   this.loginState="登录";
      // }
    },
    onError : function(error){
      this.isLoading=false;
      this.loginState="登录";
      this.$toast('登录失败');
    }

  }
}
</script>

<style scoped>
.login-page{
  height:100%;
  overflow:hidden;
}
.login-page .header .brand{
  padding-left:0.68rem;
  padding-top:0.68rem;
}
.login-page .header .brand>img{
  height:0.45rem;
}
.login-page .content{
  display: flex;
  flex-direction: row;
  height:90%;
}
.login-page .content>aside{
  flex :2;
  display: flex;
}
.login-page .content>aside .layer{
  -webkit-align-self: center;
  -moz-align-self: center;
  -o-align-self: center;
  -ms-align-self: center;
  align-self: center;
  margin:0 auto;
  width:100%;
}
.login-page .content>aside .layer img{
  height:6rem;
  display: block;
  margin:0 auto;
}
.login-page .content>article{
  flex :1.6;
  display: flex;
}
.login-page .content>article .layer{
  -webkit-align-self: center;
  -moz-align-self: center;
  -o-align-self: center;
  -ms-align-self: center;
  align-self: center;
  margin:0 auto;
  width:100%;
}
.login-page .login-box{
  width:100%;
  margin:0 auto;
  max-width:6rem;
  transform: translateY(-0.4rem)
}
.login-page .login-box .head{
  margin-bottom:1rem;
}
.login-page .login-box .head img{
  display: block;
  margin:0 auto;
  height:2.4rem;
}
.login-page .login-box .p{
  margin:0.4rem 0;
}
.login-page .login-box .input-box{
  border:1px solid #ccc;
  border-radius:0.6rem;
  padding:0 0.32rem ;
  color:#424648;
}
.login-page .login-box .input-box label{
  font-size:0.28rem;
  color:#000;
}

.login-page .login-box .input-box input{
  width:60%;
  line-height: 1;
  padding:0.22rem 0;
  font-size:0.28rem;
}
.login-page .login-box .el-button{
  width:100%;
  padding:0.22rem;
  border-radius:0.6rem;
  font-size:0.3rem;
}
</style>
