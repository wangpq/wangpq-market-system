<template>
    <div route="/dict" id="dictIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.systemDict.get"
                    method="get"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="标签名" :label-width="60" prop="label">
                        <Input type="text" v-model="searchForm.label"></Input>
                    </Form-item>
                    <Form-item label="类型" :label-width="60" prop="type">
                        <Input type="text" v-model="searchForm.type"></Input>
                    </Form-item>
                    <Form-item label="描述" :label-width="60" prop="description">
                        <Input type="text" v-model="searchForm.description"></Input>
                    </Form-item>
                </template>
                <!--<template slot="function">-->
                    <!--<Button type="primary" @click="handleAdd" icon="md-add">新增</Button>-->
                <!--</template>-->
            </DataTable>
            <FormDialog :initOption="dictFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/system/dict/FormDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'dictIndex',
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
            title: '标签名',
            key: 'label',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '数据值',
            key: 'value',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '类型',
            key: 'type',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '描述',
            key: 'description',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '排序',
            key: 'sort',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '父级编号',
            key: 'parentName',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
            minWidth:140,
            align: 'center'
          }],
        searchForm: {
          label: null,
          type: null,
          description: null,
        },
        dictFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
      }
    },
    methods: {
      handleAdd () {
        this.dictFormInitOption.title = '新增字典'
        this.dictFormInitOption.action = 'add'
        this.dictFormInitOption.visible = true
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.dictFormInitOption.title = '查看字典'
        this.dictFormInitOption.action = 'view'
        this.dictFormInitOption.visible = true
        this.dictFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.dictFormInitOption.title = '编辑字典'
        this.dictFormInitOption.action = 'edit'
        this.dictFormInitOption.visible = true
        this.dictFormInitOption.id = row.id
        this.$children[1].init()
      },
      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row))) {return}

        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】字典？',
          onOk: () => {
            $http({
              path: this.apis.systemDict.del,
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
    components: {
      DataTable,
      FormDialog,
    }
  }
</script>
<style>
</style>
