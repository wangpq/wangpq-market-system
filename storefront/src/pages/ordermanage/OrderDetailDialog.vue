<template>
  <el-dialog :visible.sync="params.visible"  @open="onOpen" width="980px" top="0vh" :center="center">
    <div class="dialog-content">
      <h2 class="title">{{params.title}}</h2>
      <div class="area-top">
   
        <div class="detail-page">
          <el-form ref="form" size="small" :model="form" label-width="80px" class="demo-ruleForm">     
            
            <el-form-item label="订货单号:" prop="no">
              <el-input :prop="form.no" v-model="form.no" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="订货门店:" prop="chainName">
              <el-input :prop="form.chainName" v-model="form.chainName" auto-complete="off" disabled></el-input>
            </el-form-item>
      
            <el-form-item label="订货人:" prop="applyName">
              <el-input :prop="form.applyName" v-model="form.applyName" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="审核人:" prop="auditName">
              <el-input :prop="form.auditName" v-model="form.auditName" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="到货日期:" prop="arriveTime">
              <el-input :prop="form.arriveTime" v-model="form.arriveTime" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="订货时间:" prop="createTime">
              <el-input :prop="form.createTime" v-model="form.createTime" auto-complete="off" disabled></el-input>
            </el-form-item>

            <!--
            <el-form-item label="审核时间:" prop="verifyDate">
              <el-input :prop="form.verifyDate" v-model="form.verifyDate" placeholder="审核时间" auto-complete="off" disabled></el-input>
            </el-form-item>
            -->

            <el-form-item label="审核状态:" prop="status">
              <el-input :prop="form.status" v-model="form.status" auto-complete="off" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="area-down">
        <PageTable 
          ref="orderDetailDialogTable"
          :pagerFixed="pagerFixed"
          :showSummary="showSummary"
          :summaries="summaries"
          :columns = "columns"
          :setParams = "setParams"
          :httpParams="httpParams"
          maxHeight="250"
        >
        </PageTable>
        <NoteBook :noteList="noteList" :hasList="noteHasList" :hasTextarea="noteHasTextarea" @onChange="onNoteAreaChange"></NoteBook>
      </div>
 
    </div>

    <span slot="footer" class="dialog-footer">
      <!--
      <el-button round @click="params.visible = false">取消</el-button>
      -->
      <el-button round type="primary" @click="params.visible = false">确定</el-button>
      <el-button round type="success" v-if="params.auditStatus==0" @click="onBtnAuditTaped">提交审核</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import api from '@/api/apiList'
  import $http from '@/utils/httputils'
  import dateformat from '@/utils/dateformat'
  import PageTable from '@/components/PageTable'
  import NoteBook from '@/components/NoteBook'

  export default {
    components:{
      PageTable,
      NoteBook
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
        // 留言列表数组
        noteList : [],
        noteHasList : true,
        noteHasTextarea : false,
        // 内部沟通输入框
        textarea : "",
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
            prop:'unit',
            title:'单位',
            width:'60'
          },
          {
            prop:'number',
            title:'数量',
            width:'80',
            sortable:true
          },
          {
            prop:'specification',
            title:'规格',
            width:'80'
          },
          {
            prop:'price',
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
        ],
        memberDiscounts:null,
        rules: {
        }
      }
    },
    methods:{
      formatStatus(status){
        switch (status) {
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
      },
      onBtnAuditTaped(){
        $http({ 
          method:'put',
          path: api.submitAudit,
          data: {
            "callNo" : this.params.row.no
          }
        },res=>{ 
          this.$toast("订货单提交审核操作成功！");  
          this.params.row.auditStatus=1;
          this.params.auditStatus=1;
          this.form.status=this.formatStatus(1); 
          this.$emit('refresh');
        },err => {
        },this);
      },
      onOpen(){ 
        if (this.params.row != null){       
          this.form = this.params.row;
          this.form.status=this.formatStatus(this.params.row.auditStatus); 
          this.noteHasList=true;
          this.noteHasTextarea=false;
          // 处理返回的字符串为数组
          let tempArr=this.form.message.replace(/\n/g,'--').split("--");
          if(tempArr[tempArr.length-1]==""){
            tempArr=tempArr.slice(0,-1);
          }
          this.noteList=tempArr;
          this.httpParams.data.callNo=this.form.no;
          // 加try cantch解决第一次打开对话框时候表格没有数据使用refresh出错的问题
          try {
            this.$refs.orderDetailDialogTable.refresh();  
          } catch (error) { 
          }
        }
      },
      onNoteAreaChange(val){
        this.textarea=val;
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
