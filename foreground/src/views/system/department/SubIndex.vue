<template>
  <div>
      <Table 
        ref="dataTable"
        class="menuTable"
        :showHeader=false
        :columns="columns"
        :data="data"
        @on-row-click="rowClick"
      >
      </Table>
      <FormDialog :initOption="menuFormInitOption"></FormDialog>
  </div>
</template>
<script>

  import FormDialog from '@/views/system/department/FormDialog'
  import $http from '@/utils/httputils'

  export default {
    name: 'subIndex',
    props: {
      row: {
        type: Object,
        default: []
      },
      SubIndex: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        data: [],
        expand: false,
        columns: [
          {
            type: 'expand',
            width: 60,
            align: 'center',
            render: (h, params) => {
              if (params.row.children.length == 0) {
                return h('span', {})
              }
              return h(this.SubIndex, {
                props: {
                  row: params.row,
                  SubIndex: this.SubIndex
                }
              })
            }
          },
          {
            title: '部门名称',
            key: 'name',
            align: 'center',
            minWidth:120,
          },
          {
            title: '部门电话',
            key: 'mobile',
            minWidth:100,
            align: 'center'
          },
          {
            title: '部门负责人',
            key: 'managerName',
            minWidth:100,
            align: 'center'
          },
          {
            title: '部门负责人电话',
            key: 'managerTel',
            minWidth:130,
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            minWidth:100,
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
                      this.hanldeDelete(params.row)
                    }
                  }
                }, '删除')
              ])
            },
          } 
        ],
        searchForm: {
          content: null,
          type: null,
          useType: null,
        },
        menuFormInitOption: {
          title: '',
          action: '',
          visible: false,
          row: {}
        },
      }
    },
    methods: {
      rowClick (row, index) {
        this.$refs.dataTable.toggleSelect(index)
      },

      getSelectRow () {
        return this.$refs.dataTable.getSelection()
      },
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
      handleAdd (row) {
        this.menuFormInitOption.title = '新增部门'
        this.menuFormInitOption.action = 'add'
        this.menuFormInitOption.visible = true
        this.menuFormInitOption.row = row
        this.$children[1].reset()
        this.$children[1].init()
      },
      handleEdit (row) { 
        this.menuFormInitOption.title = '编辑部门'
        this.menuFormInitOption.action = 'edit'
        this.menuFormInitOption.visible = true
        this.menuFormInitOption.row = row
        this.$children[1].init()
      },
      hanldeDelete (row) {
   
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】菜单？',
          onOk: () => {
            $http({
              path: this.apis.departmentManage.delete,
              method: 'delete',
              data:{ids: row.id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.name + '】删除成功！'
                })
                this.update();
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
      update () {
        eventBus.$emit('refresh_menu_table', true)
      }
    },
    created () {
      this.data = this.row.children
    },
    components: {
      FormDialog
    }
  }
</script>
<style lang="scss" scoped>
.menuTable {
  .ivu-table-expanded-cell {
      padding: 0 !important;
  }
  .ivu-table-wrapper {
      border: 0 !important;
  }
}
</style>
