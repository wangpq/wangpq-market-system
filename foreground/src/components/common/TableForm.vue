<template lang="html">
  <div class="table-form">
    <Card>
        <div class="form-wrap">
          <Form ref="form" :model="form" :rules="rules" inline>
            <slot name="form"></slot>
          </Form>
        </div>
        <Row type="flex" justify="center">
            <Col span="24">
              <Table
                ref="dataTable"
                :columns="columns"
                :data="tableData"
                :border="border"
                :stripe="stripe"
                :show-header="showHeader"
                :size="size"
                :context="this.$parent"
                @on-row-click="rowClick"
                @on-sort-change="sortTable"
              >
              </Table>
              <MyLoading size="large" :show="loading"></MyLoading>
            </Col>
        </Row>
        <Row type="flex" justify="center" class="pagination" :style="hiddenPage">
          <Col span="25">
            <div :style="pageStyle">
              <Page
                :current="pageIndex"
                :page-size-opts="pageSizes"
                :page-size="limit"
                :total="totalPages"
                @on-page-size-change="sizeChange"
                @on-change="pageChange"
                show-total
                show-sizer
              >
              </Page>
            </div>
          </Col>
        </Row>
    </Card>
  </div>
</template>

<script>
  import MyLoading from '@/components/common/MyLoading'
  import $http from '@/utils/httputils'

  export default {
    props: {
      url: {
        type: String
      },
      ajaxParams :{
        type : Object,
        default :{}
      },
      method: {
        type: String,
      },
      columns: {
        type: Array,
        required: true
      },
      stripe: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: true
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      size: {
        type: String
      },
      limits: {
        type: Number,
        default: 10
      },
      isPage: {
        type: Boolean,
        default: false
      },
      isLoadDataNow: {
        type: Boolean,
        default: true
      },
      form: {
        type: Object,
        default: () => {
          return {}
        }
      },
      rules : {
        type: Object,
        default: () => {
          return {}
        }
      },
      pageStyle: {
        type: String,
        default: ''
      },
    },
    data () {
      return {
        tableData: [],
        loading: true,
        pageSizes: [10, 20, 30],
        limit: this.limits,
        pageIndex: 1,
        totalPages: 0,
        hiddenPage: 'display:block',
        menuId: null,
      }
    },
    mounted () {  
      this.$nextTick(() => { 
        //判断是否立即加载数据
        if (!this.isLoadDataNow) {
          return
        }
        this.loadData()
        if (this.isPage) {
          this.noPage()
        }
      })
    },
    methods: {

      handle (e) {
        var row = this.getSelectRow()
        eval('this.$parent.' + e + "(row)")
      },

      getSelectRow () {
        return this.$refs.dataTable.getSelection()
      },

      rowClick (row, index) {
        this.$refs.dataTable.toggleSelect(index)
      },

      //判断当前选择的行是否正确
      isRightSelect (row) {
        if (!row || row.length === 0) {
          this.$Message.warning('请选择行！')
          return false
        } else if (row.length > 1) {
          this.$Message.warning('请选择一行！')
          return false
        }
        return row[0]
      },
      //判断当前选择的行是否正确
      isRightSelectForBatch (row, name) {
        if (!row || row.length === 0) {
          this.$Message.warning('请选择行！')
          return false
        }
        if (!name) {
          name = 'name';
        }
        var ids = [], names = []
        row.forEach(e => {
          ids.push(e.id);
          names.push(e[name])
        })

        return {id: ids.join(','), name: names.join(",")}
      },

      //不分页
      noPage () {
        this.hiddenPage = 'display:none'
      },
      // load remote data
      loadData () {  
        let params = this.params
        this.loading = true
        $http({
          path: this.url,
          method: this.method,
          data: params,
        }).then(response => {  
          let res = response.data
          if (res.success) {
            this.transformTableData(res)
            this.loading = false
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
            this.loading = false
          }
        })
      },
      //数据转换
      transformTableData (res) {
        this.tableData = res.data.list
        this.totalPages = res.data.total
        this.pageIndex = res.data.pageIndex
      },

      clear () {
        this.tableData = []
      },
      // change page size
      sizeChange (limit) {
        this.limit = limit
        this.loadData()
      },
      // change current page
      pageChange (pageIndex) {
        this.pageIndex = pageIndex
        this.loadData()
      },
      // handle sort
      sortTable (column, key, order) {
        console.log(column, key, order)
      },
      validateRules(){ 
        return new Promise((resovle, reject) => { 
          this.$refs.form.validate((valid) => {
            valid ?  resovle() : "";
          })
        })
      }
    },
    computed: {
      // dynamic pagination query params
      params() { 
        let params = this.ajaxParams
        params.pageIndex = this.pageIndex
        params.limit = this.limit
        return params
      }
    },
    components: {
      MyLoading
    }
  }
</script>

<style lang="scss" scoped>
.ivu-form-item{
  margin-bottom:22px!important;
}
.ivu-form .ivu-form-item-label{
  padding-top:0!important;
}
.table-form {
  .form {
      margin: 10px 0px 0px 10px;
  }
  .pagination {
    margin: 10px 0px 0px 10px;
  }
  .ivu-table {
    max-height: 64vh;
    overflow-y: auto;
    position: relative;
  } 
}
</style>
