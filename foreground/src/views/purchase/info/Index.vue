<template>
    <div route="/purchase" id="purchaseIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.purchase.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="单号" :label-width="60" prop="no">
                        <Input type="text" v-model="searchForm.no"></Input>
                    </Form-item>
                    <Form-item label="仓库" :label-width="60" prop="warehouseName">
                        <Input type="text" v-model="searchForm.warehouseName"></Input>
                    </Form-item>
                    <Form-item label="供应商" :label-width="60" prop="supplierName">
                        <Select class="tree_combo_select" v-model="searchForm.supplierId" placeholder="==供应商==">
                            <Option v-for="item in supplierList" :value="item.id" :key="item.id">
                                {{ item.name }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="业务员" :label-width="60" prop="counterman">
                        <Input type="text" v-model="searchForm.counterman"></Input>
                    </Form-item>
                    <Form-item label="审核状态" :label-width="60" prop="auditStatus">
                        <Select class="tree_combo_select" v-model="searchForm.auditStatus" clearable>
                            <Option v-for="item in getDict(apis.dictType.purchaseAuditStatus)" :value="item.value"
                                    :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="申请人" :label-width="60" prop="applyName">
                        <Input type="text" v-model="searchForm.applyName"></Input>
                    </Form-item>
                    <Form-item label="结算" :label-width="60" prop="orSettlement">
                        <Select class="tree_combo_select" v-model="searchForm.orSettlement" clearable>
                            <Option v-for="item in getDict(apis.dictType.purchaseOrSettlement)" :value="item.value"
                                    :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="结算时间" :label-width="60" prop="settlementTime">
                        <DatePicker :clearable="false" :options="apis.dateOptions" type="daterange" v-model="dateRange"
                                    @on-change="selectRange" format="yyyy-MM-dd" placeholder="选择日期区间"
                                    style="min-width: 10vw"></DatePicker>
                    </Form-item>
                </template>
            </DataTable>
            <FormDialog :initOption="purchaseFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/purchase/info/FormDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'purchaseIndex',
    data () {
      return {
        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 80,
            align: 'center'
          },
          {
            title: '单号',
            key: 'no',
            sortable: true,
            minWidth: 200,
            align: 'center'
          },
          {
            title: '仓库',
            key: 'warehouseName',
            sortable: true,
            minWidth: 120,
            align: 'center'
          },
          {
            title: '供应商',
            key: 'supplierName',
            sortable: true,
            minWidth: 120,
            align: 'center'
          },
          {
            title: '业务员',
            key: 'counterman',
            sortable: true,
            minWidth: 90,
            align: 'center'
          },
          {
            title: '审核模板',
            key: 'auditTemplatName',
            sortable: true,
            minWidth: 110,
            align: 'center'
          },
          {
            title: '审核状态',
            key: 'auditStatus',
            sortable: true,
            minWidth: 110,
            align: 'center',
            render: (h, params) => {
              return this.$children[0].transDictValue(h, params, this.apis.dictType.purchaseAuditStatus)
            }
          },
          {
            title: '种类数量',
            key: 'productNum',
            sortable: true,
            minWidth: 110,
            align: 'center'
          },
          {
            title: '产品总数',
            key: 'productAmount',
            sortable: true,
            minWidth: 110,
            align: 'center'
          },
          {
            title: '申请人',
            key: 'applyName',
            sortable: true,
            minWidth: 100,
            align: 'center'
          },
          {
            title: '采购总价',
            key: 'amountPrice',
            sortable: true,
            minWidth: 110,
            align: 'center'
          },
          {
            title: '结算',
            key: 'orSettlement',
            sortable: true,
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              return this.$children[0].transDictValue(h, params, this.apis.dictType.purchaseOrSettlement)
            }
          },
          {
            title: '结算方式',
            key: 'settlementType',
            sortable: true,
            minWidth: 110,
            align: 'center',
            render: (h, params) => {
              return this.$children[0].transDictValue(h, params, this.apis.dictType.purchaseSettlementType)
            }
          },
          {
            title: '支付方式',
            key: 'paymentType',
            sortable: true,
            minWidth: 110,
            align: 'center',
            render: (h, params) => {
              return this.$children[0].transDictValue(h, params, this.apis.dictType.payWay)
            }
          },
          {
            title: '结算时间',
            key: 'settlementTime',
            sortable: true,
            minWidth: 110,
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            sortable: true,
            minWidth: 90,
            flex: "right",
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
            minWidth: 160,
            align: 'center'
          }
        ],
        dateRange: '',
        supplierList: [],
        searchForm: {
          no: null,
          warehouseName: null,
          supplierId: null,
          counterman: null,
          auditStatus: null,
          applyName: null,
          orSettlement: null,
          settlementType: null,
          paymentType: null,
          settlementTime: null,
        },
        purchaseFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
      }
    },
    created () {
      this.getSupplierList()
    },
    methods: {
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.purchaseFormInitOption.title = '查看采购单'
        this.purchaseFormInitOption.action = 'view'
        this.purchaseFormInitOption.visible = true
        this.purchaseFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.purchaseFormInitOption.title = '编辑采购单'
        this.purchaseFormInitOption.action = 'edit'
        this.purchaseFormInitOption.visible = true
        this.purchaseFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row, 'no'))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定删除【' + row.name + '】采购订单？',
          onOk: () => {
            $http({
              path: this.apis.purchase.del,
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
      getSupplierList () {
        $http({
          path: this.apis.supplier.get,
          method: 'post',
          data: {},
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.supplierList = res.data.list
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      resetTableSearchForm () {
        this.searchForm.startSettleTime = ''
        this.searchForm.endSettleTime = ''
        this.dateRange = ''
      },
      selectRange (e) {
        this.searchForm.startSettleTime = e[0] + " 00:00:00"
        this.searchForm.endSettleTime = e[1] + " 23:59:59"
      },
    },
    components: {
      DataTable,
      FormDialog,
    }
  }
</script>
<style lang="scss">

</style>
