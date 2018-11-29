<template>
  <div class="wrapper">
    <div class="hander">

      <el-form ref="form" :model="accountInfo" :rules="rules" label-width="80px" size="small">

        <el-form-item label="门店名" prop="chainName" >
          <el-input style="width: 380px" v-model="accountInfo.chainName" disabled="disabled"></el-input>
        </el-form-item>

        <el-form-item label="商户号" prop="mchId" >
          <el-input style="width: 380px" clearable v-model="accountInfo.mchId" :disabled="enable"></el-input>
        </el-form-item>


        <el-form-item label="账户ID" prop="id" style="display: none">
          <el-input style="display: none"  clearable v-model="accountInfo.id" :disabled="enable"></el-input>
        </el-form-item>

        <el-form-item label="付款提示" prop="attach" >
          <el-tooltip class="item" effect="dark" content="支付弹框提示语" placement="right">
            <el-input style="width: 380px" clearable v-model="accountInfo.attach" :disabled="enable"></el-input>
          </el-tooltip>
        </el-form-item>


        <el-form-item  label="RSA公钥" prop="publicKey">
          <el-tooltip class="item" effect="dark" content="由全付通平台生成，直接获取" placement="right">
            <el-input
              style="width: 380px"
              type="textarea"
              v-model="accountInfo.publicKey"
              placeholder="请输入RSA公钥"
              :autosize="{ minRows: 4, maxRows: 6}"
              :disabled="enable">
            </el-input>
          </el-tooltip>

        </el-form-item>

        <el-form-item  label="RSA私钥" prop="privateKey">
          <el-tooltip class="item" effect="dark" content="由商户自己生成，将公钥上传全付通平台" placement="right">
          <el-input
            style="width: 380px"
            type="textarea"
            placeholder="请输入RSA私钥"
            v-model="accountInfo.privateKey"
            :autosize="{ minRows: 4, maxRows: 6}"
            :disabled="enable">
          </el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="APPID" prop="subAppid"  >
          <el-input style="width: 380px"  clearable v-model="accountInfo.subAppid" :disabled="enable"></el-input>
        </el-form-item>

        <div style="color: #ff0000;margin: 0.5rem">注:商户结算结算账号由贵州华科建邺向<a href="https://citicmch.swiftpass.cn/" target="_blank">全付通</a>申请</div>

        <el-form-item>
          <el-button round type="warning" @click="onSubmit('form')">{{btnName}}</el-button>
          <el-button round :disabled="enable" @click="onBtnCancel">取消</el-button>
        </el-form-item>

      </el-form>


    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import api from '@/api/apiList'
import {trim,timeOutFn} from '@/utils/utils'

import {Button,Input,Dialog} from 'element-ui';
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Input);

export default {
  name: 'BalanceAccount',
  data() {
    return {

      enable:true,
      btnName:"修改",

      accountInfo:{
        // 门店名
        chainName : "",
        // 商户号
        mchId : "",
        // 账户ID
        id : "",
        // 付款提示语，不填默认为门店名称
        attach  : "",
        // 商户公钥
        publicKey : "",
        // 商户密钥
        privateKey : "",
        //商户公众号
        subAppid:""
      },
      rules: {
        mchId:[
          { required: true, message: '商户号不能为空', trigger: 'blur' }
        ],
        publicKey:[
          { required: true, message: 'RSA公钥不能为空', trigger: 'blur' }
        ],
        privateKey:[
          { required: true, message: 'RSA私钥不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created : function(){
    this.onCheckPlatformInfos();
  },
  methods : {
    trimObjItem(obj){
      for(let key in obj){
        if(obj[key]==null || obj[key]=="" ){
          obj[key]="";
        }else if(typeof(obj[key])=="number"){
          obj[key]=trim( String(obj[key]) );
        }else{
          obj[key]=trim(obj[key]);
        }
      }
      return obj;
    },
    onSubmit(form){
      if (this.enable){
        this.enable = false;
        this.btnName = '保存';
      }else{
        debugger
        this.$refs[form].validate((valid) => {
          debugger
          if (valid) {

            let params=this.trimObjItem(this.accountInfo);
            let reqParams = {
              id:parseInt(params.id),
              chainName:params.chainName,
              attach:params.attach,
              mchId:params.mchId,
              privateKey:params.privateKey,
              publicKey:params.publicKey,
              subAppid:params.subAppid
            }

            this.$ajax
            .post(api.queryChainAccountSave,reqParams)
            .then( (response) =>{
              let res=response.data;
              if(res.success){
                this.$toast("账号信息更新成功");
                this.enable = true;
                this.btnName = '修改';

              }else{
                this.$toast("账号信息更新失败");
              }
            })
            .catch( (error)=> {
            });


          } else {
            this.$toast("门店信息验证失败");
            return false;
          }
        })
      }
    },


    onBtnCancel(){
      this.enable = true;
      this.btnName='修改';
      this.onCheckPlatformInfos();
    },


    onCheckPlatformInfos(){
      // 查看信息公钥等信息 /chain/account
      this.$ajax
      .get(api.queryChainAccount)
      .then( (response) =>{
        timeOutFn(this,response,()=>{
          let res=response.data;
          if(res.success){
            if(res.data){
              this.accountInfo=res.data;
            }else{
              this.accountInfo.chainName = "";
              this.accountInfo.mchId = "";
              this.accountInfo.id = "";
              this.accountInfo.attach = "";
              this.accountInfo.publicKey = "";
              this.accountInfo.privateKey = "";
              this.accountInfo.subAppid = "";
            }
          }
        })
      })
      .catch( (error)=> {
      });

    }

  }
}
</script>

<style scoped>
.wrapper{
  padding:12px;
}
.hander{
  padding: 60px 0 30px 60px;
  background-color: #fff;
  border-radius: 6px;
}

</style>
