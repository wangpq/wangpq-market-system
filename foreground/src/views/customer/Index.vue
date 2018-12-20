<template>
    <div  class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.customer.list"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="客户名称" :label-width="100" prop="nameLike">
                        <Input type="text" v-model="searchForm.nameLike"/>
                    </Form-item>
                    <Form-item label="地址（省）" :label-width="100" prop="province">
                        <Input type="text" v-model="searchForm.province"/>
                    </Form-item>
                    <Form-item label="地址（市）" :label-width="100" prop="city">
                        <Input type="text" v-model="searchForm.city"/>
                    </Form-item>
                    <Form-item label="地址（区）" :label-width="100" prop="area">
                        <Input type="text" v-model="searchForm.area"/>
                    </Form-item>
                </template>
            </DataTable>
            <FormDialog :initOption="providerFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/customer/FormDialog'
  import $http from '@/utils/httputils'

  export default {
    name: 'productIndex',
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
            minWidth:70,
            title: '客户名称',
            align: 'center',
            key: 'name'
          },
          {
            minWidth:70,
            title: '联系人',
            align: 'center',
            key: 'contactUser'
          },
           {
            minWidth:70,
            title: '联系电话',
            align: 'center',
            key: 'contactTel'
          },
           {
            minWidth:70,
            title: '地址',
            align: 'center',
            render: (h, params) => {
              let val1 = params.row.province
              let val2 = params.row.city
              let val3 = params.row.area
              let val4 = params.row.detailAdderss
              let res = val1+val2+val3+val4
              return h('span', {}, res)
            }
          },
          {
            minWidth:70, 
            title: '备注',
            align: 'center',
            key: 'remark'
          },
           {
            minWidth:70, 
            title: '创建时间',
            align: 'center',
            key: 'createTime'
          },
         ],
        searchForm: {
         
        },
        providerFormInitOption: {
          title: '',
          action: '',
          visible: false,
          row: ''
        },
      }
    },
    methods: {
      //添加
      handleAdd () {
        this.providerFormInitOption.title = '新增客户信息'
        this.providerFormInitOption.action = 'add'
        this.providerFormInitOption.visible = true
        this.$children[1].init()
      },
      //编辑
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.providerFormInitOption.title = '编辑客户信息'
        this.providerFormInitOption.action = 'edit'
        this.providerFormInitOption.visible = true
        this.providerFormInitOption.row= row
        this.$children[1].init()
      },
      //删除
      handleDelete (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】客户信息？',
          onOk: () => {
            $http({
              path: this.apis.customer.delete,
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
      resetTableSearchForm () {
        this.searchForm.productCateId = ''
      },

    },
    created () {

    },
    watch: {
      'searchForm.productNo' (val) {
        this.searchForm.productNo = this.Trim(val, true)
      }
    },
    components: {
      DataTable,
      FormDialog,
    }
  }
</script>
<style scoped>

    .checkedStatus {
        min-width: 7vw;
    }

</style>
