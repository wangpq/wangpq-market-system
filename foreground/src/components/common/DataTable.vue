<template lang="html">
    <div class="datatable">
        <Card>
            <div class="search">
                <Form
                        ref="tableSearchForm"
                        :model="searchForm"
                        inline>
                    <slot name="search"></slot>
                </Form>
                <Row type="flex" justify="center" v-if="hasSearch">
                    <Form inline>
                        <Form-item>
                            <Button type="primary" @click="query" icon="md-search">查询</Button>
                        </Form-item>
                        <Form-item>
                            <Button type="warning" @click="reset" class="page-reset" icon="md-refresh">重置</Button>
                        </Form-item>
                    </Form>
                </Row>
            </div>
            <Row type="flex" justify="end" class="function">
                <Col span="24">
                    <div v-show="menuBtnList.length>0 && isLoadHandleBtns===true">
                        <template v-for="item in menuBtnList">
                            <Button class="handle-btn" :type="item.resId" @click="handle(item.resCilck)"
                                    :icon="item.resIcon">{{item.title}}
                            </Button>
                        </template>
                    </div>
                </Col>
            </Row>
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
                            @on-sort-change="sortTable"></Table>
                    <MyLoading size="large" :show="loading"></MyLoading>
                </Col>
            </Row>
            <Row type="flex" justify="center" class="pagination" :style="hiddenPage">
                <Col span="24">
                    <div :style="pageFloat">
                        <Page
                                :current="pageIndex"
                                :page-size-opts="pageSizes"
                                :page-size="limit"
                                :total="totalPages"
                                @on-page-size-change="sizeChange"
                                @on-change="pageChange"
                                show-total
                                show-sizer>
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
    name: 'dataTable',
    props: {
      // 元数据
      source: {
        type: Array
      },
      url: {
        type: String
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
      isLoadHandleBtns: {
        type: Boolean,
        default: true
      },
      searchForm: {
        type: Object,
        default: () => {
          return {}
        }
      },
      pageFloat: {
        type: String,
        default: 'float: right'
      },
    },
    data () {
      return {
        sourceData: this.source,
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
      if (this.isLoadDataNow) {
        this.autoGetPageList();
      } else {
        this.loading = false;
      }

    },
    methods: {
      refresh () {
        this.autoGetPageList();
      },
      autoPageIndex () {
        let pageCounts = Math.ceil(this.source.length / this.limit)
        if (this.pageIndex > pageCounts) {
          this.pageIndex = pageCounts;
        }
      },
      autoGetPageList () {
        if (this.sourceData) {
          this.loading = false;
          if (this.sourceData.length > 0) {
            this.autoPageIndex();
            let start = (this.pageIndex - 1) * this.limit;
            let end = start + this.limit;
            this.tableData = this.sourceData.slice(start, end);
            this.totalPages = this.sourceData.length;
          } else {
            this.tableData = [];
            this.totalPages = 0;
            this.pageIndex = 1;
          }
        } else {
          this.loadData();
        }
      },
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
        this.tableData = []
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

      transDictValue (h, params, type) {
        const val = params.row[params.column.key]
        const label = this.getDictValue(type, val)
        return h('span', {}, label)
      },

      //数据转换
      transformTableData (res) {
        this.tableData = res.data.list
        this.totalPages = res.data.total
        this.pageIndex = res.data.pageIndex
      },

      query () {
        this.pageIndex = 1
        this.totalPages = 0
        this.loadData()
        if (typeof this.$parent.query === 'function') {
          this.$parent.query()
        }
      },
      reset () {
        this.$refs.tableSearchForm.resetFields()
        if (typeof this.$parent.resetTableSearchForm === 'function') {
          this.$parent.resetTableSearchForm()
        }
      },
      clear () {
        this.tableData = [];
        this.pageIndex = 1;
        this.totalPages = 0;
      },
      // change page size
      sizeChange (limit) {
        this.limit = limit
        this.autoGetPageList()
      },
      // change current page
      pageChange (pageIndex) {
        this.pageIndex = pageIndex
        this.autoGetPageList()
      },
      // handle sort
      sortTable (column, key, order) {
        console.log(column, key, order)
      }
    },
    computed: {
      // dynamic pagination query params
      params () {
        let params = this.searchForm
        params.pageIndex = this.pageIndex
        params.limit = this.limit
        return params
      },
      hasSearch () {
        return !!this.$slots.search
      },
      menuBtnList () {
        if (!this.menuId) {
          this.menuId = this.$route.query.menuId
        }
        return this.$store.state.app.menusBtn[this.menuId] || []
      }
    },
    watch: {
      source (val) {
        this.sourceData = val;
      },
      tableData (val) {
        this.tableData = val;
      }
    },
    components: {
      MyLoading
    }
  }
</script>

<style lang="scss">
    .datatable {

        .function {
            padding: 0 0 5px 10px;
            /*line-height: 40px;*/
            .handle-btn {
                margin-right: 10px;
            }
        }
        .search {
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
        .ivu-card-body {
            max-height: 87vh;
            overflow-y: auto;
        }
    }
</style>
