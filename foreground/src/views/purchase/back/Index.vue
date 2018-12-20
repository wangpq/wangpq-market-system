<template>
    <div route="/purchase" id="purchaseIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.erpPurchaseProduct.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">

                    <Form-item label="关联采购单号" :label-width="60" prop="purchaseNo">
                        <Input type="text" v-model="searchForm.purchaseNo"></Input>
                    </Form-item>
                    <Form-item label="关联商品ID" :label-width="60" prop="productId">
                        <Input type="text" v-model="searchForm.productId"></Input>
                    </Form-item>
                    <Form-item label="商品名称" :label-width="60" prop="productName">
                        <Input type="text" v-model="searchForm.productName"></Input>
                    </Form-item>
                    <Form-item label="商品条码" :label-width="60" prop="productNo">
                        <Input type="text" v-model="searchForm.productNo"></Input>
                    </Form-item>
                    <Form-item label="商品采购数量" :label-width="60" prop="number">
                        <Input type="text" v-model="searchForm.number"></Input>
                    </Form-item>
                    <Form-item label="商品规格" :label-width="60" prop="specifications">
                        <Input type="text" v-model="searchForm.specifications"></Input>
                    </Form-item>
                    <Form-item label="商品单位" :label-width="60" prop="unit">
                        <Input type="text" v-model="searchForm.unit"></Input>
                    </Form-item>
                    <Form-item label="采购价格" :label-width="60" prop="price">
                        <Input type="text" v-model="searchForm.price"></Input>
                    </Form-item>
                    <Form-item label="" :label-width="60" prop="createTime">
                        <Input type="text" v-model="searchForm.createTime"></Input>
                    </Form-item>
                    <Form-item label="" :label-width="60" prop="orDel">
                        <Input type="text" v-model="searchForm.orDel"></Input>
                    </Form-item>

                    <!--
                    <Form-item label="下拉查询" :label-width="60" prop="checkedStatus">
                        <Select class="checkedStatus" v-model="searchForm.checkedStatus" clearable>
                            <Option v-for="item in getDict(apis.dictType.checkedStatus)" :value="item.value" :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    -->

                    <Form-item label="日期" :label-width="60" prop="saleTime">
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
  import FormDialog from '@/views/purchase/back/FormDialog'

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
            title: '关联采购单号',
            key: 'purchaseNo',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '关联商品ID',
            key: 'productId',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '商品名称',
            key: 'productName',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '商品条码',
            key: 'productNo',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '商品采购数量',
            key: 'number',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '商品规格',
            key: 'specifications',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '商品单位',
            key: 'unit',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '采购价格',
            key: 'price',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
            minWidth: 140,
            align: 'center'
          },
          {
            title: '',
            key: 'orDel',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
        ],
        dateRange: '',
        searchForm: {
          id: null,
          purchaseNo: null,
          productId: null,
          productName: null,
          productNo: null,
          number: null,
          specifications: null,
          unit: null,
          price: null,
          createTime: null,
          orDel: null,
        },
        purchaseFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
      }
    },
    methods: {
      handleAdd () {
        this.purchaseFormInitOption.title = '新增总部采购商品表'
        this.purchaseFormInitOption.action = 'add'
        this.purchaseFormInitOption.visible = true
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.purchaseFormInitOption.title = '查看总部采购商品表'
        this.purchaseFormInitOption.action = 'view'
        this.purchaseFormInitOption.visible = true
        this.purchaseFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.purchaseFormInitOption.title = '编辑总部采购商品表'
        this.purchaseFormInitOption.action = 'edit'
        this.purchaseFormInitOption.visible = true
        this.purchaseFormInitOption.id = row.id
        this.$children[1].init()
      },
      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】总部采购商品表？',
          onOk: () => {
            $http({
              path: this.apis.erpPurchaseProduct.del,
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
    components: {
      DataTable,
      FormDialog,
    }
  }
</script>
<style lang="scss">

</style>
