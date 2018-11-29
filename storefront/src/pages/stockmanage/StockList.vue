<template>
  <div class="wrapper">
    <div class="group">
      <span class="cell">
        <label >门店名称:</label>
        <el-input size="small" placeholder="请输入门店名称" v-model="searchForm.chainNameLike"></el-input>
      </span>
      <span class="cell">
        <label >商品名称:</label>
        <el-input size="small" placeholder="请输入商品名称" v-model="searchForm.productNameLike"></el-input>
      </span>
      <span class="cell">
        <label >商品条码：</label>
        <el-input size="small" placeholder="请输入商品条码" v-model="searchForm.productNo"></el-input>
      </span>
      <span class="cell">
        <label >商品分类：</label>
        <el-input size="small" placeholder="请输入商品分类" v-model="searchForm.productCate"></el-input>
      </span>
    </div>

    <div class="group" style="text-align:center;">
      <el-button size="small"  type="primary" icon="el-icon-search" @click="onBtnQuery">查询</el-button>
      <el-button size="small"  type="danger" icon="el-icon-remove-outline" @click="onBtnReset">重置</el-button>
    </div>

    <div class="my-table-body">
      <PageTable 
        ref="table"
        :columns = "columns"
        :pagerFixed="pagerFixed"
        :showSummary="showSummary"
        :summaries="summaries"
        maxHeight="420"
        :httpParams="httpParams" 
      >
      </PageTable>
    </div>

  </div>

</template>

<script>
import api from '@/api/apiList'
import PageTable from '@/components/PageTable'
export default {
  components:{
    PageTable
  },
  data(){
    return{
      searchForm : {
      }, 
      // 表格选中行
      selectRows:[],
      detailDialogParams : {
        title:'入库订单详情',
        visible:false,
        row:null
      },
      pagerFixed : false,
      // 表格是否总计
      showSummary : true,
      // 总计的字段
      summaries :["productNo","stockSum"],
      httpParams:{ //列表请求参数传递到子模板
        method:'post',
        path:api.stockSearch,
        data:{
        }
      },
      //表格 columns
      columns:[
        {
          type:'index',
          title:'序号',
          width: 100
        },
        {
          prop:'chainName',
          title:'门店名称',
          sortable:true,
          width: 140,
        },
        /*
        {
          prop:'productId',
          title:'商品ID',
          width: 140,
        },
        */
        {
          prop:'productNo',
          title:'商品货号',
          sortable:true,
          width:'140'
        },
        {
          prop:'productName',
          title:'商品名称',
          width:'80'
        },
        {
          prop:'cateName',
          title:'商品类别名称',
          width:'120'
        },
        {
          prop:'unit',
          title:'单位',
          width:'120'
        },
        {
          prop:'stockSum',
          title:'库存数量',
          sortable:true,
          width:'120'
        },
        {
          fixed : "right",
          prop:'status',
          title:'状态',
          width:'80',
          formatter:function (row, column, cellValue, index) {
            let res = ''
            switch (cellValue) {
              case 0:
                res = '不正常'
                break
              case 1 :
                res = '正常'
                break
            }
            return res
          }
        }
      ],
    }
  },
  methods:{
    onBtnQuery(){
      this.$refs.table.search(this.searchForm);
    },
    onBtnReset(){
      this.searchForm.chainNameLike = ''
      this.searchForm.productNameLike = ''
      this.searchForm.productNo = ''
    }, 
    refresh(){ 
      this.$refs.table.refresh();
    }
  }
}
</script>

<style scoped>
.wrapper{
  padding:12px;
}
.group{
  padding:14px 14px 6px;
  border-radius:6px;
  background-color: #fff;
  margin-bottom:6px;
}

.group>.cell{
  display: inline-block;
  margin-bottom:4px;
}
.group>.cell>label{
  font-size:14px;
  margin: 0 8px 8px;
}

.el-select{
  width: 100px;
}

.el-input{
  width: 180px;
}

.my-table-body{
  background-color: #fff;
  border-radius: 6px;
  overflow:hidden;
}
#btn-action-box{
  position: relative;
  line-height: 0;
  height:0;
}
#btn-action-box>.btn-group{
  position: absolute;
  left:98px;
  top:11px;
}
.note-wrap{
  display: inline-block;
  position: absolute;
  right:0;
  top:-9px;
  line-height: 1.48;
}
.note{
  display: inline-block;
  padding:6px 10px;
  color:#fff;
  background-color: #EF5AA1;
  border-radius:4px;
  font-size:14px;
  max-width:340px;
  margin-right:4px;
  position: relative;
}
</style>
