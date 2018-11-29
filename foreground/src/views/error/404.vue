<template lang="html">
  <div class="layout">
    <div class="layout-content">
      <div class="layout-content-main">
        <Icon type="android-sad" :size="128"></Icon>
        <p>您访问的页面去土耳其吃雪糕咯！</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
.layout-content {
  .layout-content-main{
    text-align: center;

    h1 {
      font-size: 10em;
    }
    p {
      font-weight: bold;
      font-size: 2em;
    }
  }
}
</style>
