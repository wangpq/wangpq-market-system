<template>
    <Modal
            width="60"
            v-model="initOption.visible"
            :title="initOption.title"
            @on-ok="ok"
            :loading="loading"
            :mask-closable="false">

        <DataTable
                :url="apis.systemRole.get"
                method="post"
                :columns="columns"
                isLoadDataNow="false"
                isLoadHandleBtns="false"
                pageFloat="float: left"
                ref="RoleSelectDialog"
                refs="RoleSelectDialog"
                :searchForm="searchForm">
            <template slot="search">
                <FormItem label="角色名称" :label-width="60" prop="rolesName">
                    <Input v-model="searchForm.rolesName"></Input></FormItem>
                <FormItem label="适用范围" :label-width="60" prop="useType">
                    <Select v-model="searchForm.useType" clearable style="width: 8vw">
                        <Option value="1">门店系统使用</Option>
                        <Option value="2">总部系统使用</Option>
                    </Select>
                </FormItem>
                <FormItem label="角色描述" :label-width="60" prop="content">
                    <Input v-model="searchForm.content"></Input></FormItem>
            </template>
        </DataTable>
    </Modal>
</template>
<script>
  import DataTable from '@/components/common/DataTable'

  export default {
    name: 'RoleSelectDialog',
    props: {
      initOption: {
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
            title: '角色名称',
            key: 'rolesName',
            align: 'center'
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
                  res = '门店使用'
                  break
                case 2:
                  res = '总部使用'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '角色描述',
            key: 'content',
            align: 'center'
          },
          {
            title: '是否超管',
            key: 'isSuper',
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
            align: 'center'
          }],
        searchForm: {
          rolesName: null,
          content: null,
          useType: "2",
          isSuper: 0,
        },
        loading: true
      }
    },
    methods: {
      ok () {
        var row = this.$refs.RoleSelectDialog.getSelectRow()
        if (row.length == 0 || row.length > 1) {
          this.$Message.info('只能选择一行')
          this.loading = false
          setTimeout(() => {
            this.loading = true
          }, 50)
          return false
        }
        this.initOption.visible = false
        this.$parent.userForm.roleId = row[0].id
        this.$parent.userForm.rolesName = row[0].rolesName

      }
    },
    watch: {
      'initOption.visible' (val) {
        if (val) {
          //加载数据
          this.$refs.RoleSelectDialog.loadData()
        } else {
          this.$refs.RoleSelectDialog.clear()
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
