<template>
  <el-dialog :visible.sync="params.visible" center @open="onOpen" width="580px">
    <div class="dig-handler">
      <h2 class="title">{{params.title}}</h2>
      <el-form ref="form" size="small" :model="form" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="类型:" prop="memberCode">
          <el-input placeholder="请输入内容" v-model="form.memberCode" :prop="form.memberCode" class="input-with-select">
            <el-select v-model="form.type" slot="prepend" placeholder="请选择">
              <el-option label="未知"  value="0"></el-option>
              <el-option label="手机号"  value="1"></el-option>
              <el-option label="身份证"  value="2"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="用户名:" prop="name">
          <el-input :prop="form.name" v-model="form.name" placeholder="输入用户名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="折扣:" prop="gradeId">
          <el-select style="width: 5rem" v-model="form.gradeId"  placeholder="请选择">
            <template v-for="(item, index) in memberDiscounts">
              <el-option :label="item.name" :value="item.id" :key="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="0" value="0">保密</el-radio>
            <el-radio label="1" value="1">男</el-radio>
            <el-radio label="2" value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日:">
            <el-date-picker type="date"  placeholder="选择生日" v-model="form.birthday" format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.remark">
          </el-input>
        </el-form-item>

      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button round type="primary" @click="onSubmit('form')">保存</el-button>
      <el-button round @click="params.visible = false">取消</el-button>
    </span>

  </el-dialog>
</template>

<script>
  import api from '@/api/apiList'
  import $http from '@/utils/httputils'
  import {isCardID} from '@/utils/utils'
  import dateformat from '@/utils/dateformat'

    export default {
        name: "MemberDialog",
        props:{
          params:{
            type: Object,
            default: () => {
              return {
                title:'新增会员',
                visible:false,
                row:null
              }
            }
          }
        },
      data(){
          return{
            form:{
              id:null,
              memberCode:"",
              name:"",
              gender:"0",
              type:"1",
              birthday:"",
              gradeId:1,
              gradeName:""
            },
            memberDiscounts:null,
            rules: {
              name: [
                { required: true, message: '请输入会员名称', trigger: 'blur' }
              ],
              memberCode:[
                { required: true, message: '请输入会员号', trigger: 'blur' }
              ],
              gender:[
                {required: true, message: '请选择性别', trigger: 'blur' }
              ],
              gradeId:[
                {required: true, message: '请选择用户折扣类型', trigger: 'blur' }
              ]
            }
          }
      },
    mounted(){

    },
      methods:{
        paramInit(){
          this.form.id = null;
          this.form.memberCode = "";
          this.form.name = "";
          this.form.gender = "0";
          this.form.type = "1";
          this.form.birthday = "";
          this.form.remark ="";
        },
        getDiscounts(){
          $http({
            method:'get',
            path: api.memberDiscounts,
            data:{},
          },res=>{
            this.memberDiscounts = res.data;
          },err => {
          },this);
        },
        onOpen(){
          if (this.params.row != null){
            this.form = this.params.row;
            this.form.type =  this.form.type + "";
            this.form.gender =  this.form.gender + "";
          }else{
            this.paramInit();
          }
          this.getDiscounts();
        },
        onSubmit(form){
          

          this.form.memberCode = this.form.memberCode.trim();
          this.form.name = this.form.name.trim();
          this.form.remark =this.form.remark==null ? "" : this.form.remark.trim();

          if(!!this.form.birthday){  
            // 这是已经格式化的
            if(typeof(this.form.birthday)==="string"){
            }else{
              this.form.birthday=dateformat.format(this.form.birthday, 'yyyy-MM-dd hh:mm:ss');
            }
          }

          if(this.form.memberCode.length!==11 && this.form.type==1){
            this.$toast("请输入正确的手机号！");
            return false;
          }

          if(this.form.type==2){

            if(this.form.memberCode==""){
              this.$toast("请输入正确的身份证号！");
              return false;
            }else{
              let flag=isCardID( this.form.memberCode );
              if(flag!==true){
                this.$toast(flag);
                return false; 
              }
            }
          }
          if (this.memberDiscounts != null){
            this.memberDiscounts.forEach((value, index, array)=>{
              if (array[index].id == this.form.gradeId){
                this.form.gradeId = array[index].id;
                this.form.gradeName = array[index].name;
              }
            });
          }

          this.$refs[form].validate((valid) => {
            if (valid) {
              $http({
                method:'post',
                path: api.memberSaveUpdate,
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
  .el-select{
    width: 100px;
  }

  .el-input{
    width: 280px;
  }
 .dig-handler>.title{
    text-align: center;
    font-weight: bold;
    font-size:16px;
    padding:18px 0 12px;
  }
</style>
