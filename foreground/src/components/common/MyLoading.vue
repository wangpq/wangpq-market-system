<template>
  <div id="myLoading">
    <Spin :size="size" fix v-if="show">
      <Icon type="load-a" size=48 class="datatable-spin-icon-load"></Icon>
      <div>数据加载中……</div>
    </Spin>
  </div>
</template>
<script>
export default {
  name: 'myLoading',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'large'
    }
  },
  data () {
    return {

    };
  }
};
</script>
<style scoped>
.datatable-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
</style>
