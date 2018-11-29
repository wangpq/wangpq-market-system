<template>
<transition name="fade">
  <div class="toast" @click="afterToastHide" v-show="visible">
    <div class="wrap">
      <div class="content">
        <div class="body"><slot>{{message}}</slot></div>
        <div v-if="showBtn" class="opt" @click="afterToastHide"><button>知道了</button></div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示按钮
      showBtn : false,
      // 显示的信息
      message: "",
      // 自动关闭
      autoHide : false,
      // toast 隐藏后显示后执行函数
      onAfterToastHide : ()=>{}
    };
  },
  methods:{
    afterToastHide(){   
      this.visible=false;
      this.onAfterToastHide && this.onAfterToastHide();
    }
  }
};
</script>

<style scoped>
.toast{
  position: fixed;
  left:0;
  top:0;
  bottom:0;
  right:0;
  z-index:9999;
  background-color: rgba(0,0,0,0);
  display: flex;
  flex-direction: row;
  
}
.toast>.wrap{
  align-self: center;
  margin:0 auto;
  background-color: rgba(66,70,72,0.5);
  border-radius :0.15rem;
  padding: 0.88rem 0.48rem;
  min-width:4rem;
}
.toast>.wrap .body{
  color:#fff;
  font-size:0.28rem;
  margin-bottom:0.1rem;
  text-align: center;
}
.toast>.wrap .opt{
  text-align: center;
}
.toast>.wrap .opt button{
  color:#aac849;
  cursor:pointer;
  font-size:0.22rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.2s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
