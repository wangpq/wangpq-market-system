<template>
  <ProductDetail v-if="type == 'product'" :products="rows.products"></ProductDetail>
</template>
<script>
  import ProductDetail from '@/components/ProductDetail'
    export default {
        name: "PageDetail",
       components: {
        ProductDetail
      },
      mounted(){

      },
      props: {
        type:{
          type:String
        },
        rows: {
          type: Object,
          required: false
        }
      }
    }
</script>

<style scoped>

</style>
