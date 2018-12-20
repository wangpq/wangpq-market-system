<template>
    <div class="layout-content">
        <div class="layout-content-main">
            <DepartTable
              :url="apis.departmentManage.tree"
              method="get"
              :columns="columns"
              :border="border"
              :searchForm="searchForm"
            >
            </DepartTable>
            <FormDialog :initOption="menuFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import FormDialog from '@/views/system/department/FormDialog'
  import SubIndex from '@/views/system/department/SubIndex'
  import MyLoading from '@/components/common/MyLoading'
  import $http from '@/utils/httputils'
  import DepartTable from '@/components/common/DepartTable'

  export default {
    name: 'menuIndex',
    components: {
      DepartTable,
      FormDialog,
      SubIndex
    },
    data () {
      return {
        border : false,
        refresh: false,
        columns: [
          {
            type: 'expand',
            width: 60,
            align: 'center',
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
          row: {},
        }
      }
    },
    methods: {
      handleAdd (row) {  
        this.menuFormInitOption.title = '新增部门'
        this.menuFormInitOption.action = 'add'
        this.menuFormInitOption.visible = true
        this.menuFormInitOption.row = row
        this.$children[1].reset();
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
              data: {ids: row.id}
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
      update(){ 
        // 更新表格
        this.$children[0].query();
      }
    },
    mounted () {
      this.update();
      eventBus.$on('refresh_menu_table', (refresh) => {
        this.refresh = refresh
      })
    },
    watch: {
      'refresh' (val) {
        if (val) {
          this.update()
          this.refresh = false
        }
      }
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
