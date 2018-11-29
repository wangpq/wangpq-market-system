<template>
    <div route="/chain/log" id="paylogIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.paylog.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="支付订单号" :label-width="80" prop="orderSn">
                        <Input type="text" v-model="searchForm.orderSn"></Input>
                    </Form-item>
                    <Form-item label="交易流水号" :label-width="80" prop="tradeSn">
                        <Input type="text" v-model="searchForm.tradeSn"></Input>
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
  import $http from '@/utils/httputils'

  export default {
    name: 'paylogIndex',
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
            title: '支付订单号',
            key: 'orderSn',
            width: 200,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '交易流水号',
            key: 'tradeSn',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '支付方式',
            key: 'paymentName',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '支付金额',
            key: 'payMoney',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '返回代码',
            key: 'payContent',
            sortable:true,
            minWidth:70,
            tooltip:true,
            align: 'center'
          },
          {
            title: '商户号',
            key: 'mchId',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '找零',
            key: 'pocket',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '总金额',
            key: 'takeMoney',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '支付时间',
            key: 'createTime',
            sortable:true,
            minWidth:140,
            align: 'center'
          }],
        dateRange: '',
        searchForm: {
          orderSn: null,
          tradeSn: null,
          startTime: null,
          endTime: null,
        },
      }
    },
    methods: {
      selectRange (e) {
        this.searchForm.startTime = e[0]
        this.searchForm.endTime = e[1]
      },
      resetTableSearchForm () {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
        this.dateRange = ''
      },

    },
    components: {
      DataTable,
    }
  }
</script>
<style>

</style>
