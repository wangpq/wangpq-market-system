<template>
  <div class="modify-pass-page">
      <Header></Header>
      <ModifyPassBody></ModifyPassBody>
  </div>
</template>

<script>
import Header from '@/components/Header'
import ModifyPassBody from '@/components/ModifyPassBody'

const getFirstNavActive=function(){
    let node=document.querySelector("#header .nav li:first-child a");
    node.classList.add("router-link-exact-active");
    node.classList.add("router-link-active");
}

export default {
  components: {
    Header,
    ModifyPassBody
  },
  created: function() {
    // let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // let name = userInfo.name;
    // if(name && name!==""){
      /*
       var timer= window.setTimeout(function(){
        getFirstNavActive();
        window.clearTimeout(timer);
      },10)
      */
    // }else{
      // this.$router.push("/login");
    // }
  }
}
</script>

<style scoped>
.modify-pass-page{
  height:100%;
  display: flex;
  flex-direction: column;
}
</style>
