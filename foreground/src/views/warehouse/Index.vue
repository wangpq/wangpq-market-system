<template>
    <div route="/warehouse" id="wareHouseIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.warehouseManage.list"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="仓库编码" :label-width="60" prop="code">
                      <Input type="text" v-model="searchForm.code"></Input>
                    </Form-item>
                    <Form-item label="仓库名称" :label-width="60" prop="name">
                        <Input type="text" v-model="searchForm.nameLike"></Input>
                    </Form-item>
                    <Form-item label="仓库地址" :label-width="60" prop="address">
                        <Input type="text" v-model="searchForm.detailAddressLike"></Input>
                    </Form-item>
                </template>
                <!--<template slot="function">-->
                    <!--<Button type="primary" @click="handleAdd" icon="md-add">新增</Button>-->
                <!--</template>-->
            </DataTable>
            <FormDialog :initOption="wareHouseFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/warehouse/FormDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'wareHouseIndex',
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
            title: '仓库编号',
            key: 'code',
            sortable:true,
            minWidth:30,
            align: 'center'
          },
          {
            title: '仓库名称',
            key: 'name',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '所属区域',
            key: 'country',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '面积（m²）',
            key: 'floorSpace',
            sortable:true,
            minWidth:70,
            align: 'center'
          },{
            title: '联系人',
            key: 'contactName',
            sortable:true,
            minWidth:70,
            align: 'center'
          },{
            title: '联系手机',
            key: 'contactMobile',
            sortable:true,
            minWidth:70,
            align: 'center'
          }, {
            title: '详细地址',
            key: 'detailAddress',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable:true,
            minWidth:140,
            align: 'center'
          }],
        searchForm: {
          nameLike: null,
          detailAddressLike: null,
          code: null,
        },
        wareHouseFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
      }
    },
    methods: {
      handleAdd () {
        this.wareHouseFormInitOption.title = '新增仓库'
        this.wareHouseFormInitOption.action = 'add'
        this.wareHouseFormInitOption.visible = true
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.wareHouseFormInitOption.title = '查看仓库'
        this.wareHouseFormInitOption.action = 'view'
        this.wareHouseFormInitOption.visible = true
        this.wareHouseFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.wareHouseFormInitOption.title = '编辑仓库'
        this.wareHouseFormInitOption.action = 'edit'
        this.wareHouseFormInitOption.visible = true
        this.wareHouseFormInitOption.id = row.id
        this.$children[1].init()
      },
      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】仓库？',
          onOk: () => {
            $http({
              path: this.apis.warehouseManage.delete,
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
    },
    mounted () {
    },
    components: {
      DataTable,
      FormDialog,
    }
  }
</script>
<style>
</style>
