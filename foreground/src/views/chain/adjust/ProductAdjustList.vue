<template>
<div>
  <Modal 
    v-model="initOptions.visible"
    :mask-closable="false"
    width=1280
    style="z-index:9999;position:relative;"
  >
      <p slot="header" style="color:#f60;text-align:center;">
          <Icon type="information-circled"></Icon>
          <span>调价单调价商品列表</span>
      </p>
      <div class="body">
          <Row>
              <Col span="12"  style="padding-right:8px;">
                <Card>
                    <p slot="title">修改前：</p>
                    <div>
                      <DataTable
                        ref="dataTable"
                        :source="beforeEditTableData"
                        :limits ="pageLimit"
                        :columns="columns"
                        :searchForm="searchForm"
                        :isLoadHandleBtns="isBtnListVisible"
                        :isLoadDataNow="isLoadDataNow"
                      >
                      </DataTable>
                    </div>
                </Card>
              </Col>
              <Col span="12" style="padding-left:8px;">
                <Card>
                    <p slot="title">修改后：</p>
                    <div>
                      <DataTable 
                        ref="noAjaxDataTable"
                        :columns="editedTableColumns" 
                        :source="editedTableData"
                        :limits ="pageLimit"
                        :isLoadHandleBtns="isBtnListVisible"
                        :isLoadDataNow="isLoadDataNow"
                      >
                      </DataTable>  
                    </div>
                </Card>
              </Col>
          </Row>
      </div> 
      <div slot="footer" style="text-align:center;">
          <Button type="primary"  @click="initOptions.visible=false">确定</Button>
      </div>
  </Modal>
</div>
</template>

<script>
  import $http from '@/utils/httputils'
  import DataTable from '@/components/common/DataTable'  

  export default {
    components: {
      DataTable
    },
    props: {
      initOptions: {
        visible : {
          type: Boolean,
          default:false
        },
        row : {
          type: Object
        },
        oldList  : {
          type: Array,
          default(){
            return []
          }
        },
        newList  : {
          type: Array,
          default(){
            return []
          }
        }
      }
    },
    data () {
      return {
        isLoadDataNow : true,
        isBtnListVisible : false,
        pageLimit : 5,
        columns: [
          {
            title: '商品名称',
            key: 'productName',
            sortable:true,
            minWidth:120,
            align: 'center'
          },
           {
            title: '最低售价',
            key: 'lowestPrice',
            sortable:true,
            minWidth:120,
            align: 'center'
          },
          {
            title: '修改前价格',
            key: 'prePrice',
            sortable:true,
            minWidth:120,
            align: 'center'
          },
          {
            title: '修改后价格',
            fixed : "right",
            key: 'price',
            sortable:true,
            minWidth:120,
            align: 'center'
          }
        ],
        searchForm: {
          readjustNo : ""
        },
        editedTableColumns : [
          {
            minWidth:120,
            title: '商品名称',
            align: 'center',
            key: 'productName'
          },
          {
            minWidth:120,
            title: '最低售价(元)',
            sortable: true,
            align: 'center',
            key: 'lowestPrice'
          },
          {
            minWidth:120,
            title: '修改前价格',
            sortable: true,
            align: 'center',
            key: 'salePrice'
          },
          {
            minWidth:120,
            fixed : "right",
            title: '修改后价格',
            align: 'center',
            key: 'price'
          }
        ],
        editedTableData : [],
        beforeEditTableData : []
      }
    },
    methods: {
      init(){   
        this.beforeEditTableData=this.initOptions.oldList;
        this.editedTableData=this.initOptions.newList;
        this.$nextTick(() => {
          this.$refs.dataTable.refresh();
          this.$refs.noAjaxDataTable.refresh(); 
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.store-select {
    height: 32px;
    padding :0;
    border:none;
    position: relative;
    .tree-wrap{
      position:absolute;
      left:0;
      right:0;
      top:32px;
      z-index:9999;
      background-color: #fff;
    }
}
</style>
