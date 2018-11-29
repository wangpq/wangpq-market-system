<template>
    <div route="/brand" id="brandIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.productBrand.get"
                    method="get"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="品牌名称" :label-width="60" prop="name">
                        <Input type="text" v-model="searchForm.name"></Input>
                    </Form-item>
                    <Form-item label="品牌描述" :label-width="60" prop="description">
                        <Input type="text" v-model="searchForm.description"></Input>
                    </Form-item>
                    <!--
                    <Form-item label="日期" :label-width="60" prop="saleTime">
                        <DatePicker 
                          :clearable="false" 
                          :options="apis.dateOptions" 
                          type="daterange" 
                          v-model="dateRange"
                          @on-change="onSelectRange" 
                          format="yyyy-MM-dd" 
                          placeholder="选择日期区间"         
                          style="min-width: 10vw"
                        >
                        </DatePicker>
                    </Form-item>
                    -->
                </template>
                <!--<template slot="function">-->
                <!--<Button type="primary" @click="handleAdd" icon="md-add">新增</Button>-->
                <!--</template>-->
            </DataTable>
            <FormDialog :initOption="brandFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/product/brand/FormDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'brandIndex',
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
            title: '品牌名称',
            key: 'name',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '品牌描述',
            key: 'description',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
            minWidth:140,
            align: 'center'
          }],
        dateRange: '',
        searchForm: {
          name: null,
          description: null,
          startTime: null,
          endTime: null,
        },
        brandFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
      }
    },
    methods: {
      onSelectRange(e) {
        this.searchForm.startTime   = e[0] + " 00:00:00"
        this.searchForm.endTime   = e[1] + " 23:59:59"
      },
      handleAdd () {
        this.brandFormInitOption.title = '新增品牌'
        this.brandFormInitOption.action = 'add'
        this.brandFormInitOption.visible = true
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.brandFormInitOption.title = '查看品牌'
        this.brandFormInitOption.action = 'view'
        this.brandFormInitOption.visible = true
        this.brandFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.brandFormInitOption.title = '编辑品牌'
        this.brandFormInitOption.action = 'edit'
        this.brandFormInitOption.visible = true
        this.brandFormInitOption.id = row.id
        this.$children[1].init()
      },
      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】品牌？',
          onOk: () => {
            $http({
              path: this.apis.productBrand.del,
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
<style lang="scss">

</style>
