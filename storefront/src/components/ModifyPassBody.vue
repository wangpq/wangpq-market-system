<template>
  <div class="ModifyPassBody">
    <dl>
      <dt>
        <div class="head">
           <i></i><span>修改密码</span>
        </div>
        <div class="body">
          <p>
             <label for="userName"><i>*</i><span>旧密码</span></label>
             <span class="input">
               <input type="password" v-model="oldPwd" ref="modifyOldPass" placeholder="请输入旧密码">
             </span>
          </p>
          <p>
             <label for="userName"><i>*</i><span>新密码</span></label>
             <span class="input">
               <input type="password" v-model="newPwd" ref="modifyNewPass" placeholder="请输入新密码">
             </span>
          </p>
        </div>
      </dt>
      <dd>
        <el-button type="success" round size="small" @click="onModifySave">保存</el-button>
        <el-button type="info" round size="small" @click="onModifyCancel">取消</el-button>
      </dd>
    </dl>
  </div>
</template>

<script>
import Vue from 'vue';
import { Button} from 'element-ui';
import {trim,timeOutFn} from '@/utils/utils'
import api from '@/api/apiList'
Vue.use(Button);



export default {
  name: 'ModifyPassBody',
  data () {
    return {
      oldPwd : "",
      newPwd : ""
    }
  },
  created: function() {
  },
  methods : {
    onModifySave(){
      this.oldPwd=trim(this.oldPwd);
      this.newPwd=trim(this.newPwd);

      if(this.oldPwd.length<=0){
        this.$toast({
          message : "请输入旧密码!",
          showBtn : true
        });
        this.$refs.modifyOldPass.focus();
        return false;
      }
      if(this.newPwd.length<=0){
        this.$toast({
          message : "请输入新密码!",
          showBtn : true
        });
        this.$refs.modifyNewPass.focus();
        return false;
      }

      if (!this.validate(this.newPwd)) {
        this.$message.error('密码太简单,请输入6-30位数字+字母');
        return false;
      }

      this.$ajax.put(api.queryModifypwd,{
        "oldPwd":  this.oldPwd,
        "newPwd":  this.newPwd
      })
      .then( (response) =>{

        timeOutFn(this,response,()=>{
          if(response.status==200 &&  response.data){
            if(response.data.success){
              this.$message({
                message: '密码修改成功！，即将重新登录',
                type: 'success'
              });
              let timer=window.setTimeout(()=>{
                  this.$router.push("/login");
                  window.clearTimeout(timer);
              },1800)
            }else{
              this.$toast(response.data.message || "密码修改失败");
            }
          }else{
            this.$toast("密码修改失败");
          }

        })
      })
      .catch( (error)=> {
        this.$toast(error || "密码修改失败");
      });
    },
    // 取消返回上一页
    onModifyCancel(){
      this.$router.go("-1");
    }  ,
    validate(password){
      let regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{6,30}');
      return regex.test(password);
    }
  }
}
</script>

<style scoped>
.ModifyPassBody{
  flex :1;
  display: flex;
}
.ModifyPassBody dl{
  margin:0 auto;
  align-self: center;
  background-color: #fff;
  box-shadow: 0 0 0.2rem 0.08rem #ccc;
  width:440px;
  margin:0 auto;
  border-radius:0.1rem;
}
.ModifyPassBody dl dt{
  padding:0.2rem;
}
.ModifyPassBody dl dt .head>i{
  display: inline-block;
  width: 3px;
  height: 16px;
  line-height: 16px;
  background-color: #aac849;
  vertical-align: middle;
  margin-right: 6px;
}
.ModifyPassBody dl dt .head>span{
  font-size: 15px;
  font-weight: bold;
  vertical-align: middle;
  color: #000;
}
.ModifyPassBody dl dt .body{
  width:320px;
  margin:68px auto;
}
.ModifyPassBody dl dt .body p{
  margin:14px 0;
}
.ModifyPassBody dl dt .body p>label{
  font-size:14px;
  vertical-align: middle;
  margin-right: 4px;
}
.ModifyPassBody dl dt .body p>label>i{
  color:#e26336;
  margin-right:4px;
  font-style: normal;
  font-weight: bold;
  font-size:16px;
}
.ModifyPassBody dl dt .body p>span>input{
  border:1px solid #ccc;
  border-radius:3px;
  padding:8px 10px;
  width:220px;
}

.ModifyPassBody dl dd{
  text-align: center;
  border-top:1px solid #ccc;
  padding:0.3rem 0;
}

</style>
