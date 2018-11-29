<template>
  <div>
    <!--<div class="header">-->
      <!--<img width="100px" height="50px"  src="./assets/logo.png">-->
      <!--<div>中铁如家前台销售系统</div>-->
    <!--</div>-->
    <div id="app">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}

  .header{
    text-align: left;
  }
</style>
