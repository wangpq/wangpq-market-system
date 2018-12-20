<template>
    <div route="/role" id="roleIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.systemRole.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">

                    <FormItem label="角色名称" :label-width="60" prop="rolesName">
                        <Input v-model="searchForm.rolesName"></Input></FormItem>
                    <FormItem label="适用范围" :label-width="60" prop="useType">
                        <Select v-model="searchForm.useType" clearable style="min-width: 8vw">
                            <Option v-for="item in getDict(apis.dictType.roleUseType)" :value="item.value" :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="角色描述" :label-width="60" prop="content">
                        <Input v-model="searchForm.content"></Input></FormItem>
                </template>
                <!--<template slot="function">-->
                <!--<Button type="primary" @click="handleAdd" icon="md-add">新增</Button>-->
                <!--</template>-->
            </DataTable>
            <FormDialog :initOption="roleFormInitOption"></FormDialog>
            <ResourceTreeDialog :initOption="roleResourceOption"></ResourceTreeDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import ResourceTreeDialog from '@/components/tree/ResourceTreeDialog'
  import FormDialog from '@/views/system/role/FormDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'roleIndex',
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
            title: '角色名称',
            key: 'rolesName',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '适用范围',
            key: 'useType',
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              return this.$children[0].transDictValue(h, params, this.apis.dictType.roleUseType)
            }
          },
          {
            title: '角色描述',
            key: 'content',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '是否超管',
            key: 'isSuper',
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.isSuper
              var res = ''
              switch (val) {
                case 0:
                  res = '普通角色'
                  break
                case 1:
                  res = '超级管理员'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable:true,
            minWidth:140,
            align: 'center'
          }],
        searchForm: {
          rolesName: null,
          content: null,
          useType: null,
        },
        roleFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
        roleResourceOption: {
          title: null,
          visible: false,
          roleId: null,
          useType: null
        },
      }
    },
    methods: {
      handleAdd () {
        this.roleFormInitOption.title = '新增角色'
        this.roleFormInitOption.action = 'add'
        this.roleFormInitOption.visible = true
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.roleFormInitOption.title = '查看角色'
        this.roleFormInitOption.action = 'view'
        this.roleFormInitOption.visible = true
        this.roleFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}

        if (row.isSuper === 1) {
          this.$Message.warning("超级管理员不能修改！")
          return;
        }

        this.roleFormInitOption.title = '编辑角色'
        this.roleFormInitOption.action = 'edit'
        this.roleFormInitOption.visible = true
        this.roleFormInitOption.id = row.id
        this.$children[1].init()
      },
      hanldeDelete (row) {

        if (!row || row.length === 0) {
          this.$Message.warning('请选择行！')
          return false
        }

        let next = false;
        row.forEach(e => {
          if (e.isSuper === 1) {
            this.$Message.warning("超级管理员不能删除！")
            next = true;
          }
        })
        if (next) {
          return;
        }

        if (!(row = this.$children[0].isRightSelectForBatch(row, 'rolesName'))) {return}

        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】角色？',
          onOk: () => {
            $http({
              path: this.apis.systemRole.del,
              method: 'delete',
              data: {ids: row.id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.name + '】删除成功！'
                })
                this.$children[0].query()
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

      //为角色分配权限
      hanldeAuth (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        if (row.isSuper === 1) {
          this.$Message.warning("超级管理员无需分配权限！")
          return;
        }
        this.roleResourceOption.roleId = row.id
        this.roleResourceOption.useType = row.useType
        this.roleResourceOption.visible = true
        this.roleResourceOption.title = '分配资源菜单权限'
      },
    },
    mounted () {

    },
    components: {
      DataTable,
      ResourceTreeDialog,
      FormDialog,
    }
  }
</script>
<style>
</style>
