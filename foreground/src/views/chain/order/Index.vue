<template>
    <div route="/chain/order" id="chainOrderIndex" class="layout-content chainOrderIndex">
        <div class="layout-content-main">
            <Row class="sale-content">
                <Col span="12">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            总销售量
                        </p>
                        <count-to
                                class="sale-count"
                                :startVal='0'
                                :endVal='saleCount.total'
                                :duration=4000
                                suffix="单"></count-to>
                    </Card>
                </Col>
                <Col span="12">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            总销售额
                        </p>
                        <count-to
                                class="sale-count"
                                :startVal='0'
                                :endVal='saleCount.totalPrice'
                                :duration=2000
                                :decimals=2
                                suffix="元"></count-to>
                    </Card>
                </Col>
            </Row>

            <DataTable
                    ref="chainOrderTable"
                    :url="apis.chainOrder.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="订单号" :label-width="60" prop="orderNo">
                        <Input type="text" placeholder="请输入订单号" v-model="searchForm.orderNo"/>
                    </Form-item>
                    <Form-item label="支付方式" :label-width="60" prop="payWay">
                        <Select class="selectCondition" v-model="searchForm.payWay" clearable>
                            <Option v-for="item in getDict(apis.dictType.payWay)" :value="item.value" :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="支付状态" :label-width="60" prop="payStatus">
                        <Select class="selectCondition" v-model="searchForm.payStatus" clearable>
                            <Option v-for="item in getDict(apis.dictType.payStatus)" :value="item.value" :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="订单类型" :label-width="60" prop="orderType">
                        <Select class="selectCondition" v-model="searchForm.orderType" clearable>
                            <Option v-for="item in getDict(apis.dictType.orderType)" :value="item.value" :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="门店名称" :label-width="60" prop="chainName">
                        <Input type="text" placeholder="请输入门店名称" v-model="searchForm.chainName"/>
                    </Form-item>
                  <Form-item label="收银员" :label-width="60" prop="cashierName">
                    <Input type="text" placeholder="请输入收银员名称" v-model="searchForm.cashierName" />
                  </Form-item>
                    <!--<Form-item label="会员名称" :label-width="60" prop="memberName">-->
                    <!--<Input type="text" v-model="searchForm.memberName"></Input>-->
                    <!--</Form-item>-->
                    <Form-item label="日期" :label-width="60" prop="saleTime">
                        <DatePicker :clearable="false" :options="apis.dateOptions" type="daterange" v-model="dateRange"
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
  import ProIndex from '@/views/chain/order/ProIndex'
  import countTo from 'vue-count-to'

  export default {
    name: 'chainOrderIndex',
    data () {
      return {

        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 80,
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '商品',
            type: 'expand',
            width: 70,
            sortable: true,
            minWidth: 70,
            align: 'center',
            render: (h, params) => {
              return h(ProIndex, {
                props: {
                  orderNo: params.row.orderNo,
                }
              })
            }
          },
          {
            title: '店铺',
            key: 'chainName',
            sortable: true,
            minWidth: 100,
            align: 'center'
          },
          {
            title: '单号',
            key: 'orderNo',
            width: 200,
            sortable: true,
            minWidth: 70,
            align: 'center'
          }, {
            title: '状态',
            key: 'orderStatus',
            minWidth: 80,
            align: 'center',
            render: (h, params) => {
              var val = params.row.orderType
              var val2 = params.row.orderStatus
              var v = val + '' + val2 + ''
              var res = ''
              switch (v) {
                case '00' || '10' || '20':
                  res = '初始'
                  break
                case '01':
                  res = '完成'
                  break
                case '11':
                  res = '解挂'
                  break
                case '21':
                  res = '退单'
                  break
                default:
                  res = '初始'
                  break
              }
              return h('span', {}, res)
            }
          }, {
            title: '类型',
            key: 'orderType',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              var val = params.row.orderType
              var res = ''
              switch (val) {
                case 0:
                  res = '正常销售'
                  break
                case 1:
                  res = '挂单'
                  break
                case 2:
                  res = '退单'
                  break
              }
              return h('span', {}, res)
            }
          }, {
            title: '售价(元)',
            key: 'salePrice',
            sortable: true,
            minWidth: 100,
            align: 'center'
          }, {
            title: '折扣(元)',
            key: 'discountPrice',
            sortable: true,
            minWidth: 100,
            align: 'center'
          }, {
            title: '实付(元)',
            key: 'payPrice',
            sortable: true,
            minWidth: 100,
            align: 'center'
          }, {
            title: '支付方式',
            key: 'payWay',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              var val = params.row.payWay
              var res = ''
              switch (val) {
                case 1:
                  res = '微信'
                  break
                case 2:
                  res = '支付宝'
                  break
                case 3:
                  res = '银联'
                  break
                case 4:
                  res = '现金'
                  break
                case 5:
                  res = 'qq钱包'
                  break
                case 6:
                  res = '京东支付'
                  break
                case 7:
                  res = '线下扫码'
                  break
                case 8:
                  res = '预支付'
                  break
                case 99:
                  res = '其他'
                  break
              }
              return h('span', {}, res)
            }
          }, {
            title: '支付状态',
            key: 'payStatus',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              var val = params.row.payStatus
              var res = ''
              switch (val) {
                case 1:
                  res = '已支付'
                  break
                case 2:
                  res = '未支付'
                  break
                default:
                  res = '未支付'
                  break
              }
              return h('span', {}, res)
            }
          }, {
            title: '支付时间',
            key: 'payTime',
            sortable: true,
            minWidth: 140,
            align: 'center'
          }, {
            title: '会员',
            key: 'memberName',
            sortable: true,
            minWidth: 80,
            align: 'center'
          }, {
            title: '收银员',
            key: 'cashierName',
            sortable: true,
            minWidth: 80,
            align: 'center'
          },
          {
            title: '销售时间',
            key: 'saleTime',
            sortable: true,
            minWidth: 140,
            align: 'center'
          }],
        searchForm: {
          chainName: null,
          orderNo: null,
          memberName: null,
          saleTime: null,
          startTime: null,
          endTime: null,
          cashierName:null
        },
        dateRange: '',
        saleCount: {
          total: 0,
          totalPrice: 0,
        },

      }
    },
    methods: {

      selectRange (e) {
        this.searchForm.startTime = e[0] + " 00:00:00"
        this.searchForm.endTime = e[1] + " 23:59:59"
      },

      query(){
        this.getSaleCount();
      },

      getSaleCount () {
        $http({
          path: this.apis.chainOrder.countTotal,
          method: 'post',
          data: this.searchForm
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.saleCount.day = res.data.day
            this.saleCount.week = res.data.week
            this.saleCount.total = Number(res.data.total)
            this.saleCount.dayPrice = res.data.dayPrice
            this.saleCount.totalPrice = Number(res.data.totalPrice)
          } else {
            this.$Notice.error({
              title: '提示',
              desc: response.data.message
            })
          }
        })
      },

      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row, 'orderNo'))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定删除【' + row.name + '】门店销售订单？',
          onOk: () => {
            $http({
              path: this.apis.chainOrder.del,
              method: 'delete',
              data: {ids: row.id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.name + '】删除成功！'
                })
                this.$children[0].query()
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: response.data.message
                })
              }
            })
          }
        })
      },

      //下载报表
      downloadReport () {
        var url = process.env.BASE_API + this.apis.report.order + "?" + this.urlEncode(this.searchForm);
        window.open(url)
      },

      resetTableSearchForm () {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
        this.dateRange = ''
      },

    },
    mounted () {
      this.getSaleCount();
    },
    components: {
      DataTable,
      countTo
    }
  }
</script>
<style lang="scss">
    .sale-content {
        text-align: center;
    }

    .sale-count {
        font-size: 2.5vw;
        color: #F6416C;
        display: block;
        text-align: center;
        font-weight: 500;
    }

    .selectCondition {
        min-width: 7vw;
    }

    .chainOrderIndex {
        .datatable {

            .ivu-table {
                overflow-y: auto;
            }
            .ivu-table-wrapper {
                /*height: 400px !important;*/
            }

            .ivu-card-body {
                max-height: 68vh;
                overflow-y: auto;
            }
        }
    }
</style>
