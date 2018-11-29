<template>
  <div class="wrapper">

    <div class="group">

      <span class="cell">
        <label >订货人:</label>
        <el-input size="small" placeholder="请输入订货人姓名" v-model="searchForm.orderer"></el-input>
      </span>

      <span class="cell">
        <label >审核人:</label>
        <el-input size="small" placeholder="请输入审核人姓名" v-model="searchForm.verifier"></el-input>
      </span>

      <span class="cell">
        <label >订货日期:</label>
        <DatePicker @getDateTime="onGetOrderDate" ref="orderDatePicker"></DatePicker>
      </span>

      <span class="cell">
        <label >到货日期:</label>
        <DatePicker @getDateTime="onGetArrivalDate" ref="arrivalDatePicker"></DatePicker>
      </span>

      <span class="cell">
        <label >状态:</label>
        <el-select size="small" v-model="searchForm.status" slot="prepend" placeholder="请选择" style="width:88px;">
          <el-option label="初始化" value="0"></el-option>
          <el-option label="待审核" value="1"></el-option>
          <el-option label="已审核" value="2"></el-option>
          <el-option label="被驳回" value="3"></el-option>
          <el-option label="待出库" value="4"></el-option>
          <el-option label="待配送" value="5"></el-option>
          <el-option label="配送中" value="6"></el-option>
          <el-option label="已入库" value="7"></el-option>
        </el-select>
      </span>

      <span class="cell">
        <label >订货单号:</label>
        <el-input size="small" placeholder="请输入单号" v-model="searchForm.orderNum"></el-input>
      </span>

    </div>

    <div class="group group-one">
      <el-button size="small"  type="primary" icon="el-icon-search" @click="onBtnQuery">查询</el-button>
      <el-button size="small"  type="danger" icon="el-icon-remove-outline" @click="onBtnReset">重置</el-button>
      <!--
      <div class="note-wrap">
        <div class="note">注：只有状态为“被驳回”的订货单才能被修改</div>  
        <div class="note">注：该列表中的状态，只有待审核，被驳回，已审核</div> 
      </div>
      <div class="button-wrap">
        <el-button size="small"  type="primary" round @click="onBtnLook">查看</el-button>
        <el-button size="small"  type="warning" round @click="onBtnAdd">新增</el-button>
        <el-button size="small"  type="danger" round @click="onBtnEdit">修改</el-button>   
        <el-button size="small"  type="danger" round @click="onBtnDelete">删除</el-button>   
      </div>
      -->
    </div>

   

    <div class="my-table-body">
      <BtnMenu :pmenu ="this.$route.query" @handleView="onBtnLook" @handleAdd="onBtnAdd" @handleEdit="onBtnEdit" @handleDelete="onBtnDelete" @handleExport="onBtnExport" @handleImport="onBtnImport"></BtnMenu>
     
      <PageTable 
        ref="table"
        :columns = "columns"
        :pagerFixed="pagerFixed"
        :showSummary="showSummary"
        :summaries="summaries"
        :httpParams="httpParams"
        maxHeight="420"
        @select = "onSelect"
      >
      </PageTable>
    </div>

    
    <!--订货单详情-->
    <OrderDetailDialog :params="orderDetailParams"></OrderDetailDialog>
    <!--修改被驳回订货单-->
    <OrderEditDialog :params="orderEditParams" @refresh="onOrderEditRefresh" ref="childOrderEditDialog"></OrderEditDialog>
    <!--新增订货单-->
    <OrderAddDialog :params="orderAddParams" @refresh="onOrderAddRefresh" ref="childOrderAddDialog"></OrderAddDialog>
    <!--入库-->
    <DeliverDialog :params="deliverDialogParams" @refresh = "refresh"></DeliverDialog>
  </div>

</template>

<script>
import api from '@/api/apiList'
import $http from '@/utils/httputils'
import dateformat from '@/utils/dateformat'
import PageTable from '@/components/PageTable'
import DatePicker from '@/components/DatePicker'
import OrderAddDialog from '@/pages/ordermanage/OrderAddDialog'
import OrderDetailDialog from '@/pages/ordermanage/OrderDetailDialog'
import OrderEditDialog from '@/pages/ordermanage/OrderEditDialog'
import DeliverDialog from '@/pages/ordermanage/DeliverDialog'

