<template>
  <el-dialog  :visible.sync="params.visible" center @open="onOpen" width="580px">
    <div class="dig-handler">
      <h2 class="title">{{params.title}}</h2>
      <div class="tips">新增账户初始密码为123456，请登录后修改</div>
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" class="demo-ruleForm">
        <el-form-item label="用户名:" prop="name">
          <el-input :prop="form.name" v-model="form.name" placeholder="请输入用户名称(登录使用)" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称:">
          <el-input :prop="form.nickname" v-model="form.nickname" placeholder="输入用户昵称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="roleId">
          <el-select v-model="form.roleId" placeholder="选择用户角色">
            <template v-for="(item) in roles">
              <el-option :label="item.rolesName" :value="item.id" :key="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input :prop="form.tel" v-model="form.tel" placeholder="输入手机号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="冻结状态:" prop="freeze">
          <!--<el-switch :prop="form.isFreeze" v-model="form.isFreeze"></el-switch>-->
          <el-radio-group v-model="form.isFreeze">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="-1">冻结</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" round type="primary" @click="onSubmit('form')">保存</el-button>
      <el-button size="small" round @click="params.visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import $http from '@/utils/httputils'
  import api from '@/api/apiList'
    export default {
        name: "UserDialog",
        props:{
          params:{
            type: Object,
            default: () => {
              return {
                title:'新增用户',
                visible:false,
                row:null
              }
            }
          }
        },
      data(){
        return{
          roles:null,
          form:{
            id:null,
            name:"",
            nickname:"",
            roleId:"",
            tel:"",
            isFreeze:1
          },
          rules: {
            name: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            roleId:[
              { required: true, message: '请选择角色', trigger: 'blur' }
            ]
          }
        }
      },
      mounted(){
        $http({
          method:'get',
          path: api.queryRoles,
          data:{  },
        },res=>{
          this.roles = res.data;
          this.form.roleId = this.roles[0].id;
        },err => {
        },this);

      },
      methods:{
        paramInit(){
          this.form.id = null;
          this.form.name = "";
          this.form.nickname = "";
          this.form.roleId = "";
          this.form.tel = "";
          this.form.isFreeze = 1;
        },
        onOpen(){
          if (this.params.row != null){
            this.form = this.params.row
          }else {
            this.paramInit()
          }
        },
        onSubmit(form){  

          this.form.name = this.form.name.trim();
          this.form.nickname = this.form.nickname.trim();
          this.form.tel = this.form.tel.trim();

          this.$refs[form].validate((valid) => {
            if (valid) {
              $http({
                method:'post',
                path: api.queryUserSave,
                data:this.form,
              },res=>{
                this.$toast("添加成功");
                this.params.visible = false;
                this.$emit('refresh');
              },err => {
              },this);
            } else {
              this.$toast("验证失败");
              return false;
            }
          });
        }
      }
    }
</script>

<style scoped>
  .tips{
    color: #ff0000;
    margin: 0 0 20px 0;
  }
  .label{
    margin: 0 0 0 10px;
    width: 2rem;
  }

  .dig-handler{
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-content:center;
    padding:0.24rem;
    border-radius:0.12rem;
    background-color: #fff;
    margin-bottom:0.12rem;
  }

  .dig-line{
    display: flex;
    flex-direction: row;
    align-items:center;
    justify-content:center;
    margin: 10px 0 0 0;
  }

  .help-tips{
    font-size: 0.2rem;
    color: #b3b3b3;
  }
  .dig-handler>.title{
    text-align: center;
    font-weight: bold;
    font-size:16px;
    padding:18px 0 12px;
  }
</style>
