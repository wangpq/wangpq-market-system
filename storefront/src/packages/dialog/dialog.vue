<template>
  <transition name="fade">
    <el-dialog
      top="0vh" 
      :center=true
      :visible.sync="visible"
      width="20%"
      >
      <div class="my-dialog">
        <h2>{{title}}</h2>
        <div class="content">{{message}}</div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button round size="small" v-if="no" @click="onBtnCancel">取 消</el-button>
        <el-button round size="small" v-if="yes" type="primary" @click="onclick">确 定</el-button>
      </span>
    </el-dialog>
  </transition>
</template>

<script>
    export default {
      name: "Dialog",
      data(){
          return{
            title:"温馨提示",
            visible:false,
            message:"",
            yes:false,
            no:false,
            success:()=> {},
            cancel:()=>{}
          }
      },
      methods:{
        onBtnCancel(){
          this.visible = false;
          this.cancel();
        },
        onclick(){
          this.visible = false;
          this.success();
        }
      }
    }
</script>

<style scoped>
.my-dialog{
  text-align:center;
}
.my-dialog>h2{
  font-size:16px;
  font-weight:bold;
  padding:28px 0 0;
}
.my-dialog>.content{
  text-align: center;
  margin: 18px;
}
</style>
