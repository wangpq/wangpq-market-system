<template>
  <div class="wrapper">
    <div class="group">
      <span class="cell">
        <label >入库人员:</label>
        <el-input size="small" placeholder="请输入入库人" v-model="storageWorker"></el-input>
      </span>
      <span class="cell">
        <label >到货日期:</label>
        <DatePicker @getDateTime="onGetArrivalDate"></DatePicker>
      </span>
    </div>

    <div class="group" style="text-align:center;">
      <el-button size="small"  type="primary" icon="el-icon-search" @click="onBtnQuery">查询</el-button>
      <el-button size="small"  type="danger" icon="el-icon-remove-outline" @click="onBtnReset">重置</el-button>
    </div>

    <div class="my-table-body">
      <BtnMenu 
        :pmenu = "this.$route.query"
        @handleView="onBtnView"
        @handleExport = "onBtnExport"
      >
      </BtnMenu>
      <PageTable 
        ref="table"
        @select = "onSelect"
        :columns = "columns"
        :pagerFixed="pagerFixed"
        :showSummary="showSummary"
        :summaries="summaries"
        maxHeight="420"
        :httpParams="httpParams" 
      >
      </PageTable>
    </div>

    <DetailDialog :params="detailDialogParams" @refresh = "refresh"></DetailDialog>

  </div>

</template>

<script>
import api from '@/api/apiList'
import dateformat from '@/utils/dateformat'
import PageTable from '@/components/PageTable'
import DateSearch from '@/components/DateSearch'
import BtnMenu from '@/components/BtnMenu'
import DetailDialog from '@/pages/stockmanage/DetailDialog'
import DatePicker from '@/components/DatePicker'

export default {
  components:{
    PageTable,
    DateSearch,
    BtnMenu,
    DetailDialog,
    DatePicker
  },
  data(){
    return{
      // 入库人员
      storageWorker : "",
      // 入库日期
      storageDate : "",
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
      summaries :["no","sum","totalPrice"],
      httpParams:{ //列表请求参数传递到子模板
        method:'post',
        path:api.stockList,
        data:{
        }
      },
      //表格 columns
      columns:[
        {
          type:'selection',
          width:'50'
        },
        {
          type:'index',
          title:'序号',
          width: 100
        },
        {
          prop:'callNo',
          title:'订货单号',
          width: 180,
        },
        {
          prop:'no',
          title:'入库单号',
          width: 180,
        },
        {
          prop:'chainName',
          title:'门店',
          width:'120'
        },
        {
          prop:'applyName',
          title:'订货人',
          width:'80'
        },
        {
        prop:'cateSum',
          title:'商品种类',
          width:'120',
          sortable:true,
          formatter:function (row, column, cellValue, index) {
            return cellValue+"种"
          }
        },
        {
          prop:'sum',
          title:'数量',
          width:'100',
          sortable:true
        },
        {
          prop:'total',
          title:'小计',
          width:'120',
          sortable:true
        },
        {
          prop:'createTime',
          title:'订货日期',
          width:'120'
        },
        {
          prop:'putTime',
          title:'到货日期',
          width:'120'
        }
      ],
    }
  },
  methods:{
    onBtnQuery(){
      let params={
        putTimeStart : this.putTimeStart,
        putTimeEnt : this.putTimeEnt
      }
      this.$refs.table.search(params);
    },
    onBtnReset(){
      this.storageWorker = "";
      this.storageDate = "";
      this.putTimeStart = "";
      this.putTimeEnt = "";
    }, 
    onGetArrivalDate(start,end){
      this.putTimeStart = start;
      this.putTimeEnt = end;
    },
    onBtnView(){
      if (this.selectRows.length <= 0){
        this.$toast("查看订货单请选择一行数据");
        return;
      }else if (this.selectRows.length > 1){
        this.$toast("查看订货单不能选择多行数据");
        return;
      }
      this.detailDialogParams.row = this.selectRows[0];
      this.detailDialogParams.visible=true;
    },
    onBtnExport(){
      alert("导出");
    },
    onSelect(val){
      this.selectRows = val;
    },
    refresh(){ 
      this.$refs.table.refresh();
    },
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
