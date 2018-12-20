<template>
    <div route="/chain" id="chainIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.chain.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="门店名称" :label-width="60" prop="name">
                        <Input type="text" v-model="searchForm.name"></Input>
                    </Form-item>
                    <Form-item label="门店类型" :label-width="60" prop="shopType">
                        <Select v-model="searchForm.shopType" clearable style="min-width: 8vw">
                            <Option v-for="item in getDict(apis.dictType.shopType)" :value="item.value" :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="门店地址" :label-width="60" prop="address">
                        <Input type="text" v-model="searchForm.address"></Input>
                    </Form-item>
                </template>
                <!--<template slot="function">-->
                    <!--<Button type="primary" @click="handleAdd" icon="md-add">新增</Button>-->
                <!--</template>-->
            </DataTable>
            <FormDialog :initOption="chainFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/chain/info/FormDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'chainIndex',
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
            title: '门店名称',
            key: 'name',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '门店类型',
            key: 'shopType',
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.shopType
              var res = ''
              switch (val) {
                case 0:
                  res = '自营型'
                  break
                case 1:
                  res = '加盟型'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '配送价格',
            key: 'deliverPrice',
            sortable:true,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.deliverPrice
              var res = ''
              switch (val) {
                case 0:
                  res = '进价'
                  break
                case 1:
                  res = '成本价'
                  break
                case 2:
                  res = '批发价'
                  break
                case 3:
                  res = '配送价'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '所属区域',
            key: 'ofAreaName',
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
            key: 'contacts',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '联系电话',
            key: 'phone',
            sortable:true,
            minWidth:70,
            align: 'center'
          }, {
            title: '联系手机',
            key: 'mobile',
            sortable:true,
            minWidth:70,
            align: 'center'
          }, {
            title: '详细地址',
            key: 'address',
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
          name: null,
          shopType: null,
          address: null,
        },
        chainFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
      }
    },
    methods: {
      handleAdd () {
        this.chainFormInitOption.title = '新增门店'
        this.chainFormInitOption.action = 'add'
        this.chainFormInitOption.visible = true
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.chainFormInitOption.title = '查看门店'
        this.chainFormInitOption.action = 'view'
        this.chainFormInitOption.visible = true
        this.chainFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.chainFormInitOption.title = '编辑门店'
        this.chainFormInitOption.action = 'edit'
        this.chainFormInitOption.visible = true
        this.chainFormInitOption.id = row.id
        this.$children[1].init()
      },
      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】门店？',
          onOk: () => {
            $http({
              path: this.apis.chain.del,
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
