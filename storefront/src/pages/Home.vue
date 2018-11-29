<template>
  <div class="container" v-loading="true">
  </div>
</template>

<script>
import Vue from 'vue';
import { Loading} from 'element-ui';
Vue.use(Loading);

export default {
  created(){
    let timer=window.setTimeout(()=>{
      window.clearTimeout(timer);
      this.$router.push("/login");
    },480)
  }
}
</script>

<style scoped>
.container{
  height:100%;
}
</style>
