<template>
  <div class="wrapper">
  <div class="hander" >
    <el-form ref="form" :model="chainInfo" :rules="rules" label-width="80px" size="small">
      <div class="item">
        <el-form-item label="名称:" prop="name" >
          <el-input style="width: 300px" v-model="chainInfo.name" :disabled="enable"></el-input>
        </el-form-item>
        <el-form-item class="interval" label="门店类型:">
          <el-select style="width: 300px" v-model="chainInfo.chainType + ''" disabled placeholder="门店类型">
            <el-option label="自营型" value="0"></el-option>
            <el-option label="加盟型" value="1"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item label="门店面积:">
          <el-input style="width: 300px" v-model="chainInfo.floorSpace" :disabled="enable">
            <div style="width: 1rem;text-align: center" slot="append">平米</div>
          </el-input>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item label="联系人:" prop="contacts">
          <el-input style="width: 300px" v-model="chainInfo.contacts" :disabled="enable">
          </el-input>
        </el-form-item>
        <el-form-item class="interval" label="电话:" prop="mobile">
          <el-input style="width: 300px" v-model="chainInfo.mobile" :disabled="enable"></el-input>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item  label="地址:" prop="address">
          <el-input style="width: 600px" v-model="chainInfo.address" autosize type="textarea" :disabled="enable"></el-input>
        </el-form-item>
      </div>
      <el-form-item  label="区域:">
        <el-input style="width: 600px" v-model="chainInfo.ofAreaName" autosize type="textarea" :disabled="enable"></el-input>
      </el-form-item>
      <el-form-item  label="备注:">
        <el-input style="width: 600px" v-model="chainInfo.remark" rows="4"  type="textarea" :disabled="enable"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button round type="warning"  @click="onSubmit('form')">{{btnName}}</el-button>
        <el-button round :disabled="enable" @click="onBtnCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
  import $http from '@/utils/httputils'
  import api from '@/api/apiList'
    export default {
        name: "ChainInfo",
        data(){
          return{
            enable:true,
            btnName:"修改",
            chainInfo:{
              name:"",
              chainType:"",
              floorSpace:0,
              address:"",
              ofAreaName:"",
              contacts:"",
              mobile:""
            },
            rules: {
              name: [
                { required: true, message: '门店名称不能为空', trigger: 'blur' }
              ],
              contacts:[
                { required: true, message: '联系人不能为空', trigger: 'blur' }
              ],
              mobile:[
                { required: true, message: '联系电话不能为空', trigger: 'blur' }
              ],
              address:[
                { required: true, message: '门店地址不能为空', trigger: 'blur' }
              ]
            }
          }
        },
      methods:{
        trimObjItem(obj){
          for(let key in obj){
            if(obj[key]==null || obj[key]=="" ){
              obj[key]="";
            }else if(typeof(obj[key])=="number"){
              obj[key]=( String(obj[key]) ).trim();
            }else{
              obj[key]=obj[key].trim();
            }
          }
          return obj;
        },
        onSubmit(form){
          if (this.enable){
            this.enable = false;
            this.btnName = '保存';
          }else{
            this.$refs[form].validate((valid) => {
              if (valid) {
                this.$dialog({
                  title:'温馨提示',
                  visible:true,
                  message:'确认修改门店信息?',
                  yes:true,
                  no:true
                },()=>{
                  $http({
                    method:'put',
                    path: api.updateChainInfo,
                    data: this.trimObjItem(this.chainInfo),
                  },res=>{
                    this.$toast("门店信息更新成功");
                    this.enable = true;
                    this.btnName = '修改';
                  },err => {
                  },this);
                });
              } else {
                this.$toast("门店信息验证失败");
                return false;
              }
            });

          }
        },
        onBtnCancel(){
          this.enable = true;
          this.btnName='修改';
          this.queryChainInfoFn();
        },
        queryChainInfoFn(){
          $http({
            method:'get',
            path: api.queryChainInfo,
            data:{},
          },res=>{
            // console.log("门店信息:",res.data);
            this.chainInfo = res.data;
          },err => {
          },this)
        }
      },
      mounted(){
        this.queryChainInfoFn();
      }
}
</script>

<style scoped>
.wrapper {
  padding: 12px;
}
.item{
  display: flex;
  flex-direction: row;
}

.hander{
  padding: 60px 0 30px 60px;
  background-color: #fff;
  border-radius: 6px;
}

.interval{
  margin: 0 0 0 10px;
}
</style>
