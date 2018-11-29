<template>
  <div id="app">
    <div id="lodopInfos"></div>
    <router-view></router-view>  <!-- 这里是展示来自路由页面数据的 -->
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body{
  background-color:#f2f2f2;
}
html,body,#app,.height100{
  height:100%;
  overflow:hidden;
}
#lodopInfos{
  padding:0 18px;
  text-align: center;
}
</style>



