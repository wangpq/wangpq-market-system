<template>
    <div route="/product" id="productIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.provider.list"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="供应商名称" :label-width="100" prop="nameLike">
                        <Input type="text" v-model="searchForm.nameLike"/>
                    </Form-item>
                </template>
            </DataTable>
            <FormDialog :initOption="providerFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/provider/FormDialog'
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
            width: 150,
            title: '供应商名称',
            align: 'center',
            key: 'name'
          },
          {
            width: 110,
            title: '配送周期',
            align: 'center',
            key: 'deliverPeriod'
          },
           {
            width: 110,
            title: '经营方式',
            minWidth:70,
            align: 'center',
            key: 'businessType',
            render: (h, params) => {
              var val = params.row.businessType
              var res = ''
              switch (val) {
                case 1:
                  res = '国有'
                  break
                case 2:
                  res = '民营'
                  break
                case 3:
                  res = '合资'
                  break
                case 4:
                  res = '外资'
                  break
                case 5:
                  res = '个体'
                  break
              }
              return h('span', {}, res)
            }
          },
           {
            width: 110,
            title: '业务员',
            align: 'center',
            key: 'countermanName'
          },
          {
            width: 110,
            title: '结算方式',
            minWidth:70,
            align: 'center',
            key: 'settleType',
            render: (h, params) => {
              var val = params.row.settleType
              var res = ''
              switch (val) {
                case 1:
                  res = '及时结算'
                  break
                case 2:
                  res = '周期结算'
                  break
                  case 3:
                  res = '按月结算'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            width: 150,
            title: '结算周期（天）',
            align: 'center',
            key: 'settlePeriod'
          },
          {
            width: 220,
            title: '月结日期（每月中的几号）',
            align: 'center',
            key: 'settleTime'
          },
          {
            width: 220,
            title: '供应商联系人电话',
            align: 'center',
            key: 'contactMobile'
          },
          {
            width: 220,
            title: '联系人',
            align: 'center',
            key: 'contactName'
          },
           {
            width: 220,
            title: '地址',
            align: 'center',
            render: (h, params) => {
              let val1 = params.row.province
              let val2 = params.row.city
              let val3 = params.row.area
              let val4 = params.row.detailAddress
              let res = val1+val2+val3+val4
              return h('span', {}, res)
            }
          },
          //  key: 'province'+'city'+'area'+'detailAddress'
          {
            width: 220,
            title: '开户行',
            align: 'center',
            key: 'bankName'
          },
          {
            width: 220,
            title: '开户行账号',
            align: 'center',
            key: 'bankAccount'
          },
           {
            width: 220,
            title: '备注',
            align: 'center',
            key: 'remark'
          },
         ],
        searchForm: {
         
        },
        providerFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
      }
    },
    methods: {
      //添加
      handleAdd () {
        this.providerFormInitOption.title = '新增供应商信息'
        this.providerFormInitOption.action = 'add'
        this.providerFormInitOption.visible = true
        this.$children[1].init()
      },
      //编辑
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.providerFormInitOption.title = '编辑供应商信息'
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
          content: '确定永久删除【' + row.name + '】商品信息？',
          onOk: () => {
            $http({
              path: this.apis.provider.delete,
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
