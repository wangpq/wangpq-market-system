<template>
  <div class="wrap">
    <template v-for="(item,index) in btMenus">
      <el-button size="small" :key="item.resId+index" class="interval" :type="item.resId" :icon="item.resIcon" @click="onClick(item.resCilck)">{{item.title}}</el-button>
    </template>
  </div>
</template>

<script>
  import $http from '@/utils/httputils'
    export default {
      name: "BtnMenu",
      data(){
        return{
          btMenus:null
        }
      },
      props: {
        pmenu:{
          type:Object
        }
      },
      methods:{
        onClick(click){
          this.$emit(click);
        }
      },
      mounted(){
        $http({
          method:'get',
          path:'system/role/menubtn',
          data:{ menuId:this.pmenu.menuid },
        },res=>{
          this.btMenus = res.data;
        },err => {
        },this);
      }
    }
</script>

<style scoped>
.wrap{
  padding:8px;
}
</style>
