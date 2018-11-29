<template>
    <div route="/chain/log/error" id="errorlogIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.paylog.getErro"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="订单号" :label-width="60" prop="orderSn">
                        <Input type="text" v-model="searchForm.orderSn"></Input>
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
    name: 'errorlogIndex',
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
            title: '订单号',
            key: 'orderSn',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '支付金额',
            key: 'payMoney',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '相关信息',
            key: 'content',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '支付渠道',
            key: 'payWay',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '失败原因',
            key: 'reason',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
            minWidth:140,
            align: 'center'
          }],
        dateRange: '',
        searchForm: {
          orderSn: null,
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
