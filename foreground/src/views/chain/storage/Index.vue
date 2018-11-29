<template>
    <div class="layout-content">
        <div class="layout-content-main">
            <DataTable
              :url="apis.chain.storage"
              method="post"
              :columns="columns"
              :searchForm="searchForm"
            >
                <template slot="search">
                    <Form-item label="门店名称：" :label-width="80" prop="chainNameLike">
                        <Input type="text" placeholder="请输入门店名称" v-model="searchForm.chainNameLike" />
                    </Form-item>
                    <Form-item label="入库单号：" :label-width="80" prop="no">
                        <Input type="text" placeholder="请输入入库单号"  v-model="searchForm.no" />
                    </Form-item>
                    <Form-item label="订货单号：" :label-width="80" prop="callNo">
                        <Input type="text" placeholder="请输入订货单号："  v-model="searchForm.callNo" />
                    </Form-item>
                    <Form-item label="订货日期：" :label-width="80" prop="orderTime">
                      <DatePicker
                        :clearable="clearable"
                        type="daterange"
                        v-model="orderTime"
                        @on-change="onOrderTimeRange"
                        format="yyyy-MM-dd"
                        placeholder="选择日期区间"
                        style="min-width: 10vw"
                      >
                      </DatePicker>
                    </Form-item>
                    <Form-item label="入库日期：" :label-width="80" prop="putTime">
                      <DatePicker
                        :clearable="clearable"
                        type="daterange"
                        v-model="putTime"
                        @on-change="onPutTimeRange"
                        format="yyyy-MM-dd"
                        placeholder="选择日期区间"
                        style="min-width: 10vw"
                      >
                      </DatePicker>
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
        clearable : false,
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 80,
            align: 'center'
          },
          {
            title: '入库单号',
            key: 'no',
            minWidth:140,
            align: 'center'
          },
          {
            title: '订货单号',
            key: 'callNo',
            minWidth:140,
            align: 'center'
          },
          {
            title: '门店名称',
            key: 'chainName',
            minWidth:140,
            align: 'center'
          },
          {
            title: '商品种类数量',
            key: 'cateSum',
            minWidth:120,
            align: 'center'
          },

          {
            title: '要货人',
            key: 'applyName',
            minWidth:120,
            align: 'center'
          },
          {
            title: '要货总数量',
            key: 'sum',
            minWidth:120,
            align: 'center'
          },
          {
            title: '入库库日期',
            key: 'putTime',
            minWidth:120,
            align: 'center'
          },
          {
            title: '要货日期',
            key: 'orderTime',
            minWidth:120,
            align: 'center'
          },
          {
            title: '总费用',
            key: 'total',
            minWidth:120,
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
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
              var val = params.row.status
              var res = ''
              switch (val) {
                case 0:
                  res = '不正常';
                  break;
                case 1:
                  res = '正常';
                  break;
              }
              return h('span', {}, res)
            }
          }   
        ],
        orderTime : "",
        putTime : "",
        searchForm: {
          chainNameLike : '',
          productNameLike :'',
          productNo : '',
          orderTimeStart  : '',
          orderTimeEnt : '',
          putTimeStart : '',
          putTimeEnt : ''
        }
      }
    },
    methods: {
      resetTableSearchForm () { 
        /* 
        this.searchForm.chainNameLike = ''
        this.searchForm.productNameLike = ''
        this.searchForm.productNo = ''
        this.searchForm.orderTime='';
        this.searchForm.orderTimeStart='';
        this.searchForm.orderTimeEnt='';
        this.searchForm.putTime='';
        this.searchForm.putTimeStart=''; 
        this.searchForm.putTimeEnt=''; 
        */
      },
      onOrderTimeRange(e) {
        this.searchForm.orderTimeStart   = e[0] + " 00:00:00"
        this.searchForm.orderTimeEnt   = e[1] + " 23:59:59"
      },
      onPutTimeRange(e) {
        this.searchForm.putTimeStart    = e[0] + " 00:00:00"
        this.searchForm.putTimeEnt    = e[1] + " 23:59:59"
      }
    },
    components: {
      DataTable,
      CateTreeCombo
    }
  }
</script>
<style>
</style>
