<template>
    <div class="pur-pro-select">
        <CommModal
                class="pur-pro-modal"
                width="60"
                v-model="initOption.visible"
                :title="initOption.title"
                @on-ok="ok"
                ok-text="选 购"
                cancel-text="关 闭"
                :loading="loading"
                :mask-closable="false">

            <DataTable
                    :url="apis.supplier.getPro"
                    method="post"
                    :columns="columns"
                    :limits="8"
                    ref="PurProductSelectDialog"
                    pageFloat="float: left"
                    :searchForm="searchForm"
                    style="overflow-y: auto;height: 70vh">
                <template slot="search">
                    <Form-item label="供应商" :label-width="60" prop="supplierName">
                        <Input type="text" v-model="initOption.supplierName" readonly=""/>
                    </Form-item>
                    <Form-item label="商品" :label-width="60" prop="product">
                        <Input type="text" v-model="searchForm.productOr" placeholder="商品编号、名称"></Input>
                    </Form-item>
                </template>
            </DataTable>
        </CommModal>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import CommModal from '../../../../plugins/CommModal'

  export default {
    name: 'ProductSelectDialog',
    props: {
      initOption: {
        url: {
          type: String,
          required: true
        },
        visible: {
          type: Boolean,
          default: false
        },
        title: {
          type: String,
          default: ''
        },
        supplierName: {
          type: String,
          default: ''
        },
      },
      searchForm: {
        supplierId: null,
        productOr: null,
      },
    },
    data () {
      return {
        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 70,
            align: 'center'
          },
          {
            title: '供应商',
            key: 'supplierName',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '商品',
            key: 'productName',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '条码',
            key: 'productNo',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '规格',
            key: 'specifications',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '单位',
            key: 'unit',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '上期采购价',
            key: 'supplyPrice',
            sortable: true,
            minWidth: 70,
            align: 'center'
          }],
        loading: true
      }
    },
    methods: {
      ok () {
        var rows = this.$refs.PurProductSelectDialog.getSelectRow()
        if (rows.length === 0) {
          this.$Message.info('请正确选择行！')
          return false
        }
        let res = []
        rows.forEach(e =>{
            const target = this.deepClone(this.$parent.purchaseProForm)
            this.copyValue(e,target)
            target.price = e.supplyPrice
            target.number = 1
            res.push(target)
          })
        this.$parent.tableData = this.objDistinct(this.$parent.tableData.concat(res))
        this.$Message.success("【" + rows.length + "】种商品添加到列表")
      },
    },
    watch: {
      'initOption.visible' (val) {
        if (val) {
          this.$refs.PurProductSelectDialog.loadData()
        }
      }
    },
    components: {
      DataTable,
      CommModal
    }
  }
</script>
<style lang="scss">
    .pur-pro-modal {
        .datatable {
            .page-reset {
                display: none;
            }
        }
    }
</style>
