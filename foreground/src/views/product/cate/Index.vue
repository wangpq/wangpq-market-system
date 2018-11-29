<template>
    <div route="/product-cate" id="cateIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.productCate.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="分类名称" :label-width="60" prop="cateName">
                        <Input type="text" v-model="searchForm.cateName"></Input>
                    </Form-item>
                    <Form-item label="备注" :label-width="60" prop="remark">
                        <Input type="text" v-model="searchForm.remark"></Input>
                    </Form-item>
                </template>
                <!--<template slot="function">-->
                    <!--<Button type="primary" @click="handleAdd" icon="md-add">新增</Button>-->
                <!--</template>-->
            </DataTable>
            <FormDialog :initOption="cateFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/product/cate/FormDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'cateIndex',
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
            title: '分类名称',
            key: 'cateName',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '分类图标',
            key: 'icon',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '排序',
            key: 'sort',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '父节点',
            key: 'parentName',
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
          cateName: null,
          remark: null,
        },
        cateFormInitOption: {
          title: '',
          action: '',
          visible: false,
          row : {},
          id: ''
        },
      }
    },
    methods: {
      handleAdd (row) {  
        this.cateFormInitOption.title = '新增商品分类'
        this.cateFormInitOption.action = 'add'
        if(row){ 
          if( row.length>1){
            this.$Message.warning('请选择一行！')
          }else if(row.length==1){
            this.cateFormInitOption.id = row.id
            this.cateFormInitOption.row = row[0];
            this.cateFormInitOption.visible = true;
          }else{
            this.cateFormInitOption.visible = true;  
          }
        }
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.cateFormInitOption.title = '查看商品分类'
        this.cateFormInitOption.action = 'view'
        this.cateFormInitOption.visible = true
        this.cateFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.cateFormInitOption.title = '编辑商品分类'
        this.cateFormInitOption.action = 'edit'
        this.cateFormInitOption.visible = true
        this.cateFormInitOption.id = row.id
        this.$children[1].init()
      },
      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.cateName + '】商品分类？',
          onOk: () => {
            $http({
              path: this.apis.productCate.del,
              method: 'delete',
              data: {id: row.id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.cateName + '】删除成功！'
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
