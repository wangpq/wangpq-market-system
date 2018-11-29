<template>
  <div class="front-page">
      <Header></Header>
      <FrontBody></FrontBody>
      <FrontFoot></FrontFoot>
  </div>
</template>

<script>
import Header from '@/components/Header'
import FrontBody from '@/components/FrontBody'
import FrontFoot from '@/components/FrontFoot'
import LodopDetect from '@/components/LodopDetect'

import api from '@/api/apiList'

export default {
  components: {
    Header ,
    FrontBody,
    FrontFoot,
    LodopDetect
  },
  created () {
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
.front-page{
  height:100%;
  display: flex;
  flex-direction: column;
}
</style>
