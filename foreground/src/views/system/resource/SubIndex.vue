<template>
    <div>
        <Table ref="dataTable"
               class="menuTable"
               :showHeader=false
               :columns="columns"
               :data="data">
        </Table>
        <FormDialog :initOption="menuFormInitOption"></FormDialog>
    </div>
</template>
<script>

  import FormDialog from '@/views/system/resource/FormDialog'
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
            title: '序号',
            type: 'index',
            width: 70,
            align: 'center'
          },
          {
            type: 'expand',
            width: 50,
            align: 'right',
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
            title: '菜单名称',
            key: 'title',
            align: 'left'
          },
          {
            title: '菜单地址',
            key: 'url',
            align: 'center'
          },
          {
            title: '菜单类型',
            key: 'type',
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
            align: 'center'
          },
          {
            title: '资源图标',
            key: 'resIcon',
            align: 'center'
          },
          {
            title: '按钮方法',
            key: 'resCilck',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            className: 'actionClassName',
            width: 180,
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
          row: {}
        },
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
        var $this = this
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
                $this.query()
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

      query () {
        eventBus.$emit('refresh_menu_table', true)
      },
    },
    created () {
      this.data = this.row.children
      console.log('data===' + this.data[0])
    },
    components: {
      FormDialog
    }
  }
</script>
<style lang="scss">
    .menuTable {
        .ivu-table-expanded-cell {
            padding: 0 !important;
        }
        .ivu-table-wrapper {
            border: 0 !important;
        }
    }


</style>
