<template>
    <div route="/resource" id="menuIndex" class="layout-content">
        <div class="layout-content-main">

            <div class="datatable">
                <Card>
                    <div class="search">
                        <Form ref="tableSearchForm"
                              :model="searchForm" inline>
                            <FormItem label="菜单名称" :label-width="60" prop="content">
                                <Input v-model="searchForm.content"></Input></FormItem>
                            <FormItem label="菜单类型" :label-width="60" prop="type">
                                <Select v-model="searchForm.type" clearable style="min-width: 8vw">
                                    <Option v-for="item in getDict(apis.dictType.menuType)" :value="item.value" :key="item.value">
                                        {{item.label }}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="使用范围" :label-width="60" prop="useType">
                                <Select v-model="searchForm.useType" clearable style="min-width: 8vw">
                                    <Option v-for="item in getDict(apis.dictType.menuUseType)" :value="item.value"
                                            :key="item.value">
                                        {{item.label }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Form>
                        <Row type="flex" justify="center">
                            <Form inline>
                                <Form-item>
                                    <Button type="primary" @click="query" icon="search">查询</Button>
                                </Form-item>
                                <Form-item>
                                    <Button type="warning" @click="reset" icon="ios-refresh">重置</Button>
                                </Form-item>
                            </Form>
                        </Row>
                    </div>
                    <Row type="flex" justify="center">
                        <Col span="24">
                            <Table class="menuTable"
                                   ref="dataTable"
                                   :columns="columns"
                                   :data="tableData"></Table>
                            <MyLoading size="large" :show="loading"></MyLoading>
                        </Col>
                    </Row>
                </Card>
            </div>

            <FormDialog :initOption="menuFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import FormDialog from '@/views/system/resource/FormDialog'
  import SubIndex from '@/views/system/resource/SubIndex'
  import MyLoading from '@/components/common/MyLoading'
  import $http from '@/utils/httputils'

  export default {
    name: 'menuIndex',
    data () {
      return {

        columns: [
          {
            title: '序号',
            type: 'index',
            width: 70,
            align: 'center'
          },
          {
            type: 'expand',
            width: 40,
            align: 'right',
            render: (h, params) => {
              return h(SubIndex, {
                props: {
                  row: params.row,
                  SubIndex: SubIndex
                }
              })
            }
          },
          {
            title: '菜单名称',
            key: 'title',
            align: 'left',
          },
          {
            title: '菜单地址',
            key: 'url',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '菜单类型',
            key: 'type',
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.type
              var res = ''
              switch (val) {
                case 1:
                  res = '菜单'
                  break
                case 2:
                  res = '按钮'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '适用范围',
            key: 'useType',
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.useType
              var res = ''
              switch (val) {
                case 1:
                  res = '门店系统使用'
                  break
                case 2:
                  res = '总部系统使用'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '资源颜色',
            key: 'resId',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '资源图标',
            key: 'resIcon',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '按钮方法',
            key: 'resCilck',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            className: 'actionClassName',
            width: 180,
            sortable:true,
            minWidth:70,
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
                      this.handleAdd(params.row)
                    }
                  }
                }, '新增'),
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
                      this.handleEdit(params.row)
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
                      this.hanldeDelete(params.row.id, params.row.title)
                    }
                  }
                }, '删除')
              ])
            },
          }],
        searchForm: {
          content: null,
          type: null,
          useType: null,
        },
        menuFormInitOption: {
          title: '',
          action: '',
          visible: false,
          row: {},
        },
        tableData: [],
        loading: true,
        refresh: false
      }
    },
    methods: {
      handleAdd (row) {
        this.menuFormInitOption.title = '新增菜单'
        this.menuFormInitOption.action = 'add'
        this.menuFormInitOption.visible = true
        this.menuFormInitOption.row = row
        this.$children[1].reset()
        this.$children[1].init()
      },
      handleEdit (row) {
        this.menuFormInitOption.title = '编辑菜单'
        this.menuFormInitOption.action = 'edit'
        this.menuFormInitOption.visible = true
        this.menuFormInitOption.row = row
        this.$children[1].getInfo()
        this.$children[1].init()
      },
      hanldeDelete (id, name) {
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + name + '】菜单？',
          onOk: () => {
            $http({
              path: this.apis.resource.del,
              method: 'delete',
              data: {id: id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + name + '】删除成功！'
                })
                this.query()
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

      loadData () {
        let params = this.searchForm
        this.loading = true
        $http({
          path: this.apis.resource.get,
          method: 'get',
          data: params,
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.tableData = res.data
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

      query () {
        this.loadData()
      },
      reset () {
        this.$refs.tableSearchForm.resetFields()
      },
      clear () {
        this.tableData = []
      },
    },
    watch: {
      'refresh' (val) {
        if (val) {
          this.query()
          this.refresh = false
        }
      }

    },
    mounted () {
      this.loadData()
      eventBus.$on('refresh_menu_table', (refresh) => {
        this.refresh = refresh
        console.log('refresh_menu_table:' + refresh)
      })
    },
    components: {
      FormDialog,
      SubIndex,
    }
  }
</script>
<style lang="scss">
    .menuTable {

        .ivu-table-cell {
            padding-left: 0px !important;
        }

    }
</style>
