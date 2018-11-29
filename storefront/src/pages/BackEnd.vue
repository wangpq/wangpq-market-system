<template>
  <div class="back-page">
      <Header></Header>
      <div id="BackBody">
        <BackMenu></BackMenu>
        <div id="BackPage">
          <keep-alive>
          <router-view></router-view>
          </keep-alive>
        </div>
      </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import BackMenu from '@/components/BackMenu'

export default {
  components: {
    Header ,
    BackMenu
  },
  created(){
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let name = userInfo.name;
    if(name && name!==""){
    }else{
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
.back-page{
  height:100%;
  display: flex;
  flex-direction: column;
}
#BackBody{
  flex :1;
  display: flex;
  flex-direction: row;
}
#BackPage{
  flex :1;
  overflow:auto;
}
</style>
