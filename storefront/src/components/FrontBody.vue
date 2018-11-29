<template>
  <!--
    <el-table
      :data="goodlist"
      style="width: 100%"
      ref="shopListTable"
      @selection-change="handleShopListSelectionChange"
    >

  -->
  <div id="FrontBody">
    <div class="container">
      <div v-if="productList.length<=0" class="welcome">
        <div class="figure">
          <img src="../assets/images/frontEnd/img_welcome.png" alt="">
        </div>
      </div>

      <el-table
        v-else
        :data="productList"
        style="width: 100%"
        ref="shopListTable"
        @selection-change="handlePrdListSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          width="60"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="selfCode"
          label="自编码">
        </el-table-column>
        <el-table-column
          prop="productNo"
          label="条码">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="salePrice"
          label="原价">
        </el-table-column>
        <el-table-column
          prop="ratio"
          label="折扣">
        </el-table-column>
        <el-table-column
          prop="saleNumber"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="payPrice"
          label="金额">
        </el-table-column>
        <!--
        <el-table-column
          prop="payPrice"
          label="优惠">
        </el-table-column>
        -->
      </el-table>
    </div>
  </div>
</template>

<script>
import { Table } from 'element-ui';

import {
  mapGetters,
  mapActions
} from "vuex";

export default {
  mounted(){
  },
  computed: {
    //...mapGetters(["productList"]),
    productList(){
      //console.log("商品信息:",this.$store.state.product.productList)
      return this.$store.state.product.productList;
    }
  },
  methods: {
    //...mapActions(['addPrdToProductListSelect'])
    handlePrdListSelectionChange(val) {
      this.$store.dispatch('addPrdToProductListSelect',val);
    }
  }
}
</script>

<style>
#FrontBody{
  flex:1;
  padding:0.24rem;
  display: flex;
}
#FrontBody>.container{
  overflow:auto;
  width: 100%;
  border-radius:0.1rem;
  background-color: #fff;
}
#FrontBody>.container>.welcome{
  display: flex;
  flex-direction: row;
  height:100%;
}
#FrontBody>.container>.welcome>.figure{
   align-self: center;
   width:100%;
}
#FrontBody>.container>.welcome>.figure>img{
   display: block;
   margin:0 auto;
   width:4.5rem;
}
.el-table th>.cell{
  text-align: center;
}
.el-table .cell{
  text-align: center;
}
</style>
