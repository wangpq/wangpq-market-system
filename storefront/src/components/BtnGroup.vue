<template>
  <div class="btn-group" >
    <template v-for="item in data">
      <el-button size="small" :disabled="item.disabled" :key="item.click" :type="item.type" :icon="item.icon"  @click="onClick(item.click)">{{item.name}}</el-button>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      data:{
        type: Array,
        default : []
      }
    },
    methods:{
      onClick(event){
        this.$emit(event);
      }
    }
  }
</script>

<style scoped>
.btn-group{
  text-align: left;
  padding: 14px 14px 6px;
}
.btn-group>button{
  margin-right:8px;
}
.btn-group>button:last-of-type{
  margin-right:0;
}
</style>