<template>
    <div route="/chain/user" id="userIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.chainUser.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="用户名称" :label-width="60" prop="name">
                        <Input type="text" v-model="searchForm.name" />
                    </Form-item>
                    <Form-item label="手机" :label-width="60" prop="tel">
                        <Input type="text" v-model="searchForm.tel"/>
                    </Form-item>
                    <Form-item label="门店名称" :label-width="60" prop="chainId">
                        <Input type="text" v-model="searchForm.chainName"/>
                    </Form-item>
                </template>
            </DataTable>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'

  import $http from '@/utils/httputils'

  export default {
    name: 'chainUserIndex',
    data () {
      return {

        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 80,
            align: 'center'
          },
          {
            title: '用户名',
            key: 'name',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '昵称',
            key: 'nickname',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '门店名称',
            key: 'chainName',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '联系人',
            key: 'contacts',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '手机号',
            key: 'tel',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '角色',
            key: 'rolesName',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '帐号类型',
            key: 'primary',
            sortable: true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.primary
              var res = ''
              switch (val) {
                case 0:
                  res = '普通账号'
                  break
                case 1:
                  res = '门店主账号'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '冻结标志',
            key: 'isFreeze',
            sortable: true,
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
            sortable: true,
            minWidth:140,
            align: 'center'
          }],
        searchForm: {
          name: null,
          tel: null,
          chainName: null,
        },
      }
    },
    methods: {
      restPwd (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定要重置【' + row.name + '】用户的密码？',
          onOk: () => {
            $http({
              path: this.apis.chainUser.reset,
              method: 'put',
              data: {id: row.id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.name + '】密码重置成功,重置密码为【123456】！'
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
    }
  }
</script>
<style>
</style>
