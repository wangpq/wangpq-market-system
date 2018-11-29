<template>
<div class="layout-content">
  <div class="layout-content-main">
    <DataTable
      :url="apis.chainStock.product"
      method="post"
      :columns="columns"
      :searchForm="searchForm"
    >
      <template slot="search">
          <Form-item label="商品编号：" :label-width="80" prop="productNo">
              <Input type="text" placeholder="请输入商品编号" v-model="searchForm.productNo" />
          </Form-item>

          <Form-item label="商品名称：" :label-width="80" prop="productNameLike">
              <Input type="text" placeholder="请输入商品名称" v-model="searchForm.productNameLike" />
          </Form-item>
      </template>
    </DataTable>
    <StockPriceDialog :opt="initStockDig"></StockPriceDialog>
  </div>
</div>
</template>
<script>
  import $http from '@/utils/httputils'
  import DataTable from '@/components/common/DataTable'
  import StockPriceDialog from '@/views/product/info/StockPriceDialog'

  export default {
    components: {
      DataTable,
      StockPriceDialog
    },
    data () {
      return {
        initStockDig:{
          visible:false,
          title:'商品进货价',
          okText:'保存',
          cancelText:'取消',
          product:""
        },
        searchForm : {
        },
        //表格 columns
        columns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '序号',
            type: 'index',
            minWidth:80,
            align: 'center'
          },
          {
            title: '商品编号',
            key: 'productNo',
            minWidth:140,
            align: 'center'
          }, 
          {
            title: '商品名称',
            key: 'productName',
            minWidth:140,
            align: 'center'
          },
          {
            title: '规格',
            key: 'specification',
            minWidth:80,
            align: 'center'
          },
          {
            title: '单位',
            key: 'unit',
            minWidth:80,
            align: 'center'
          },
          {
            title: '状态',
            key: 'status',
            minWidth:80,
            fixed:'right',
            align: 'center',
            render: (h, params) => {
              let val = params.row.status;
              let res="";
              switch (val) {
                case 0:
                  res='不正常';
                  break;
                case 1:
                  res='正常';
                  break;
                default :
                  res='不正常';
              }
              return h('span', {}, res);
            }
          }
        ]
      }
    },
    methods : {
      handleAddOrderPrice(row){
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.initStockDig.visible = true;
        this.initStockDig.product = row;
      }
    }
  }
</script>
<style>
</style>
