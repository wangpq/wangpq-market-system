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
                :isLoadDataNow=false
                :isLoadHandleBtns=false
                pageFloat="float: left"
                ref="ProductSpecSelectDialog"
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
  import ProRenderSpecSelect from '@/components/common/ProRenderSpecSelect'


  export default {
    name: 'productSpecSelectDialog',
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
      },
      selectChildRowId:null
    },
    data () {
      return {

        columns: [
          {
            width: 70,
            type: 'expand',
            title: '规格',
            render: (h, params) => {
              return h(ProRenderSpecSelect, {
                props: {
                  productNo: params.row.productNo
                },
                on:{
                  'toFather': (productId,productNo,productName,spec,unit) => {
                    //console.log('接收到数据了'+msg);
                    this.searchForm.productNo=productNo;
                    this.searchForm.productName=productName;
                    this.$parent.discrepancyForm.productNo=productNo;
                    this.$parent.discrepancyForm.productName=productName;
                    this.$parent.discrepancyForm.unit=unit;
                    this.$parent.discrepancyForm.specifications=spec;
                    this.$parent.discrepancyForm.productId=productId;
                  }
                }
              })
            }
          },
          {
            title: '自编码',
            width: 100,
            key: 'selfCode'
          },
          {
            width: 100,
            title: '商品条码',
            key: 'productNo'
          },
          {
            width: 110,
            title: '商品名称',
            key: 'productName'
          },
          /*{
            width: 90,
            title: '分类名称',
            key: 'productCateName'
          },*/
          {
            width: 70,
            title: '零售价',
            key: 'salePrice'
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
        /*var row = this.$refs.ProductSpecSelectDialog.getSelectRow()
        if (row.length === 0 || row.length > 1) {
          this.$Message.info('请正确选择行！')
          this.loading = false
          setTimeout(() => {
            this.loading = true
          }, 50)
          return false
        }*/
        this.initOption.visible = false
        // this.$parent.productForm.childId = row[0].id
        // this.$parent.productChildName = row[0].productName

      }
    },
    watch: {
      'initOption.visible' (val) {
        if (val) {
          //加载数据
          this.$refs.ProductSpecSelectDialog.loadData()
        } else {
          this.$refs.ProductSpecSelectDialog.clear()
        }
      }
    },
    components: {
      DataTable,ProRenderSpecSelect
    }
  }
</script>
<style scoped>
</style>
