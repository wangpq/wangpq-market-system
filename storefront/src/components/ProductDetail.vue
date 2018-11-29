<template >
  <el-table :data="products"
            border
            stripe="stripe"
            style="width: 100%; border:1px dashed gray;">
    <el-table-column
      type="index"
      align="center"
      width="60"
      label="序号">
    </el-table-column>
    <template v-for = "(item,index) in columns" >
      <el-table-column
        align="center"
        :key="index"
        :formatter="item.formatter"
        :prop="item.type"
        :label="item.title"
        :width="item.width" >
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  name: "ProductDetail",
  props: {
    products: {
      type: Array,
      required: false
    }
  },
  data(){
    return{
      columns:[{
        title: '货号',
        type: 'productNo',
        width: 140,
      },{
        title: '名称',
        type: 'productName',
        width: 200,
      },{
        title: '零售价',
        type: 'salePrice',
        width: 80,
      },{
        title: '折扣',
        type: 'ratio',
        width: 80,
      },{
        title: '优惠金额',
        type: 'discountPrice',
        width: 100,
      },{
        title: '数量',
        type: 'saleNumber',
        width: 80,
      },{
        title: '小计',
        type: 'totalPrice',
        width: 80,
      },{
        title: '实付',
        type: 'payPrice',
        width: 80,
      }]
    }
  }
}
</script>

<style scoped>

</style>
