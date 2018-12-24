<template>
    <div>
        <Table ref="ProRenderSpecSelect"
               highlight-row
               class="orderProTable"
               :columns="columns"
               @on-current-change="currentChange"
               :data="data" >
        </Table>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'

  export default {
    name: 'ProRenderSpecSelect',
    props: {
        productNo: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        data: [],
        columns: [
          /*{
            title: '序号',
            type: 'selection',
            width: 80,
            align: 'center',
            checked:(row)=>{
              alert(row)
            }
          },*/
          {
            title: '商品编码',
            key: 'productId',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '商品条码',
            key: 'productNo',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '商品名称',
            key: 'productName',
            sortable:true, minWidth:70,
            align: 'center',
          },
          {
            title: '单位',
            key: 'unit'
          },
          {
            title: '规格',
            key: 'specification'
          }],
      }
    },
    methods: {
      rowClick(row){
        // this.$parent.productSpecSelectDialog.selectChildRowId=123;
        alert(document.getElementById("discrepancyFormDialog"))
      },
      currentChange(currentRow,oldCurrentRow){
        // debugger
        // alert(currentRow.id)
        this.$emit('toFather',currentRow.productId,currentRow.productNo,currentRow.productName,currentRow.specification,currentRow.unit)
      },
      query () {
        $http({
          path: this.apis.chainStock.page,
          method: 'post',
          data: {productNo: this.productNo}
        }).then(response => {
          if (response.data.success) {
            this.data = response.data.data.list
          } else {
            this.$Notice.error({
              title: '提示',
              desc: response.data.message
            })
          }
        })
      }
    },
    mounted () {
      this.query()
    },
    components: {}
  }
</script>
<style lang="scss">

    .orderProTable {
        margin: 5px 5px 5px 4vw;
        border: solid 1px rgba(0, 0, 0, 0.15) !important;
        border-radius: 3px;
        .ivu-table-body {
            overflow-x: hidden;
        }
    }

</style>
