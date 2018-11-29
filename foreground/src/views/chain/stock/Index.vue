<template>
    <div class="layout-content">
        <div class="layout-content-main">
            <DataTable
              :url="apis.chain.stock"
              method="post"
              :columns="columns"
              :searchForm="searchForm"
            >
                <template slot="search">
                    <Form-item label="门店名称：" :label-width="80" prop="chainNameLike">
                        <Input type="text" placeholder="请输入门店名称" v-model="searchForm.chainNameLike" />
                    </Form-item>

                    <Form-item label="商品名称：" :label-width="80" prop="productNameLike">
                        <Input type="text" placeholder="请输入商品名称"  v-model="searchForm.productNameLike" />
                    </Form-item>
                    <Form-item label="商品条码：" :label-width="80" prop="productNo">
                        <Input type="text" placeholder="请输入商品条码" v-model="searchForm.productNo" />
                    </Form-item>

                    <Form-item label="商品分类：" :label-width="80" prop="productCate">
                        <Input type="text" placeholder="请输入商品分类" v-model="searchForm.productCate" />
                    </Form-item>

                </template>
            </DataTable>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import CateTreeCombo from '@/components/tree/CateTreeCombo'
  import $http from '@/utils/httputils'

  export default {
    name: 'saleProIndex',
    data () {
      return {
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 80,
            align: 'center'
          },
          {
            title: '门店名称',
            key: 'chainName',
            minWidth:140,
            align: 'center'
          },
          {
            title: '商品ID',
            key: 'productId',
            minWidth:140,
            align: 'center'
          },
          {
            title: '商品货号',
            key: 'productNo',
            minWidth:140,
            align: 'center'
          },
          {
            title: '商品名称',
            key: 'productName',
            minWidth:120,
            align: 'center'
          },
          /*
          {
            title: '商品类别编码',
            key: 'cateCode',
            minWidth:120,
            align: 'center'
          },
          */
          {
            title: '商品类别名称',
            key: 'cateName',
            minWidth:120,
            align: 'center'
          },
          {
            title: '单位',
            key: 'uint',
            minWidth:120,
            align: 'center'
          },
          {
            title: '库存数量',
            key: 'stockSum',
            minWidth:120,
            align: 'center'
          },
          {
            fixed : "right",
            title: '状态',
            key: 'status',
            minWidth:80,
            align: 'center',
            render: (h, params) => {
              let val = params.row.status
              let res = ''
              switch (val) {
                case 0:
                  res = '不正常'
                  break
                case 1 :
                  res = '正常'
                  break
              }
              return h('span', {}, res)
            } 
          }
        ],
        dateRange: '',
        searchForm: {

        }
      }
    },
    methods: {
      resetTableSearchForm () {
        this.searchForm.chainNameLike = ''
        this.searchForm.productNameLike = ''
        this.searchForm.productNo = ''

      },
    },
    components: {
      DataTable,
      CateTreeCombo
    }
  }
</script>
<style>
</style>
