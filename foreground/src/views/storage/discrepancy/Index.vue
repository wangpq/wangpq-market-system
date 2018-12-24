<template>
    <div route="/stockDiscrepancy" id="discrepancyIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.discrepancyManage.list"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                  <Form-item label="差异类型" :label-width="60" prop="orderType">
                    <Select class="selectCondition" v-model="searchForm.stockDiscrepancyType" clearable>
                      <Option v-for="item in getDict(apis.dictType.stockDiscrepancyType)" :value="item.value" :key="item.value">
                        {{item.label }}
                      </Option>
                    </Select>
                  </Form-item>
                    <Form-item label="仓库编码" :label-width="60" prop="warehouseId">
                      <Input type="text" v-model="searchForm.code"></Input>
                    </Form-item>
                    <Form-item label="商品条码" :label-width="60" prop="productId">
                      <Input type="text" v-model="searchForm.productId"></Input>
                    </Form-item>
                    <Form-item label="商品名称" :label-width="60" prop="productName">
                        <Input type="text" v-model="searchForm.productName"></Input>
                    </Form-item>
                </template>
                <!--<template slot="function">-->
                    <!--<Button type="primary" @click="handleAdd" icon="md-add">新增</Button>-->
                <!--</template>-->
            </DataTable>
            <FormDialog :initOption="discrepancyFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/storage/discrepancy/FormDialog'
  import {formatDate} from 'iview/src/components/date-picker/util'

  import $http from '@/utils/httputils'

  export default {
    name: 'discrepancyIndex',
    data () {
      return {

        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 50,
            align: 'center'
          },
          {
            title: '编号',
            key: 'id',
            // sortable:true,
            minWidth:60,
            align: 'center'
          },
          {
            title: '仓库名称',
            key: 'warehouseName',
            // sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '差异类型',
            key: 'type',
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.type
              var res = ''
              switch (val) {
                case 1:
                  res = '商品报损'
                  break
                case 2:
                  res = '商品报溢'
                  break
                case 3:
                  res = '客户销售退货入库'
                  break
                case 4:
                  res = '采购退货出库'
                  break
                case 5:
                  res = '门店退货入库'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '商品条码',
            key: 'productNo',
            // sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '商品名称',
            key: 'productName',
            // sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '规格',
            key: 'specifications',
            // sortable:true,
            minWidth:70,
            align: 'center'
          },{
            title: '单位',
            key: 'unit',
            // sortable:true,
            minWidth:70,
            align: 'center'
          },{
            title: '数量',
            key: 'number',
            sortable:true,
            minWidth:70,
            align: 'center'
          }, {
            title: '生产日期',
            key: 'produceTime',
            // sortable:true,
            minWidth:70,
            align: 'center',
            render: (h,params)=>{
              return h('div',
                formatDate(new Date(params.row.produceTime),'yyyy-MM-dd'))
            }
          },{
            title: '业务员',
            key: 'counterman',
            // sortable:true,
            minWidth:70,
            align: 'center'
          },{
            title: '客户',
            key: 'customer',
            // sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable:true,
            minWidth:140,
            align: 'center'
          }],
        searchForm: {
          warehouseId: null,
          productId: null,
          productName: null,
        },
        discrepancyFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
      }
    },
    methods: {
      handleAdd () {
        this.discrepancyFormInitOption.title = '新增差异信息'
        this.discrepancyFormInitOption.action = 'add'
        this.discrepancyFormInitOption.visible = true
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.discrepancyFormInitOption.title = '查看差异信息'
        this.discrepancyFormInitOption.action = 'view'
        this.discrepancyFormInitOption.visible = true
        this.discrepancyFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.discrepancyFormInitOption.title = '编辑差异信息'
        this.discrepancyFormInitOption.action = 'edit'
        this.discrepancyFormInitOption.visible = true
        this.discrepancyFormInitOption.id = row.id
        this.$children[1].init()
      },
      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】差异信息？',
          onOk: () => {
            $http({
              path: this.apis.discrepancyManage.delete,
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
