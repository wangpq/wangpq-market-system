<template>
  <el-dialog :visible.sync="params.visible"  @open="onOpen" width="1000px" top="0vh" :center="center">
    <div class="dialog-content">
      <h2 class="title">{{params.title}}</h2>
      <div class="area-top">
   
        <div class="detail-page">
          <el-form ref="form" size="small" :model="form" label-width="80px" class="demo-ruleForm">     
            
            <el-form-item label="订货单号:" prop="callNo">
              <el-input :prop="form.no" v-model="form.callNo" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="订货门店:" prop="chainName">
              <el-input :prop="form.chainName" v-model="form.chainName" auto-complete="off" disabled></el-input>
            </el-form-item>
      
            <el-form-item label="订货人:" prop="applyName">
              <el-input :prop="form.applyName" v-model="form.applyName" auto-complete="off" disabled></el-input>
            </el-form-item>

             <el-form-item label="订货时间:" prop="orderTime">
              <el-input :prop="form.orderTime" v-model="form.orderTime" auto-complete="off" disabled></el-input>
            </el-form-item> 
            
            <el-form-item label="入库日期:" prop="putTime">
              <el-input :prop="form.putTime" v-model="form.putTime" auto-complete="off" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="area-down">
        <PageTable 
          ref="deliverOrderDialogTable"
          :pagerFixed="pagerFixed"
          :showSummary="showSummary"
          :summaries="summaries"
          :columns = "columns"
          :setParams = "setParams"
          :httpParams="httpParams"
          maxHeight="250"
        >
        </PageTable>

      </div>
 
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button round type="primary" @click="params.visible = false">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import api from '@/api/apiList'
  import $http from '@/utils/httputils'
  import dateformat from '@/utils/dateformat'
  import PageTable from '@/components/PageTable'

  export default {
    components:{
      PageTable
    },
    props:{
      params:{
        type: Object,
        default: () => {
          return {
            title:'订货单详情',
            visible:false,
            row:null
          }
        }
      }
    },
    data(){
      return{
        center : true,
        // 表格是否总计
        showSummary : true,
        // 总计的字段
        summaries :["productNo","number","totalPrice"],
        // 详情参数
        form:{
          no : "",
          chainName : "",
          applyName : "",
          auditName : "",
          arriveTime : "",
          createTime : "",
          status : ""
        },
        // 分页是否固定底部
        pagerFixed : false,
        setParams:{},
        httpParams:{ //列表请求参数传递到子模板
          method:'post',
          path:api.orderProduct,
          data:{
          }
        },
        //表格 columns
        columns:[
          {
            type:'index',
            title:'序号',
            width: 80
          },
          /*
          {
            prop:'chainName',
            title:'商品码',
            width:'120'
          },
          */
          {
            prop:'productNo',
            title:'条码',
            width:'140'
          },
          {
            prop:'productName',
            title:'商品',
            width:'140'
          },
          {
            prop:'specification',
            title:'规格',
            width:'80'
          },
          {
            prop:'number',
            title:'数量',
            width:'80',
            sortable:true
          },
          {
            prop:'unit',
            title:'单位',
            width:'60'
          },
          {
            prop:'salePrice',
            title:'配送价',
            width:'120',
            sortable:true
          },
          {
            prop:'totalPrice',
            title:'小计',
            width:'120',
            sortable:true
          }
          /*
          ,
          {
            prop:'productDate',
            title:'生产日期',
            width:'120'
          },
          */
        ],
        memberDiscounts:null,
        rules: {
        }
      }
    },
    methods:{
      onOpen(){ 
        if (this.params.row != null){       
          this.form = this.params.row;
          this.httpParams.data.callNo=this.form.callNo;
          this.$refs.deliverOrderDialogTable.refresh();  
        }
      }
    }
  }
</script>

<style scoped>
.el-select{
  width: 100px;
}
.el-input{
  width: 280px;
}
.dialog-content{
  padding:18px 28px 0;
}
.dialog-content>.title{
  text-align: center;
  font-weight: bold;
  font-size:16px;
  padding:18px 0 12px;
}
.area-top{
  padding:10px;
  overflow:auto;
  margin:0 auto;
}
.detail-page{
  height:100px;
  overflow:auto;
}
.detail-page .el-form-item{
  display: inline-block;
}

.note-wrap{
  position: absolute;
  right:10px;
  top:20px;
}
.note-wrap .note{
  display: inline-block;
  padding:6px 10px;
  color:#fff;
  background-color: #EF5AA1;
  border-radius:4px;
  font-size:14px;
  max-width:380px;
  margin-right:4px;
}
</style>
