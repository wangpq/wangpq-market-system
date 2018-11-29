<template>
    <div route="/chain/sale/product" id="saleProIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.chainOrder.salePro"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="货号" :label-width="60" prop="productNo">
                        <Input type="text" v-model="searchForm.productNo"></Input>
                    </Form-item>

                    <Form-item label="门店名" :label-width="60" prop="chainName">
                        <Input type="text" v-model="searchForm.chainName"></Input>
                    </Form-item>

                    <Form-item label="商品分类" :label-width="60" prop="productCateName">
                        <CateTreeCombo @selectNode="selectNode" ref="CateTreeCombo"
                                       class="CateTreeCombo"></CateTreeCombo>
                    </Form-item>
                    <Form-item label="日期" :label-width="60" prop="saleTime">
                        <DatePicker :clearable="false" type="daterange" v-model="dateRange"
                                    @on-change="selectRange" format="yyyy-MM-dd" placeholder="选择日期区间"
                                    style="min-width: 10vw"></DatePicker>
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
            title: '商品货号',
            key: 'productNo',
            sortable: true,
            minWidth:140,
            align: 'center'
          },
          {
            title: '商品名称',
            key: 'productName',
            sortable: true,
            minWidth:120,
            align: 'center'
          },
          {
            title: '门店名称',
            key: 'chainName',
            sortable: true,
            minWidth:100,
            align: 'center'
          },
          {
            title: '商品零售价',
            key: 'salePrice',
            sortable: true,
            minWidth:80,
            align: 'center'
          },
          {
            title: '订单总量',
            key: 'orderNum',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '销售总量',
            key: 'saleNum',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '总优惠金额',
            key: 'discountPrice',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '平均折扣率',
            key: 'avgRatio',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '总销售价',
            key: 'totalPrice',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '实际销售总价',
            key: 'payPrice',
            sortable: true,
            minWidth:70,
            align: 'center'
          }
        ],
        dateRange: '',
        searchForm: {
          productNo: null,
          chainName: null,
          productCateId: null,
          startTime: null,
          endTime: null,
        },
      }
    },
    methods: {
      //选择 父级菜单之后回调方法
      selectNode (opt) {
        this.searchForm.productCateId = opt.id
        console.log('选择父级菜单之后回调值：' + opt.id + opt.title)
      },

      selectRange (e) {
        this.searchForm.startTime = e[0]
        this.searchForm.endTime = e[1]
      },
      resetTableSearchForm () {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
        this.dateRange = ''
        this.searchForm.productCateId = ''
        this.$refs.CateTreeCombo.reset()
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