import BtnMenu from '@/components/BtnMenu'
export default {
  components:{
    PageTable,
    DatePicker,
    OrderAddDialog,
    OrderDetailDialog,
    OrderEditDialog,
    DeliverDialog,
    BtnMenu
  },
  data(){
    return{
      pagerFixed : false,
      // 表格是否总计
      showSummary : true,
      // 总计的字段
      summaries :["no","totalPrice"],
      searchForm : {
        // 订货人
        orderer : "",
        // 审核人
        verifier : "",
        // 订货日期
        orderDate : "",
        // 到货日期
        arrivalDate : "",
        // 状态
        status : null,
        // 订货单号
        orderNum : ""
      },
      // 选中行
      selectRows:[],
      // 订货单(配送单)入库
      deliverDialogParams:{
        title:'订货单入库',
        visible:false,
        row:null
      },
      // 订货单详情
      orderDetailParams:{
        title:'订货单详情',
        visible:false,
        row:null
      },
      // 修改被驳回订货单
      orderEditParams :{
        title:'修改订货单',
        visible:false,
        row:null
      },
      // 新增订货单参数
      orderAddParams:{
        title:'新增订货单',
        visible:false,
        row:null
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
          prop:'no',
          title:'订货单号',
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
          prop:'auditName',
          title:'审核人',
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
          prop:'totalPrice',
          title:'小计',
          width:'100',
          sortable:true
        },
        {
          prop:'createTime',
          title:'订货日期',
          width:'180',
          sortable:true
        },
        {
          prop:'arriveTime',
          title:'到货日期',
          width:'180'
        },
        {
          fixed : "right",
          prop:'auditStatus',
          title:'审核状态',
          width:'100',
          formatter:function (row, column, cellValue, index) {
            switch (cellValue) {
              case 0:
                return '初始化';
              case 1:
                return '待审核';
              case 2:
                return '已审核';
              case 3:
                return '驳回';
              case 4:
                return '待出库';
              case 5:
                return '待配送';
              case 6:
                return '配送中';
              case 7:
                return '已入库';
              default:
                return '初始化';
            }
          }
        }
      ],
      httpParams:{ //列表请求参数传递到子模板
        method:'post',
        path:api.storeOrderList,
        data:{
        }
      }
    }
  },
  methods:{
    // 验证是否可新增或者编辑
    validateOrderPromise(type){ 
      const params={};
      // 新增
      if(type=="add"){
        params.callNo=""; 
      }else{
        params.callNo=this.orderEditParams.row.no; 
      }
      return new Promise((resovle, reject) => { 
        $http({ 
          method:'get',
          path: api.validateOrder,
          data: params,
        },res=>{ 
          resovle(res);
        },err => {  
          reject(err);
        },this);
      })
    },
    // 验证是否可新增或者编辑
    deleteOrderPromise(params){ 
      return new Promise((resovle, reject) => { 
        $http({ 
          method:'delete',
          path: api.deleteOrder,
          data: params
        },res=>{ 
          resovle(res);
        },err => {  
          reject(err);
        },this);
      })
    },
    onBtnLook(){
      if (this.selectRows.length <= 0){
        this.$toast("查看订货单请选择一行数据");
        return;
      }else if (this.selectRows.length > 1){
        this.$toast("查看订货单不能选择多行数据");
        return;
      }
      this.orderDetailParams.row = this.selectRows[0];
      this.orderDetailParams.auditStatus=this.selectRows[0].auditStatus;
      this.orderDetailParams.visible = true;
    },
    onBtnAdd(){    
      this.orderAddParams.row = null;
      this.validateOrderPromise("add").then(res => {
        this.orderAddParams.visible = true;   
      }).catch(err => { 
      })
    },
    onBtnEdit(){
      if (this.selectRows.length <= 0){
        this.$toast("请选择一行数据");
        return;
      }else if (this.selectRows.length > 1){
        this.$toast("编辑数据不能选择多行数据");
        return;
      }
      if( this.selectRows[0].auditStatus==0)
        this.orderEditParams.title='修改初始化订货单';
      if( this.selectRows[0].auditStatus==2)
        this.orderEditParams.title='修改被驳回订货单';
      this.orderEditParams.row = this.selectRows[0];
      this.validateOrderPromise("edit").then(res => {
        this.orderEditParams.visible = true;
      }).catch(err => { 
      })
    },
    onBtnDelete(){
      if (this.selectRows.length <= 0){
        this.$toast("请选择一行数据！");
        return;
      }else if (this.selectRows.length > 1){
        this.$toast("请选择单行数据删除！");
        return;
      }
      this.deleteOrderPromise({
        "callNo" : this.selectRows[0].no
      }).then(res => {
        this.$toast("删除订单成功！");  
        this.$refs.table.refresh();
      }).catch(err => { 
      })
    },
    onBtnExport(){
      let params = {
        enable:true,
        title:'订货单报表',
        method:'get',
        path:api.reportStoreOrderList,
      };
      let data = {
        jsbody : JSON.stringify(this.httpParams.data)
      };
      $http({
        method:params.method,
        path:params.path,
        data:data
      },res=>{
        this.$toast("生成成功");
      },err => {
      },this);
    },
    onOrderEditRefresh(){
      this.$refs.table.refresh();
    },
    onOrderAddRefresh(){ 
      this.$refs.table.refresh();
    },
    refresh(){ 
      this.$refs.table.refresh();
    },
    onGetOrderDate(start,end){
      this.searchForm.orderDateStart = start;
      this.searchForm.orderDateEnd = end;
    },
    onGetArrivalDate(start,end){
      this.searchForm.arrivalDateStart = start;
      this.searchForm.arrivalDateEnd = end;
    },
    onSelect(val){
      this.selectRows = val;
    },
    onBtnQuery(){
      this.searchForm.orderer = this.searchForm.orderer.trim();
      this.searchForm.verifier = this.searchForm.verifier.trim();
      this.searchForm.orderNum = this.searchForm.orderNum.trim();
      let params = {};
      // 订货人
      params.applyNameLike = this.searchForm.orderer!=="" ? this.searchForm.orderer : null;
      // 审核人
      params.auditNameLike =  this.searchForm.verifier!=="" ? this.searchForm.verifier : null;
      // 审核状态 0 初始化 1 待审核 2 已审核 3 驳回 4 待出库 5 待配送   6 配送中 7 已入库
      params.auditStatus = this.searchForm.status ;
      // 每页数据 
      params.limit = 10;
      // 订货单号
      params.no = this.searchForm.orderNum;
      // 分页起始 
      params.pageIndex = 1;
      // 到货日期开始
      params.startArriveTime = this.searchForm.arrivalDateStart;
      //  到货日期结束 
      params.endArriveTime = this.searchForm.arrivalDateEnd;
      // 订货日期开始
      params.startTime = this.searchForm.orderDateStart;
      // 订货日期结束
      params.endTime = this.searchForm.orderDateEnd;
      this.$refs.table.search(params);
    },
    // 配送单入库
    onBtnImport(){  
      if (this.selectRows.length <= 0){
        this.$toast("订货单入库请选择一行数据");
        return;
      }else if (this.selectRows.length > 1){
        this.$toast("订货单入库不能选择多行数据");
        return;
      }
      
      this.deliverDialogParams.row = this.selectRows[0];
      this.deliverDialogParams.auditStatus=this.selectRows[0].auditStatus;
      // 配送中
      if(this.deliverDialogParams.auditStatus==6){
        this.deliverDialogParams.visible=true;
      }else{
        this.$toast("只有待入库的订货单才能入库哦！");
      }
    },
    onBtnReset(){
      this.searchForm.orderer = "";
      this.searchForm.verifier = "";
      this.searchForm.orderDateStart = "";
      this.searchForm.orderDateEnd = "";
      this.searchForm.arrivalDateStart = "";
      this.searchForm.arrivalDateEnd = "";
      this.searchForm.status = null;
      this.searchForm.orderNum = "";
      this.httpParams.data={
        limit: 10, 
        pageIndex: 1
      }
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

.note-wrap{
  display: block;
  position: absolute;
  right:0;
  top:52px;
}
.note{
  display: inline-block;
  padding:6px 10px;
  color:#fff;
  background-color: #EF5AA1;
  border-radius:4px;
  font-size:14px;
  max-width:220px;
  margin-right:4px;
}
.button-wrap{
  display: block;
  position: absolute;
  left:142px;
  top:70px;
}
.group-one{
  position: relative;
  text-align: center;
}
.my-table-body{
  background-color: #fff;
  border-radius: 6px;
  overflow:hidden;
}
</style>
