<template>
    <div route="/user" id="userIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.systemUser.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="登录名" :label-width="60" prop="name">
                        <Input type="text" v-model="searchForm.name"></Input>
                    </Form-item>
                  <Form-item label="昵称" :label-width="60" prop="name">
                    <Input type="text" v-model="searchForm.nickname"></Input>
                  </Form-item>
                    <Form-item label="手机" :label-width="60" prop="tel">
                        <Input type="text" v-model="searchForm.tel"></Input>
                    </Form-item>
                </template>
                <!--<template slot="function">-->
                    <!--<Button type="primary" @click="handleAdd" icon="md-add">新增</Button>-->
                <!--</template>-->
            </DataTable>
            <FormDialog :initOption="userFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/system/user/FormDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'userIndex',
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
            title: '登录名',
            key: 'name',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '昵称',
            key: 'nickname',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '手机号',
            key: 'tel',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '角色',
            key: 'rolesName',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '是否为督导',
            key: 'orSupervision',
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.orSupervision
              var res = ''
              switch (val) {
                case 0:
                  res = '否'
                  break
                case 1:
                  res = '是'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '督导管辖门店',
            key: 'chainNames',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '冻结标志',
            key: 'isFreeze',
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.isFreeze
              var res = ''
              switch (val) {
                case 1:
                  res = '正常'
                  break
                case -1:
                  res = '冻结'
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
          name: null,
          tel: null,
          nickname:null
        },
        userFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
      }
    },
    methods: {
      handleAdd () {
        this.userFormInitOption.title = '新增用户'
        this.userFormInitOption.action = 'add'
        this.userFormInitOption.visible = true
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.userFormInitOption.title = '查看用户'
        this.userFormInitOption.action = 'view'
        this.userFormInitOption.visible = true
        this.userFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.userFormInitOption.title = '编辑用户'
        this.userFormInitOption.action = 'edit'
        this.userFormInitOption.visible = true
        this.userFormInitOption.id = row.id
        this.$children[1].init()
      },
      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row))) {return}

        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】用户？',
          onOk: () => {
            $http({
              path: this.apis.systemUser.del,
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

      restPwd (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定要重置【' + row.name + '】用户的密码？',
          onOk: () => {
            $http({
              path: this.apis.systemUser.reset,
              method: 'put',
              data: {id: row.id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.name + '】密码重置成功,重置密码为【654321】！'
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
    },
    components: {
      DataTable,
      FormDialog,
    }
  }
</script>
<style>
</style>
