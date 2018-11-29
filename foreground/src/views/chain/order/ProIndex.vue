<template>
    <div>
        <Table ref="dataTable"
               class="orderProTable"
               :columns="columns"
               :data="data">
        </Table>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'

  export default {
    name: 'proIndex',
    props: {
      orderNo: {
        type: String,
        default: ''
      },
    },
    data () {
      return {
        data: [],
        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 80,
            align: 'center'
          },
          {
            title: '订单号',
            key: 'orderNo',
            width:200,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '商品编码',
            key: 'productNo',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '商品名称',
            key: 'productName',
            sortable:true, minWidth:70,
            align: 'center',
          },
          {
            title: '商品类别',
            key: 'productCateName',
            sortable:true,
            minWidth:70,
            align: 'center',
          },
          {
            title: '零售价(元)',
            key: 'salePrice',
            sortable:true,
            minWidth:70,
            align: 'center',
          },
          {
            title: '销售数量',
            key: 'saleNumber',
            sortable:true,
            minWidth:70,
            align: 'center',
          },
          {
            title: '折扣金额(元)',
            key: 'discountPrice',
            sortable:true,
            minWidth:70,
            align: 'center',
          },
          {
            title: '金额小计(元)',
            key: 'totalPrice',
            sortable:true,
            minWidth:70,
            align: 'center',
          }],
      }
    },
    methods: {
      query () {
        $http({
          path: this.apis.chainOrderPro.list,
          method: 'get',
          data: {orderNo: this.orderNo}
        }).then(response => {
          if (response.data.success) {
            this.data = response.data.data
          } else {
            this.$Notice.error({
              title: '提示',
              desc: response.data.message
            })
          }
        })
      },
    },
    mounted () {
      this.query()
    },
    components: {}
  }
</script>
<style lang="scss">

    .orderProTable {
        margin: 5px 5px 5px 4vw;
        border: solid 1px rgba(0, 0, 0, 0.15) !important;
        border-radius: 3px;
        .ivu-table-body {
            overflow-x: hidden;
        }
    }

</style>
