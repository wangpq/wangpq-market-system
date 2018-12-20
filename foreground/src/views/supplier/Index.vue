<template>
    <div id="supplierIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.supplier.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="供应商名称" :label-width="90" prop="name">
                        <Input type="text" v-model="searchForm.name"></Input>
                    </Form-item>
                    <Form-item label="经营方式" :label-width="60" prop="businessWay">
                        <Select v-model="searchForm.businessWay" clearable style="width: 8vw">
                            <Option v-for="item in getDict(apis.dictType.supplierBusinessWay)" :value="item.value"
                                    :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                </template>
                <!--<template slot="function">-->
                    <!--<Button type="primary" @click="handleAdd" icon="md-add">新增</Button>-->
                <!--</template>-->
            </DataTable>
            <FormDialog :initOption="supplierFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/supplier/FormDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'supplierIndex',
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
            title: '名称',
            key: 'name',
            width: 130,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '编码',
            key: 'code',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '配送周期',
            key: 'deliverCycle',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '经营方式',
            key: 'businessWay',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.businessWay
              var res = ''
              switch (val) {
                case 0:
                  res = '购销'
                  break
                case 1:
                  res = '代销'
                  break
                case 2:
                  res = '联营'
                  break
                case 3:
                  res = '扣率代销'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '联营保底金额',
            key: 'unionLowestPrice',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '结算门店',
            key: 'settleChain',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '业务员',
            key: 'countermanName',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '进价方式',
            key: 'docPriceWay',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.docPriceWay
              var res = ''
              switch (val) {
                case 0:
                  res = '进货价'
                  break
                case 1:
                  res = '零售价'
                  break
                case 2:
                  res = '约定价格'
                  break
                case 3:
                  res = '最近价格'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '付款方式',
            key: 'paymentWay',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.paymentWay
              var res = ''
              switch (val) {
                case 0:
                  res = '现金'
                  break
                case 1:
                  res = '微信'
                  break
                case 2:
                  res = '支付宝'
                  break
                case 3:
                  res = '支付宝'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '结算方式',
            key: 'settleWay',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.settleWay
              var res = ''
              switch (val) {
                case 0:
                  res = '临时指定'
                  break
                case 1:
                  res = '指定账期'
                  break
                case 2:
                  res = '指定日期'
                  break
                case 3:
                  res = '货到付款'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '结账周期（天）',
            key: 'settleCycle',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '月结日期',
            key: 'monthStatementDate',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '联系电话',
            key: 'phone',
            width: 120,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '地址',
            key: 'address',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '联系人',
            key: 'contactName',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '联系手机号',
            key: 'contactMobile',
            width: 120,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '开户行',
            key: 'bankName',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '银行帐号',
            key: 'bankAccount',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '税务登记号',
            key: 'taxRegNum',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '营业执照号',
            key: 'businessLicenseNum',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '经营类型',
            key: 'businessType',
            width: 100,
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.businessType
              var res = ''
              switch (val) {
                case 0:
                  res = '国有'
                  break
                case 1:
                  res = '民营'
                  break
                case 2:
                  res = '合资'
                  break
                case 3:
                  res = '外资'
                  break
                case 4:
                  res = '个体'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '备注',
            key: 'remark',
            width: 180,
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable:true,
            minWidth:140,
            align: 'center'
          }, {
        title: '操作',
            key: 'action',

            className: 'actionClassName',
            width: 180,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handleView(params.row.id)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: '',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row.id)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.hanldeDelete(params.row.id, params.row.name)
                    }
                  }
                }, '删除')
              ])
            },
          }],
        searchForm: {
          name: null,
          businessWay: null,
        },
        supplierFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
      }
    },
    methods: {
      handleAdd () {
        this.supplierFormInitOption.title = '新增供应商'
        this.supplierFormInitOption.action = 'add'
        this.supplierFormInitOption.visible = true
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.supplierFormInitOption.title = '查看供应商'
        this.supplierFormInitOption.action = 'view'
        this.supplierFormInitOption.visible = true
        this.supplierFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.supplierFormInitOption.title = '编辑供应商'
        this.supplierFormInitOption.action = 'edit'
        this.supplierFormInitOption.visible = true
        this.supplierFormInitOption.id = row.id
        this.$children[1].init()
      },
      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' +row.name + '】供应商？',
          onOk: () => {
            $http({
              path: this.apis.supplier.del,
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
    },
    mounted () {

    },
    components: {
      DataTable,
      FormDialog,
    }
  }
</script>
<style>
</style>
