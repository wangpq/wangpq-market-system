<template>
    <Modal
            width="60"
            v-model="initOption.visible"
            :title="initOption.title"
            @on-ok="ok"
            :loading="loading"
            :mask-closable="false">

        <DataTable
                :url="apis.product.simple"
                method="post"
                :columns="columns"
                limits=8
                isLoadDataNow="false"
                pageFloat="float: left"
                ref="ProductSelectDialog"
                refs="ProductSelectDialog"
                :searchForm="searchForm"
                style="overflow-y: auto;height: 70vh">
            <template slot="search">
                <Form-item label="货号" :label-width="60" prop="productNo">
                    <Input type="text" v-model="searchForm.productNo"></Input>
                </Form-item>
                <Form-item label="商品名称" :label-width="60" prop="productName">
                    <Input type="text" v-model="searchForm.productName"></Input>
                </Form-item>
            </template>
        </DataTable>
    </Modal>
</template>
<script>
  import DataTable from '@/components/common/DataTable'


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
        }
      }
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
            width: 100,
            title: '产品条码',
            key: 'productNo'
          },
          {
            width: 110,
            title: '产品主名称',
            key: 'productName'
          },
          {
            width: 110,
            title: '产品副名称',
            key: 'productDeputyName'
          },
          {
            width: 90,
            title: '分类名称',
            key: 'productCateName'
          },
          {
            width: 100,
            title: '零售价',
            key: 'salePrice'
          },
          {
            width: 100,
            title: '最低售价',
            key: 'lowestPrice'
          },
          {
            width: 120,
            title: '毛利润（%）',
            key: 'grossProfit'
          },
          {
            width: 70,
            title: '单位',
            key: 'unit'
          },
          {
            width: 70,
            title: '规格',
            key: 'specification'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          }],
        searchForm: {
          productNo: null,
          productName: null,
        },
        loading: true
      }
    },
    methods: {
      ok () {
        var row = this.$refs.ProductSelectDialog.getSelectRow()
        if (row.length === 0 || row.length > 1) {
          this.$Message.info('请正确选择行！')
          this.loading = false
          setTimeout(() => {
            this.loading = true
          }, 50)
          return false
        }
        this.initOption.visible = false
        this.$parent.productForm.childId = row[0].id
        this.$parent.productChildName = row[0].productName

      }
    },
    watch: {
      'initOption.visible' (val) {
        if (val) {
          //加载数据
          this.$refs.ProductSelectDialog.loadData()
        } else {
          this.$refs.ProductSelectDialog.clear()
        }
      }
    },
    components: {
      DataTable
    }
  }
</script>
<style scoped>
</style>
